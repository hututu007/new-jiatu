<template>
  <div id="dian" class="gps">
    <baidu-map class="map" :center="map.center" :zoom="map.zoom" :scroll-wheel-zoom="map.scrollWheelZoom" >
    <bml-marker-clusterer :averageCenter="true" >
      <bm-marker
      v-if="showAllCar"
      v-for="(item,index) in locationList"
      :key="item.carId"
      :position="item.longitude==null?'':({lng:item.longitude,lat:item.latitude})"
      :rotation="item.heading"
      :icon="{url: require('@/assets/images/car/car'+item.carState+'.png'), size: {width: 17, height: 37}}"
      @click="carSelect(item,index)">
        <my-overlay v-if="carOnly==item.carId" :locationObj="item"></my-overlay>
        <bm-label v-if="showLicense" :content='"<span class="+ carState + item.carState + "></span>" + item.license'  :labelStyle="licenseLabel.labelStyle" :offset="licenseLabel.offset" />
      </bm-marker>
    </bml-marker-clusterer>

    <bm-marker
    v-if="!showAllCar&&nowCarInfo"
      :key="nowCarInfo.carId"
      :position="nowCarInfo.longitude==null?'':({lng:nowCarInfo.longitude,lat:nowCarInfo.latitude})"
      :rotation="nowCarInfo.heading"
      :icon="{url: require('@/assets/images/car/car'+nowCarInfo.carState+'.png'), size: {width: 17, height: 37}}"
      >
        <my-overlay v-if="carOnly==nowCarInfo.carId" :locationObj="nowCarInfo"></my-overlay>
        <bm-label v-if="showLicense" :content='"<span class="+ carState + nowCarInfo.carState + "></span>" + nowCarInfo.license'  :labelStyle="licenseLabel.labelStyle" :offset="licenseLabel.offset" />
      </bm-marker>
    </baidu-map>
    <left-card :Cardatadisplay="cardatadisplay" :carId="carOnly" :carState='carStateNum' ></left-card>
    <top-card @showSettings="showSettings" :topCarState="topCarState" @tabsClick="tabsClick"></top-card>
    <location-card :locationList="locationList" @tabsClick="tabsClick"  @carSelect="carSelect" @search="getLocation" :refresh='true'></location-card>
    <bot-card></bot-card>
  </div>
</template>

<script>
import {BaiduMap ,BmlMarkerClusterer}  from 'vue-baidu-map'
import leftCard from './leftCard'
import topCard from './topCard'
import locationCard from './locationCard'
import myOverlay from './myOverlay'
import botCard from './botCard'

