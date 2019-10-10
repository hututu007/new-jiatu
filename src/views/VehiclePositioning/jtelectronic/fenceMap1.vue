<template>
  <div class="fence">
    <div id="map_container"></div>
  </div>
</template>

<script>

  export default {
    name: "fenceMap",
    components: {},
    data() {
      return {
        map: '',
        fenceList: [
          {POINT: {}, SHAPE: '1'}
        ],
        carGpsList:[],
        shapeType: '',
        overlays: [],
        fenceTypePoints: { // 用于储存形状的点数据
          circle: [],
          polygon: []
        },
        falseData: [],
        images: [require('../../../../static/img/car/car-行驶绿色-1.png'), require('../../../../static/img/car/car-怠速蓝色-1.png'), require('../../../../static/img/car/car-故障橙色-1.png'),
          require('../../../../static/img/car/car-熄火灰色-1.png'), require('../../../../static/img/car/car-设备拔出黄色-1.png'), require('../../../../static/img/car/car-超速红色-1.png')],
      }
    },
    created() {
      this.$bus.$on('shapeChange', (val) => {
        if (val === 'circle') { // 圆形
          this.shapeType = BMAP_DRAWING_CIRCLE
          this.map.removeOverlay(this.overlays[0]);
          this.drowFence(this.shapeType)
        } else if (val === 'rectangle') {
          this.shapeType = BMAP_DRAWING_RECTANGLE
          this.map.removeOverlay(this.overlays[0]);
          this.drowFence(this.shapeType)
        } else if (val === 'polygon') {
          this.shapeType = BMAP_DRAWING_POLYGON
          this.map.removeOverlay(this.overlays[0]);
          this.drowFence(this.shapeType)
        }
      })
      this.$bus.$on('onSubmit', (val) => {
        this.beginFence()
      })

    },
    mounted() {
      this.map = new BMap.Map("map_container");
      if (this.$store.getters.point.lng&&this.$store.getters.point.lat) {
      this.map.centerAndZoom(new BMap.Point(this.$store.getters.point.lng, this.$store.getters.point.lat), 15); //默认重庆经纬度
      }else {
      this.$message({
        message: '请前往企业信息配置企业地址',
        type: 'warning'
      });
      this.map.centerAndZoom(new BMap.Point(106.506447, 29.614564), 15); //默认重庆经纬度
      }
      this.map.enableScrollWheelZoom(true);
      this.map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
      this.getCargpsFuc()
    },
    methods: {
      /** 添加车辆覆盖物 **/

      /** 绘制围栏方法 **/
      drowFence(shapeType) {
        
        // 围栏盒子
        var styleOptions = {
          strokeColor: "white",    //边线颜色。
          fillColor: "#c1dcb9",      //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 3,       //边线的宽度，以像素为单位。
          strokeOpacity: 1,       //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid' //边线的样式，solid或dashed。
        };

        // 实例化鼠标绘制工具
        var drawingManager = new BMapLib.DrawingManager(this.map, {
          isOpen: true, //是否开启绘制模式
          isSnap:false,
          enableDrawingTool: true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size('50%', 10), //偏离值
            drawingModes: [shapeType],
            drawingTypes: [shapeType]
          },
          circleOptions: styleOptions, //圆的样式
          polygonOptions: styleOptions, //多边形的样式
          rectangleOptions: styleOptions //矩形的样式
        });
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        let that = this;

        var overlays = [];
        drawingManager.addEventListener('overlaycomplete', (e) => {
          this.map.removeOverlay(that.overlays[0]);
          that.overlays[0] = e.overlay;
          // 可编辑
          e.overlay.enableEditing()
          that.clearOne()
          that.saveOverlay(that.overlays)



        overlays.push(e.overlay);
        });
      },
      /** 删除电子围栏 **/
      clearOne() {
        for (var i = 0; i < this.overlays.length; i++) {
          // 删除这个覆盖物 给覆盖物添加右键菜单
          var markerMenu = new BMap.ContextMenu();
          markerMenu.addItem(new BMap.MenuItem('删除', () => {
            this.map.removeOverlay(this.overlays[0]);
          }));
          this.overlays[i].addContextMenu(markerMenu);
        }
      },
      /** 获取中心点方法 **/
      getCenterPoint(path) {
        var x = 0.0;
        var y = 0.0;
        for (var i = 0; i < path.length; i++) {
          x = x + parseFloat(path[i].lng);
          y = y + parseFloat(path[i].lat);
        }
        x = x / path.length;
        y = y / path.length;
        return new BMap.Point(x, y);
      },
      /** 添加覆盖物标记index **/

      /** 储存 **/
      saveOverlay(overlays) {
        console.log(overlays);
        
        // 存储电子围栏
        var tempoint = [];
        console.log(overlays);
        
        for (var i = 0; i < overlays.length; i++) {
          // 存储电子围栏
          if (overlays[i].toString() == "[object Polygon]") {// 矩形
            for (var num = 0; num < overlays[i].getPath().length; num++) {
              var point = this.getCenterPoint(overlays[i].getPath()); // 多边形中心点
              if (num != overlays[i].getPath().length - 1) {
                tempoint += overlays[i].getPath()[num].lng + "," + overlays[i].getPath()[num].lat + ";";
              } else {
                tempoint += +overlays[i].getPath()[num].lng + "," + overlays[i].getPath()[num].lat;
              }
            }
            this.fenceTypePoints.polygon = tempoint;
            this.falseData.push({points: this.fenceTypePoints.polygon, shapeType: 2,centerPoint:point})

          } else if (overlays[i].toString() == "[object Circle]") {// 圆形
            var point=overlays[i].getCenter()
            this.fenceTypePoints.circle += overlays[i].getCenter().lng + "," + overlays[i].getCenter().lat + ";";
            this.fenceTypePoints.circle += overlays[i].getRadius();
            this.falseData.push({points: this.fenceTypePoints.circle, shapeType: 1,centerPoint:point})
          }
        }
      },
      /** 电子围栏中心覆盖物 **/
      fenceOverlay(point, text, index){
        let that = this
        // 复杂的自定义覆盖物
        function FenceCustomOverlay(point, text,index) {
          this._point = point;
          this._text = text;
          this._index = index
        }

        FenceCustomOverlay.prototype = new BMap.Overlay();
        FenceCustomOverlay.prototype.initialize = function (map) {

          this._map = map;
          let div = this._div = document.createElement("div");
          // 覆盖物div样式
          div.style.position = "absolute";
          div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
          div.style.transform = "translateX(-40px) translateY(-16px)";
          div.style.color = "#fff";
          div.style.whiteSpace = "nowrap";
          div.style.MozUserSelect = "none";
          div.style.padding = "2px"
          div.style.fontSize = "12px";
          div.style.textAlign = 'center';
          div.className = 'point';

          // 圆点
          let pointSpan= document.createElement("span");
          div.appendChild(pointSpan);
          pointSpan.appendChild(document.createTextNode(this._index));
          pointSpan.style.backgroundColor = "#f56767";
          pointSpan.style.position = "absolute";
          pointSpan.style.left= 26+'px'
          pointSpan.style.top= 40+'px'
          pointSpan.style.border = "2px solid white";
          pointSpan.style.textAlign='center';
          pointSpan.style.lineHeight=27+'px'
          pointSpan.style.fontSize= 12+'px';
          pointSpan.style.borderRadius='50%';
          pointSpan.style.width= 30+'px'
          pointSpan.style.height= 30+'px'
          pointSpan.style.fontWeight= 'bold'

          // 提示文字
          let tipText= document.createElement("p");
          div.appendChild(tipText);
          tipText.appendChild(document.createTextNode(this._text));
          tipText.style.backgroundColor = "#fff";
          tipText.style.position = "absolute";
          tipText.style.top= -10+'px'
          tipText.style.left= -43+'px'
          tipText.style.padding = 10 + "px";
          tipText.style.color='#666'
          tipText.style.fontSize= 12+'px';
          tipText.style.borderRadius=4+'px';
          tipText.style.width= 160+'px';
          tipText.style.height= 30+'px';
          tipText.style.fontWeight= 'bold';
          tipText.style.display='none';

          // 底部小尖
          let litle= document.createElement("span");
          tipText.appendChild(litle);
          litle.style.position = "absolute";
          litle.style.top= 30+'px'
          litle.style.left= '45%'
          litle.style.width= 0+'px'
          litle.style.height= 0+'px'
          litle.style.borderRight = "10px solid transparent";
          litle.style.borderBottom = "10px solid transparent";
          litle.style.borderLeft = "10px solid transparent";
          litle.style.borderTop = "10px solid #fff";

          pointSpan.addEventListener("mouseover", function () {
            if(tipText.style.display==='none'){
              tipText.style.display='block';
            }
          });
          pointSpan.addEventListener("mouseout", function () {
            if(tipText.style.display==='block'){
              tipText.style.display='none';
            }
          });


          that.map.getPanes().labelPane.appendChild(div);
          return div;
        }
        // 画覆盖物
        FenceCustomOverlay.prototype.draw = function () {
          var map = this._map;
          var pixel = map.pointToOverlayPixel(this._point);
          this._div.style.left = pixel.x + "px";
          this._div.style.top = pixel.y - 30 + "px";
        }


        let item = point;
        let myFenceOverlay = new FenceCustomOverlay(new BMap.Point(item.lng, item.lat), text, index);
        that.map.addOverlay(myFenceOverlay);
      },
      /** 初始化电子围栏 **/
      beginFence() {
        for (var n = 0; n < this.falseData.length; n++) {
          if (this.falseData[n].shapeType == 1) { // 圆形
            var pot = [];
            pot = this.falseData[n].points.split(";");// 圆半径点通过分号分割
            var pot1 = pot[0].split(",");
            var point=new BMap.Point(pot1[0], pot1[1])
             this.fenceOverlay(point,'123456',n)

            this.map.centerAndZoom(new BMap.Point(pot1[0], pot1[1]), 15); // 分割后的坐标作为起始坐标
            var circle = new BMap.Circle(new BMap.Point(pot1[0], pot1[1]), pot[1], {
              strokeColor: "white",    //边线颜色。
              fillColor: "#c1dcb9",      //填充颜色。当参数为空时，圆形将没有填充效果。
              strokeWeight: 3,       //边线的宽度，以像素为单位。
              strokeOpacity: 1,       //边线透明度，取值范围0 - 1。
              fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
              strokeStyle: 'solid' //边线的样式，solid或dashed。
            });
            this.map.addOverlay(circle);

          } else if (this.falseData[n].shapeType == 2) { // 矩形 , 多边形
            var str = [];
            var arrPois = [];
            var polyLine = "";
            str = this.falseData[n].points.split(";");// 坐标点通过分号分割
            var point=this.falseData[n].centerPoint
            this.fenceOverlay(point,'123456',n) // 画
            for (var j = 0; j < str.length; j++) // 循环数组
            {
              this.map.centerAndZoom(new BMap.Point(str[j].split(",")[0], str[j].split(",")[1]), 15); // 分割后的坐标作为起始坐标
              arrPois.push(new BMap.Point(str[j].split(",")[0], str[j].split(",")[1]));// 循环数组中每一组的坐标
            }
            polyLine = new BMap.Polygon(arrPois, {
              strokeColor: "white",    //边线颜色。
              fillColor: "pink",      //填充颜色。当参数为空时，圆形将没有填充效果。
              strokeWeight: 3,       //边线的宽度，以像素为单位。
              strokeOpacity: 1,       //边线透明度，取值范围0 - 1。
              fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
              strokeStyle: 'solid' //边线的样式，solid或dashed。
            });// 展示围栏
            this.map.addOverlay(polyLine);
          }
        }

      },
      /** 判断小车是否在围栏内 **/
      insideFuc(thisMarker, point, shapeType) {
        
        if (shapeType === 1) { // 圆形内
          //判断点是否在
          if (BMapLib.GeoUtils.isPointInCircle(point, circle)) {
            var infoWindow = new BMap.InfoWindow("在圆形区域内");
            thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
          } else {
            var infoWindow = new BMap.InfoWindow("不在圆形区域内");
            thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
          }
        } else if (shapeType === 2) { // 矩形、多边形内
          //判断点是否在
          if (BMapLib.GeoUtils.isPointInPolygon(point, polyLine)) {
            var infoWindow = new BMap.InfoWindow("在区域内");
            thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
          } else {
            var infoWindow = new BMap.InfoWindow("不在区域内");
            thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
          }
        }
      },
      /** 创建小车覆盖物 **/
      addCarMarker(data) {
        // 需根据小车的状态修改小车覆盖物的颜色
        for (var i = 0; i < data.length; i++) {
          var myImg = this.images[0]
          // var myIcon = new BMap.Icon(this.images[0], new BMap.Size(50,50));
          var point = new BMap.Point(data[i].longitude, data[i].latitude)
          // var marker = new BMap.Marker(point, {icon: myIcon});  // 创建标注
          // this.map.addOverlay(marker);               // 将标注添加到地图中
          this.carTextMarker(point, data[i].license, myImg, i)
        }
      },
      /** 自定义覆盖物 **/
      carTextMarker(point, text, myImg, index) {
        let that = this
        // 复杂的自定义覆盖物
        let myIcon = myImg

        function ComplexCustomOverlay(point, text, myIcon, index) {
          this._point = point;
          this._text = text;
          this._img = myIcon;
          this._index = index
        }

        ComplexCustomOverlay.prototype = new BMap.Overlay();
        ComplexCustomOverlay.prototype.initialize = function (map) {

          this._map = map;
          let div = this._div = document.createElement("div");
          // 覆盖物div样式
          div.style.position = "absolute";
          div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
          div.style.transform = "translateX(-40px) translateY(-16px)";
          div.style.color = "#fff";
          div.style.backgroundColor = "#5b8ee2";
          div.style.whiteSpace = "nowrap";
          div.style.MozUserSelect = "none";
          div.style.padding = "2px"
          div.style.fontSize = "12px";
          div.style.textAlign = 'center';
          div.className = 'point';

          // 小车
          let car = document.createElement('img');
          car.src = this._img
          div.appendChild(car);
          car.style.position = "absolute";
          car.style.top = "25px";
          car.style.left = "20px";
          car.style.display = 'block';
          car.style.width = "50px";
          car.style.height = "50px";

          // 地点
          let nameText = this._span = document.createElement("span");
          div.appendChild(nameText);
          nameText.appendChild(document.createTextNode(this._text));
          nameText.style.backgroundColor = "#5b8ee2";
          nameText.style.display = "block";
          nameText.style.border = "1px solid #8db0eb";
          nameText.style.paddingLeft = 20 + "px";
          nameText.style.paddingRight = 5 + "px";
          nameText.style.paddingTop = 5 + "px";
          nameText.style.paddingBottom = 5 + "px";

          // // 小圆圈
          let nameCircle = this._circle = document.createElement("span");
          div.appendChild(nameCircle);
          nameCircle.style.position = "absolute";
          nameCircle.style.width = "116px"
          nameCircle.style.height = "116px"
          nameCircle.style.top = "-3px";
          nameCircle.style.left = "-15px";
          nameCircle.className = "shadowCircle"
          nameCircle.style.zIndex = "-1";
          nameCircle.style.background = "rgba(91,142,226,.4)";
          nameCircle.style.display = "none";
          nameCircle.style.borderRadius = "50%";

          // 小车点击事件
          let _this = this
          car.onclick = function () {
            var a = []; // 兄弟节点数组
            var parents = document.getElementsByClassName("point")
            for(var i = 0; i < parents.length; i++){  //循环
              if(parents[i].nodeType == 1 && parents[i] != parents[_this._index]){  //如果该节点是元素节点与不是这个节点本身
                a.push(parents[i]);      // 添加到兄弟节点里
              }
            }
            // 兄弟节点隐藏
            for(var j = 0; j < a.length; j++){
              a[j].children[2].style.display = "none"
            }
            if (parents[_this._index].children[2].style.display === "none") {
              parents[_this._index].children[2].style.display = "block"
            } else {
              parents[_this._index].children[2].style.display = "none"
            }
          }
          that.map.getPanes().labelPane.appendChild(div);
          return div;
        }
        // 画覆盖物
        ComplexCustomOverlay.prototype.draw = function () {
          var map = this._map;
          var pixel = map.pointToOverlayPixel(this._point);
          this._div.style.left = pixel.x + "px";
          this._div.style.top = pixel.y - 30 + "px";
        }
        let item1 = point;
        let myCompOverlay = new ComplexCustomOverlay(new BMap.Point(item1.lng, item1.lat), text, myIcon, index);
        that.map.addOverlay(myCompOverlay);
        this.insideFuc(myCompOverlay, point,1)
      },
      /** 获取电子围栏数据方法 **/
      getCargpsFuc() {
        this.getData('/', 'post').then(data => {
          this.carGpsList=data.data.carGpsList
          this.addCarMarker(data.data.carGpsList)
        }).catch(error => {
          console.log(error)
        })
      },
      /** 获取围栏列表数据 **/
      getFenceData() {
        this.getData('/gps/dynamic', 'post').then(data => {

        }).catch(error => {
          console.log(error)
        })
      }

    },
  
  }
</script>

<style scoped>
  .fence {
    width: 100%;
    height: 900px;
  }

  #map_container {
    width: 100%;
    height: 100%;
  }
</style>
