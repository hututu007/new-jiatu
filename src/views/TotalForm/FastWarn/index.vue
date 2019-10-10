<template>
  <div class="app-container FastWarn">
    <jt-title :titData="TitData">
      <el-button type="primary" size="mini" class="exportExcel" @click="exportExcel" slot="tabsRight">导出</el-button>
    </jt-title>
    <div class="carSelect">
      <span class="lable">车辆标签</span>
      <el-select style="width: 210px!important;margin-right: 30px" @change="labelChange" v-model="labels" size="small" multiple
                 placeholder="请选择">
        <el-option
          v-for="item in carDataLabel"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span class="lable">选择车辆</span>
      <el-select class="carList" style="width: 210px!important;margin-right: 30px" v-model="carIds" size="small" multiple placeholder="请选择">
        <el-option
          v-for="item in carData"
          :key="item.id"
          :label="item.license"
          :value="item.id">
        </el-option>

      </el-select>
      <span class="lable">选择日期</span>
      <el-date-picker
        v-model="date"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <el-button style="margin-left: 30px" type="primary" size="mini" @click="total">统计</el-button>
    </div>
    <div id="mySpeedChart" style="width: 100%;height: 600px"></div>

    <div class="table">
      <jt-table ref="carTableEq" :tableData="tabledata"></jt-table>
    </div>
  </div>
</template>
<script>
  import JtTitle from '@/components/JtTitle'
  import {export2Excel} from '@/vendor/index'
  import JtTable from '@/components/JtTable'
  import {datetime} from "../../../utils/filters";


  export default {
    name: 'Costs',
    components: {
      JtTitle, JtTable
    },
    data() {
      return {
        TitData: {
          typeName: 0,
          name: '速度统计',
          img: '',
          fucName: '',
          fuc: 1
        },
        mySpeedChart: "",//echart
        carData: [],//车辆信息
        carDataLabel: [],
        labels: [], // 车辆标签
        carIds: [], // 车牌id
        date: '', // 日期
        tabledata: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号 '},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'driverName', title: '驾驶员'},
            {name: 'distance', title: '里程'},
            {name: 'maxSpeed', title: '最大速度'},
            {name: 'avgSpeed', title: '平均速度'},
            {name: 'minSpeed', title: '最小速度'},
            {name: 'useTime', title: '用时'}
          ]
        },
      }
    },
    methods: {
      /**
       * 车辆标签选择
       * @param val 选择的的车辆标签数据
       */
      labelChange(val) {
        this.getData('report/carList', 'post', {carLabelIds: this.labels.join(',')}).then((res) => {
          this.carIds=[]
          this.carData = res.data
        })
      },
      total() {
        // 基于准备好的dom，初始化echarts实例
        // 绘制图表
        // let carIds = this.carIds.length > 0 ? this.carIds : 0
        var carLabelIds = ''
        var carIdsStr = ''
        if (this.labels.length) {
          carLabelIds = this.labels.join(',')
        }
        if (this.carIds.length) {
          carIdsStr = this.carIds.join(',')
        }
        if(!this.date||!this.labels||!this.carIds){
          this.$message({
            message: '请填写完整！',
            type: 'warning'
          })
          return false
        }
        this.getData('/report/speedWarnChart', 'post', {
          carLabelIds: carLabelIds,
          carIdsStr: carIdsStr,
          chartTime: this.date
        }).then((res) => {
          if (res.code === 0) {
            res.data = JSON.parse(res.data)
            this.mySpeedChart.setOption(res.data)
            this.getData('report/speedWarnReport', 'post', {
              carLabelIds: carLabelIds,
              carIdsStr: carIdsStr,
              chartTime: this.date
            }).then((res) => {
              this.tabledata.list = res.data

              // this.tabledata.colhead = [];
              // this.tabledata.datalist = [];
              // const label = res.data[0].column;
              // const rows = res.data[1].row;
              // rows.pop();
              // this.tabledata.colhead.push({label: '月份', prop: 'row0'})
              // for (let i = 0; i < label.length; i++) {
              //   this.tabledata.colhead.push({label: label[i], prop: 'row' + (i + 1)})
              // }
              // for (let i = 0; i < rows.length; i++) {
              //   let row = {};
              //   let key = Object.keys(rows[i])[0]
              //   row['row0'] = key;
              //   for (let j = 0; j < rows[i][key].length; j++) {
              //     row['row' + (j + 1)] = rows[i][key][j];
              //   }
              //   this.tabledata.datalist.push(row)
              // }
            })
          }
        })
      },
      //导出
      exportExcel() {
        // let tabledata = this.tabledata;
        // tabledata = JSON.stringify(tabledata)
        // tabledata = tabledata.replace(/datalist/g, 'list')
        // tabledata = tabledata.replace(/colhead/g, 'headList')
        // tabledata = tabledata.replace(/label/g, 'title')
        // tabledata = tabledata.replace(/prop/g, 'name')
        // tabledata = JSON.parse(tabledata)
        export2Excel(this.tabledata, '导出列表')
      }
    },
    mounted() {
      this.mySpeedChart = this.$echarts.init(document.getElementById('mySpeedChart'));
      this.mySpeedChart.setOption(
        {
        color: ['#55a8fd', '#64B6F0', '#FF7993'],
        calculable: true,
        tooltip: {trigger: 'axis'},
        legend: {
          data: ['最大速度', '平均速度', '最小速度']
        },
        xAxis: [{type: 'category', axisLabel: {}, boundaryGap: true, data: []}],
        yAxis: [{type: 'value', name: '速度'}],
        series: [
          {barWidth: 15, name: '最大速度', type: 'bar', data: []},
          {barWidth: 15, name: '平均速度', type: 'bar', data: []},
          {barWidth: 15, name: '最小速度', type: 'bar', data: []}]
      }
      )
      // this.total();
    },
    created() {
      this.getData('/carLabel/page', 'post').then(res => {
        this.carDataLabel = res.data.list
      }).catch(error => {
        console.log(error)
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .FastWarn {
    .el-input__inner {
      height: 32px;
    }
    .el-icon-date {
      line-height: 32px;
    }
    padding-bottom: 40px;
    .carSelect {
      padding: 20px 20px 40px 20px;

      .lable {
        font-size: 14px;
        color: #666666;
        margin-right: 5px;
      }
      .carList{
        .el-select__tags>span{
          max-height: 80px;
          overflow-y: scroll;
          width: 178px;
          /*滚动条样式*/
          &::-webkit-scrollbar {/*滚动条整体样式*/
            width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
          }
          &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
          }
          &::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(0,0,0,0.1);
          }
        }
      }

    }
    .table {
      padding: 20px;
      margin: auto;
    }
    .exportExcel {
      transform: translateY(-50%);
      position: relative;
      top: 50%;
    }
    .jt-table {
      .el-table tr:nth-child(2n) {
        background-color: #f2f7ff;
      }
    }

    .el-table th {
      padding: 8px 0;
      background: #eef7ff;
      color: #7595c5;
      font-size: 12px;
    }

    .el-table td {
      padding: 8px 0;
      font-size: 12px;
    }
  }
</style>

