<template>
  <div class="equipment">
    <div class="equipment-main">
      <jt-title :titData="equipmentTitData"></jt-title>
      <div class="equipment-form">
        <el-form :inline="true" :model="equipmentForm" class="equipmentForm-inline">
          <el-form-item label="设备号">
            <el-input v-model="equipmentForm.din"
                      placeholder="请输入设备号"></el-input>
          </el-form-item>
          <el-form-item label="所属机构/部门" class="equipmentOrgBox">
            <jt-more-select ref="moreOrgName" @moreCheck="moreCheck"></jt-more-select>
          </el-form-item>
          <el-form-item label="绑定状态">
            <el-select v-model="equipmentForm.bindStatus" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="未绑定" value="0"></el-option>
              <el-option label="绑定" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新增日期" style="margin-right: 40px">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="开始日期"  value-format="yyyy-MM-dd" v-model="equipmentForm.startDate"
                              style="width: 100%;"></el-date-picker>
            </el-col>
            <div class="line" :span="2" style="float: left;margin-left: 15px;margin-right: 9px">-</div>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="结束日期"  value-format="yyyy-MM-dd" v-model="equipmentForm.stopDate"
                              style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="equipmentSearch(equipmentForm)">查询</el-button>
            <el-button class="fn-btn-reset" size="mini" @click="resetForm(equipmentForm)">重置</el-button>
          </el-form-item>
          <div>
            <el-form-item>
              <el-button size="mini" icon="el-icon-plus" type="primary" @click="addEquepmentFuc">新增设备</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="equipmentTable">
        <jt-table ref="equipmentTable" @tableSelectionChange="tableSelectionChange" :tableData="equipmentTableData">
          <div slot="tablePage">
            <jt-pager :pager="pagerDv" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
      <!-- 新增设备弹窗 -->
      <jt-dialog :dialog-show.sync="dialogAddShow" :title="dialogAdd.title" :width="dialogAdd.width">
        <div slot="dialog">

          <el-form label-position="right" ref="DeviceInfoForm" :model="DeviceInfoForm"
                   class="DeviceInfoForm">
            <el-row>
              <el-col :span="12">
                <el-form-item label="设备号">
                  <el-input v-model="DeviceInfoForm.din"
                            placeholder="请输入设备号"></el-input>
                </el-form-item>
                <el-form-item label="到期日期">
                  <el-date-picker type="date" placeholder="请选择到期日期"  v-model="DeviceInfoForm.expireDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属机构/部门" class="orgBox">
                  <jt-org-select ref="upOrgNameDevice" @orgCurrent="orgCurrent"></jt-org-select>
                  <!--@orgNodeClick="orgNameChangeDevice" @orgCurrent="orgCurrentDevice"-->
                </el-form-item>
                <el-form-item label="设备版本号">
                  <el-input v-model="DeviceInfoForm.version"
                            placeholder="请输入版本号"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item style="display:flex;justify-content: center;width: 100%;margin-top: 20px">
              <el-button size="mini" @click="dialogShowDevice = false">取 消</el-button>
              <el-button size="mini" type="primary" @click.native="deviceAddFuc(DeviceInfoForm)">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </jt-dialog>

      <!-- 车辆绑定弹窗 -->
      <jt-dialog :dialog-show.sync="dialogShowCarBind" :title="dialogCar.title" :width="dialogCar.width">
        <div slot="dialog">
          <car-table :carTableForm="carTableForm" @carBindFuc="carBindFuc"></car-table>
        </div>
      </jt-dialog>
      <!-- 设备调拨弹窗 -->
      <jt-dialog :dialog-show.sync="dialogShowDevice" :title="dialogDevice.title" :width="dialogDevice.width">
        <div slot="dialog">
          <el-form label-position="right" ref="DeviceEquipmentForm" :model="DeviceEquipmentForm"
                   class="carArchivesStopForm">
            <el-form-item label="所属机构/部门" class="orgBox">
              <jt-org-select ref="upOrgNameDevice"></jt-org-select>
              <!--@orgNodeClick="orgNameChangeDevice" @orgCurrent="orgCurrentDevice"-->
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
              <el-button size="mini" @click="dialogShowDevice = false">取 消</el-button>
              <el-button size="mini" type="primary" @click.native="deviceSureFuc(DeviceEquipmentForm)">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </jt-dialog>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtOrgSelect from '@/components/Jtorgselect/index'
  import JtMoreSelect from '@/components/Jtmoreselect/index'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import carTable from './carTable'
  import {datetime} from '@/utils/filters'

  export default {
    components: {JtTitle, JtOrgSelect, JtTable, JtPager, JtDialog, carTable, JtMoreSelect},
    data() {
      return {
        equipmentTitData: {
          typeName: 0,
          name: '设备管理',
          img: '',
          fucName: '',
          fuc: 0
        },
        equipmentForm: {
          din: '',
          orgIds: '',
          bindStatus: '',
          startDate: '',
          stopDate: '',
          pageNum: 1,
          pageSize: 10
        },
        DeviceInfoForm: {
          din: '',
          expireDate: '',
          version: '',
          orgId: ''
        },
        pagerDv: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        carTableForm: {
          license: '',
          orgId: '',
          deviceId: '',
        },
        dialogAddShow: false,
        dialogAdd: {
          title: '添加设备信息',
          width: '800px'
        },
        dialogShowCarBind: false,
        dialogCar: {
          title: '车辆绑定',
          width: '1000px'
        },
        dialogShowDevice: false,
        dialogDevice: {
          title: '设备调拨',
          width: '500px'
        },
        transferObj: {
          id: '',
          orgId: ''
        },
        ids: '',
        DeviceEquipmentForm: {},
        equipmentTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'din', title: '设备号'},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'license', title: '绑定车牌号'},
            {name: 'expireDate', title: '到期日期'},
            {name: 'createTime', title: '绑定日期'},
            {name: 'isExpire', title: '是否到期'},
            {name: 'bindStatus', title: '绑定状态'},
            {name: 'version', title: '设备版本号'}
          ],
          handleList: [
            {
              name: '设备调拨',
              handleFunc: (obj) => {
                this.transferObj.id = obj.row.id
                this.dialogShowDevice = true

              }
            },
            {
              name: '车辆绑定',
              handleFunc: (obj) => {
                this.carTableForm.deviceId = obj.row.id
                if (obj.row.bindStatus === '绑定') {
                  /** 解绑操作 **/
                  this.$confirm('确定解除绑定?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/device/unbind', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getDevidePage()
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
                } else {
                  this.dialogShowCarBind = true
                }

              }
            }

          ],
          upload: true,
          templateUrl: '/template/device_template.xlsx',
          upUrl: "/device/import",
          downList: [
            {
              name: '调拨',
              handleFunc: () => {
                this.dialogShowDevice = true
              }
            }
          ]
        }
      }
    },
    created() {

    },
    methods: {
      /**
       * 点击新增设备
       */
      addEquepmentFuc() {
        this.dialogAddShow = true
      },
      orgCurrent(val){
        this.DeviceInfoForm.orgId=val.id
      },
      /**
       * 保存新增设备
       * @param val 设备新增编辑表单数据
       */
      deviceAddFuc(val) {
        this.DeviceInfoForm.expireDate=datetime(this.DeviceInfoForm.expireDate,null)
        this.getData('/device/addDevice', 'post', this.DeviceInfoForm).then(res => {
          if(res.code===0){
            this.dialogAddShow = false
            this.$message({
              message: '成功',
              type: 'success'
            })
            this.getDevidePage()
          }else {
            this.$message.error('失败')
          }

        }).catch(error => {
          console.log(error)
        })
      }, 
      /**
       * 点击组织节点多选
       * @param data 所有选中机构组织节点id数据
       */
      moreCheck(data) {
        this.equipmentForm.orgIds = data
      },
      /**
       * 查询表单数据
       * @param form 表单数据
       */
      equipmentSearch(form) {
        this.getDevidePage()
      },
      /**
       * 根据设备号模糊查询表单数据
       * @param val 设备号输入值
       */
      inputChange(val) {
        this.getDevidePage()

      },
      /**
       * 重置表单数据
       * @param form 表单数据
       */
      resetForm(form) {
        this.equipmentForm.din = ''
        this.equipmentForm.bindStatus = ''
        this.equipmentForm.startDate = ''
        this.equipmentForm.stopDate = ''
        this.getDevidePage()
      },
      /**
       * 切换当前显示数量
       */
      handleSizeChange(val) {
        this.equipmentForm.pageSize = val
        this.getDevidePage()
      },
      /**
       * 切换当前页数
       */
      changeCurrentPage(val) {
        this.equipmentForm.pageNum = val
        this.getDevidePage()
      },
      /**
       * 循环绑定车辆状态方法
       */
      carStatus(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].isExpire === 0) {
            data[i].isExpire = '未到期'
          } else if (data[i].isExpire === 1) {
            data[i].isExpire = '已到期'
          }
          if (data[i].bindStatus === 0) {
            data[i].bindStatus = '未绑定'
          } else if (data[i].bindStatus === 1) {
            data[i].bindStatus = '绑定'
          }
        }
      },
      /**
       * 过滤后台数据时间格式
       */
      filterTime(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].expireDate = datetime(data[i].expireDate)
          data[i].createTime = datetime(data[i].createTime)
        }
      },
      /**
       *  获取设备管理table数据
       */
      getDevidePage() {
        if (this.equipmentForm.startDate==null) {
          this.equipmentForm.startDate=''
        }
        if (this.equipmentForm.stopDate==null) {
          this.equipmentForm.stopDate=''
        }
        this.getData('/device/page', 'post', this.equipmentForm).then(res => {
          this.carStatus(res.data.list)
          this.filterTime(res.data.list)
          this.equipmentTableData.list = res.data.list
          this.pagerDv.total = res.data.total
          if (res.data.pageNum && res.data.pageNum != 'null') {
            this.pagerDv.currentPage = res.data.pageNum;
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       *  车辆绑定方法
       *  @param obj 传过来的每一辆车对应数据
       */
      carBindFuc(obj) {
        var object = {}
        object.deviceId = this.carTableForm.deviceId
        object.carId = obj.row.id

        this.$confirm('此操作将绑定该设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getData('/device/bind', 'post', object, true).then(res => {
            if (res.code === 0) {
              this.getDevidePage()
            }
          }).catch(error => {
            console.log(error)
          })
        })
      },
      /**
       *  确定设备调拨方法
       *  @param form 归属机构部门表单数据
       */
      deviceSureFuc() {
        /* 判断是否批量调拨 */
        if (this.ids) {
          this.getData('/device/batchTransfer', 'post', {
            ids: this.ids,
            orgId: this.$refs.upOrgNameDevice.val.id
          }, true).then(res => {
            if (res.code === 0) {
              this.dialogShowDevice = false
              this.getDevidePage()
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.transferObj.orgId = this.$refs.upOrgNameDevice.val.id
          this.getData('/device/transfer', 'post', this.transferObj, true).then(res => {
            if (res.code === 0) {
              this.dialogShowDevice = false
              this.getDevidePage()
            }
          }).catch(error => {
            console.log(error)
          })
        }

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
      this.getDevidePage()


    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .equipment {
    width: 100%;
    padding: 20px;
    .equipment-main {
      background-color: white;
      .equipment-form {
        padding: 20px 20px 0px 20px;
        width: 100%;
        .el-form-item:nth-child(4) {
          .el-form-item__content {
            width: 370px;
          }
        }
        .equipmentForm-inline {
          .el-form-item__label {
            font-size: 12px;
          }
          .el-input__inner {
            width: 180px;
            height: 28px;
            font-size: 12px;
            line-height: 28px;
          }
        }
        .equipmentOrgBox > .el-form-item__content > .jt-org-select > .el-input > .el-input__inner {
          width: 193px;
        }
      }
      .carArchivesStopForm {
        .jt-org-select {
          float: left;
          .el-input > .el-input__inner {
            height: 28px;
          }
        }
      }
      .DeviceInfoForm {
        .el-form-item__content {
          float: left;
        }
        .el-form-item__label {
          font-size: 12px;
          width: 100px;
        }
        .el-input__inner {
          width: 193px;
          height: 28px;
          font-size: 12px;
          line-height: 28px;
        }
      }
    }
    .equipmentTable {
      padding: 0px 20px 20px 20px;
    }
  }

</style>
