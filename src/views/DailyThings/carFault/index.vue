<template>
  <div class="carFault">
    <div class="carFault-main">
      <jt-title :titData="carFaultTitData"></jt-title>
      <div class="carFault-form">
        <el-form :inline="true" :model="carFaultForm" class="carFaultForm-inline">
          <el-form-item label="车牌号">
            <el-input v-model="carFaultForm.license"></el-input>
          </el-form-item>
          <el-form-item label="设备号">
            <el-input v-model="carFaultForm.din"
                      placeholder="请输入设备号"></el-input>
          </el-form-item>
          <el-form-item label="所属机构/部门" class="orgBox">
            <jt-more-select ref="faultOrgName" @moreCheck="moreCheck"></jt-more-select>
          </el-form-item>
          <el-form-item label="故障日期">
            <el-date-picker
              class="range"
              style="width: 230px;margin-right: 30px"
              v-model="xufei"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="carFaultSearch(carFaultForm)">查询</el-button>
            <el-button class="fn-btn-reset" size="mini" @click="resetForm(carFaultForm)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="carFaultTable">
        <jt-table ref="carTable" @tableSelectionChange="tableSelectionChange" :tableData="carFaultTableData">
          <div slot="tablePage" v-if="false">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </div>
    <!-- 处理弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <el-form label-position="right" ref="carFaultStopForm" :model="carFaultStopForm"
                 class="carFaultStopForm">
          <el-form-item label="处理方式">
            <el-select v-model="carFaultStopForm.dealReasonId" placeholder="请选择">
              <el-option label="班车" value="班车"></el-option>
              <el-option label="公务车" value="公务车"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理意见" class="mark">
            <el-input type="textarea" v-model="carFaultStopForm.dealReasonRemark"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="dealFuc(carFaultStopForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtMoreSelect from '@/components/Jtmoreselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'

  export default {
    components: {JtTitle, JtMoreSelect, JtTable, JtPager, JtDialog},
    data() {
      return {
        carLoading: true, //正在加载
        carPage: {},//车牌号
        carFaultTitData: {
          typeName: 0,
          name: '车辆故障信息管理',
          img: '',
          fucName: '',
          fuc: 0
        },
        xufei: '',
        carFaultForm: {
          // pageNum: 1, //当前页码
          // pageSize: 10,//每页条数
          license: '',
          orgIds: "", // 机构ID拼串
          din: '',
          startTime: '',
          endTime: ''
        },
        carFaultTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号'},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'din', title: '设备号'},
            {name: 'modelName', title: '车型车款'},
            {name: 'dtc', title: '故障码'},
            {name: 'time', title: '故障时间'},
            {name: 'dtcName', title: '故障原因'},
            {name: 'suggestion', title: '故障处理意见'}
          ],
          // handleList: [
          //   // {
          //   //   name: '处理',
          //   //   handleFunc: (obj) => {
          //   //     this.dialogShow=true
          //   //   }
          //   // },
          //   // {
          //   //   name: '忽略提醒',
          //   //   handleFunc: (obj) => {
          //   //   }
          //   // }
          // ],
          upload: false,
          downList: [
            // {
            //   name: '批量处理',
            //   handleFunc: () => {
            //     axios.get('/fms-web/template/car_template.xlsx', {responseType: 'arraybuffer'}).then(function (res) {
            //       const name = Math.random().toString(36).substr(2)
            //       let filename = name + '.xlsx'
            //       fileDownload(res.data, filename)
            //     })
            //   }
            // },
            // {
            //   name: '批量忽略',
            //   handleFunc: () => {
            //     this.$confirm('确定删除?', {
            //       confirmButtonText: '确定',
            //       cancelButtonText: '取消',
            //       type: 'warning'
            //     }).then(() => {
            //       this.getData('/car/batchDelete', 'post', {ids: this.ids}, true).then(res => {
            //         if (res.code === 0) {
            //           this.tableDataFuc()
            //         }
            //       }).catch(error => {
            //         console.log(error)
            //       })
            //     }).catch(() => {
            //       this.$message({
            //         type: 'info',
            //         message: '已取消'
            //       });
            //     });
            //   }
            // }
          ]
        },
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        dialogShow: false,
        dialog: {
          title: '填写处理意见',
          width: '500px'
        },
        carFaultStopForm: {
          dealReasonId: '',
          dealReasonRemark: ''
        }
      }
    },
    methods: {
      moreCheck(val) {
        this.carFaultForm.orgIds = val.join(',')
      },
      carFaultSearch() {
        this.carFaultForm.startTime = datetime(this.xufei[0])
        this.carFaultForm.endTime = datetime(this.xufei[1])
        this.getPage()
      },
      resetForm() {
        this.xufei = ''
        this.carFaultForm.license = ''
        this.carFaultForm.din = ''
        this.carFaultForm.orgIds = ''
        this.carFaultForm.startTime = ''
        this.carFaultForm.endTime = ''
        this.$refs.faultOrgName.val.orgValue = ''
      },
      tableSelectionChange() {
      },
      handleSizeChange() {
      },
      changeCurrentPage() {
      },
      dealFuc() {

      },
      getPage() {
        this.getData('/fault/page', 'post', this.carFaultForm).then(res => {
          this.pager.total = res.data.length
          this.carFaultTableData.list = res.data
          for (var i = 0; res.data.length; i++) {
            res.data[i].modelName = res.data[i].carType + res.data[i].carModel
          }
        })
      }
    },
    mounted() {
      this.getPage()
    },
    created() {
      // 获取车牌号
      // this.getData('/car/page', 'post', {pageNow:1,pageSize:100}).then(res => {
      //     if (res.code === 0) {
      //       this.carLoading = false;
      //       this.carPage = res.data.list
      //      }
      //     }).catch(error => {
      //       console.log(error)
      // })
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .carFault {
    width: 100%;
    padding: 20px;
    .carFault-main {
      background-color: white;
      .carFault-form {
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
        max-height: 610px;
        overflow-y: auto;
        padding: 0px 20px 20px 20px;
      }
    }
    .carFaultStopForm {
      .el-form-item__label {
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
