<template>
  <div class="path" style="width: 100%;height: 100%" id="Trace">
    <!-- 地图 -->
    <TrafficMap
      :Points='Points'
      :mapCenter="mapCenter"
      ref="TrafficMap"
    ></TrafficMap>
    <!-- 指定某辆车的信息 -->
    <left-card :Cardatadisplay="cardatadisplay" :carId="carId" :carState='carStateNum'></left-card>
    <!-- 卡片 -->
    <div class="TraceRightCard">
      <!-- <div @click="TraceCard = !TraceCard"
           :class="TraceCard? 'Trace-Cardt-buttom' : 'Trace-Cardt-buttom1'"></div> -->
      <el-button v-if="lineBool" type="primary" @click="pathLine()" class="Stops-line-Buttom"
                 style="background-color:rgb(44, 203, 204);">轨迹曲线
      </el-button>
      <el-button type="primary" icon="el-icon-arrow-right" class="Stops-Search-Buttom" @click="OpenStops()"
                 v-on:click="TraceCard = !TraceCard" style="background-color:rgb(44, 203, 204);">收起查询轨迹
      </el-button>

      <transition name="slide-fade">
        <div class="Trace-Search-Card" v-if="TraceCard">
          <el-card class="box-card">
            <div class="text item">
              <el-form :model="val" label-position="top" class="right-inline">
                <el-form-item label="车牌号">
                  <el-input v-model="val.license" placeholder="请输入车牌号" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="查询方式">
                  <el-select @change="carSelectClick(val)" v-model="val.type" placeholder="请选择" size="mini"
                             style="width:100%">
                    <el-option label="分段查询" value="0"></el-option>
                    <el-option label="按时查询" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="具体日期" v-show="timeSearch">
                  <el-date-picker
                    v-model="val.date2"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    size="mini"
                    style="width:100%"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="选择时间" v-show="!timeSearch">
                  <el-date-picker
                    v-model="val.date1"
                    type="date"
                    @change="DataPickerChange"
                    :picker-options="pickerOptions"
                    placeholder="请选择"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width:100%"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="轨迹分段" v-show="!timeSearch">
                  <el-select @change="traceSearch" v-model="val.sections" placeholder="请选择分段" size="mini"
                             style="width:100%">
                    <el-option
                      v-for="item in sectionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="btn">
                  <el-button size="mini" type="primary" v-if="timeSearch" @click="traceSearch()">搜索</el-button>
                </el-form-item>
              </el-form>
              <!-- Heard -->
              <p class="Trace-Search-Card-Search-Result">搜索到相关结果:{{Trace_Search_Card.list.length}}个</p>

              <div class="search_content">
                <p style="text-align:center;margin-top:20px" v-if="loading"><i class="el-icon-loading"
                                                                               style="fonst-size:20px;"></i><span
                  style="color:#6666">&nbsp; 加载中。。。</span></p>

                <div class="Trace-Search-Card-Search" v-for="val in Trace_Search_Card.list"
                     v-if="!loading"
                     @click="searchSingle(val.Points)"
                     :key="val.id">
                  <p class="Trace-Search-Card-Search-Time"
                     style="font-size:12px;color:#999999;margin:15px 0 15px 10px;">{{val.Time |
                    datetime}}</p>
                  <div class="Trace-Search-Card-Search-Start"
                       style="font-size:12px;color:#666666;margin:0 0 10px 10px;"><span></span>
                    <p style="width:224px;display:inline-block">{{val.Start}}</p>
                  </div>
                  <div class="Trace-Search-Card-Search-End"
                       style="font-size:12px;color:#666666;margin:0 0 15px 10px;"><span></span>
                    <p style="width:224px;display:inline-block">{{val.End}}</p>
                  </div>
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
                      <p>急刹车</p>
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
    <!-- 速度曲线弹窗 -->
    <line-dialog :time="speedTime" :license="linelicense" :dialog-show.sync="dialogShow"></line-dialog>
  </div>
