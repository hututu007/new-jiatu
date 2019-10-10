<template>
  <div class="runMap">
    <!-- 地图容器 -->
    <div id="map_container"></div>
  </div>
</template>

<script>
  export default {
    name: "runMap",
    data() {
      return {
        temporary: [], //定义中间新取出的值放到一个新的数组里面
        interval: '',
        num: 0,
        firstRunList:[], // 用于画出小车历史路线
        firstArr:[],
        PointArr: [],
        setRotation: '',
        Move: '',
        map:'',
        myIcon2:'',
        carImg:'',
        carUrlList:[require('@/assets/images/car/car0.png'),require('@/assets/images/car/car1.png'),require('@/assets/images/car/car2.png'),
          require('@/assets/images/car/car3.png'),require('@/assets/images/car/car5.png'),require('@/assets/images/car/car6.png')] // 所有状态图片
      }
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
    created() {

    },
    methods: {
      /**
       * 实例化动态轨迹地图并添加一系列画轨迹方法
       */
      runMapFuc() {
        for(var i=0;i<this.firstRunList.length;i++){
         this.firstArr.push({
           longitude: this.firstRunList[i].longitude,
           latitude: this.firstRunList[i].latitude,
           route: this.firstRunList[i].heading
         })
          drowLine(this.map, this.firstArr,this.myIcon2)
        }

        // 百度地图API功能
        this.PointArr = [{longitude: this.firstRunList[this.firstRunList.length-1].longitude, latitude: this.firstRunList[this.firstRunList.length-1].latitude, route: this.firstRunList[this.firstRunList.length-1].route}]
        var firstPoint=[{longitude: this.firstRunList[0].longitude, latitude: this.firstRunList[0].latitude, route: 30}]
        // 添加轨迹箭头
        //         var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        //           scale: 0.6, //图标缩放大小
        //           strokeColor: "#fff", //设置矢量图标的线填充颜色
        //           strokeWeight: "2" //设置线宽
        //         });
        //         var icons = new BMap.IconSequence(sy, "10", "10");
        // 1.在地图上添加起始点图标，选用数组的第一个对象的经纬度进行定位展示
        addMarker(new BMap.Point(this.firstRunList[0].longitude, this.firstRunList[0].latitude), '起点', this.map, firstPoint);
        /**
         * 2.调用方法marker具体为
         */
        function addMarker(point, name, mapInit, trackUnit) {
          if (name == "起点") {
            var myIcon = new BMap.Icon("/static/img/icon-map_07.png", new BMap.Size(45, 45), {
              anchor: new BMap.Size(20, 45)//这句表示图片相对于所加的点的位置mapStart
              // offset: new BMap.Size(-10, 45), // 指定定位位置
              // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
            });
            var marker = new BMap.Marker(point, {icon: myIcon});  // 创建标注
            mapInit.addOverlay(marker);               // 将标注添加到地图中
            // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
          }
        }

        /**
         * 3.值存储到一个新的数组里面，通过这些数组拿出前后两个值进行画线。
         */
        var carMk;//先将终点坐标展示的mark对象定义
        /* 全局定时器设定 */

        this.interval = setInterval(() => {
          /* 请求车辆实时数据 */
          this.getData('/gps/dynamic', 'post', {carId: this.$route.params.carId}).then(res => {

            var data=res.data.carGpsList[0].gps

            var lastData=data[data.length-1]
            // this.map.centerAndZoom(new BMap.Point(lastData.longitude, lastData.latitude), 15);
            /*判断车辆颜色*/
            this.imgChange(lastData)
            this.num = this.num + 1;
            this.PointArr.push({
              longitude: lastData.longitude,
              latitude: lastData.latitude,
              route: lastData.heading
            });
            if(this.PointArr.length>2){
              this.PointArr.splice(0,1)
            }
            this.$bus.$emit('interval',this.$route.params.carId)

          }).catch(error => {
            console.log(error)
          })
          drowLine(this.map, this.PointArr, this.myIcon2);//画线调用
          console.log(this.PointArr)
        }, 30000);

        /**
         * 4.每一次画一次线的方法调用
         */
        function drowLine(map, arr, myIcon) {
          if (arr && arr.length > 1) {//判断数值为两个点时开始进行绘制
            for (var i = 0; i < arr.length - 1; i++) {
              var polyline22 = new BMap.Polyline(
                [
                  new BMap.Point(arr[i].longitude, arr[i].latitude),
                  new BMap.Point(arr[i + 1].longitude, arr[i + 1].latitude)
                ],
                {
                  strokeColor: "#5e8cdc",
                  strokeWeight: 10,
                  strokeOpacity: 1
                  // icons: [icons]
                });
              //创建折线
              map.addOverlay(polyline22);
              addMarkerEnd(new BMap.Point(arr[i + 1].longitude, arr[i + 1].latitude), '终点', map, arr[i + 1], myIcon);//添加图标
            }
          }
        }

        /**
         * 5.removeOverlay这个方法放在哪儿都会报找不到图标的错误
         */
        function addMarkerEnd(point, name, mapInit, trackUnit, myIcon) {
          if (name == "终点") {
            if (carMk) {//先判断第一次进来的时候这个值有没有定义，有的话就清除掉上一次的。然后在进行画图标。第一次进来时候没有定义也就不走这块，直接进行画图标
              mapInit.removeOverlay(carMk);
            }
            carMk = new BMap.Marker(point, {icon: myIcon});  // 创建标注
            carMk.setRotation(trackUnit.route);//trackUnit.route
            mapInit.addOverlay(carMk);               // 将标注添加到地图中
            // carMk.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

          }
        }

        /**
         *在每个点的真实步骤中设置小车转动的角度
         *@param{BMap.Point} curPos 起点
         *@param{BMap.Point} targetPos 终点
         */
        this.setRotation = function (curPos, targetPos, em) {
          var me = this;
          var deg = 0;
          curPos = this.map.pointToPixel(curPos);
          targetPos = this.map.pointToPixel(targetPos);
          if (targetPos.x != curPos.x) {
            var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x),
              atan = Math.atan(tan);
            deg = atan * 360 / (2 * Math.PI);
            if (targetPos.x < curPos.x) {
              deg = -deg + 90 + 90;
            } else {
              deg = -deg;
            }
            em._newPointMark.setRotation(-deg);

          } else {
            var disy = targetPos.y - curPos.y;
            var bias = 0;
            if (disy > 0)
              bias = -1
            else
              bias = 1
            em._newPointMark.setRotation(-bias * 90);
          }
          return;
        }

        function $(element) {
          return document.getElementById(element);
        }

      },
      imgChange(data){
        if (data.accStatus === 1 && data.speed) {
          this.carImg=this.carUrlList[0] // 行驶中
          this.myIcon2 = new BMap.Icon(this.carImg, new BMap.Size(50, 50), {anchor: new BMap.Size(27, 13)})
        } else if (data.accStatus === 0) {
          this.carImg=this.carUrlList[1]  // 熄火
          this.myIcon2 = new BMap.Icon(this.carImg, new BMap.Size(50, 50), {anchor: new BMap.Size(27, 13)})
        } else if (data.eventType === 4) {
          this.carImg=this.carUrlList[2] // 超速
          this.myIcon2 = new BMap.Icon(this.carImg, new BMap.Size(50, 50), {anchor: new BMap.Size(27, 13)})
        } else if (data.eventType === 6) {
          this.carImg=this.carUrlList[3] // 怠速
          this.myIcon2 = new BMap.Icon(this.carImg, new BMap.Size(50, 50), {anchor: new BMap.Size(27, 13)})
        } else if (data.dtc === true) {
          this.carImg=this.carUrlList[4] // 故障
          this.myIcon2 = new BMap.Icon(this.carImg, new BMap.Size(50, 50), {anchor: new BMap.Size(27, 13)})
        } else if (data.carPlugType === 6) {
          this.carImg=this.carUrlList[5] // 设备拔出
          this.myIcon2 = new BMap.Icon(this.carImg, new BMap.Size(50, 50), {anchor: new BMap.Size(27, 13)})
        }else{
          this.carImg=this.carUrlList[4] // 行驶中
          this.myIcon2 = new BMap.Icon(this.carImg, new BMap.Size(50, 50), {anchor: new BMap.Size(27, 13)})
        }
      }
    },
    mounted() {
      this.map = new BMap.Map('map_container');
      this.map.centerAndZoom(new BMap.Point(106.5065165683,29.6144641402), 15);
      this.map.enableScrollWheelZoom(true);

      this.getData('/gps/dynamic', 'post', {carId: this.$route.params.carId}).then(res => {
        this.firstRunList=res.data.carGpsList[0].gps
        if(this.firstRunList[0]){
          this.map.centerAndZoom(new BMap.Point(this.firstRunList[0].longitude, this.firstRunList[0].latitude), 15);
        }else{
          this.map.centerAndZoom(new BMap.Point(106.5065165683,29.6144641402), 15);
        }
        //地图中心点
        this.map.enableScrollWheelZoom(true);
        this.imgChange(this.firstRunList[this.firstRunList.length-1])
        this.runMapFuc()
      }).catch(error => {
        console.log(error)
      })

    }
  }
</script>

<style scoped>
  #map_container {
    width: 100%;
     height: calc(100vh - 60px);
  }
</style>
