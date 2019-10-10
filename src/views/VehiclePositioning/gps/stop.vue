<template>
  <div class="stop" id="Stops">
    <el-button type="primary" icon="el-icon-arrow-right" class="Stops-Search-Buttom" @click="OpenStops()"
               v-on:click="StopsCard = !StopsCard" style="background-color:rgb(44, 203, 204);">收起停靠历史
    </el-button>
    <!-- 卡片 -->
    <transition name="fade">
      <div class="Stops-Search-Card" v-if="StopsCard">
        <el-card class="box-card1">
          <div class="text item">
            <el-form :model="val" label-position="top" class="right-inline">
              <el-form-item label="车牌号">
                <el-input  v-model="val.license" placeholder="请输入车牌号"></el-input>

              </el-form-item>
              <el-form-item label="具体日期">
                <el-date-picker
                  v-model="val.date"
                  type="date"
                  placeholder="选择日期"
                  style="width:100%">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="stopSearch(val)">搜索</el-button>
              </el-form-item>
            </el-form>
            <!-- Heard -->
            <p class="Stops-Search-Card-Search-Result">搜索到相关结果:{{gpslistStops.length ? gpslistStops.length:'0'}}个</p>
            <div class="stopMain">
              <div class="Stops-Search-Card-Search" v-for="(val,index) in gpslistStops" :key="val.index"
                   @click="stopSingle(val,index)">
                <p class="Stops-Search-Card-Search-Time"
                   style="font-size:12px;color:#999999;margin:15px 0 15px 10px;text-align:left;padding-left: 0;">
                  {{val.stopTime}}</p>
                <p class="Stops-Search-Card-Search-Start out_p"
                   style="font-size:12px;color:#666666;margin:0 0 6px 10px;text-align:left;padding-left: 5px;width:260px;">
                  <span>{{val.index+1}}</span><span
                  v-show="val.id%2==0">{{val.index}}</span><i style="font-style: normal;">地点：</i><span
                  style="color:rgb(102, 102, 102);height: auto">{{val.position}}</span>
                </p>
                <p class="Stops-Search-Card-Search-End"
                   style="font-size:12px;color:#666666;text-align:left;margin:0 0 4px 10px;padding-left: 37px;"><i
                  style="font-style: normal">时长：</i>{{val.duration}}
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </transition>
    <baidu-map :center="centerPosition" :zoom="zoom" class="stopMap" :scroll-wheel-zoom="true" >
      <bm-marker v-if="gpslistStops" v-for="(item,index) in gpslistStops" :key="item.id" ref="marker"
                 :position="{lng: item.longitude, lat: item.latitude}"
                 :dragging="false"
                 :icon="{url: infoLabel.selectLabel===index?require('@/assets/images/gpsImg/icon-map_10.png'):require('@/assets/images/gpsImg/icon-map_09.png'), size: {width: 22, height: 45}}"
                  @click="markerclick(index)"
                >
        <bm-label :content="(index+1)+''" :labelStyle="{color: '#fff', fontSize : '12px', border:'none', background: 'none', zIndex:'99', textAlign:'center'}" :offset="{width: index+1>=10?3:6, height: 4}"/>
     <bm-label v-if="infoLabel.selectLabel===index" :content="item.position" :position="{lng: item.longitude, lat: item.latitude}" :offset="{width: 0, height: -40}" :labelStyle="infoLabel.labelStyle"/>
      </bm-marker>
    </baidu-map>
    <!-- 指定某辆车的信息 -->
    <left-card :Cardatadisplay="cardatadisplay" :carId="carId" :carState='carStateNum'
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
        cardatadisplay: true,
        zoom: 15,
        // Card-Cardata 车辆信息
        StopsCard: true,
        path: [],
        centerPosition: {lng: 106.5479429849, lat: 29.6077127161},
        gpslistStops: [],
        icon: {
          url: require("../../../assets/images/map-icon-red.png"),
          size: {width: 65, height: 42},
          opts: {anchor: {width: 27, height: 13}}
        },
        carStateNum:"",
        val: {
          license: this.$route.params.license,
          date: ''
        },
        infoLabel: {
          labelStyle:{
            textAlign:'center',
            fontSize:'12px',
            padding: '7px 10px',
            background: "#fff",
            border:'none',
            boxShadow:'0 2px 12px 0 rgba(0,0,0,.1)',
            borderRadius:"5px",
            transform:' translateX(-47%)'
          },
          selectLabel: ''// 选中点
        },
        //  展开 轨迹搜索的数据
        Stops_Search_Card: {
          HeadersNum: 2,
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
        obj.license = val.license

        /*获取多个停靠点数据*/
        this.getData('/gps/docked', 'post', obj).then(res => {
          if(res.data.length){
            this.centerPosition = {lng: res.data[0].longitude, lat: res.data[0].latitude}
          }else{
            this.$message.warning('暂无数据');
            this.centerPosition = {lng: 106.5479429849, lat: 29.6077127161}
          }

          /*根据经纬度查询具体停靠地点*/
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].license = this.val.license
            res.data[i].index = i
            res.data[i].stopTime = this.getdateStop(res.data[i].stopTime)
            res.data[i].duration = cnTime(Math.abs(parseInt(res.data[i].duration) / 1000))
          }
          this.gpslistStops = res.data
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
      stopSingle(val,index) {
        this.infoLabel.selectLabel = index;
        this.carId = val.carId
        this.centerPosition.lng = val.longitude
        this.centerPosition.lat = val.latitude
        this.zoom = 17;
      },
      markerclick(index) {
        this.infoLabel.selectLabel = index;
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
    },
    mounted() {
      this.carId = this.$route.params.carId;
      if (this.$route.params.carState) {
        this.carStateNum = this.$route.params.carState
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .stop {
    width: 100%;
    height: calc(100vh - 60px);
    position: relative;
    .stopMap {
      width: 100%;
      height: 100%;
    }

    .right-inline {
      font-size: 12px;
      padding: 15px 20px;
      .el-form-item {
        margin-bottom: 10px;
      }
      .el-form-item:nth-child(1), .el-form-item:nth-child(2) {
        margin-bottom: 10px;
        .el-form-item__label {
          width: 86px;
          font-weight: normal;
        }
        .el-form-item__content {
          .el-input__inner {
            height: 28px;
            font-size: 12px;
          }
        }
      }
      .el-form-item:nth-child(3) {
        text-align: center;
      }
      .el-form-item__label {
        line-height: 1;
        font-size: 12px;
        padding: 0 0 5px;
        color: #666666;
      }
    }
  }

  .stopMain {
    height: 270px;
    overflow-y: auto;
    /*滚动条样式*/
    &::-webkit-scrollbar { /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 4px;
    }
    &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track { /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }

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

  #Stops {
    position: relative;
  }

  #Stops .box-card1 {
    position: fixed;
    top: 127px;
    width: 282px;
    z-index: 10;
    right: 20px;
  }

  #Stops .Stops-Search-Card .box-card1 .el-card__body {
    padding: 0;
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

  // .Stops-Search-Card-Search-Start {
  //   position: relative;
  //   left: 30px;
  // }

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
    border-bottom: 1px dotted #eef6fe;
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

