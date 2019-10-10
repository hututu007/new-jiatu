<template>

  <div class="lushuCompnent">
    <!-- 地图容器 -->
    <div id="map_canvas"></div>
    <!-- 播放器 -->
    <div class="Traceplayer" v-if="playerContent">
      <ul>
        <li :class="{'playIcontow' :play.playIcon, 'play':true }" class="" @click="player" ></li>
        <li class="playLeft" @click="reducePlaySpeed" id="reducePlaySpeed"></li>
        <li class="jindu">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                       color="rgba(142, 113, 199, 0.7)"></el-progress>
        </li>
        <li class="playRight" @click="addPlaySpeed" id="addPlaySpeed"><p class="NowSpeed">{{play.NowSpeed}}x</p></li>
      </ul>
    </div>
  </div>

</template>


<script>
export default {
  components: {},
  props: [ "Points", "mapCenter"],
  data() {
    return {
      playerContent:false,
      play: {  //播放动画
        playIcon: false,
        play: false,
        MaxSpeed: 0,
        NowSpeed: 1,
      },
      pointIndex: 0, //进度值
      distance:0,//实际路程
      percentage:0, //进度条
      speed:1000, //车辆初始速度
      map: "", //地图
    };
  },
  methods: {
    /**
     * 减小播放速度
     */
    reducePlaySpeed() {
      if (this.play.MaxSpeed >= 1) {
        this.play.MaxSpeed--;
        this.NowSpeed(this.play.MaxSpeed);
        if (this.play.MaxSpeed > 2 && this.play.MaxSpeed <= 8) {
          clearInterval(this.intervalId);
          var speed = this.play.NowSpeed*250;
          this.intervalId=setInterval(this.carAnimated,speed)
        }
      }
      //速度减少
    },
    /**
     * 倍速播放
     */
    addPlaySpeed() {
      if (this.play.MaxSpeed <= 8) {
        this.play.MaxSpeed++;
        this.NowSpeed(this.play.MaxSpeed);
        if (this.play.MaxSpeed <= 8 && this.play.MaxSpeed > 0) {
         clearInterval(this.intervalId);
         var speed = 250/this.play.NowSpeed;
        this.intervalId=setInterval(this.carAnimated,speed)
        }
      }
     //速度增加
    },
    /**
     * 快进/后退的效果提示
     */
    NowSpeed(MaxSpeed) {
      switch (MaxSpeed) {
        case 0:
          this.play.NowSpeed = 1;
          break;
        case 1:
          this.play.NowSpeed = 1.5;
          break;
        case 2:
          this.play.NowSpeed = 2;
          break;
        case 3:
          this.play.NowSpeed = 2.5;
          break;
        case 4:
          this.play.NowSpeed = 3;
          break;
        case 5:
          this.play.NowSpeed = 3.5;
          break;
        case 6:
          this.play.NowSpeed = 4;
          break;
        case 7:
          this.play.NowSpeed = 4.5;
          break;
        case 8:
          this.play.NowSpeed = 5;
          break;
        default:
      }
    },

    /**
     * 绘制轨迹
     */
    mapInit(PointArr) {
      this.PointArr = PointArr
      clearInterval(this.intervalId); // 停止进度条
      this.percentage = 0; //进度条清零
      this.pointIndex = 0; // 还原进度index
      this.playerContent=true //播放栏
      this.play.playIcon = false //恢复播放按钮
      this.play.play = false;//恢复播放状态
      this.play.NowSpeed = 1; //恢复倍数
      this.play.MaxSpeed = 0;
      this.pointIndex = 0;
      let _this = this;
      let firstLongitude = PointArr[0].longitude;
      let fristLatitude = PointArr[0].latitude;

      // 每个marker进行恢复操作
      var allOverlay = this.map.getOverlays();
      for (var i = 0; i < allOverlay.length; i++) {
        allOverlay[i].enableMassClear();
      }
      _this.map.clearOverlays();//清除已经画的线

      /**
       *  设置中心点
       */

      _this.map.centerAndZoom(
        new BMap.Point(firstLongitude, fristLatitude),
        15
      );

       /**
       *  设置起点
       */
        var pt_start = new BMap.Point(firstLongitude,fristLatitude);
        let Icon_start = new BMap.Icon( require('@/assets/images/gpsImg/icon-start.png'), new BMap.Size(30,80));
        var marker_start = new BMap.Marker(pt_start,{icon:Icon_start});  // 创建标注
        marker_start.disableMassClear(); // 禁止清除
	      _this.map.addOverlay(marker_start);         // 将标注添加到地图中

      /**
       *  设置终点
       */
        let lastLongitude = PointArr[PointArr.length-1].longitude;
        let lastLatitude = PointArr[PointArr.length-1].latitude;

        var pt_end = new BMap.Point(lastLongitude,lastLatitude);
        let Icon_end = new BMap.Icon( require('@/assets/images/gpsImg/icon-end.png'), new BMap.Size(28,80));
        var marker_end = new BMap.Marker(pt_end,{icon:Icon_end});  // 创建标注
        marker_end.disableMassClear(); // 禁止清除
	      _this.map.addOverlay(marker_end);  // 将标注添加到地图中

      /**
       *  实例路线样式
       */
      var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        scale: 0.6, //图标缩放大小
        strokeColor: "#fff", //设置矢量图标的线填充颜色
        strokeWeight: "2" //设置线宽
      });
      var icons = new BMap.IconSequence(sy, "10", "10");
      
      var trackPoints = [];
      var mileage=0,time=0,sumSpeed=0,maxSpeed=parseInt(PointArr[0].gpsSpeed),virtualSpeed=0;
      for (var i = 0; i < PointArr.length; i++) {
      sumSpeed += parseInt(PointArr[i].gpsSpeed);
      // 计算速度不为0的长度
      if (PointArr[i].gpsSpeed&&PointArr[i].gpsSpeed>0) {
        virtualSpeed +=1;
      }
      if (i>0) {
        var Speed = parseInt(PointArr[i].gpsSpeed);
        // 累加路程
        mileage +=  this.GetDistance(PointArr[i-1].latitude,PointArr[i-1].longitude,PointArr[i].latitude,PointArr[i].longitude);
        maxSpeed = Speed>maxSpeed?Speed:maxSpeed  // 当前的点速度与上一个点速度比值取大
      }
        trackPoints[i] = new BMap.Point(
          PointArr[i].longitude,
          PointArr[i].latitude
        );
        
        // 判断驾驶行为(目前四个行为)
        if (PointArr[i].eventType) {
          if (PointArr[i].eventType==0) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude, require('@/assets/images/gpsImg/eventType0.png'));
          }else
          if (PointArr[i].eventType==1) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude, require('@/assets/images/gpsImg/eventType1.png'));
          }else
          if (PointArr[i].eventType==2) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude, require('@/assets/images/gpsImg/eventType2.png'));
          }else
          if (PointArr[i].eventType==4) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude, require('@/assets/images/gpsImg/eventType4.png'));
          }
          // else
          // if (PointArr[i].eventType==6) {
          //   _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude, require('@/assets/images/gpsImg/eventType6.png'));
          // }
        }
      }
      time = (PointArr[PointArr.length-1].obdTime-PointArr[0].obdTime)/1000/60;

      this.runInfo = {
        mileage: mileage.toFixed(1),
        time: time.toFixed(1),
        speed: (sumSpeed/virtualSpeed).toFixed(1),
        maxSpeed: maxSpeed
      }

      this.$bus.$emit('updateTra',{},this.runInfo);

       /**
       *  画线
       */
      var polyline = new BMap.Polyline(trackPoints, {
        enableEditing: false, //是否启用线编辑，默认为false
        enableClicking: true, //是否响应点击事件，默认为true
        // icons: [icons],
        strokeWeight: "7", //折线的宽度，以像素为单位
        strokeOpacity: 0.8, //折线的透明度，取值范围0 - 1
        strokeColor: "#aaaaaa" //折线颜色
      });
      polyline.disableMassClear(); // 禁止清除
      _this.map.addOverlay(polyline);
    },

    /**
     * 播放动画
     * pointIndex 播放的进度值  
     */ 
    carAnimated () {
      var allOverlay = this.map.getOverlays();
      const length = this.PointArr.length; //数据长度
      // if (this.pointIndex>0) {  // 清楚小车覆盖物
      //   this.map.removeOverlay(allOverlay[allOverlay.length-1]);
      // }

      this.map.clearOverlays();
      //绘小车
      var pt = new BMap.Point(this.PointArr[this.pointIndex].longitude, this.PointArr[this.pointIndex].latitude);
      let carIcon = new BMap.Icon(require('@/assets/images/car/car0.png'), new BMap.Size(17,37));
      var marker = new BMap.Marker(pt, {icon: carIcon});  // 创建标注
      marker.setRotation(this.PointArr[this.pointIndex].heading);
      this.map.addOverlay(marker);   // 将标注添加到地图中

      //更新速度等卡片信息，并绑定数据
      this.$bus.$emit('updateTra', this.PointArr[this.pointIndex]);

      //绘制进度条
      const speedScale = 100/(length-1);  //进度条速度比值 进度总路程为100
      this.percentage = parseInt(speedScale*this.pointIndex);
      this.pointIndex++
      // 数据走完时清除定时器
      if (this.pointIndex>length-1) {
        clearInterval(this.intervalId);
        this.pointIndex = 0;
        this.play.playIcon = false //恢复播放按钮
        this.play.play = false;//恢复播放状态
        this.play.NowSpeed = 1; //恢复倍数
      }
    },
    /**
     *  添加自定义图标
     */
    addMapIcon(longitude,latitude,imgUrl){
        let pt= new BMap.Point(longitude,latitude);
        let Icon = new BMap.Icon(imgUrl, new BMap.Size(28,27));
        let marker = new BMap.Marker(pt,{icon:Icon});  // 创建标注
        marker.disableMassClear(); // 禁止清除
        
	      this.map.addOverlay(marker);         // 将标注添加到地图中
    },
     /**
       * 进度条播放
       */
    playerProgress(){
    },
    /**
     *  播放动画
     */
    player(){
      this.play.play = !this.play.play;
      this.play.playIcon = !this.play.playIcon;
      if (this.play.play) {
        this.intervalId=setInterval(this.carAnimated,250)
      }else{
         clearInterval(this.intervalId);
      }
    },
    /**
     * 进行经纬度转换为距离的计算
    */
    Rad(d){
       return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    },
    /**
     * 计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
     */
    GetDistance(lat1,lng1,lat2,lng2){
      var radLat1 = this.Rad(lat1);
      var radLat2 = this.Rad(lat2);
      var a = radLat1 - radLat2;
      var  b = this.Rad(lng1) - this.Rad(lng2);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
      Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
      s = s *6378.137 ;// EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000; //输出为公里
      //s=s.toFixed(4);
      return s;
    }
  },
  mounted() {
    let mapCenter = this.mapCenter 
    this.map = new BMap.Map("map_canvas");
    if (this.$store.getters.point.lng&&this.$store.getters.point.lat) {
      this.map.centerAndZoom(new BMap.Point(this.$store.getters.point.lng , this.$store.getters.point.lat), 13); //默认重庆经纬度
    }else {
      this.map.centerAndZoom(new BMap.Point(106.55 , 29.57), 13); //默认重庆经纬度
    }
    this.map.enableScrollWheelZoom(true);
  },
  beforeDestroy() {
    // 销毁组件时清除定时器
    clearInterval(this.intervalId)
  },
  watch: {
    mapCenter() {
      this.map.centerAndZoom(this.mapCenter, 13); //设置中心点
    }
  }
};
</script>
<style scoped>
#map_canvas {
  width: 100%;
  height: calc(100vh - 60px);
}

