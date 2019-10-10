<template>
  <div class="fence">
    <div id="map_container"></div>
  </div>
</template>

<script>
export default {
  name: "fenceMap",
  props: {
    selectedIndex: {
      type: Number,
      default: null
    },
    editState: {
      type:Boolean,
      default: false,
    }
  },
  data() {
    return {
      map: "", //地图
      fence: "",
      drawingManager:"", // 绘制工具
      drawOverlays: [], //绘制时的覆盖物
      overlays: [], // 绘制完成的覆盖物
      dataOverlays: [],  //需传递到后台的数据
      initPoints: [], //初始化围栏数据
      styleOptions:  { // 绘画时围栏样式
        strokeColor: "blue",    //边线颜色。
        fillColor: "#fff",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.5,       //边线透明度，取值范围0 - 1。
        fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      },
      initStyleOptions:{ // 初始化围栏样式
        strokeColor: "#fff",    //边线颜色。
        fillColor: "#c1dcb9",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 1,       //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      },

    }
  },
  
  methods: {
    /**
     * 绘制
     * */
    draw(type) {
        let _type
        if (type== 1) { // 圆形
            _type = BMAP_DRAWING_CIRCLE
        }else 
        if (type== 2) { // 矩形
            _type = BMAP_DRAWING_RECTANGLE
        }else 
        if (type== 3) { // 多边形
            _type = BMAP_DRAWING_POLYGON
        }
        this.clearAll();
        this.drawingManager.open();
        this.drawingManager.setDrawingMode(_type);
    },
    /**
     * 清除所有绘制图形(注意是绘制时的图形，不是所有覆盖物)
     */
    clearAll() {
        for(var i = 0; i < this.drawOverlays.length; i++){
            this.map.removeOverlay(this.drawOverlays[i]);
        }
        this.drawOverlays.length = 0
    },
    /**
     * path转换
     */
    converted(currentTarget) {
        this.dataOverlays = [];
        if (!currentTarget.zQ) {
            alert('无法读取图形，您可以尝试更换浏览器！')
        }else
        if (currentTarget.zQ === 'Circle') {
            this.dataOverlays = {
                path: currentTarget.getRadius(),
                radius:currentTarget.getCenter()
            }
        }else
        if (currentTarget.zQ === 'Polygon') {
            this.dataOverlays = {
            path: currentTarget.getPath()
            }
        } 
    },
    /** 删除电子围栏 **/
      clearOne() {
        for (var i = 0; i < this.drawOverlays.length; i++) {
          // 删除这个覆盖物 给覆盖物添加右键菜单
          var markerMenu = new BMap.ContextMenu();
          markerMenu.addItem(new BMap.MenuItem('删除', () => {
            this.clearAll();
            this.drawingManager.open();
            this.dataOverlays = [];
          }));
          this.drawOverlays[i].addContextMenu(markerMenu);
        }
      },
    /**
     * 数据围栏初始化
     */
    DrawInit (fence) {
        this.overlays = []
        // 清除覆盖物
        this.map.clearOverlays(); 
        fence.forEach((item, index) => {
            if (this.selectedIndex==index) { // 选中状态
                this.initStyleOptions.fillColor = '#55a8fd'
            }else if (item.enable===0) {  // 停用状态
                this.initStyleOptions.fillColor = '#f56767'
            }else {
                this.initStyleOptions.fillColor = '#71d189'
            }
            var Overlays;
            Overlays =JSON.parse(item.coordinateJson)
            if (Overlays.radius) { // 圆
                //创建中心点
                let Center = new BMap.Point(Overlays.radius.lng,Overlays.radius.lat);
                this.initCenterPoint(Center, index, item.enclosureName);
                // 创建圆
                let circle = new BMap.Circle(Center, Overlays.path, this.initStyleOptions);
                this.map.addOverlay(circle);
                this.overlays.push(circle); 
            }else if(Overlays.path) { // 多边形
                let path = [];
                Overlays.path.forEach((point) => {
                    path.push(new BMap.Point(point.lng,point.lat))
                })
                //创建中心点
                let Center = this.getCenterPoint(path);
                this.initCenterPoint(Center, index, item.enclosureName);
                // 创建多边形
                var polygon = new BMap.Polygon(path, this.initStyleOptions);
                this.map.addOverlay(polygon);
                this.overlays.push(polygon); 

            }
        });
        //  地图处于编辑状态时
        if (this.editState&&(this.selectedIndex||this.selectedIndex===0)) {
            this.overlays[this.selectedIndex].enableEditing();

            this.overlays[this.selectedIndex].addEventListener("lineupdate", (e) => {
            this.overlays = [];
            this.overlays.push(e.currentTarget);
            this.converted(e.currentTarget)
        });
        }
    },
    /**
     * 初始化中心点覆盖物
     */
    initCenterPoint(point, index, content) {
        // 更新地图中心点
        if (this.selectedIndex==index) {
            this.map.centerAndZoom(point, 16); //选中时调整中心点
        }
        // 处于编辑状态时
        if (this.editState&&this.selectedIndex==index) {
            return;
        }
        let backgroundColor = "#f56767"
        // 判断是否处于选中状态
            if (this.selectedIndex==index) {
                backgroundColor = '#55a8fd'
            }else {
                backgroundColor = '#f56767'
            }
        var mySquare =new this.SquareOverlay(point, 25, backgroundColor, index, content)
        this.map.addOverlay(mySquare);
    },

      /** 
     * 获取中心点方法
     *  **/
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
    /**
     * 自定义覆盖物
     */
    customCover() {
        this.SquareOverlay = function(center, length, color, index, content){
        this._center = center;  
        this._length = length;  
        this._color = color;  
        this._index = index;
        this._content = content;
        }
        this.SquareOverlay.prototype = new BMap.Overlay();
        this.SquareOverlay.prototype.initialize = function(map) {
        // 保存map对象实例  
        this._map = map;
        // 创建div元素，作为自定义覆盖物的容器  
        var div = document.createElement("div");  
        div.style.position = "absolute";      
        // 可以根据参数设置元素外观  
        div.style.width = this._length + "px";   
        div.style.height = this._length + "px";  
        div.style.background = this._color;    
        div.style.borderRadius = '100px';
        div.style.border = '2px solid #fff';
        div.style.fontSize = '12px';
        div.style.color = '#fff';
        div.style.textAlign = 'center';
        div.style.lineHeight = this._length-2 + 'px';
        div.innerText = this._index+1;

        // 设置信息窗
        var opts = {
        position : this._center,    // 指定文本标注所在的地理位置
        offset   : new BMap.Size(0, -45)    //设置文本偏移量
        }
        var label = new BMap.Label(this._content, opts);  // 创建文本标注对象
            label.setStyle({
                textAlign:'center',
                fontSize:'12px',
                padding: '7px 10px',
                background: "#fff",
                border:'none',
                boxShadow:'0 2px 12px 0 rgba(0,0,0,.1)',
                borderRadius:"5px",
                transform:' translateX(-47%)'
            });
        map.addOverlay(label);
        label.hide();

        //添加onmouseover事件
        // 鼠标进
        div.addEventListener('mouseover' , function(){
            label.show();
        })
        // 鼠标出
        div.addEventListener('mouseout' , function(){
            label.hide();
        })
        // 将div添加到覆盖物容器中  
        map.getPanes().markerPane.appendChild(div);   
        // 保存div实例  
        this._div = div;
        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、  
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。  
        return div;
        }
        // 实现绘制方法  
        this.SquareOverlay.prototype.draw = function(){
        // 根据地理坐标转换为像素坐标，并设置给容器 
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";  
        this._div.style.top = position.y - this._length / 2 + "px";  
        }

    },

  },
  // 组件切换清楚bus数据
   beforeDestroy () {
    this.$bus.$off('drawInit')
  },
  created() {
    this.$bus.$on('shapeChange', (type) => {
      this.draw(type)
    });
    this.customCover()
  },
  mounted() {
      //地图初始化
    this.map = new BMap.Map("map_container");
    if (this.$store.getters.point.lng&&this.$store.getters.point.lat) {
        this.map.centerAndZoom(new BMap.Point(this.$store.getters.point.lng, this.$store.getters.point.lat), 16); //企业地址
    }else {
        this.$message({
        message: '请前往企业信息配置企业地址',
        type: 'warning'
        });
        this.map.centerAndZoom(new BMap.Point(106.506447, 29.614564), 16); //默认重庆经纬度
    }
    this.map.enableScrollWheelZoom(true);
    this.map.addControl(new BMap.OverviewMapControl());    //添加缩略地图控件


       //实例化鼠标绘制工具
    this.drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, //是否开启绘制模式
        //enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
        },
        circleOptions: this.styleOptions, //圆的样式
        polylineOptions: this.styleOptions, //线的样式
        polygonOptions: this.styleOptions, //多边形的样式
        rectangleOptions: this.styleOptions //矩形的样式
    });

     //添加鼠标绘制工具监听事件，用于获取绘制结果
    this.drawingManager.addEventListener('overlaycomplete', (e)=> {
        e.overlay.enableEditing(); //可编辑
        this.drawOverlays.push(e.overlay)
        this.drawingManager.close();
        this.converted(e.overlay);
        this.clearOne()
        // 编辑状态发生变更时
        e.overlay.addEventListener("lineupdate", (e) => {
            this.drawOverlays = [];
            this.drawOverlays.push(e.currentTarget);
            this.converted(e.currentTarget)
        });

    });
    // 围栏列表有数据时初始化围栏
    let _this = this
        _this.$bus.on('drawInit',(fence)=>{
            _this.fence = fence;
            _this.DrawInit(fence);
        })
    
  },
  watch: {
      /**
       * 监听选中状态变化重绘覆盖物
       */
      selectedIndex(newIndex, oldIndex) {
        this.DrawInit(this.fence);
      },
      editState() {  //监听编辑状态  （选中状态的围栏进行编辑时，selectedIndex值无变化，故无法监听，所以再次监听了编辑状态）
        this.DrawInit(this.fence);
      }
  }
}
</script>

<style>
#map_container {
  width: 100%;
  height: calc(100vh - 60px);
}
</style>

