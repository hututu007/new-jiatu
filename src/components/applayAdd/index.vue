<template>
  <div class="applay-add">
    <el-form label-position="right" ref="applicationOneForm" :rules="rules" :model="applicationOneForm"
             id="applicationOneForm">
      <!--:rules="rules"-->
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item class="changeItem" label="用车人" prop="usemanId">
              <el-select @change="useManChange" v-model="applicationOneForm.usemanId" filterable
                         :disabled="disabledUseMan" placeholder="请选择用车人"
                         style="width: 193px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="changeItem" label="出发地" prop="startAddress">
              <el-input v-model="applicationOneForm.startAddress" placeholder="请输入出发地"
                        style="width: 193px;"></el-input>
            </el-form-item>
            <el-form-item label="用车时间" class="range changeItem">
              <el-date-picker v-model="preStartTime" type="datetimerange" align="right"
                              start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="changeItem" label="乘车人数">
              <el-input-number style="width: 204px;" v-model="applicationOneForm.passengerNum"
                               controls-position="right" @change="handleChangeNum" :min="1"
                               :max="10"></el-input-number>
            </el-form-item>
            <el-form-item class="changeItem" label="用车事由">
              <el-input v-model="applicationOneForm.useReason" placeholder="请输入用车事由"
                        style="width: 193px;"></el-input>
            </el-form-item>
            <el-form-item class="changeItem" label="是否紧急用车" prop="urgency">
              <el-radio-group v-model="applicationOneForm.urgency">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>

            </el-form-item>
            <el-form-item class="prover" label="审批人">
              <!--multiple-->
              <el-select
                v-model="auditManIds"
                ref="saveTagInput"
                :disabled="applayDisabled"
                size="small"
                multiple
                @change=""
                filterable placeholder='请选择'
                style="width: 193px;">
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item class="changeItem" label="所属机构/部门" prop="orgId">
              <!--<el-input v-model="sizeForm.orgId" style="display: none"></el-input>-->
              <jt-org-select ref="upOrgNameApplay" :disabled="disabled" :nodeId="applicationOneForm.orgId"
                             @orgCurrent="orgCurrent2"></jt-org-select>
            </el-form-item>
            <el-form-item class="changeItem" label="目的地" prop="stopAddress">
              <el-input v-model="applicationOneForm.stopAddress" placeholder="请输入目的地"
                        style="width: 193px;"></el-input>
            </el-form-item>
            <el-form-item class="changeItem" label="返回地" prop="returnPlace">
              <el-input v-model="applicationOneForm.backAddress" placeholder="请输入返回地"
                        style="width: 193px;"></el-input>
            </el-form-item>
            <el-form-item class="changeItem" label="用车类型" prop="usetypeId">
              <el-select @change="carUseChange" v-model="applicationOneForm.usetypeId" placeholder="请选择类型">
                <el-option v-for="item in options1" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="changeItem" label="备注">
              <el-input v-model="applicationOneForm.remark" placeholder="请输入备注信息" style="width: 193px;"></el-input>
            </el-form-item>
            <el-form-item class="changeItem" label="是否需要驾驶员" prop="needDriver">
              <el-select v-model="applicationOneForm.needDriver" placeholder="请选择">
                <el-option v-for="item in options10" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
        <el-button size="mini" @click="dialogHide">取 消</el-button>
        <el-button size="mini" type="primary" @click.native="applicationOneAddFuc(applicationOneForm)">确 定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  import {datetime} from '@/utils/filters'
  import {getCookie} from '@/utils/auth'

  export default {
    components: {JtOrgSelect},
    props: ['disabled'],
    name: 'index',
    data() {
      return {
        applayDisabled: false,
        auditManIds: [],
        data: {},
        applicationOneForm: {
          usemanId: '',
          startAddress: '',
          preStartTime: '',
          preStopTime: '',
          passengerNum: '',
          useReason: '',
          auditManIds: '',
          orgId: '',
          remark: '',
          stopAddress: '',
          usetypeId: '',
          urgency: '',
          backAddress: '',
          needDriver: '',
          priority: 1
        },
        rules: {
          usemanId: [
            {required: true, message: '请输入用车人', trigger: 'change'}
          ],
          startAddress: [
            {required: true, message: '请输入出发地', trigger: 'blur'}
          ],
          urgency: [
            {required: true, message: '判断是否紧急', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择时间', trigger: 'change'}
          ],
          stopAddress: [
            {required: true, message: '请输入目的地', trigger: 'blur'}
          ],
          backAddress: [
            {required: true, message: '请输入返回地', trigger: 'blur'}
          ],
          usetypeId: [
            {required: true, message: '请选择用车事由', trigger: 'change'}
          ],
          needDriver: [
            {required: true, message: '请选择是否需要驾驶员', trigger: 'change'}
          ]
        },
        disabledUseMan: false,
        options: [],
        options2: [],
        preStartTime: '',// 用车时间
        options1: [],
        options10: [{value: 0, label: '不需要'}, {value: 1, label: '需要'}],
        userId: null,
        update: false,
      }
    },
    created() {
      /** 获取设置的审批流程信息 **/
      this.getData('/apply/getAuditFlow', 'post').then(res => {
        if (res.code === 0) {
          this.data = res.data
          if (this.data.cannotUpdateauditman) {
            this.applayDisabled = true
          } else {
            this.applayDisabled = false
          }
        }
      }).catch(error => {
        console.log(error)
      })
      this.$bus.$on('addApplicationOne', (val, update) => {
        this.$refs.upOrgNameApplay.val.orgValue = ''
        this.update = update
        this.applicationOneForm = {
          usemanId: '',
          startAddress: '',
          preStartTime: '',
          preStopTime: '',
          passengerNum: '',
          useReason: '',
          auditManIds: '',
          orgId: '',
          remark: '',
          stopAddress: '',
          usetypeId: '',
          urgency: '',
          backAddress: '',
          needDriver: '',
        } // 重置表单
        this.preStartTime = ''
        if (val === 1) {   // 我发起的
          this.disabledUseMan = true
          this.getData('/apply/useman/list', 'post').then(res => {
            this.userId = parseInt(getCookie('jiatu_userId'))
            // 绑定审批人
            if (this.data.applicantIds) {
              var array = this.data.applicantIds.split(',')
              if (array.indexOf(getCookie('jiatu_userId')) != -1) {
                this.applicationOneForm.priority = 2   // 条件标记
                var arr = this.data.auditManIds.split(',')
                for (var i = 0; i < arr.length; i++) {
                  arr[i] = parseInt(arr[i])
                }
                this.auditManIds = arr
              } else {
                this.applicationOneForm.priority = 1  // 默认标记
                console.log(this.data.defaultAuditManIds) // 如果没有，那就是设置审批流程的问题
                if (this.data.defaultAuditManIds) {
                  var arr = this.data.defaultAuditManIds.split(',')
                  for (var i = 0; i < arr.length; i++) {
                    arr[i] = parseInt(arr[i])
                  }
                  this.auditManIds = arr
                }
              }
            } else {
              // 如果没有，那就是，默认审批流程的问题
              if (this.data.defaultAuditManIds) {
                this.applicationOneForm.priority = 1  // 默认标记
                var arr = this.data.defaultAuditManIds.split(',')
                for (var i = 0; i < arr.length; i++) {
                  arr[i] = parseInt(arr[i])
                }
                this.auditManIds = arr
              } else {
                this.auditManIds = []
              }

            }
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].id === this.userId && this.disabledUseMan) {
                this.applicationOneForm.usemanId = res.data[i].id
              }
            }
          }).catch(error => {
            console.log(error)
          })
        } else {  // 代人发起的
          this.disabledUseMan = false
          this.auditManIds = []
        }
      })
      this.$bus.$on('resetAddDialog', (data, update) => {
        this.applayDisabled = true
        this.update = update
        this.disabledUseMan = true
        if (data.auditManIds) {
          var arr = data.auditManIds.split(',')
          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i])
          }
          this.auditManIds = arr
        }
        this.applicationOneForm = {
          usemanId: data.usemanId,
          startAddress: data.startAddress,
          preStartTime: datetime(data.preStartTime,'yy:MM:dd hh:mm:ss'),
          preStopTime:datetime(data.preStopTime,'yy:MM:dd hh:mm:ss'),
          passengerNum: data.passengerNum,
          useReason: data.useReason,
          auditManIds: data.auditManIds,
          remark: data.remark,
          orgId: data.orgId,
          id: data.id,
          stopAddress: data.stopAddress,
          usetypeId: data.usetypeId,
          urgency: data.urgency,
          backAddress: data.backAddress,
          needDriver: data.needDriver,
        }
        this.preStartTime = [datetime(data.preStartTime,'yy:MM:dd hh:mm:ss'), datetime(data.preStopTime,'yy:MM:dd hh:mm:ss')]// 用车时间
      })
    },
    mounted() {
      this.getUseManFuc()
      /** 用车类型数据 **/
      this.getData('/apply/usetype/page', 'post').then(res => {
        for (var i = 0; i < res.data.list.length; i++) {
          this.options1.push({
            label: res.data.list[i].name,
            value: res.data.list[i].id
          })
        }
      }).catch(error => {
        console.log(error)
      })
      /** 审批人数据 **/
      this.getData('/apply/auditman/list', 'post').then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.options2.push({
            label: res.data[i].realName,
            value: res.data[i].id
          })
        }
      }).catch(error => {
        console.log(error)
      })

    },
    methods: {
      /**
       *  用車类型选择
       * @param val 用車型id
       */
      carUseChange(val) {
        if (this.data.carusetypeIds) {
          let array = this.data.carusetypeIds.split(',')
          if (array.indexOf(val.toString()) != -1) {
            this.applicationOneForm.priority = 2  // 默认标记
            var arr = this.data.auditManIds.split(',')
            for (var i = 0; i < arr.length; i++) {
              arr[i] = parseInt(arr[i])
            }
            this.auditManIds = arr
          } else {
            this.applicationOneForm.priority = 1  // 默认标记
            if (this.data.defaultAuditManIds) {
              var arr = this.data.defaultAuditManIds.split(',')
              for (var i = 0; i < arr.length; i++) {
                arr[i] = parseInt(arr[i])
              }
              this.auditManIds = arr
            }
          }
        }
        // else {
        //   if (this.data.defaultAuditManIds) {
        //     this.applicationOneForm.priority = 1  // 默认标记
        //     var arr = this.data.defaultAuditManIds.split(',')
        //     for (var i = 0; i < arr.length; i++) {
        //       arr[i] = parseInt(arr[i])
        //     }
        //     this.auditManIds = arr
        //   }
        // }
      },
      /**
       *  用車人选择
       * @param val 用車人选择id
       */
      useManChange(val) {
        // 绑定审批人
        if (this.data.applicantIds) {
          let array = this.data.applicantIds.split(',')
          if (array.indexOf(val.toString()) != -1) {
            this.applicationOneForm.priority = 2  // 条件标记
            var arr = this.data.auditManIds.split(',')
            for (var i = 0; i < arr.length; i++) {
              arr[i] = parseInt(arr[i])
            }
            this.auditManIds = arr
          } else {
            this.applicationOneForm.priority = 1  // 默认标记
            if (this.data.defaultAuditManIds) {
              var arr = this.data.defaultAuditManIds.split(',')
              for (var i = 0; i < arr.length; i++) {
                arr[i] = parseInt(arr[i])
              }
              this.auditManIds = arr
            }
          }
        } else {
          if (this.data.defaultAuditManIds) {
            this.applicationOneForm.priority = 1  // 默认标记
            var arr = this.data.defaultAuditManIds.split(',')
            for (var i = 0; i < arr.length; i++) {
              arr[i] = parseInt(arr[i])
            }
            this.auditManIds = arr
          }
        }
        this.getData('/org/group/get', 'post', {id: val}).then(res => {
          setTimeout(() => {
            this.applicationOneForm.orgId = res.data.id
          }, 100)
        }).catch(error => {
          console.log(error)
        })
      },
      getUseManFuc() {
        /** 用车人数据 **/
        this.getData('/apply/useman/list', 'post').then(res => {
          this.userId = parseInt(getCookie('jiatu_userId'))
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].id === this.userId && this.disabledUseMan) {
              this.applicationOneForm.usemanId = res.data[i].id
            }
            this.options.push({
              label: res.data[i].realName,
              value: res.data[i].id
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 关闭弹窗
       */
      dialogHide() {
        this.$emit('dialogHide')
      },
      /**
       * 组织机构选择
       * @param val 当前选择的组织机构id
       */
      orgCurrent2(val) {
        this.applicationOneForm.orgId = val.id
      },
      /**
       * 申请确定按钮方法
       * @param data 当前表单数据
       */
      applicationOneAddFuc(data) {
        if (!this.auditManIds) {
          this.$message({
            message: '请选择审批人！',
            type: 'warning'
          })
          return false
        }
        var str = JSON.stringify(this.auditManIds)
        this.applicationOneForm.preStartTime = datetime(this.preStartTime[0],'yy:MM:dd hh:mm:ss')
        this.applicationOneForm.preStopTime = datetime(this.preStartTime[1],'yy:MM:dd hh:mm:ss')
        this.applicationOneForm.auditManIds = str.substring(1, str.length - 1)  // 审批人ids字符串

        if (this.update) {
          this.getData('/apply/update', 'post', this.applicationOneForm, true).then(res => {
            if (res.code === 0) {
              this.$emit('applicationOneAddFuc')
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.getData('/apply/submit', 'post', this.applicationOneForm, true).then(res => {
            if (res.code === 0) {
              this.$emit('applicationOneAddFuc')
            }
          }).catch(error => {
            console.log(error)
          })
        }


      },
      /**
       * 计数器选择
       * @param val 当前值
       */
      handleChangeNum(val) {
        this.applicationOneForm.passengerNum = val
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .applay-add {
    #applicationOneForm {
      .el-form-item {
        margin-bottom: 10px;
        .el-input-number__increase, .el-input-number__decrease {
          width: 16px;
          line-height: 19px;
          height: 15px;
        }
        .el-form-item__error {
          top: 90%;
          left: 110px;
        }
        .el-input-number__increase {
          top: 6px;
        }
        .el-input-number__decrease {
          bottom: 6px;
        }
      }
      .el-form-item__label {
        width: 110px;
        font-size: 12px;
      }
      .changeItem {
        .el-input__inner {
          width: 204px;
          height: 28px !important;
        }
      }
      .range {
        .el-range-editor {
          width: 204px;
          padding: 0px 0px 0px 10px;
          margin-top: 5px;
          .el-range-separator {
            width: 10%;
          }
        }
        .el-input__icon {
          line-height: 28px;
        }
      }
      .range > input {
        font-size: 12px;
      }
      .range > span {
        font-size: 12px;
        padding: 0px 14px 0px 5px;
      }
      .prover {
        .el-input__inner {
          width: 204px;
          line-height: 28px;
        }
      }
    }
  }
</style>
