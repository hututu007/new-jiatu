<template>
  <div class="stop" id="Stops">
    <el-button type="primary" icon="el-icon-arrow-right" class="Stops-Search-Buttom" @click="OpenStops()"
               v-on:click="StopsCard = !StopsCard" style="background-color:rgb(44, 203, 204);">收起查询轨迹
    </el-button>
    <!-- 卡片 -->
    <transition name="fade">
      <div class="Stops-Search-Card" v-if="StopsCard">
        <el-card class="box-card1">
          <div class="text item">
            <el-form :model="val" class="right-inline">
              <el-form-item label="车牌号">
                <el-input  v-model="val.license" placeholder="请输入车牌号"></el-input>
              </el-form-item>
              <el-form-item label="具体日期">
                <el-date-picker
                  v-model="val.date"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="stopSearch(val)">搜索</el-button>
              </el-form-item>
            </el-form>
            <!-- Heard -->
            <p class="Stops-Search-Card-Search-Result">搜索到相关结果:{{gpslistStops.length ? gpslistStops.length:'0'}}个</p>
            <div class="stopMain">
              <div class="Stops-Search-Card-Search" v-for="val in gpslistStops" :key="val.index"
                   @click="stopSingle(val)">
                <p class="Stops-Search-Card-Search-Time"
                   style="font-size:12px;color:#999999;margin:15px 0 15px 10px;text-align:left;padding-left: 60px;">
                  {{val.stopTime}}</p>
                <p class="Stops-Search-Card-Search-Start"
                   style="font-size:12px;color:#666666;margin:0 0 10px 10px;text-align:left;padding-left: 30px;"><span>{{val.index}}</span><span
                  v-show="val.id%2==0">{{val.index}}</span><i style="font-style: normal;margin-right: 20px;">地点</i><span
                  style="color:rgb(102, 102, 102);width: 200px;height: auto">{{val.position}}</span>
                </p>
                <p class="Stops-Search-Card-Search-End"
                   style="font-size:12px;color:#666666;text-align:left;margin:0 0 15px 10px;padding-left: 60px;"><i
                  style="font-style: normal;margin-right: 20px;">时长</i>{{val.duration}}
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </transition>
    <!--<baidu-map class="map" :center="singlePosition" :zoom="15" :scroll-wheel-zoom="true"-->
    <!--@click="mapClick">-->
    <baidu-map :center="centerPosition" :zoom="11" class="stopMap" :scroll-wheel-zoom="true">
      <bm-marker v-if="gpslistStops" v-for="item in gpslistStops" :key="item.index" ref="marker"
                 :position="{lng: item.longitude, lat: item.latitude}"
                 :dragging="false"
                 :icon="{url: icon.url, size: {width: 300, height: 157}}">
        <bm-label ref="bmLabel"
                  :content="'<span></span><line></line>'+'<cursor class=cursorBox>3</cursor>'+item.license"
                  :labelStyle="{color: '#fff', fontSize : '13px'}" :offset="{width: -25, height: -25}"/>
      </bm-marker>
    </baidu-map>
    <!-- 指定某辆车的信息 -->
    <left-card :Cardatadisplay="Cardatadisplay" :taskShow="false" :Card_Cardata="Card_Cardata" :speed="speed" :rpm="rpm"
               @runClick="runClick" @traceClick="traceClick" @stopClick="stopClick"
    ></left-card>
  </div>
</template>

