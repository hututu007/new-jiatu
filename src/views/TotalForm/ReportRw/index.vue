<template>
  <div class="taskreport">
    <div class="taskreport-main">
      <jt-title :titData="carFaultTitData"></jt-title>
      <div class="taskreport-form">
        <el-form :inline="true" :model="carFaultForm" class="carFaultForm-inline">
          <el-form-item label="类型">
            <el-select  placeholder="请选择类型" id="carCode" v-model="carFaultForm.typeId"   >
                <el-option label="全部" value="1"></el-option>
                <el-option label="领导用车" value="2"></el-option>
                <el-option label="员工用车" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="故障日期">
            <el-date-picker
              class="range"
              style="width: 230px;margin-right: 30px"
              v-model="rwdateValue"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="getTableData">查询</el-button>
            <el-button class="fn-btn-reset" size="mini" @click="resetForm">重置</el-button>
          </el-form-item>
          <div>
          </div>
        </el-form>
      </div>
      <div class="carFaultTable">
        <jt-table ref="carTable" @tableSelectionChange="tableSelectionChange" :tableData="carFaultTableData">
          <!-- <div slot="tablePage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div> -->
        </jt-table>
      </div>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtMoreSelect from '@/components/Jtmoreselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'

  export default {
    components: {JtTitle, JtMoreSelect, JtTable, JtPager, JtDialog},
    data() {
      return {
        carFaultTitData: {
          typeName: 0,
          name: '公务用车明细表',
          img: '',
          fucName: '',
          fuc: 0
        },
        rwdateValue:"",
        carFaultForm: {
            pageNum: 1, //当前页码
            pageSize: 10,//每页条数
            typeId:"", // 类型
            startCreateTime:null, 
            endCreateTime:null,
        },
        typeData:"",
        carFaultTableData: {
          checkStyle: true,
          list: [],
          headList: [],
        },
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10,
        },
        dialogShow:false,
        dialog: {
          title: '填写处理意见',
          width: '500px'
        },
        carFaultStopForm:{
          dealReasonId:'',
          dealReasonRemark:''
        }
      }
    },
    methods: {
      getTableData(){
        this.getData('/report/taskreport', 'post', this.carFaultForm).then(res => {
          res.data[0].column[6]['width'] = '200';
            this.carFaultTableData.list = res.data[1].row;
            this.pager.total = res.data[2].total;
            let headList = res.data[0].column;
            headList = JSON.stringify(headList)
            headList = headList.replace(/prop/g, 'name')
            headList = headList.replace(/label/g, 'title')
            headList = JSON.parse(headList);
            this.carFaultTableData.headList = headList;
          }).catch(error => {
            console.log(error)
        })
      },
      moreCheck(val){
      },
      //重置
      resetForm(){
        this.carFaultForm= {
            pageNum: 1, //当前页码
            pageSize: 10,//每页条数
            typeId:"", // 类型
            startCreateTime:null, 
            endCreateTime:null,
        },
        this.rwdateValue = [];
        this.getTableData();
      },
      tableSelectionChange(){},
      handleSizeChange(){},
      changeCurrentPage(){},
      dealFuc(){}
    },
    mounted() {
    },
    created(){
        this.getTableData();
        // this.getData('/apply/usetype/page', 'post', {pageSize: 999}).then(res => {
        //     this.typeData = res.data.list;
        // }).catch(error => {
        //     console.log(error)
        // })
    },
    watch: {
        rwdateValue(val) {
            
            if (val) {
            this.carFaultForm.startCreateTime = val[0];
            this.carFaultForm.endCreateTime = val[1];
            } else {
            this.carFaultForm.startCreateTime = null
            this.carFaultForm.endCreateTime = null
            }
        }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .taskreport {
    width: 100%;
    padding: 20px;
    .taskreport-main {
      background-color: white;
      .taskreport-form {
        padding: 20px;
        width: 100%;
        height: 90px;
        .carFaultForm-inline {
          .el-form-item__label {
            font-size: 12px;
            color: #666;
            font-weight: normal;
          }
          .el-input__inner {
            width: 180px;
            height: 28px;
            font-size: 12px;
            line-height: 28px;
          }
          .range {
            padding: 0px 10px;
          }
          .range > .el-input__icon {
            line-height: 28px;
          }
          .range > input {
            font-size: 12px;
          }
          .range > span {
            font-size: 12px;
            padding: 0px 14px 0px 5px;
            color: #666;
            line-height: 28px;
          }
        }
        .orgBox > .el-form-item__content > .jt-org-select > .el-select > .el-input > .el-input__inner {
          width: 193px;
        }
      }
      .carFaultTable {
        padding: 0px 20px 20px 20px;
      }
    }
    .carFaultStopForm{
      .el-form-item__label{
        font-size: 12px;
      }
    }
    .carFaultStopForm > .el-form-item > .el-form-item__content > .el-select > .el-input > .el-input__inner {
      width: 180px;
      height: 28px;
      line-height: 28px;
    }
    .carFaultStopForm > .mark > .el-form-item__content {
      float: left;
    }
  }
</style>
