<template>
  <div class="carArchives">
    <div class="carArchives-main">
      <jt-title :titData="carArchivesTitData"></jt-title>
      <div class="carArchives-form">
        <el-form :inline="true" :model="carArchivesForm" class="carArchivesForm-inline">
          <el-form-item label="车牌号">
            <el-input @keyup.native="inputChange(carArchivesForm)" v-model="carArchivesForm.license"
                      placeholder="请输入车牌号"></el-input>
          </el-form-item>
          <!--<el-gps-item label="上级机构/部门" class="orgBox">-->
          <!--<jt-org-select ref="upOrgName" @orgCurrent="orgCurrent1"></jt-org-select>-->
          <!--</el-gps-item>-->
          <el-form-item label="上级机构/部门" class="orgBox">
            <jt-org-select ref="upOrgName" @orgCurrent="orgCurrent1"></jt-org-select>
          </el-form-item>
          <el-form-item label="车辆状态">
            <el-select v-model="carArchivesForm.status" placeholder="请选择">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停运" value="2"></el-option>
              <el-option label="报废" value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绑定状态">
            <el-select v-model="carArchivesForm.bindStatus" placeholder="请选择">
              <el-option label="已绑定" value="1"></el-option>
              <el-option label="未绑定" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="购车日期">
            <el-date-picker
              v-model="carArchivesForm.buyDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="carSearch(carArchivesForm)">查询</el-button>
            <el-button class="fn-btn-reset" size="mini" @click="resetForm(carArchivesForm)">重置</el-button>
          </el-form-item>
          <div>
            <el-form-item  style="margin-bottom:0">
              <el-button size="mini" icon="el-icon-plus" type="primary" @click="addCarInfo">新增车辆</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="carArchivesTable">
        <jt-table ref="carTable" @tableSelectionChange="tableSelectionChange" :tableData="carArchivesTableData">
          <div slot="tablePage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </div>
    <!-- 新增编辑弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <add-car-dialog :update="update" @deleteFuc="deleteFuc" :nodeId="nodeId" :sizeForm="sizeForm"
                        @addSuccess="addSuccess"
                        ref="addcar"></add-car-dialog>
      </div>
    </jt-dialog>
    <!-- 设备绑定弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShowEq" :title="dialogEq.title" :width="dialogEq.width">
      <div slot="dialog">
        <eq-table :eqTableForm="eqTableForm" @deviceBind="deviceBind"></eq-table>
      </div>
    </jt-dialog>
    <!--车辆停运弹窗-->
    <jt-dialog :dialog-show.sync="dialogShowStop" :title="dialogStop.title" :width="dialogStop.width">
      <div slot="dialog">
        <el-form label-position="right" ref="carArchivesStopForm" :model="carArchivesStopForm"
                 class="carArchivesStopForm">
          <el-form-item label="停运原因">
            <el-select v-model="carArchivesStopForm.reasonId" placeholder="请选择">
              <el-option v-for="item in stopReasonList" :key="item.reasonId" :label="item.stopReason"
                         :value="item.reasonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注信息" class="mark">
            <el-input type="textarea" v-model="carArchivesStopForm.stopReasonRemark"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShowStop = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addStopFuc(carArchivesStopForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtOrgSelect from '@/components/Jtorgselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import AddCarDialog from './addcardialog'
  import eqTable from './eqTable'
  import axios from 'axios'
  import {fileDownload} from '@/vendor/index'
  import {datetime} from '@/utils/filters'
  import { status } from '@/utils/index'
  import {nullFuc} from '@/utils/index'
  import moment from 'moment'

  export default {
    components: {JtTitle, JtTable, JtPager, JtDialog, AddCarDialog, eqTable, JtOrgSelect},
    data() {
      return {
        list: null,
        dialog: {
          title: '添加车辆档案',
          width: '800px'
        },
        nodeId: '',
        sizeForm: {
          insureExpireDate: '',
          surveyExpireDate: '',
          orgId: '',
          upkeepExpireDate: '',
          license: '',
          buyDate: '',
          carModelId:'',
          oilCardNo: '',
          carLabel: '',
          modelId: '',
          oilType: ''
        },
        dialogShow: false,
        dialogEq: {
          title: '设备绑定',
          width: '1000px'
        },
        dialogShowEq: false,
        dialogStop: {
          title: '车辆停运',
          width: '500px'
        },
        dialogShowStop: false,
        carArchivesStopForm: {
          reasonId: '',
          stopReasonRemark: '',
          Id: ''
        },
        stopReasonList: [],
        carArchivesTitData: {
          typeName: 0,
          name: '车辆档案',
          img: '',
          fucName: '',
          fuc: 0
        },
        carArchivesForm: {
          license: '',
          status: '',
          buyDate: '',
          orgId: '',
          bindStatus: '',
          pageNum: 1, //当前页码
          pageSize: 10//每页条数
        },
        carId: '',
        eqTableForm: {
          din: '',
          carId: '',
          bindStatus: ''
        },
        carArchivesTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号', width: '120px'},
            {name: 'orgName', title: '所属机构/部门', width: '120px'},
            {name: 'din', title: '绑定设备号', width: '150px'},
            {name: 'initMileage', title: '初始里程', width: '150px'},
            {name: 'buyDate', title: '购车时间', width: '100px'},
            {name: 'modelName', title: '车型车款', width: '250px'},
            {name: 'insureExpireDate', title: '保险到期日', width: '100px'},
            {name: 'surveyExpireDate', title: '年检到期日', width: '100px'},
            {name: 'upkeepExpireDate', title: '保养到期日', width: '100px'},
            {name: 'oilTypeName', title: '油品型号', width: '100px'},
            {name: 'oilCardNo', title: '油卡号', width: '100px'},
            {name: 'status', title: '状态', width: '100px'},
            {name: 'carLabelName', title: '车辆标签', width: '100px'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                nullFuc(obj.row)
                setTimeout(()=>{
                  this.$bus.$emit('carModelGet',[obj.row.brandId, obj.row.typeId, obj.row.modelId])
                },300)
                this.update = true
                this.dialog.title = '编辑车辆档案'
                this.dialogShow = true
                this.sizeForm = {
                  insureExpireDate: obj.row.insureExpireDate,
                  surveyExpireDate: obj.row.surveyExpireDate,
                  orgId: obj.row.orgId,
                  upkeepExpireDate: obj.row.upkeepExpireDate,
                  license: obj.row.license,
                  buyDate: obj.row.buyDate,
                  oilCardNo: obj.row.oilCardNo,
                  carLabel: parseInt(obj.row.carLabel),
                  oilType: obj.row.oilType,
                  id: obj.row.id,
                  carModelId:obj.row.brandId+','+obj.row.typeId+','+obj.row.modelId,
                  initMileage:obj.row.initMileage,
                }
                this.nodeId = obj.row.orgId
              }
            },
            {
              name: '设备绑定',
              handleFunc: (obj) => {
                this.eqTableForm.carId = obj.row.id;
                // 判断是否绑定 0：未绑定   1：绑定
                if (obj.row.bindStatus === 0) {
                  this.dialogShowEq = true
                } else {
                  /** 解绑操作 **/
                  this.$confirm('确定解除绑定?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/car/unbind', 'post', {din: obj.row.din,id:obj.row.id,deviceId:obj.row.deviceId}, true).then(res => {
                      if (res.code === 0) {
                        this.tableDataFuc()
                        this.$message({
                          type: 'success',
                          message: '成功!'
                        });
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消'
                    });
                  });

                }
              }
            },
            {
              name: '停运',
              handleFunc: (obj) => {
                this.carArchivesStopForm = {
                  reasonId: '',
                  stopReasonRemark: '',
                  Id: ''
                }
                this.carId = obj.row.id
                if (obj.row.status === '正常') {
                  this.dialogShowStop = true
                } else {
                  /** 恢复运营 **/
                  this.$confirm('确定恢复运营?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/car/recover', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.tableDataFuc()
                        this.$message({
                          type: 'success',
                          message: '成功!'
                        });
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消'
                    });
                  });
                }
              }
            }
          ],
          upload: true,
          templateUrl: '/template/car_template.xlsx',
          // upUrl: "/fms-web/car/import", 
          upUrl: "car/import",
          downList: [
            {
              name: '批量删除',
              handleFunc: () => {
                if (!this.ids) {
                  this.$message({
                    message: '请选择车辆！',
                    type: 'warning'
                  });
                  return;
                }
                this.$confirm('确定删除?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/car/batchDelete', 'post', {ids: this.ids}, true).then(res => {
                    if (res.code === 0) {
                      this.tableDataFuc()
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                })
              }
            },
            {
              name: '停运',
              handleFunc: () => {
                if (!this.ids) {
                  this.$message({
                    message: '请选择车辆！',
                    type: 'warning'
                  });
                  return;
                }
                this.dialogShowStop = true
                this.carArchivesStopForm = {
                  reasonId: '',
                  stopReasonRemark: '',
                  Id: ''
                }
              }
            },
            {
              name: '恢复运营',
              handleFunc: () => {
                if (!this.ids) {
                  this.$message({
                    message: '请选择车辆！',
                    type: 'warning'
                  });
                  return;
                }
                this.$confirm('确定恢复运营?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/car/batchRecover', 'post', {ids: this.ids}, true).then(res => {
                    if (res.code === 0) {
                      this.tableDataFuc()
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }
            },
            {
              name: '报废',
              handleFunc: () => {
                this.$confirm('确定报废?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/car/batchScrap', 'post', {ids: this.ids}, true).then(res => {
                    if (res.code === 0) {
                      this.tableDataFuc()
                    }
                  }).catch(error => {
                    console.log(error)
                  })
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
        oilTypeList: [], // 油品型号
        carSelection: {   // 车辆表格多选
          stopSelection: [], // 批量停运
          runSelection: [], // 批量恢复运营
          wrongSelection: [] // 批量报废
        },
        ids: '',
        update: false
      }
    },
    watch: {
      dialogShow: {
        handler: (newVal, oldVal) => {
          if (newVal === false) {
            // this.nodeID2 = ''
            this.update = false
          }
        },
        deep: true
      }
    },
    methods: {
      orgCurrent2() {
      },
      /**
       * 添加车辆档案
       */
      addCarInfo() {
        var arr=[]
        setTimeout(()=>{
          this.$bus.$emit('carModelGet',arr)
        },300)
        this.update = false
        this.dialog.title = '添加车辆档案'
        this.dialogShow = true

        /* 清空表单 */
        this.sizeForm = {
          insureExpireDate: '',
          surveyExpireDate: '',
          orgId: '',
          upkeepExpireDate: '',
          license: '',
          buyDate: '',
          oilCardNo: '',
          carModelId:'',
          carLabel: '',
          carLabelName: '',
          modelId: '',
          oilType: '',
          oilTypeName: "",
        }
        this.nodeId=''
        this.$nextTick(() => {
          this.$refs.addcar.$refs.upOrgName.val.orgValue = ''
        })
      },
      /**
       * 获取上级机构部门数据
       * @param val 子组件传过来的上级机构部门数据
       */
      orgCurrent1(val) {
        this.carArchivesForm.orgId = val.id
      },
      /**
       * 搜索车辆档案
       * @param data 表单数据
       */
      carSearch(data) {
        this.tableDataFuc()
      },
      /**
       * 重置表单数据
       * @param data 表单数据
       */
      resetForm() {
        this.$refs.upOrgName.val.orgValue = ''
        this.carArchivesForm = {
          license: '',
          status: '',
          bindStatus: '',
          buyDate: '',
          orgId: ''
        }
        this.tableDataFuc()
      },
      /**
       * 切换当前页数
       */
      changeCurrentPage(val) {
        this.carArchivesForm.pageNum = val;
        this.tableDataFuc()
      },
      /**
       * 切换当前显示数量
       */
      handleSizeChange(val) {
        this.carArchivesForm.pageSize = val;
        this.tableDataFuc()
      },
      /**
       *  根据车牌号模糊查询
       * @param data 表单数据
       */
      inputChange(data) {
        this.tableDataFuc()
      },
      /**
       * 循环绑定车辆状态方法
       */
      carStatus(data,oilType) {
        let oilTypeStatus = {};

        for (let i = 0; i < oilType.length; i++) {
          let key = oilType[i].id
          oilTypeStatus[key]= oilType[i].name
        }

        for (var i = 0; i < data.length; i++) {
          if (data[i].oilType) {
            data[i].oilTypeName = status(data[i].oilType, oilTypeStatus)
          }
          if (data[i].status === 1) {
            data[i].status = '正常'
          } else if(data[i].status === 9){
            data[i].status = '报废'
          }else {
            data[i].status = '停运'
          }
        }

      },
      /**
       * 过滤后台数据时间格式
       */
      filterTime(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].insureExpireDate = datetime(data[i].insureExpireDate)
          data[i].buyDate = datetime(data[i].buyDate)
          data[i].surveyExpireDate = datetime(data[i].surveyExpireDate)
          data[i].upkeepExpireDate = datetime(data[i].upkeepExpireDate)
        }
      },
      /**
       *  获取车辆档案数据
       */
      tableDataFuc() {
        this.getData('/car/page', 'post', this.carArchivesForm).then(res => {
          this.carStatus(res.data.pv.list,res.data.oilType)
          this.filterTime(res.data.pv.list)
          this.carArchivesTableData.list = res.data.pv.list
          this.pager.total = res.data.pv.total
          /** 绑定停运原因数据 **/
          this.stopReasonList = res.data.stopReason
          if (res.data.pageNum && res.data.pageNum != 'null') {
            this.pager.currentPage = res.data.pageNum;
          }
        }).catch(error => {
          console.log(error)
        })


      },
      /**
       * 停运方法
       * @param form 停运表单数据
       */
      addStopFuc(form) {
        if (this.ids) {
          this.getData('/car/batchStopReason', 'post', {
            ReasonId: form.reasonId,
            stopReasonRemark: form.stopReasonRemark,
            ids: this.ids
          }, true).then(res => {
            if (res.code === 0) {
              this.dialogShowStop = false
              this.tableDataFuc()
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.carArchivesStopForm.Id = this.carId
          this.getData('/car/stopReason', 'post', this.carArchivesStopForm, true).then(res => {
            if (res.code === 0) {
              this.dialogShowStop = false
              this.tableDataFuc()
            }
          }).catch(error => {
            console.log(error)
          })
        }


      },
      /**
       * 添加编、辑车辆关闭弹窗方法
       * @param form 添加编、辑车辆表单数据
       */
      deleteFuc(form) {
        this.dialogShow = false
      },
      /**
       * 添加车辆成功回调
       */
      addSuccess() {
        this.dialogShow = false
        this.tableDataFuc()
      },
      /**
       * 设备绑定方法
       * @param obj  设备详情
       */
      deviceBind(obj) {
        var object = {}
        object.deviceId = obj.row.id
        object.carId = this.eqTableForm.carId
        this.$confirm('此操作将绑定该设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getData('/device/bind', 'post', object, true).then(res => {
            if (res.code === 0) {
              this.dialogShowEq = false
              this.tableDataFuc()
              this.$bus.$emit('bindYes')
            }
          })
        })



      },
      /**
       * 表格多选数据
       * @param val 表格多选数组
       */
      tableSelectionChange(val) {
        var arr = []
        if (val.length) {
          for (var i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
        }
        this.ids = arr.join(',')
      }
    },
    mounted() {
      /** 初始化表格数据 **/
      this.tableDataFuc()
      /** 停运原因接口数据 **/

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .carArchives {
    width: 100%;
    padding: 20px;
    .carArchives-main {
      background-color: white;
      .carArchives-form {
        padding: 20px;
        width: 100%;
        .carArchivesForm-inline {
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
        }
        .orgBox > .el-form-item__content > .jt-org-select > .el-select > .el-input > .el-input__inner {
          width: 193px;
        }
      }
      .carArchivesTable {
        padding: 0px 20px 20px 20px;
      }
      .dialogForm {
        .el-input__inner {
          width: 250px;
          height: 28px;
          line-height: 28px;
        }
      }
    }
    .carArchivesStopForm > .el-form-item > .el-form-item__content > .el-select > .el-input > .el-input__inner {
      width: 180px;
      height: 28px;
      line-height: 28px;
    }

    .carArchivesStopForm > .mark > .el-form-item__content {
      float: left;
    }
  }

</style>