export default {
  components: {BaiduMap, leftCard, topCard, locationCard, myOverlay, BmlMarkerClusterer, botCard},
  data() {
    return {
      carState:'state_spot', //行驶状态
      cardatadisplay: false, //控制基本信息栏
      showLicense: true, // 车牌显示
      carOnly:null, //保留一个班车的 id
      carStateNum: "" , //车辆状态
      topCarState:{}, // 头部tab各个状态的number
      nowCarInfo: null, //选定车辆信息
      showAllCar:true,
      // 实例化地图对象
      map:{
        center: '北京',
        zoom: 16,
        scrollWheelZoom: true
      },
      locationList:{},
      allLocationList: {},
      infoData:{},
      //实例化车牌
      licenseLabel: {
        labelStyle: {
          background: 'url(' + require('@/assets/images/bg_car_License.png') + ') no-repeat',
          backgroundSize:"100% 100%",
          width: "92px",
          height:"28px",
          border:"none",
          color:"#fff",
          fontWeight:'bold',
          textAlign: 'center',
          lineHeight: '28px',
          fontSize:"12px",
        },
        offset: {
          width:-40,
          height:-35
        },
      }
    }
  },
  beforeDestroy(){
    this.loading.close();
  },
  methods: {
    // 获取location数据
    getLocation(searchPar) {
      this.getData('/gps/initCarList', 'post', searchPar).then(res => {

        if (res.code==0) {
          this.loading.close();
          this.locationList = res.data.carGpsList;
          this.allLocationList = res.data; // 接受所有数据

          // 头部tab各个状态的number
          this.topCarState = [
            {Num: res.data.carGpsList.length, label: '全部', value: "carGpsList"}, //全部
            {Num: res.data.gpsList_7.length, label: '行驶中', value: "gpsList_7"}, //正常
            {Num: res.data.gpsList_6.length, label: '熄火', value: "gpsList_6"}, //熄火
            {Num: res.data.gpsList_5.length, label: '超速', value: "gpsList_5"}, //超速
            {Num: res.data.gpsList_4.length, label: '怠速', value: "gpsList_4"}, // 怠速
            {Num: res.data.gpsList_3.length, label: '疲劳驾驶', value: "gpsList_3"}, //疲劳驾驶
            {Num: res.data.gpsList_2.length, label: '故障', value: "gpsList_2"}, //故障
            {Num: res.data.gpsList_1.length, label: '设备拔出', value: "gpsList_1"}, // 设备拔出
          ]
          this.$bus.$emit('gpsBotInfo',res.data.gpsList_7)

          /**
           * 地图初始化聚合点（避免部分gps车辆经纬度未推送数据问题）
           */
          if (searchPar) {
            return;
          }
          if (this.$store.getters.point.lng&&this.$store.getters.point.lat) { //判断企业地址经纬度是否存在
            this.map.center = this.$store.getters.point
          }else
          if (res.data.carGpsList[0].longitude!=null) { //如果未设置企业地址则跳到第一个车辆聚合点
            this.map.center = {lng: res.data.carGpsList[0].longitude, lat:res.data.carGpsList[0].latitude};
          }else
          if (res.data.carGpsList[1].longitude!=null) { //如果第一个车辆经纬度不存在则跳到第二个车辆聚合点
            this.map.center = {lng: res.data.carGpsList[1].longitude, lat:res.data.carGpsList[1].latitude};
          } else
          if (res.data.carGpsList[2].longitude!=null){  //如果第二个车辆经纬度不存在则跳到第三个车辆聚合点
            this.map.center = {lng: res.data.carGpsList[2].longitude, lat:res.data.carGpsList[2].latitude};
          }
        }
      }).catch(() =>{
        this.loading.close();
      })

    },
    // tab栏切换方法
    tabsClick (selected){
      if (selected) {
        this.locationList = this.allLocationList[selected]
      }
      // 重新展示小车
       this.carOnly = null;
       this.showAllCar = true;
    },
    // 选中小车
    carSelect(val,index) {
      let carPoint = {lng: val.longitude,lat: val.latitude}
      // 重新实例化地图
      this.map.zoom = 16;
      this.map.center = carPoint;
      // 加载车辆信息版块
      this.cardatadisplay = true;
      // 保留一个小车
      this.carOnly = val.carId;
      // 设备状态值
      this.carStateNum = val.carState;

      // 开启更新
      this.updateCarData(val,index)
    },

    /**
     * 定时更新单辆车的数据
     */
    updateCarData(val,index) {
      this.nowCarInfo = val;
      this.showAllCar = false;
      this.$bus.$emit('gpsRefresh', val) // 传一次初始化数据，避免数据延迟bug
      // 仅当只有单车模式才开启更新
      clearInterval(this.interval);

      this.interval = setInterval(()=>{
        if (!this.carOnly) {
          clearInterval(this.interval);
          return;
        }
        this.getData('/gps/getGpsCarInfo', 'post', {carId:this.carOnly}).then((res)=>{
          if (res.code==0) {
            this.$bus.$emit('gpsRefresh', res.data.carGpsList[0])
            this.nowCarInfo = res.data.carGpsList[0];
            this.map.center = {lng: this.nowCarInfo.longitude, lat: this.nowCarInfo.latitude};
            // 根据index更新location初始化的数据
            this.$set(this.locationList,index ,this.nowCarInfo )
          }
        })
      },10000)
    },

    /**
     * 显示设置
     * id: 1:显示车牌号，2：超速告警，3：怠速告警 4：插拔告警
     */
    showSettings(val,id) {
      if (id==1) {
        this.showLicense = val;
      }
    }
  },
  created () {
    // 开启加载动画
    this.loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.4)'
    });
    this.getLocation();
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  mounted() {

  },

}
</script>
<style  lang="scss">
.state_spot {
  width: 8px;
  height: 8px;
  background: #feb57f;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spotnull {
  width: 8px;
  height: 8px;
  background: #feb57f;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spot0 {
  width: 8px;
  height: 8px;
  background: #71d189;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spot1 {
  width: 8px;
  height: 8px;
  background: #8ba3c2;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spot2 {
  width: 8px;
  height: 8px;
  background: #f56767;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spot3 {
  width: 8px;
  height: 8px;
  background: #55a8fd;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spot4 {
  width: 8px;
  height: 8px;
  background: #736658;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spot5 {
  width: 8px;
  height: 8px;
  background: #feb57f;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spot6 {
  width: 8px;
  height: 8px;
  background: #ffc600;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
.state_spotnull {
  width: 8px;
  height: 8px;
  background: #ffc600;
  display: inline-block;
  border-radius: 15px;
  margin-right: 5px;
}
</style>

<style scoped lang="scss">
.map {
  width: 100%;
  height: calc(100vh - 60px);
}

</style>
