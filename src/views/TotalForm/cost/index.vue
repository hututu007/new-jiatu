<template>
  <div class="app-container Costs">
    <jt-title :titData="TitData">
      <el-button type="primary" size="mini" class="exportExcel" @click="exportExcel" slot="tabsRight">导出</el-button>
    </jt-title>
    <div class="carSelect">
      <span class="lable">车辆标签</span>
      <el-select style="width: 193px;margin-right: 30px" @change="labelChange" v-model="labels" size="small" multiple
                 placeholder="请选择">
        <el-option
          v-for="item in carDataLabel"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span class="lable">选择车辆</span>
      <el-select style="width: 300px;" v-model="carIds" size="small" multiple placeholder="请选择">
        <el-option
          v-for="item in carData"
          :key="item.id"
          :label="item.license"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button style="margin-left: 30px" type="primary" size="mini" @click="total">统计</el-button>
    </div>
    <div id="myChart" style="width: 100%;height: 600px"></div>
    <div class="table" v-if="tabledata.datalist">
      <el-table
        :data="tabledata.datalist"
        border
        show-summary
        id="out-table"
        style="width: 100%;"
      >
        <el-table-column
          v-for='item in tabledata.colhead'
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
          width="150">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="see(scope)"
              size="mini">查看明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import JtTitle from '@/components/JtTitle'
  import {export2Excel} from '@/vendor/index'


  export default {
    name: 'Costs',
    components: {
      JtTitle
    },
    data() {
      return {
        TitData: {
          typeName: 0,
          name: '费用统计',
          img: '',
          fucName: '',
          fuc: 1
        },
        carDataLabel: [],
        labels: [], // 车辆标签
        myChart: "",//echart
        carData: {},//车辆信息
        carIds: [], //车牌id
        tabledata: {
          colhead: [],
          datalist: [],
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
          this.carIds = []
          this.carData = res.data
        })
      },
      total() {
        // 基于准备好的dom，初始化echarts实例
        // 绘制图表
        let carIds = this.carIds.length > 0 ? this.carIds : 0
        this.getData('/report/costchart', 'post', {carIds: carIds}).then((res) => {
          if (res.code === 0) {
            res.data = JSON.parse(res.data)
            this.myChart.setOption(res.data)
            this.getData('report/costreport', 'POST', {carIds: carIds}).then((res) => {
              this.tabledata.colhead = [];
              this.tabledata.datalist = [];
              const label = res.data[0].column;
              const rows = res.data[1].row;
              rows.pop();
              this.tabledata.colhead.push({label: '月份', prop: 'row0'})
              for (let i = 0; i < label.length; i++) {
                this.tabledata.colhead.push({label: label[i], prop: 'row' + (i + 1)})
              }
              for (let i = 0; i < rows.length; i++) {
                let row = {};
                let key = Object.keys(rows[i])[0]
                row['row0'] = key;
                for (let j = 0; j < rows[i][key].length; j++) {
                  row['row' + (j + 1)] = rows[i][key][j];
                }
                this.tabledata.datalist.push(row)
              }
            })
          }
        })
      },
      see(val) {
        this.$router.push({
          path: 'detailed',
          query: {
            date: val.row.row0,
            carIds: this.carIds
          }
        })
      },
      //导出
      exportExcel() {
        let tabledata = this.tabledata;
        tabledata = JSON.stringify(tabledata)
        tabledata = tabledata.replace(/datalist/g, 'list')
        tabledata = tabledata.replace(/colhead/g, 'headList')
        tabledata = tabledata.replace(/label/g, 'title')
        tabledata = tabledata.replace(/prop/g, 'name')
        tabledata = JSON.parse(tabledata)
        export2Excel(tabledata, '导出列表')
      },
    },
    mounted() {
      this.myChart = this.$echarts.init(document.getElementById('myChart'));
      this.total();
    },
    created() {
      // this.getData('report/carList', 'POST').then((res) => {
      //   this.carData = res.data
      // })
      this.getData('/carLabel/page', 'post').then(res => {
        this.carDataLabel = res.data.list
      }).catch(error => {
        console.log(error)
      })
    }


  }
</script>

<style scoped lang="scss">
  .Costs {
    padding-bottom: 40px;
    .carSelect {
      padding: 20px 20px 30px 20px;
      text-align: left;
      .lable {
        font-size: 14px;
        color: #666666;
        margin-right: 5px;
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
  }

</style>

<style rel="stylesheet/scss" lang="scss">
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
</style>

