<template>
  <div class="path" style="width: 100%;height: 100%" id="Trace">
    <el-button type="primary" icon="el-icon-arrow-right" class="Trace-Search-Buttom"
               style="background-color:rgb(44, 203, 204);" @click="OpenTrace()" v-on:click="TraceCard = !TraceCard">
      收起查询轨迹
    </el-button>
    <!-- 地图 -->
    <TrafficMap
      :Points='Points'
      ref="TrafficMap"
    ></TrafficMap>
    <!-- 指定某辆车的信息 -->
    <left-card :Cardatadisplay="Cardatadisplay" :taskShow="false" :Card_Cardata="Card_Cardata" :speed="speed" :rpm="rpm"
               @runClick="runClick" @traceClick="traceClick" @stopClick="stopClick"
    ></left-card>
    <!-- 卡片 -->
    <div class="TraceRightCard">
      <div @click="TraceCard = !TraceCard"
           :class="TraceCard? 'Trace-Cardt-buttom' : 'Trace-Cardt-buttom1'"></div>
      <transition name="slide-fade">
        <div class="Trace-Search-Card" v-if="TraceCard">
          <el-card class="box-card">
            <div class="text item">
              <el-form :model="val"  label-position="top" class="right-inline">
                <el-form-item label="车牌号">
                  <el-input  v-model="val.license" placeholder="请输入车牌号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="查询方式" >
                  <el-select @change="carSelectClick(val)" v-model="val.type" placeholder="请选择"  size="mini" style="width:100%">
                    <el-option label="分段查询" value="0"></el-option>
                    <el-option label="按时查询" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="具体日期" v-show="timeSearch" >
                  <el-date-picker
                    v-model="val.date2"
                    type="datetimerange"
                    @change="DataPickerChange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="mini"
                     style="width:100%"
                     >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="选择时间" v-show="!timeSearch">
                  <el-date-picker
                    v-model="val.date1"
                    type="date"
                    placeholder="请选择"
                    size="mini"
                     style="width:100%"
                     >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="轨迹分段" v-show="!timeSearch">
                  <el-select v-model="val.sections" placeholder="请选择分段"  size="mini"  style="width:100%" >
                    <el-option
                      v-for="item in sectionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="btn">
                  <el-button size="mini" type="primary" @click="traceSearch(val)">搜索</el-button>
                </el-form-item>
              </el-form>
              <!-- Heard -->
              <p class="Trace-Search-Card-Search-Result">搜索到相关结果:{{Trace_Search_Card.list.length}}个</p>
              <div class="search_content">
                <div class="Trace-Search-Card-Search" v-for="val in Trace_Search_Card.list"
                     @click="searchSingle(val.Points)"
                     :key="val.id">
                  <p class="Trace-Search-Card-Search-Time"
                     style="font-size:12px;color:#999999;margin:15px 0 15px 10px;text-align:left;">{{val.Time |
                    datetime}}</p>
                  <p class="Trace-Search-Card-Search-Start"
                     style="font-size:12px;color:#666666;margin:0 0 10px 10px;text-align:left;"><span></span>{{val.Start}}
                  </p>
                  <p class="Trace-Search-Card-Search-End"
                     style="font-size:12px;color:#666666;text-align:left;margin:0 0 15px 10px;"><span></span>{{val.End}}
                  </p>
                  <ul class="Trace-Search-Card-Search-Status">
                    <li>
                      <p>{{val.CarStatu.ChaoSu}}</p>
                      <p>超速</p>
                    </li>
                    <li>
                      <p>{{val.CarStatu.JiZhuanWan}}</p>
                      <p>急转弯</p>
                    </li>
                    <li>
                      <p>{{val.CarStatu.JiShaChe}}</p>
                      <p>急加速</p>
                    </li>
                    <li>
                      <p>{{val.CarStatu.JiJiaSu}}</p>
                      <p>急加速</p>
                    </li>
                  </ul>
                  <div class="Trace-Search-Card-Search-score">{{val.Score}} <span>分</span></div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import {BmlLushu} from "vue-baidu-map";
  import TrafficMap from './TrafficMap'
  import {datetime} from '@/utils/filters'
  import leftCard from './leftCard'
  import Vue from 'vue'

  export default {
    components: {
      BmlLushu,
      TrafficMap,
      leftCard
    },
    data() {
      return {
        Points: "",
        timeSearch:false,
        Cardatadisplay: true,
        // Card-Cardata 车辆信息
        Card_Cardata: [],
        // Card-Cardata 任务信息
        Card_task: [],
        sectionList:[],
        rpm: '',
        speed: '',
        date: '',
        license: '',
        carId: this.$route.query.carId,
        // 控制搜索卡片的显示隐藏
        TraceCard: true,
        map: {
          lng: null,
          lat: null
        },
        path: [],
        icon: {
          url: "../../../../static/img/car/car-行驶绿色-3.png",
          size: {width: 65, height: 42},
          opts: {anchor: {width: 27, height: 13}}
        },
        val:{
          license:'',
          type:'',
          date1:'',
          date2:'',
          sections:''
        },
        //  展开 轨迹搜索的数据
        Trace_Search_Card: {
          list: [],

        }
      };
    },
    methods: {
      /**
       * 判断是按时查询还是分段查询，
       * @param  val 传过来的表单数据
       */
      carSelectClick(data) {
        /* 0-分段查询，1-按时查询*/
        if (data.type === '1') {
          this.timeSearch=true
        } else {
          this.timeSearch=false
        }
      },
      /**
       * 监听分段查询时间选择得到分段数据，
       * @param  val 传过来的包含数据
       */
      DataPickerChange(val) {
        /* 根据车牌号获取车辆id*/
        var obj = {}
        this.getData('/car/page', 'post', {license: this.val.license}).then(res => {
          obj.carId = res.data.pv.list[0].id
        }).catch(error => {
          console.log(error)
        })
        obj.date = this.val.date1
        this.getData('/gps/section', 'post', obj).then(res => {
          var sectionList = []
          if (res.data) {
            for (var i = 0; i < res.data.length; i++) {
              sectionList.push({
                value: datetime(res.data[i].startTime, "hh:mm:ss") + '-' + datetime(res.data[i].stopTime, "hh:mm:ss"),
                label: datetime(res.data[i].startTime, "hh:mm:ss") + '-' + datetime(res.data[i].stopTime, "hh:mm:ss"),
              })
              this.sectionList = sectionList
            }
          }

        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 分段查询方法 按钮-点击
       * @param  val 传过来的包含数据
       */
      traceSearch() {
        var obj = {}
        this.getData('/car/page', 'post', {license: this.val.license}).then(res => {
          this.carId = res.data.pv.list[0].id
        }).catch(error => {
          console.log(error)
        })
        /*分段*/
        if (this.val.type === 0) {
          obj.startTime = this.val.date1 + ' ' + this.val.sections.split('-')[0]
          obj.endTime = this.val.date1 + ' ' + this.val.sections.split('-')[1]
        } else {
          /*分时*/
          obj.startTime = this.val.date2[0]
          obj.endTime = this.val.date2[1]
        }
        this.getData('/gps/trace', 'post', {carId: this.carId, startTime: obj.startTime, stopTime: obj.endTime}).then(res => {
          this.Trace_Search_Card.list = []  //清空数据
          var dataLength = Object.keys(res.data).length;
          if (dataLength > 0) {
            for (let i = 1; i <= dataLength; i++) {
              let datelist = res.data['list_' + i];
              let gps = res.data['list_' + i].gps;

              let list = {}
              list.Start = gps[0].position; //起点
              list.End = gps[gps.length - 1].position; //终点
              list.Time = gps[0].obdTime; //时间
              list.Score = 90;  //分数
              list.CarStatu = this.getEventType(gps)  //判断驾驶行为数组
              list.Points = gps; //经纬度集合点
              this.Trace_Search_Card.list.push(list)
            }
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 计算驾驶行为
       */
      getEventType(PointArr) {
        let eventType = {ChaoSu: 0, JiZhuanWan: 0, JiShaChe: 0, JiJiaSu: 0};
        for (var i = 0; i < PointArr.length; i++) {
          if (PointArr[i].eventType) {
            if (PointArr[i].eventType == 0) {
              eventType.JiJiaSu += 1;
            } else if (PointArr[i].eventType == 1) {
              eventType.JiShaChe += 1;
            } else if (PointArr[i].eventType == 2) {
              eventType.JiZhuanWan += 1;
            } else if (PointArr[i].eventType == 4) {
              eventType.ChaoSu += 1;
            }
          }
        }
        return eventType
      },
      /**
       * 计算起始地点
       * @param  data 入参
       */
      getRealPlace(data) {
        let _this = this
        var trace = new BMap.Geocoder();
        trace.getLocation((new BMap.Point(data[0].lng, data[0].lat)), (res) => {
          var addComp = res.addressComponents;
          _this.startPlace = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street
        })
        var trace1 = new BMap.Geocoder();
        trace1.getLocation((new BMap.Point(data[1].lng, data[1].lat)), (res) => {
          var addComp1 = res.addressComponents;
          _this.endPlace = addComp1.province + ", " + addComp1.city + ", " + addComp1.district
        })
        return _this.startPlace + '-' + _this.endPlace
      },
      /**
       * 查询列表点击方法
       * @param  val 一条详细数据
       */
      searchSingle(val) {
        this.$refs.TrafficMap.mapInit(val) //集合点传入地图组件中
      },
      /**
       * 判百度地图自带是搜索工具，
       * @param  res 传过来的数据
       */
      handleSearchComplete(res) {
        this.path = res.getPlan(0).getRoute(0).getPath() // 轨迹坐标点集合（经纬度）
      },
      /**
       * 卡片的伸缩展示
       */
      OpenTrace() {
        if (
          document.getElementsByClassName("Trace-Search-Buttom")[0].style
            .backgroundColor == "rgb(44, 203, 204)"
        ) {
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].style.backgroundColor =
            "rgb(64, 158, 255)";
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].children[1].innerText =
            "展开查询轨迹";
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].children[0].className =
            "el-icon-arrow-left";
        } else if (
          document.getElementsByClassName("Trace-Search-Buttom")[0].style
            .backgroundColor == "rgb(44, 203, 204)"
        ) {
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].style.backgroundColor =
            "rgb(64, 158, 255)";
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].children[1].innerText =
            "展开查询轨迹";
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].children[0].className =
            "el-icon-arrow-left";
        } else {
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].style.backgroundColor =
            "rgb(44, 203, 204)";
          document.getElementsByClassName(
            "Trace-Search-Buttom"
          )[0].children[1].innerText =
            "收起查询轨迹";
          document.getElementsByClassName(
            "Trace-Search-Buttom"
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

      /* 绑定带过来的车牌号*/
      /* 根据车辆id查询单个车辆数据 --绑定左边卡片*/
      this.getData('/gps/location', 'post', {license: this.$route.query.license}).then(res => {
        this.date = res.data.carGpsList[0].time
        // 速度和转速
        this.rpm = res.data.carGpsList[0].rpm
        this.speed = res.data.carGpsList[0].speed
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
        // 转化时间戳
        var getdateCar = () => {
          var now = new Date(res.data.carGpsList[0].time),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
          return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
        }
        res.data.carGpsList[0].time = getdateCar()

        this.Card_task = [
          {label: '用车人', value: '张三'},
          {label: '事由', value: '参加会议培训'},
          {label: '用车时间', value: res.data.carGpsList[0].time},
          {label: '目的地', value: '重庆洪湖西路站北'},
          {label: '驾驶员', value: res.data.carGpsList[0].driverName},
        ]

      }).catch(error => {
        console.log(error)
      })
      // document.getElementsByClassName("content")[0].style.height =
      //   window.outerHeight + "px";
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .path{
    .right-inline {
      font-size: 12px;
      padding: 15px 20px;
      .el-form-item {
        margin-bottom: 10px;
      }
      .el-form-item__label{
        line-height: 1;
        font-size: 12px;
        padding: 0 0 5px;
        color: #666666;
      }
      .el-date-editor .el-range-separator {
        padding: 0;
      }
      .el-date-editor .el-range-input {
        width: 100%;
      }
     .btn{
       text-align: center;
       margin-bottom: 10px;
       .el-form-item__content {
         float: none;
       }
     }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  #Trace .box-card {
  }

  #Trace .Trace-Search-Card form .el-date-editor--datetimerange {
    width: 217px;
  }

  #Trace .ticket {
    width: 100%;
    height: 100%;
    display: block;
    background: #5b8ee2;
    border: 1px solid #8db0eb;
    padding-left: 8px;
    padding-right: 8px;
  }

  #Trace
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

  #Trace {
    position: relative;
  }

  .TraceRightCard {
    position: absolute;
    top: 60px;
    right: 20px;

  }
  .TraceRightCard .Trace-Search-Card{
    width: 282px;
  }
  .Trace-Cardt-buttom {
    height: 28px;
    width: 28px;
    background-image: url('../../../../static/img/icons-sprites.png');
    background-position-x: -83px;
    background-position-y: -79px;
    background-color: #ffffff;
    box-shadow: 0px 0px 1px #888888;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    cursor: pointer;
    position: absolute;
    left: -28px;
    top: 20px;
  }

  .Trace-Cardt-buttom1 {
    height: 28px;
    width: 28px;
    background-image: url('../../../../static/img/icons-sprites.png');
    background-position-x: -57px;
    background-position-y: -79px;
    background-color: #ffffff;
    box-shadow: 0px 0px 1px #888888;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    cursor: pointer;
    position: absolute;
    left: -28px;
    top: 20px;
  }

  #Trace .Trace-Search-Buttom {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 136px;
    height: 36px;
    font-size: 14px;
    padding-left: 10px;
    padding-top: 10px;
    border: 0;
  }

  #Trace .box-card {
  }

  #Trace .text {
    font-size: 14px;
  }

  #Trace .Trace-Search-Card .box-card .el-card__body {
    padding-bottom: 0;
    padding: 0;
  }

  #Trace #formPage .el-date-editor .el-range-separator {
    overflow: initial;
    line-height: 13px;
    width: 10%;
  }

  .Trace-Search-Card-chepai .el-form-item__label,
  .Trace-Search-Card-Select .el-form-item__label,
  .Trace-Search-Card-Time .el-form-item__label {
    text-align: left;
    margin-right: 1px;
  }

  #Trace .el-form-item__content {
    margin-left: 0 !important;
  }

  .Trace-Search-Card-bottom {
    margin: 20px 0;
  }

  .Trace-Search-Card-Search-Result {
    height: 30px;
    background: #eff3f8;
    line-height: 30px;
    text-align: left;
    padding-left: 20px;
    font-size: 12px;
    color: #8395ab;
  }

  .search_content {
    height: 270px;
    overflow: auto;
  }

  #Trace
  .Trace-Search-Card
  .box-card
  .el-card__body
  .item
  #formPage
  .demo-dynamic {
    padding: 0 20px;
  }

  .Trace-Search-Card-Search-Time {
  }

  .Trace-Search-Card-Search-Time::before {
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

  .Trace-Search-Card-Search-Start span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #42c8b3;
    border-radius: 50%;
    margin-right: 8px;
  }

  .Trace-Search-Card-Search-End span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #ffaa76;
    border-radius: 50%;
    margin-right: 8px;
  }

  .Trace-Search-Card-Search-Status {
    height: 50px;
    background-color: #eff3f8;
  }

  .Trace-Search-Card-Search-Status li {
    float: left;
    border-right: 1px solid #d8e6ee;
    width: 25%;
    padding: 5px 0;
  }

  .Trace-Search-Card-Search-Status li p:nth-of-type(1) {
    font-size: 14px;
    font-weight: 600;
    color: #666666;
  }

  .Trace-Search-Card-Search-Status li p:nth-of-type(2) {
    font-size: 12px;
    color: #999999;
  }

  .Trace-Search-Card-Search {
    position: relative;
    cursor: pointer;
  }

  .Trace-Search-Card-Search-score {
    position: absolute;
    top: 0px;
    right: 0;
    font-size: 16px;
    font-weight: 600;
    color: #feb57f;
  }

  .Trace-Search-Card-Search-score span {
    font-size: 12px;
    color: #aaaaaa;
    margin-right: 10px;
  }

  #Trace .Trace-Search-Card .box-card .el-card__body .item .el-button--small {
    padding: 9px 25px;
  }

  #Trace {
    position: relative;
  }


</style>