.lushuCompnent {
  position: relative;
}

.Traceplayer {
  width: 400px;
  height: 50px;
  background-color: #3a5992;
  opacity: 0.8;
  border-radius: 25px;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
}

.Traceplayer .play {
  width: 30px;
  height: 30px;
  background: url("../../../../static/img/icon-map.png");
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.Traceplayer .playLeft {
  width: 24px;
  height: 30px;
  background-image: url("../../../../static/img/icon-map.png");
  background-position-x: -30px;
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.Traceplayer .playRight {
  width: 24px;
  height: 30px;
  background-image: url("../../../../static/img/icon-map.png");
  background-position-x: -54px;
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.Traceplayer .jindu {
  width: 232px;
  margin-left: 94px;
  margin-top: 16px;
}

.Traceplayer .jindu .el-progress .el-progress-bar .el-progress-bar__outer {
  background-color: #90a0bd;
}

.Traceplayer
  .jindu
  .el-progress-bar
  .el-progress-bar__outer
  .el-progress-bar__inner {
  background-color: #2ccbcc;
}

.Traceplayer .el-progress-bar__innerText {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ffffff;
  font-size: 0;
  position: absolute;
  margin: 0px;
  margin-left: -10px;
}

.Traceplayer .NowSpeed {
  display: inline-block;
  color: #ffffff;
  position: absolute;
  right: -25px;
  top: 8px;
  font-size: 12px;
}

.Traceplayer .playIcontow {
  width: 30px;
  height: 30px;
  background: url("../../../../static/img/icon-map.png");
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-position-x: -90px;
  background-position-y: -130px;
  cursor: pointer;
}
</style>

