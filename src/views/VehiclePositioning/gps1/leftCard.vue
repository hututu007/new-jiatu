<template>
  <div class="left-card">
    <div class="Cardata" v-show="Cardatadisplay">
      <el-card class="box-card">
        <div class="text item">
          <ul style="width: 100%;overflow: hidden">
            <li>
              <div>
                <span>速度</span>
                <p v-if="speed">{{speed}}</p>
                <p v-else>--</p>
                <em>km/h</em>
              </div>
            </li>
            <li>
              <div>
                <span>转度</span>
                <p  v-if="rpm">{{rpm}}</p>
                <p v-else>--</p>
                <em>r/min</em>
              </div>
            </li>
          </ul>
        </div>
        <div class="Carinfo">
          <p
            style="background-color:#eff3f8;color:#8395ab;text-align:left;padding-left:10px;height:30px;line-height:30px;font-size:12px">
            车辆信息</p>
          <div class="Dian-content" v-for="val in Card_Cardata" :key="val.label">
            <p style="display:inline-block;">{{val.label}}<span></span></p>
            <span v-if="val.value">{{val.value}}</span>
            <span v-else>--</span>
          </div>
        </div>
        <div class="taskinfo" v-if="taskShow">
          <p
            style="background-color:#eff3f8;color:#8395ab;text-align:left;padding-left:10px;height:35px;line-height:35px;font-size:12px">
            任务信息</p>
          <div class="Dian-content" v-for="val in Card_task" :key="val.label">
            <p style="display:inline-block;">{{val.label}}<span></span></p><span
            style="display:inline-block;width:180px;">{{val.value}}</span>
          </div>
        </div>

        <div class="dian-Cardata-buttom">
          <!--<router-link to="/Trace">-->
          <el-button type="primary" size="small" @click.native="traceClick">轨迹</el-button>
          <!--</router-link>-->
          <el-button type="primary" size="small" style="margin-left:20px;margin-bottom:20px;"
                     @click.native="runClick">动态
          </el-button>
          <!--<router-link>-->
          <el-button type="primary" size="small" style="margin-left:20px;margin-bottom:20px;"
                     @click.native="stopClick">停靠
          </el-button>
          <el-button type="primary" size="small" style="margin-left:20px;margin-bottom:20px;display: none"
                     @click.native="gpsClick">定位
          </el-button>
        </div>
        <!--</router-link>-->
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "leftCard",
    props: ['Cardatadisplay', 'Card_task', 'Card_Cardata', 'runData','speed', 'rpm','taskShow'],
    data() {
      return {}
    },
    methods:{
      traceClick(){
        this.$emit('traceClick')
      },
      runClick(){
        this.$emit('runClick')
      },
      stopClick(){
        this.$emit('stopClick')
      },
      gpsClick(){
        this.$emit('gpsClick')
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
    .Carinfo .Dian-content, .taskinfo .Dian-content {
      text-align: left;
      padding-left: 10px;
      margin: 14px 0;
    }

    .Carinfo .Dian-content p, .taskinfo .Dian-content p {
      font-size: 12px;
      color: #999999;
      text-align: justify;
      width: 50px;
      line-height: 1.5px;
    }

    .Carinfo .Dian-content p span, .taskinfo .Dian-content p span {
      display: inline-block /* Opera */
    ;
      padding-left: 100%;
    }

    .Carinfo .Dian-content span, .taskinfo .Dian-content span {
      font-size: 12px;
      color: #333333;
      margin-left: 20px;
      text-align: left;
    }
  }


</style>
