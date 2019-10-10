<template>

  <div class="lushuCompnent">
    <!-- 地图容器 -->
    <div id="map_canvas"></div>
    <!-- 播放栏 -->
    <div class="Traceplayer" v-if="playerContent">
      <ul>
        <li :class="{'playIcontow' :play.playIcon}" class="play" @click="player" ></li>
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
  props: [ "Points"],
  data() {
    return {
      playerContent:false,
      play: {  //播放动画
        playIcon: false,
        play: false,
        MaxSpeed: 0,
        NowSpeed: 1,
      },
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
          this.lushu._opts.speed = this.play.NowSpeed * 500;
        } else {
          this.lushu._opts.speed = this.play.NowSpeed * 500;
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
        if (this.play.MaxSpeed <= 8 && this.play.MaxSpeed > 1) {
          this.lushu._opts.speed = this.speed * this.play.NowSpeed;
        }
        else {
          this.lushu._opts.speed = this.speed * this.play.NowSpeed;
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

      this.distance = 0;  //路程清零
      this.percentage = 0; //进度条清零
      this.playerContent=true //播放栏
      this.play.playIcon = false //恢复播放按钮
      this.play.play = false;//恢复播放状态
      this.play.NowSpeed = 1; //恢复倍数
      this.play.MaxSpeed = 0;
      let _this = this;
      _this.map.clearOverlays();//清除已经画的线
      let firstLongitude = PointArr[0].longitude;
      let fristLatitude = PointArr[0].latitude;

      /**
       *  设置中心点
       */

      _this.map.centerAndZoom(
        new BMap.Point(firstLongitude, fristLatitude),
        15
      );

       /**
       *  设置起点 http://lbsyun.baidu.com/jsdemo/img/fox.gif
       */
        var pt_start = new BMap.Point(firstLongitude,fristLatitude);
        let Icon_start = new BMap.Icon("../../../static/img/mark/icon-map_07.png", new BMap.Size(28,45));
	      var marker_start = new BMap.Marker(pt_start,{icon:Icon_start});  // 创建标注
	      _this.map.addOverlay(marker_start);         // 将标注添加到地图中


      /**
       *  设置终点
       */
        let lastLongitude = PointArr[PointArr.length-1].longitude;
        let lastLatitude = PointArr[PointArr.length-1].latitude;

        var pt_end = new BMap.Point(lastLongitude,lastLatitude);
        let Icon_end = new BMap.Icon("../../../static/img/mark/icon-map_08.png", new BMap.Size(28,45));
	      var marker_end = new BMap.Marker(pt_end,{icon:Icon_end});  // 创建标注
	      _this.map.addOverlay(marker_end);         // 将标注添加到地图中

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
      for (var i = 0; i < PointArr.length; i++) {
        trackPoints[i] = new BMap.Point(
          PointArr[i].longitude,
          PointArr[i].latitude
        );
        // 判断驾驶行为(目前四个行为)
        if (PointArr[i].eventType) {
          if (PointArr[i].eventType==0) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude,'../../../../static/img/car/eventType0.png');
          }else
          if (PointArr[i].eventType==1) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude,'../../../../static/img/car/eventType1.png');
          }else
          if (PointArr[i].eventType==2) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude,'../../../../static/img/car/eventType2.png');
          }else
          if (PointArr[i].eventType==4) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude,'../../../../static/img/car/eventType4.png');
          }else
          if (PointArr[i].eventType==6) {
            _this.addMapIcon(PointArr[i].longitude,PointArr[i].latitude,'../../../../static/img/car/eventType4.png');
          }
        }
        // 计算路程
        if (i>0) {
           let pointA = new BMap.Point(PointArr[i].longitude,PointArr[i].latitude)
          let pointB = new BMap.Point(PointArr[i-1].longitude,PointArr[i-1].latitude)
          this.distance +=Number(_this.map.getDistance(pointA,pointB));
        }
      }
      this.distance = Math.floor(this.distance*100)/100; // 行驶的总路程
       /**
       *  画线
       */
      var polyline = new BMap.Polyline(trackPoints, {
        enableEditing: false, //是否启用线编辑，默认为false
        enableClicking: true, //是否响应点击事件，默认为true
        // icons: [icons],
        strokeWeight: "10", //折线的宽度，以像素为单位
        strokeOpacity: 0.8, //折线的透明度，取值范围0 - 1
        strokeColor: "#aaaaaa" //折线颜色
      });
      _this.map.addOverlay(polyline);
      /**
       *  路书（小车行驶）
       */
       this.lushu = new BMapLib.LuShu(_this.map, trackPoints, {
              defaultContent: "",
              autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
              icon: new BMap.Icon(
                "../../../static/img/car/car-行驶绿色-3.png",
                new BMap.Size(52, 52),
                { anchor: new BMap.Size(27, 13) }
              ),
              speed: _this.speed,
              enableRotation: true, //是否设置marker随着道路的走向进行旋转
              landmarkPois: []
        });
    },
    /**
       *  添加自定义图标
       */
    addMapIcon(longitude,latitude,imgUrl){
        let pt= new BMap.Point(longitude,latitude);
        let Icon = new BMap.Icon(imgUrl, new BMap.Size(28,27));
	      let marker = new BMap.Marker(pt,{icon:Icon});  // 创建标注
	      this.map.addOverlay(marker);         // 将标注添加到地图中
    },
     /**
       * 进度条播放
       */
    playerProgress(){
      var speed = (100*this.speed/this.distance/1.34/10)*this.play.NowSpeed //播放速度
      this.percentage+=speed;
      this.percentage = Number(this.percentage.toPrecision(4))
      if (this.percentage>100) {
        this.percentage = 100;
        clearInterval(this.intervalId);
      }
    },
    /**
       *  播放动画
       */
    player(){
      this.play.play = !this.play.play;
      this.play.playIcon = !this.play.playIcon;
      if (this.play.play) {
        this.percentage = this.percentage==100?0:this.percentage;
        this.lushu.start();
        this.intervalId=setInterval(this.playerProgress,100)
      }else{
        this.lushu.pause();
         clearInterval(this.intervalId);
      }

    }
  },
  mounted() {
    this.map = new BMap.Map("map_canvas");
    this.map.centerAndZoom(new BMap.Point(106.55 , 29.57), 11); //默认重庆经纬度
    this.map.enableScrollWheelZoom(true);


  }
};
</script>
<style scoped>
#map_canvas {
  width: 100%;
  height: 900px;
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