</template>

<script>
  import TrafficMap from './TrafficMap'
  import {datetime} from '@/utils/filters'
  import leftCard from './leftCard'
  import LineDialog from './lineDialog'
  import Vue from 'vue'

  export default {
    components: {
      TrafficMap, leftCard, LineDialog
    },
    data() {
      return {
        speedTime: '',
        speedData: {
          timelist: [],
          list: []
        },
        linelicense:'',
        dialogShow: false,
        lineBool: false,
        Points: "",
        mapCenter: "",
        timeSearch: false,
        cardatadisplay: true,
        carStateNum: "",
        pickerOptions: {
          disabledDate(time) {
            var date = new Date("8/1/2018 10:00 AM");
            var date1 = date.getTime()
            return time.getTime() < date1;
          }
        },
        // Card-Cardata 车辆信息
        infoData: {},
        sectionList: [],
        date: '',
        license: '',
        carId: '',
        // 控制搜索卡片的显示隐藏
        TraceCard: true,
        icon: {
          url: require('@/assets/images/car/car0.png'),
          size: {width: 65, height: 42},
          opts: {anchor: {width: 27, height: 13}}
        },
        timeObj: {},
        val: {
          license: this.$route.params.license,
          type: "0",
        },
        loading: false,
        //  展开 轨迹搜索的数据
        Trace_Search_Card: {
          list: [],
        }
      };
    },
    watch: {
      'Trace_Search_Card.list': function (val, oldVal) {
        this.lineBool = false
      }
    },
    methods: {
      /**
       * 点击查询速度曲线
       */
      pathLine() {
        this.dialogShow = true
        this.$bus.$emit('speedDataFuc', this.speedData)
      },
      /**
       * 判断是按时查询还是分段查询，
       * @param  val 传过来的表单数据
       */
      carSelectClick(data) {
        this.Trace_Search_Card.list = []; //清空数据
        /* 0-分段查询，1-按时查询*/
        if (data.type === '1') {
          this.timeSearch = true
        } else {
          this.timeSearch = false
        }
      },
      /**
       * 监听分段查询时间选择得到分段数据，
       * @param  val 传过来的包含数据
       */
      DataPickerChange(val) {
        /* 根据车牌号获取车辆id*/
        var obj = {}
        if (val === null) {
          this.sectionList = {};
          this.val.sections = "";
          this.Trace_Search_Card.list = []; //清空数据
          return;
        }
        this.getData('/car/page', 'post', {license: this.val.license}).then(res => {
          obj.carId = res.data.pv.list[0].id
          this.sectionList = {};
          this.getData('/gps/section', 'post', obj).then(res => {
            var sectionList = [];
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
        }).catch(error => {
          console.log(error)
        })
        obj.date = this.val.date1
      },
      /**
       * 分段查询方法 按钮-点击
       * @param  val 传过来的包含数据
       */
      traceSearch() {
        this.loading = true;
        this.getData('/car/page', 'post', {license: this.val.license}).then(res => {
          this.carId = res.data.pv.list[0].id
          /*分段*/
          if (this.val.type === '0') {
            this.timeObj.startTime = this.val.date1 + ' ' + this.val.sections.split('-')[0]
            this.timeObj.endTime = this.val.date1 + ' ' + this.val.sections.split('-')[1]
          } else {
            /*分时*/
            this.timeObj.startTime = this.val.date2[0]
            this.timeObj.endTime = this.val.date2[1]
          }

          this.getData('/gps/trace', 'post', {
            carId: this.carId,
            startTime: this.timeObj.startTime,
            stopTime: this.timeObj.endTime
          }).then(res => {
            this.Trace_Search_Card.list = []  //清空数据
            var dataLength = Object.keys(res.data).length;
            if (dataLength > 0) {
              this.loading = false;

              for (let i = 1; i <= dataLength; i++) {
                let datelist = res.data['list_' + i];
                let gps = res.data['list_' + i].gps;
                let list = {}
                list.Start = gps[0].position; //起点
                list.End = gps[gps.length - 1].position; //终点
                list.Time = gps[0].obdTime; //时间

                list.CarStatu = this.getEventType(gps)  //判断驾驶行为数组
                list.Score = 100 - list.CarStatu.ChaoSu - list.CarStatu.JiZhuanWan - list.CarStatu.JiShaChe - list.CarStatu.JiJiaSu;  //分数

                list.Points = gps; //经纬度集合点
                this.Trace_Search_Card.list.push(list)
              }
            } else {
              this.$message.warning('暂无数据');
              this.loading = false;
            }
          })
        }).catch(() => {
          this.loading = false;
          this.$message.warning('暂无数据');
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
       * 查询列表点击方法
       * @param  val 一条详细数据
       */
      searchSingle(val) {
        this.speedData.timelist = []
        this.speedData.list = []
        this.$refs.TrafficMap.mapInit(val); //集合点传入地图组件中
        this.lineBool = true
        this.speedTime = this.val.date1 + ' ' + this.val.sections.split('-')[0] + '—' + this.val.date1 + ' ' + this.val.sections.split('-')[1]
        this.linelicense=this.val.license
        for (var i = 0; i < val.length; i++) {
          this.speedData.timelist.push(datetime(val[i].obdTime, 'yy:MM:dd hh:mm:ss'))
          this.speedData.list.push(val[i].gpsSpeed)
        }
      },
      OpenStops() {
        if (
          document.getElementsByClassName("Stops-Search-Buttom")[0].style
            .backgroundColor == ""
        ) {
          document.getElementsByClassName("Trace-Search-Buttom")[0].style.backgroundColor = "rgb(64, 158, 255)";
          document.getElementsByClassName("Trace-Search-Buttom")[0].children[1].innerText = "展开查询轨迹";
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
            "展开查询轨迹";
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
            "收起查询轨迹";
          document.getElementsByClassName(
            "Stops-Search-Buttom"
          )[0].children[0].className =
            "el-icon-arrow-right";
        }
      }

    },
    mounted() {
      this.carId = this.$route.params.carId;
      if (this.$route.params.carState) {
        this.carStateNum = this.$route.params.carState
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .path {
    .el-dialog {
      border-radius: 4px;
      overflow-y: hidden;
      .el-dialog__header {
        padding: 0px;
      }
      .el-dialog__body {
        padding: 0px;
      }
    }
    .Stops-Search-Buttom {
      position: fixed;
      top: 79px;
      right: 22px;
      width: 134px;
      z-index: 10;
      height: 36px;
      font-size: 14px;
      padding-left: 10px;
      padding-top: 10px;
      border: 0;
    }
    .Stops-line-Buttom {
      position: fixed;
      top: 79px;
      width: 134px;
      z-index: 10;
      right: 166px;
      height: 36px;
      font-size: 14px;
      padding-top: 10px;
      border: 0;
    }
    .right-inline {
      font-size: 12px;
      padding: 15px 20px;
      .el-form-item {
        margin-bottom: 10px;
      }
      .el-form-item__label {
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
      .btn {
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
    position: fixed;
    top: 129px;
    right: 20px;

  }

  .TraceRightCard .Trace-Search-Card {
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
    margin: 2px 11px 0 0;
    float: left;
  }

  .Trace-Search-Card-Search-End span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #ffaa76;
    border-radius: 50%;
    margin: 2px 11px 0 0;
    float: left;
  }

  .Trace-Search-Card-Search-Status {
    height: 44px;
    background-color: #eff3f8;
  }

  .Trace-Search-Card-Search-Status li {
    float: left;
    border-right: 1px solid #d8e6ee;
    width: 25%;
    padding: 7px 0;
    text-align: center;
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

