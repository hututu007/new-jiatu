<template>
  <div class="left-card">
    <div class="Cardata" v-if="Cardatadisplay">
      <el-card class="box-card">
        <div class="text item">
          <ul style="width: 100%;overflow: hidden" v-if="$route.name!='Stop'" >
            <li>
              <div>
                <span>速度</span>
                <p v-if="kmph">{{kmph||kmph===0?kmph:'--'}}</p>
                <p v-else>{{infoData.kmph||infoData.kmph===0?infoData.kmph:'--'}}</p>
                <em>km/h</em>
              </div>
            </li>
            <li>
              <div>
                <span>转速</span>
                <p>{{infoData.rpm||infoData.rpm===0?infoData.rpm:'--'}}</p>
                <em>r/min</em>
              </div>
            </li>
          </ul>
        </div>
        <div class="Carinfo">
          <p
          class="title"
            style="">
            车辆信息</p>
          <div class="Dian-content">
            <p >车牌号<span></span></p>
            <span>{{infoData.license?infoData.license:'--'}}</span>
          </div>
          <div class="Dian-content">
            <p >设备状态<span></span></p>
            <span>{{carState==null?'拔出':'正常' }}</span>
          </div>
          <!--  -->
          <div class="Dian-content">
            <p >总里程<span></span></p>
            <span>{{infoData.mileage?infoData.mileage:'--'}}&nbsp;km</span>
          </div>
          <div class="Dian-content">
            <p >故障码<span></span></p>
            <span>{{infoData.dtc?infoData.dtc:'--'}}</span>
          </div>
          <div class="Dian-content">
            <p >时间<span></span></p>
            <span v-if="infoData.time">{{infoData.time | datetime('yy:MM:dd hh:mm:ss')}}</span>
            <span v-else>----</span>
          </div>
          <div class="Dian-content">
            <p >位置<span></span></p>
            <span class="out_p" style="width:180px;display: inline-block;position: relative;top: 2px;">{{position?position:'--'}}</span>
          </div>
        </div>
        <div class="taskinfo" v-if="taskShow">
          <p class="title"
            >
            任务信息</p>
          <div class="Dian-content">
            <p >用车人<span></span></p>
            <span>{{infoData.applyInfo?infoData.applyInfo.useMan:'--'}}</span>
          </div>
          <div class="Dian-content">
            <p >事由<span></span></p>
            <span style="">{{infoData.applyInfo?infoData.applyInfo.useReason:'--'}}</span>
          </div>
          <div class="Dian-content">
            <p >用车时间<span></span></p>
            <span v-if="infoData.applyInfo">{{infoData.applyInfo.preStartTime | datetime('yy:MM:dd hh:mm:ss')}} </br>-- {{infoData.applyInfo.preStopTime | datetime('yy:MM:dd hh:mm:ss')}}</span>
            <span v-else>--</span>
          </div>
          <div class="Dian-content">
            <p >目的地<span></span></p>
            <span>{{infoData.applyInfo?infoData.applyInfo.stopAddress:'--'}}</span>
          </div>
          <div class="Dian-content">
            <p >驾驶员<span></span></p>
            <span>{{infoData.applyInfo?infoData.applyInfo.driver:'--'}}</span>
          </div>
        </div>
        <div class="runinfo" v-if="runShow">
          <p
           class="title">
            行驶信息</p>

          <div class="Dian-content">
            <p  >行驶里程<span></span></p><span
            style="display:inline-block;width:180px;">{{runInfo.mileage?runInfo.mileage:'--'}}（公里）</span>
          </div>
          <div class="Dian-content">
            <p  >行驶时间<span></span></p><span
            style="display:inline-block;width:180px;">{{runInfo.time?runInfo.time:'--'}} 分钟</span>
          </div>
          <div class="Dian-content">
            <p  >平均速度<span></span></p><span
            style="display:inline-block;width:180px;">{{runInfo.speed?runInfo.speed:'--'}}（km/h）</span>
          </div>
          <div class="Dian-content">
            <p  >最高速度<span></span></p><span
            style="display:inline-block;width:180px;">{{runInfo.maxSpeed?runInfo.maxSpeed:'--'}}（km/h）</span>
          </div>
        </div>

        <div class="dian-Cardata-buttom">
          <el-row :gutter="20">
             <el-col :span="8" v-show="btn.gpsShow"><div class="grid-content">
              <router-link to="/vehicle-positioning/gps">
              <el-button type="primary" size="mini">定位</el-button>
              </router-link>
            </div></el-col>
            <el-col :span="8"><div class="grid-content">
              <router-link :to="'/vehicle-positioning/path/'+infoData.carId+'/'+infoData.license +'/'+ carState"  v-if="btn.pathShow">
              <el-button type="primary" size="mini" >轨迹</el-button>
              </router-link>
            </div></el-col>
            <el-col :span="8"><div class="grid-content">
              <router-link :to="'/vehicle-positioning/state/'+infoData.carId+'/'+infoData.license +'/'+ carState"  v-if="btn.stateShow">
              <el-button type="primary" size="mini" >动态</el-button>
              </router-link>
            </div></el-col>
            <el-col :span="8"><div class="grid-content">
              <router-link :to="'/vehicle-positioning/stop/'+infoData.carId+'/'+infoData.license +'/'+ carState"  v-if="btn.stopShow">
              <el-button type="primary" size="mini">停靠</el-button>
              </router-link>
            </div></el-col>

          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "leftCard",
    props: ['Cardatadisplay','carId','carState','refresh'],
    data() {
      return {
        kmph:"",
        infoData:{},
        position:"",
        runShow:false,
        taskShow:true,
        runInfo:{},
        btn:{
          pathShow:true,
          stateShow:true,
          stopShow:true,
          gpsShow:true
        },
      }
    },

    mounted(){
      if(this.$route.name==='Path'){
        this.btn.pathShow=false
        this.runShow=true
        this.taskShow=false
      }else if(this.$route.name==='Gps'){
        this.btn.gpsShow=false
      }else if(this.$route.name==='State'){
        this.btn.stateShow=false
      }else if(this.$route.name==='Stop'){
        this.btn.stopShow=false
        this.taskShow=false
      }
    },
    methods:{
      getPosition(pt) {
        let _this = this
        var geoc = new BMap.Geocoder();
        
          geoc.getLocation(pt, (rs) => {
            var addComp = rs.addressComponents;
            this.position = addComp.city  + addComp.district + addComp.street + addComp.streetNumber
        })

      },
    },
    created(){
      //轨迹更新速度等卡片信息
      this.$bus.$on('updateTra', (val, runInfo) => {
        if (runInfo) {
        this.runInfo = runInfo;
        }
        
        if (val) {
          this.kmph = val.gpsSpeed;
          this.infoData.time = val.obdTime;
          this.infoData.position = val.position;
          this.infoData.renderDom = 0
          let point = new BMap.Point(val.longitude, val.latitude);
          this.getPosition(point);
        }
       
      })
      this.$bus.$on('oneCarState', (val)=>{
        this.getData('/gps/getGpsCarInfo', 'post', {carId:val}).then((res)=>{
          this.infoData = res.data.carGpsList[0];
          const pt = {
            lng:this.infoData.longitude,
            lat: this.infoData.latitude
          }
          this.getPosition(pt)
          // 里程精确到小数两位
          if (this.infoData.mileage) {
            this.infoData.mileage = this.infoData.mileage.toFixed(2);
          }
        })
      })
      this.$bus.$on('gpsRefresh', info => {
        if(info.mileage){
          info.mileage = info.mileage.toFixed(2);
        }
        // info.mileage = info.mileage.toFixed(2)
        this.infoData = info;
      })
    },
    watch: {
      carId() {
        if (!this.carId) {
          return;
        }
        this.getData('/gps/getGpsCarInfo', 'post', {carId:this.carId}).then((res)=>{
          this.infoData = res.data.carGpsList[0];
          const pt = new BMap.Point(this.infoData.longitude , this.infoData.latitude)
          this.getPosition(pt)
          // 里程精确到小数两位
          if (this.infoData.mileage) {
            this.infoData.mileage = this.infoData.mileage.toFixed(2);
          }
        })

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .left-card {
    position: absolute;
    width: 280px;
    top: 50px;
    left: 20px;
    .Cardata .box-card .el-card__body {
      padding: 0;
    }
    .box-card .title {
      background-color:#eff3f8;
      color:#8395ab;
      text-align:left;
      padding-left:10px;
      height:30px;
      line-height:30px;
      font-size:12px
    }
    .Cardata .item li {
      width: 50%;
      float: left;
      margin-bottom: 20px;
      margin-top: 17px;
      text-align: center;
    }
    .Cardata .item li:nth-child(1) {
      border-right: 1px solid #cddde7;
    }

    .Cardata .item li span {
      display: block;
      padding-bottom: 10px;
      font-size: 14px;
      color: #666666;
    }

    .Cardata .item li p {
      display: inline;
      font-size: 24px;
      font-weight: 600;
      color: #324e80;
      margin-right: 5px;
    }

    .Cardata .item li em {
      font-size: 12px;
      color: #999999;
    }
    .Cardata {
      width: 100%;
      .dian-Cardata-buttom{
        text-align: center;
      }
    }

    .Cardata .text {
      font-size: 14px;
    }
  .taskinfo .Dian-content {
    text-align: left;
    padding-left: 10px;
    margin: 14px 0;
  }

    .Carinfo .Dian-content, .taskinfo .Dian-content, .runinfo .Dian-content{
    display: flex;
      text-align: left;
      padding-left: 10px;
      margin: 8px 0px 0px;
    }

    .Carinfo .Dian-content p, .taskinfo .Dian-content p,.runinfo .Dian-content p{
      font-size: 12px;
      color: #999999;
      text-align: justify;
      width: 55px;
      display: inline-block;
    }

    .Carinfo .Dian-content p span, .taskinfo .Dian-content p span, .runinfo .Dian-content p span{
      display: inline-block;
      padding-left: 100%;
    }

    .Carinfo .Dian-content span, .taskinfo .Dian-content span,.runinfo .Dian-content span{
      font-size: 12px;
      color: #333333;
      margin-left: 20px;
      text-align: left;
      width: 180px;
    }
    .dian-Cardata-buttom{
      width: 100%;
      padding:0px 20px 20px 20px;
    }

  }


</style>