<script>
  import {BmlLushu} from "vue-baidu-map"
  import leftCard from './leftCard'
  import {datetime} from '@/utils/filters'
  import {cnTime} from '@/utils/hmsFilters'

  export default {
    components: {BmlLushu, leftCard},
    data() {
      return {
        // 控制搜索卡片的显示隐藏
        Cardatadisplay: true,
        // Card-Cardata 车辆信息
        Card_Cardata: [],
        StopsCard: true,
        path: [],
        centerPosition: {lng: 106.5479429849, lat: 29.6077127161},
        gpslistStops: [],
        icon: {
          url: require("../../../assets/images/car/car-行驶绿色-4.png"),
          size: {width: 65, height: 42},
          opts: {anchor: {width: 27, height: 13}}
        },
        val: {
          license: '',
          date: ''
        },
        //  展开 轨迹搜索的数据
        Stops_Search_Card: {
          HeadersNum: 2,
          list: [
            {
              id: 1,
              Time: "2018-02-16 10:45",
              ParKing: [{label: "地点", position: "渝北区金开大道15号"}, {label: '时长', TimeSize: '36'}],
            },
            {
              id: 2,
              Time: "2018-02-16 10:41",
              ParKing: [{label: "地点", position: "渝北区金开大道15号"}, {label: '时长', TimeSize: '36'}],
            },
            {
              id: 3,
              Time: "2018-02-16 10:41",
              ParKing: [{label: "地点", position: "渝北区金开大道15号"}, {label: '时长', TimeSize: '36'}],
            },

          ]
        },
        rpm: 0,
        speed: 0,
        carId: '',
        date: '',
        license: ''
      };
    },
    methods: {
      /**
       * 点击搜索停靠点
       */
      stopSearch(val) {
        var obj = {}
        obj.date = datetime(val.date)
        obj.carId = val.license

        /*获取多个停靠点数据*/
        this.getData('/gps/docked', 'post', obj).then(res => {
          this.centerPosition = {lng: res.data[0].longitude, lat: res.data[0].latitude}
          // this.centerPosition={lng: 106.5479429849, lat: 29.6077127161},
          /*根据经纬度查询具体停靠地点*/
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].license = this.val.license
            res.data[i].index = i
            res.data[i].stopTime = this.getdateStop(res.data[i].stopTime)
            res.data[i].duration = cnTime(Math.abs(parseInt(res.data[i].duration) / 1000))
            this.gpslistStops = res.data
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 时间戳转换为具体时间
       * @param  date 入参
       */
      getdateStop(date) {
        var now = new Date(date),
          y = now.getFullYear(),
          m = now.getMonth() + 1,
          d = now.getDate();
        return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
      },
      /**
       * 点击某一个停靠点
       * @param  val 入参
       */
      stopSingle(val) {
        this.centerPosition.lng = val.longitude
        this.centerPosition.lat = val.latitude
        this.Card_Cardata[4].value = val.stopTime
        this.Card_Cardata[5].value = val.position
      },
      /**
       * 打开收起查询轨迹
       */
      OpenStops() {
        if (
          document.getElementsByClassName("Stops-Search-Buttom")[0].style
            .backgroundColor == ""
        ) {
          document.getElementsByClassName("Trace-Search-Buttom")[0].style.backgroundColor = "rgb(64, 158, 255)";
          document.getElementsByClassName("Trace-Search-Buttom")[0].children[1].innerText = "展开历史停靠";
          document.getElementsByClassName("Trace-Search-Buttom")[0].children[0].className = "el-icon-arrow-left";
        } else if (
          document.getElementsByClassName("Stops-Search-Buttom")[0].style
            .backgroundColor == "rgb(44, 203, 204)"
        ) {
          document.getElementsByClassName(
            "Stops-Search-Buttom"
          )[0].style.backgroundColor =
            "rgb(64, 158, 255)";
          document.getElementsByClassName(
            "Stops-Search-Buttom"
          )[0].children[1].innerText =
            "展开历史停靠";
          document.getElementsByClassName(
            "Stops-Search-Buttom"
          )[0].children[0].className =
            "el-icon-arrow-left";
        } else {
          document.getElementsByClassName(
            "Stops-Search-Buttom"
          )[0].style.backgroundColor =
            "rgb(44, 203, 204)";
          document.getElementsByClassName(
            "Stops-Search-Buttom"
          )[0].children[1].innerText =
            "收起历史停靠";
          document.getElementsByClassName(
            "Stops-Search-Buttom"
          )[0].children[0].className =
            "el-icon-arrow-right";
        }
      },
      /**
       * 停靠点、轨迹、动态方法
       */
      stopClick() {
        this.$router.push({
          path: 'stop',
          query: {
            date: this.date,
            carId: this.$route.query.carId,
            license: this.$route.query.license
          }
        });

      },
      traceClick() {
        this.$router.push({
          path: 'path',
          query: {
            date: this.date,
            carId: this.$route.query.carId,
            license: this.$route.query.license
          }
        });
      },
      runClick() {
        this.$router.push({
          path: 'state',
          query: {
            date: this.date,
            carId: this.$route.query.carId,
            license: this.$route.query.license
          }
        });
      },
    },
    mounted() {
      /* 根据车辆id查询单个车辆数据 --绑定左边卡片*/

      this.getData('/gps/location', 'post', {license: this.$route.query.license}).then(res => {
        this.date = res.data.carGpsList[0].time
        res.data.carGpsList[0].time = this.getdateStop(res.data.carGpsList[0].time)
        // 计算定位位置名称
        this.$nextTick(() => {
          var gc = new BMap.Geocoder();
          gc.getLocation((new BMap.Point(res.data.carGpsList[0].longitude, res.data.carGpsList[0].latitude)), (response) => {
            var addComp = response.addressComponents;
            var place = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street
            this.Card_Cardata = [
              {label: '车牌号', value: res.data.carGpsList[0].license},
              {label: '设备状态', value: '正常'},
              {label: '总里程', value: res.data.carGpsList[0].mileage + 'km'},
              {label: '故障码', value: '0 个'},
              {label: '时间', value: res.data.carGpsList[0].time},
              {label: '位置', value: place},
            ]
          })
        })
      }).catch(error => {
        console.log(error)
      })
      /*路由带过来的车牌号绑定*/
      this.val.license = this.$route.query.license
      // this.getData('/car/page', 'post').then(res => {
      //   console.log(res)
      //   var carList = res.data.data.list
      //   for (var i = 0; i < carList.length; i++) {
      //     /*暂无数据-有则开启*/
      //     // this.formdata[0].data.push({
      //     //   value:carList[i].id,
      //     //   label:carList[i].license
      //     // })
      //   }
      // }).catch(error => {
      //   console.log(error)
      // })
      // document.getElementsByClassName("content")[0].style.height = window.outerHeight + "px";
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .stop {
    width: 100%;
    height: 900px;
    position: relative;
    .stopMap {
      width: 100%;
      height: 100%;
    }
    .right-inline {
      padding-top: 20px;
      .el-form-item:nth-child(1), .el-form-item:nth-child(2) {
        margin-bottom: 0px;
        .el-form-item__label {
          width: 86px;
          font-weight: normal;
        }
        .el-form-item__content {
          float: left;
          .el-input__inner {
            width: 217px;
            height: 28px;
          }
        }
      }
      .el-form-item:nth-child(3) {
        text-align: center;
      }
    }
  }

  .stopMain {
    width: 100%;
    max-width: 324px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: auto;

  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  #Stops .ticket {
    width: 100%;
    height: 100%;
    display: block;
    background: #5b8ee2;
    border: 1px solid #8db0eb;
    padding-left: 8px;
    padding-right: 8px;
  }

  #Stops .BMapLabel {
    width: 92px;
    height: 28px;
    background-color: #5b8ee2 !important;
    border: 0 !important;
    padding-left: 5px !important;
    padding-top: 5px !important;
    position: relative;
  }

  #Stops .BMapLabel > span:nth-child(1)::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #70ce8d;
    margin-left: 8px;
    margin-right: 6px;
    border-radius: 15px;
  }

  #Stops .BMapLabel > line {
    width: 86px;
    height: 22px;
    display: inline-block;
    position: absolute;
    left: 3px;
    top: 3px;
    border: 1px solid #8db0eb;
  }

  #Stops
  > div:nth-of-type(1)
  > div:nth-of-type(1)
  > div:nth-of-type(2)
  > div:nth-of-type(1)
  > div:nth-of-type(1) {
    background-color: #5b8ee2 !important;
    border-radius: 0 !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    padding: 3px !important;
  }

  #Stops {
    position: relative;
  }

  #Stops .Stops-Search-Buttom {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 134px;
    z-index: 10;
    height: 36px;
    font-size: 14px;
    padding-left: 10px;
    padding-top: 10px;
    border: 0;
  }

  #Stops {
    position: relative;
  }

  #Stops .box-card1 {
    position: absolute;
    top: 70px;
    width: 348px;
    z-index: 10;
    right: 20px;
  }
  #Stops .Stops-Search-Card .box-card1 .el-card__body {
    padding: 0px 10px;
    #formPage {
      .demo-dynamic > div {
        .el-form-item__content {
          width: 217px;
        }
        .el-date-editor {
          width: 217px;
        }
      }
    }
  }

  #Stops #formPage .el-date-editor .el-range-separator {
    overflow: initial;
    line-height: 13px;
    width: 10%;
  }

  .Stops-Search-Card-chepai .el-form-item__label,
  .Stops-Search-Card-Select .el-form-item__label,
  .Stops-Search-Card-Time .el-form-item__label {
    text-align: left;
    margin-right: 1px;
  }

  #Stops .el-form-item__content {
    margin-left: 0 !important;
  }

  .Stops-Search-Card-bottom {
    margin: 20px 0;
  }

  .Stops-Search-Card-Search-Result {
    height: 30px;
    background: #eff3f8;
    line-height: 30px;
    text-align: left;
    padding-left: 20px;
    font-size: 12px;
    color: #8395ab;
  }

  #Stops
  .Stops-Search-Card
  .box-card1
  .el-card__body
  .item
  #formPage
  .demo-dynamic {
    padding: 0 20px;
  }

  #Stops .Stops-Search-Card .box-card1 .el-card__body .item .Stops-Search-Card-Search .Stops-Search-Card-Search-Time {
    margin: 15px 0 5px 10px !important;
  }

  #Stops .Stops-Search-Card .box-card1 .el-card__body .item {
    padding-bottom: 20px;
  }

  .Stops-Search-Card-Search-Time::before {
    display: inline-block;
    background: pink;
    overflow: hidden;
    content: "";
    width: 10px;
    height: 10px;
    background: url("../../../../static/img/icon-map.png");
    background-position-x: 192px;
    background-position-y: 56px;
    margin-right: 6px;
  }

  .Stops-Search-Card-Search-Start {
    position: relative;
    left: 30px;
  }

  .Stops-Search-Card-Search-Start span {
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    line-height: 25px;
  }

  .Stops-Search-Card-Search-Start span:nth-of-type(1) {
    display: inline-block;
    width: 22px;
    height: 32px;
    margin-right: 10px;
    background: url('../../../../static/img/icon-map.png');
    background-position-x: -56px;
    background-position-y: 102px;
    margin-top: 10px;
    position: absolute;
    left: -30px;
    top: -2px
  }

  .Stops-Search-Card-Search-Start span:nth-of-type(2) {
    display: inline-block;
    width: 22px;
    height: 32px;
    margin-right: 10px;
    background: url('../../../../static/img/icon-map.png');
    background-position-x: -78px;
    background-position-y: 102px;
    margin-top: 10px;
    position: absolute;
    left: -30px;
    top: -2px
  }

  .Stops-Search-Card-Search-End span {
    margin-right: 33px;
  }

  .Stops-Search-Card-Search {
    position: relative;
    padding: 3px 0;
  }

  .Stops-Search-Card-Search:hover {
    background-color: #dfefff;
  }

  .Stops-Search-Card-Search-score {
    position: absolute;
    top: 0px;
    right: 0;
    font-size: 16px;
    font-weight: 600;
    color: #feb57f;
  }

  .Stops-Search-Card-Search-score span {
    font-size: 12px;
    color: #aaaaaa;
    margin-right: 10px;
  }

  #Stops .Stops-Search-Card .box-card1 .el-card__body .item .el-button--small {
    padding: 9px 25px;
  }
</style>

