<template>
  <div class="speed-total">
    <el-dialog title="" width="1000px" :close-on-click-modal="false" :modal-append-to-body="false"
               :before-close="handleClose" :visible.sync="dialogShow">
      <div style="padding: 20px">
        <div class="dsc">
          <p>{{license}}</p>
          <p>{{'轨迹时间段：'+time}}</p>
        </div>
        <div class="line">
          <p>速度曲线图</p>
          <div id="speedEchart" style="width: 100%;height: 350px"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "chatCard",
    props: {
      dialogShow: {
        type: Boolean,
        required: true,
        default: false
      },
      time:{
        type:String,
        required: true,
        default: '--'
      },
      license:{
        type:String,
        required: true,
        default: '--'
      }
    },
    data() {
      return {
        propShow: false,
        data: [],
        speedTime:[],
        interval:0
      };
    },
    watch: {
      dialogShow: function (val, oldVal) {
        this.$nextTick(() => {
          this.drawLine()
        })
      }
    },
    created(){
      this.$bus.$on('speedDataFuc',(val)=>{
        this.data=val.list
        this.speedTime=val.timelist
        this.interval=Math.floor(val.list.length/5)
      })
    },
    methods: {
      handleClose() {
        this.propShow = !this.dialogShow
        this.$emit('update:dialogShow', this.propShow)
      },
      drawLine() {
        let myChart = this.$echarts.init(document.getElementById("speedEchart"))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: '时间：{b} <br/>{a}：{c}'
          },
          color: ['#faa732'],
          grid: {
            left: '4%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis:  {
            type: 'category',
            boundaryGap: false,
            axisLabel: {interval:this.interval, textStyle: {color: '#666'}},
            axisLine: {
              lineStyle: {
                color: '#666',
                width: 1,//这里是为了突出显示加上的
              }
            },
            data:this.speedTime,
            name: '时间'
          },
          yAxis: {
            type: 'value',
            name: '速度（km/h）',
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          series: [
            {
              name:'速度',
              type:'line',
              data:this.data,
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            }
          ]
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .speed-total {
    .dsc {
      width: 100%;
      p {
        font-size: 12px;
      }
      p:nth-child(1) {
        font-size: 16px;
        font-weight: bold;
      }
      p:nth-child(2) {
        margin-bottom: 15px;
      }
      border-bottom: 1px solid #ebeef5;
    }
    .line {
      margin-top: 20px;
      &>p{
        font-weight: bold;
      }
    }
  }
</style>
