<template>
  <div class="condition-total">
    <el-dialog title="" width="1000px" :close-on-click-modal="false" :modal-append-to-body="false"
               :before-close="handleClose" :visible.sync="dialogShow">
      <div class="title">
        <p>车辆安全报告（第38周）</p>
        <p>深圳中兴驾图科技大数据产出</p>
      </div>
      <div style="padding: 20px">
        <div class="dsc">
          <p>川A14135</p>
          <p>华能珞璜电厂-车辆综合运营管理平台</p>
          <p>报告时间：2017/09/18-2017/09/24</p>
          <p>行驶里程：7237.16公里</p>
          <p>总油耗：233.23升</p>
        </div>
        <div class="line">
          <p>安全评分</p>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="周报"
              width="180">
            </el-table-column>
            <el-table-column
              prop="num"
              label="安全评分">
            </el-table-column>
            <el-table-column
              prop="ranking"
              label="所在机构排名">
            </el-table-column>
            <el-table-column
              prop="grade"
              label="所在机构评分">
            </el-table-column>
            <el-table-column
              prop="level"
              label="安全等级">
              <template slot-scope="scope">
                <img src="../../../assets/images/star.png" v-for="num in 5" :key="num">
              </template>
            </el-table-column>
          </el-table>
          <div id="carEchart" style="width: 100%;height: 350px"></div>
        </div>
        <div class="thing">
          <p>安全统计事件</p>
          <el-table
            :data="tableData1"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="事件类型">
            </el-table-column>
            <el-table-column
              prop="num"
              label="千公里发生次数">
            </el-table-column>
            <el-table-column
              prop="ranking"
              label="所在机构平均发生次数">
            </el-table-column>
          </el-table>

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
      }
    },
    data() {
      return {
        propShow: false,
        tableData: [
          {date: '第38周', num: '100', ranking: '1/20', grade: '30'}
        ],
        tableData1: [
          {date: '超速', num: '0.55', ranking: '1.46'},
          {date: '急减速', num: '0.55', ranking: '1.46'},
          {date: '急转弯', num: '0.55', ranking: '1.46'},
          {date: '急加速', num: '0.55', ranking: '1.46'}
        ]
      };
    },
    watch: {
      dialogShow: function (val, oldVal) {
        this.$nextTick(() => {
          this.drawLine()
        })
      }
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.drawLine()
      // })
    },
    methods: {
      handleClose() {
        this.propShow = !this.dialogShow
        this.$emit('update:dialogShow', this.propShow)
      },
      drawLine() {
        let myChart = this.$echarts.init(document.getElementById("carEchart"))
        myChart.setOption({
          color: ['#55cc79', '#e84e6c'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          center: ['50%', '50%'],
          legend: {
            data: ['本机构', '该车辆'],
            // orient: 'vertical',
            left: '30px',
            bottom: 'bottom'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7'],
            axisLabel: {interval: 0, textStyle: {color: '#666'}},
            axisLine: {
              lineStyle: {
                color: '#dedede',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
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
              name:'该车辆',
              data: [45, 45,'' ,'' , 45, 45, 45],
              type: 'line'
            },
            {
              name:'本机构',
              data: [30, 13, 30, 30, 60, 33, 75],
              type: 'line'
            }
          ]
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .condition-total {
    .el-dialog {
      border-radius: 4px;
      overflow-y: hidden;
      .el-dialog__header {
        padding: 0px;
      }
      .el-dialog__body {
        padding: 0px;
      }
      .el-table thead {
        background-color: #ecf0f3;
        tr, th {
          background-color: inherit;
        }
        /*.el-table th, .el-table tr {*/
        /*!* background-color: #fff; *!*/
        /*}*/
      }
    }
    .title {
      width: 100%;
      height: 80px;
      border-bottom: 1px solid #ebeef5;
      padding-left: 20px;
      padding-top: 20px;
      p:first-child {
        font-size: 18px;
        font-weight: bold;
      }
      p:last-child {
        font-size: 12px;
        color: #999;
      }
    }
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
      padding-bottom: 20px;
    }
    .line {
      margin-top: 20px;
      & > p {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 15px;
      }

    }
    .thing {
      margin-top: 20px;
      width: 100%;
      & > p {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 50px;
    }
  }
</style>
