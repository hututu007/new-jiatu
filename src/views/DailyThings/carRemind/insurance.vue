<template>
  <div class="insurance-remind">
    <div class="insurance-remind-form">
      <el-form :inline="true" :model="carInsuranceForm" class="carInsuranceForm-inline">
        <el-form-item label="车牌号">
          <el-input v-model="carInsuranceForm.license"
                    placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="所属机构/部门" class="orgBox">
          <jt-org-select ref="upOrgName" @orgCurrent="orgCurrent1"></jt-org-select>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-select style="width: 193px" v-model="carInsuranceForm.insureState" placeholder="请选择">
            <el-option label="未过期" value="1"></el-option>
            <el-option label="已过期" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投保日期">
          <el-date-picker
            class="range"
            style="width: 230px;margin-right: 30px"
            v-model="carInsuranceForm.xufei"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="carInsuranceSearch(carInsuranceForm)">查询</el-button>
          <el-button class="fn-btn-reset" size="mini" @click="resetForm(carInsuranceForm)">重置</el-button>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="condition">条件设定</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" icon="el-icon-message" type="warning" @click="addInsuranceMsg">{{subscribe}}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="carInsuranceTable">
      <jt-table ref="carInsurancTable" @tableSelectionChange="tableSelectionChange" :tableData="carInsuranceTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 条件设定弹窗 -->
    <jt-dialog :dialog-show.sync="conditionDialogShow" :title="conditionDialog.title" :width="conditionDialog.width">
      <div slot="dialog">
        <el-form label-position="right" ref="insuranceForm" :model="insuranceForm"
                 class="insuranceForm">
          <el-form-item label="距保险到期日(天)">
            <el-input
              placeholder="请输入天数"
              suffix-icon="el-icon-date"
              v-model="conditionForm.setDays">
            </el-input>
            <span style="font-size: 12px;color: #999;margin-left: 20px">产生提醒消息</span>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="conditionDialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="conditionFuc(conditionForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
    <!-- 处理弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <el-form label-position="right" ref="insuranceForm" :model="insuranceForm"
                 class="insuranceForm">
          <el-form-item label="最新投保日期">
            <el-date-picker
              v-model="insuranceForm.newInsuretime"
              type="date"
              placeholder="投保日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd " style="width: 193px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="最新投保金额">
            <el-input
              placeholder="请输入金额"
              v-model="insuranceForm.newInsureamount"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="dealFuc(insuranceForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'

  export default {
    name: "insurance",
    components: {JtOrgSelect, JtTable, JtPager, JtDialog},
    data() {
      return {
        subscribe: '',
        carInsuranceForm: {
          license: '',
          insureState: '',
          xufei: [],
          insureType: 1,
          pageNum: 1,
          pageSize: 10,
          startDate: '',
          stopDate: '',
          orgId: ''
        },
        carInsuranceTableData: {
          checkStyle: true,
          signStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号'},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'insureStateName', title: '保险状态'},
            {name: 'lastInsuretime', title: '上次投保日期'},
            {name: 'surplusDays', title: '剩余到期天数'},
            {name: 'exceedDays', title: '已超投保天数'},
          ],
          handleList: [
            {
              name: '处理',
              handleFunc: (obj) => {
                console.log(obj.row)
                this.dialogShow = true
                this.insuranceForm = {
                  newInsuretime: obj.row.newInsuretime?datetime(obj.row.newInsuretime):'',
                  newInsureamount: obj.row.newInsureamount?obj.row.newInsureamount:'',
                  id: obj.row.id,
                  insureType: 1
                }
              }
            },
            {
              name: '标记已读',
              handleFunc: (obj) => {
                this.$confirm('此操作将此提醒消息标记为已读，是否继续', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/cw/remind/signRead', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getPage()
                    }
                  }).catch(error => {
                    console.log(error)
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }
            }
          ],
          upload: false,
          downList: [
            {
              name: '全部标记为已读',
              handleFunc: () => {
                this.$confirm('此操作将全部提醒消息标记为已读，是否继续', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/cw/remind/allSignRead', 'post', {allRead: true, insureType: 1}, true).then(res => {
                    if (res.code === 0) {
                      this.getPage()
                    }
                  }).catch(error => {
                    console.log(error)
                  });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }
            }
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
          title: '更新保险信息',
          width: '500px'
        },
        insuranceForm: {
          newInsuretime: '',
          newInsureamount: '',
          id: '',
          insureType: 1
        },
        conditionDialogShow: false,
        conditionDialog: {
          title: '保险到期提醒条件设定',
          width: '500px'
        },
        conditionForm: {
          setDays: '',
          insureType: 1
        },
        cwIds: '',
        contentData: {},
      }
    },
    methods: {
      /**
       * 条件设定按钮点击
       */
      condition() {
        this.conditionDialogShow = true
        if (this.contentData) {
          this.conditionForm.setDays = this.contentData.setDays
          this.conditionForm.id = this.contentData.id?this.contentData.id:''
        }
      },
      /**
       * 查询表单
       * @param form 查询表单数据
       */
      carInsuranceSearch(form) {
        if (form.xufei) {
          form.startDate = datetime(form.xufei[0])
          form.stopDate = datetime(form.xufei[1])
        }
        this.getPage()
      },
      /**
       * 重置表单
       */
      resetForm() {
        this.$refs.upOrgName.val.orgValue = ''
        this.carInsuranceForm = {
          license: '',
          insureState: '',
          insureType: 1,
          xufei: [],
          pageNum: 1,
          pageSize: 10,
          startDate: '',
          stopDate: '',
          orgId: ''
        }
        this.getPage()
      },
      /**
       * 机构组织选择
       */
      orgCurrent1(val) {
        this.carInsuranceForm.orgId = val.id
      },
      /**
       * 消息订阅
       */
      addInsuranceMsg() {
        if (this.subscribe === '未订阅消息') {
          this.$confirm('此操作将订阅消息', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.getData('/cw/condition/subscribe', 'post', {issubscribe: 1, insureType: 1}, true).then(res => {
              if (res.code === 0) {
                this.subscribe = '已订阅消息'
              }
            }).catch(error => {
              console.log(error)
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        } else if (this.subscribe === '已订阅消息') {
          this.$confirm('此操作将取消订阅消息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.getData('/cw/condition/subscribe', 'post', {issubscribe: 0, insureType: 1}, true).then(res => {
              if (res.code === 0) {
                this.subscribe = '未订阅消息'
              }
            }).catch(error => {
              console.log(error)
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });

        }
      },
      /**
       * 表格多选
       * @param val 表格多选id数组
       */
      tableSelectionChange(val) {
        var arr = []
        if (val.length) {
          for (var i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
        }
        this.cwIds = arr.join(',')
      },
      /**
       * 分页-每页显示数量
       * @param val 数量
       */
      handleSizeChange(val) {
        this.carInsuranceForm.pageSize = val
        this.getPage()
      },
      /**
       * 分页-当前页码
       * @param val 当前页码
       */
      changeCurrentPage(val) {
        this.carInsuranceForm.pageNum = val
        this.getPage()
      },
      /**
       * 处理确定事件
       */
      dealFuc(form) {
        this.getData('/cw/remind/handle ', 'post', form, true).then(res => {
          if (res.code === 0) {
            this.getPage()
            this.dialogShow = false
          }
        }).catch(error => {
          console.log(error)
        });

      },
      /**
       *  条件设定确定事件
       * @param form 条件表单数据
       */
      conditionFuc(form) {
        this.getData('/cw/condition/add ', 'post', form, true).then(res => {
          if (res.code === 0) {
            this.getPage()
            this.conditionDay()
            this.conditionDialogShow = false
          }
        }).catch(error => {
          console.log(error)
        });
      },
      /**
       *  页面table数据方法
       */
      getPage() {
        this.getData('/cw/remind/page', 'post', this.carInsuranceForm).then(res => {
          this.pager.total = res.data.total
          if (res.code === 0) {
            res.data.list.forEach((ele) => {
              ele.lastInsuretime = datetime(ele.lastInsuretime)
              ele.insureStateName = ele.insureState === 1 ? '未过期' : '已过期'
            })
            this.carInsuranceTableData.list = res.data.list
          }
        }).catch(error => {
          console.log(error)
        });
      },
      conditionDay(){
        this.getData('/cw/condition/get ', 'post', {insureType: 1}).then(res => {
          if (res.code === 0) {
            this.contentData = res.data
            if (res.data.issubscribe === 1) {
              this.subscribe = '已订阅消息'
            } else {
              this.subscribe = '未订阅消息'
            }
          }
        }).catch(error => {
          console.log(error)
        });
      }
    },
    mounted() {
      this.getPage()
      this.conditionDay()
      // this.getData('/cw/remind/add ', 'post').then(res => {
      //
      // }).catch(error => {
      //   console.log(error)
      // });


    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .insurance-remind {
    .insurance-remind-form {
      .carInsuranceForm-inline {
        .el-form-item__label {
          font-size: 12px;
          color: #666;
          font-weight: normal;
        }
        .el-input__inner {
          width: 193px;
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
          line-height: 28px;
          padding: 0px 14px 0px 5px;
          color: #666;
        }
      }
      .orgBox > .el-form-item__content > .jt-org-select > .el-select > .el-input > .el-input__inner {
        width: 193px;
      }
    }
    .insuranceForm {
      .el-input {
        width: auto;
      }
      .el-form-item__label {
        font-size: 12px;
      }
      .el-input__inner {
        width: 180px;
        height: 28px;
        line-height: 28px;
      }
    }
    .insuranceForm > .el-form-item > .el-form-item__content > .el-select > .el-input > .el-input__inner {
      width: 180px;
      height: 28px;
      line-height: 28px;
    }
    .insuranceForm > .mark > .el-form-item__content {
      float: left;
    }
  }

</style>
