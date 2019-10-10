<template>
  <div class="changePwd">
    <div class="changePwd-main">
      <jt-title :titData="changePwdTitData"></jt-title>
      <div class="userInfo">
        <el-row>
          <el-col :span="24">
            <div style="background-color: white;padding:20px;">
              <el-alert
                title="提示：您可以在此页面设置修改密码。密码变更请重新登录"
                type="info"
                style="background-color:  #fffae7;color: #feb57f"
                :closable="false"
                show-icon>
              </el-alert>
            </div>
          </el-col>
        </el-row>
        <div class="userInfo-main">
          <div>{{userInfo.firstName}}</div>
          <div>
            <p>{{userInfo.realName}}</p>
            <p>{{'登录账号：'+userInfo.userName}}<span style="color:#409eff;margin-left: 30px;cursor: pointer"
                                                  @click="changePhone"  v-if="false">[变更手机]</span></p>
          </div>
        </div>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark ">
              <div style="width:auto;padding-left:20px;padding-right:20px">
                <div
                  style="width:100%;height:1px;margin:25px auto;padding:0px;overflow:hidden;border-bottom:#dce7ee 1px dashed;"></div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="userInfo-text">
          <ul>
            <li>联系电话：</li>
            <li>所属机构/部门：</li>
            <li>职务类型：</li>
            <li>角色类别：</li>
            <li>账号状态：</li>
            <li>登录密码：</li>
          </ul>
          <ul>
            <li>{{userInfo.linkPhone}}</li>
            <li>{{userInfo.name}}</li>
            <li>{{userInfo.duty}}</li>
            <li>{{userInfo.role}}</li>
            <!-- <li>普通员工</li> -->
            <li>{{userInfo.status}}</li>
            <li>******
              <el-button type="text" @click="changePassword" style="margin-left:20px">修改密码</el-button>
            </li>
          </ul>
        </div>
        <el-col :span="24">
          <div class="grid-content">
            <div style="width:auto;padding-left:20px;padding-right:20px">
              <div
                style="width:100%;height:1px;margin:25px auto;padding:0px;overflow:hidden;border-bottom:#dce7ee 1px dashed;"></div>
            </div>
          </div>
        </el-col>
      </div>
      <!-- 修改密码弹窗 -->
      <jt-dialog :dialog-show.sync="dialogShowUserPassword" :title="dialogPassword.title" :width="dialogPassword.width">
        <div slot="dialog">
          <el-form label-position="right" ref="changePwdForm" :model="changePwdForm"
                   class="changePwdForm">
            <el-form-item label="当前密码">
              <el-input type="password" v-model="changePwdForm.oldPwd" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input type="password" v-model="changePwdForm.newPwd" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input type="password" v-model="changePwdForm.newPwd1" placeholder=""></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
              <el-button size="mini" @click="dialogShowUserPassword = false">取 消</el-button>
              <el-button size="mini" type="primary" @click.native="changePwdSureFuc(changePwdForm)">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </jt-dialog>
      <!-- 变更手机弹窗 -->
      <jt-dialog @closeDialog="closeDialog" :dialog-show.sync="dialogShowUserPhone" :title="dialogPhone.title"
                 :width="dialogPhone.width">
        <div slot="dialog">
          <el-form label-position="right" ref="changePhoneForm" :model="changePhoneForm"
                   class="changePhoneForm">
            <el-form-item>为了保证您的帐号安全，更换手机登录前请先进行安全验证</el-form-item>
            <el-form-item label="原手机" v-show="!newPhoneShow">
              <span style="margin-left: 20px">{{changePhoneForm.oldPhone}}</span>
              <el-button style="margin-left: 100px" size="mini" :disabled="old.captchaDisable" plain
                         @click.native="changePhoneFuc()">{{old.captchaLabel}}
              </el-button>
            </el-form-item>
            <el-form-item label="新手机" v-show="newPhoneShow">
              <el-input v-model="changePwdForm.newPhone" placeholder="请输入手机号"></el-input>
              <el-button size="mini" style="margin-left: 30px" :disabled="newd.captchaDisable" plain
                         @click.native="changePhoneFuc1()">{{newd.captchaLabel}}
              </el-button>
            </el-form-item>
            <el-form-item label="验证码">
              <el-input v-model="changePwdForm.code" placeholder="请输入验证码"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;margin-top: 20px" v-show="!newPhoneShow">
              <el-button size="mini" type="primary" @click="nextTip">下一步</el-button>
              <!--<el-button size="mini" type="primary" @click.native="changePhoneSureFuc(changePhoneForm)">确 定</el-button>-->
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;margin-top: 20px" v-show="newPhoneShow">
              <el-button size="mini" @click="PhoneDisableFuc">取 消</el-button>
              <el-button size="mini" type="primary" @click.native="PhoneSureFuc(changePhoneForm)">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </jt-dialog>

    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtDialog from '@/components/JtDialog'
  import {getCookie} from '@/utils/auth'

  export default {
    components: {JtTitle, JtDialog},
    data() {
      return {
        changePwdTitData: {
          typeName: 0,
          name: '个人信息',
          img: '',
          fucName: '',
          fuc: 0
        },
        dialogShowUserPassword: false,
        dialogPassword: {
          title: '修改密码',
          width: '500px'
        },
        changePwdForm: {
          oldPwd: '',
          newPwd: '',
          newPwd1: ''
        },
        newPhoneShow: false,
        dialogShowUserPhone: false,
        dialogPhone: {
          title: '更改手机绑定',
          width: '500px'
        },
        changePhoneForm: {
          oldPhone: '',
          newPhone: '',
          code: ''
        },
        userInfo: {
          realName: '', // 真实姓名
          userName: '', // 登录账号
          linkPhone: '', // 联系电话
          name: '', //  所属机构部门
          duty: '', // 职务
          firstName:'', // 姓氏
          role: '', // 角色类别
          identity: '', // 身份
          status: '', // 启用状态
          password: '' // 密码
        },
        old: {
          captchaLabel: "发送验证码",
          seconds: 60,
          captchaDisable: false,
        },
        newd: {
          captchaLabel: "发送验证码",
          seconds: 60,
          captchaDisable: false,
        },
        interval: '',
        newInterval: '',
      }
    },
    beforeDestroy() {
      clearTimeout(this.interval)
      clearTimeout(this.newInterval)
    },
    // filters: {
    //   statusFilter(status) {
    //     const statusMap = {
    //       published: 'success',
    //       draft: 'gray',
    //       deleted: 'danger'
    //     }
    //     return statusMap[status]
    //   }
    // },
    methods: {
      closeDialog() {
        this.newPhoneShow = false
        clearTimeout(this.interval)
        clearTimeout(this.newInterval)

      },
      /**
       * 变更手机
       */
      changePhone() {
        this.dialogShowUserPhone = true
      },
      /**
       * 修改密码
       */
      changePassword() {
        this.dialogShowUserPassword = true
      },
      /**
       *  修改密码提交
       * @param form 表单数据
       */
      changePwdSureFuc(form) {
        if (form.newPwd != form.newPwd1) {
          this.$confirm('两次输入密码不一致', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        } else {
          this.getData('/user/pwd/update', 'post', {newPwd: form.newPwd, oldPwd: form.oldPwd}, true).then(res => {
            if (res.code === 0) {
              this.dialogShowUserPassword = false
              this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }

      },
      /**
       *  发送验证码
       */
      changePhoneFuc() {
        this.old.captchaDisable = true;
        //立即显示重发提示不必等待倒计时启动
        this.old.captchaLabel = this.old.seconds + '秒后重新发送';
        //启动1s步长倒计时
        this.interval = setInterval(() => {
          this.kTimer(this.old)
          if (this.old.seconds == 60) {
            //停止倒计时
            clearTimeout(this.interval)
          }
        }, 1000);
      },
      /**
       * 倒计时方法
       */
      kTimer(that) {
        var length = 60;
        var seconds = that.seconds;
        var captchaLabel = that.captchaLabel;
        if (seconds < 1) {
          captchaLabel = '获取验证码';
          seconds = length;
          that.captchaDisable = false;

        } else {
          captchaLabel = --seconds + '秒后重新发送'
        }
        that.seconds = seconds;
        that.captchaLabel = captchaLabel;
      },
      /**
       *  下一步新手机验证操作
       */
      nextTip() {
        this.newPhoneShow = true
      },
      changePhoneFuc1() {
        // newInterval
        this.newd.captchaDisable = true;
        //立即显示重发提示不必等待倒计时启动
        this.newd.captchaLabel = this.newd.seconds + '秒后重新发送';
        //启动1s步长倒计时
        this.newInterval = setInterval(() => {
          this.kTimer(this.newd)
          if (this.newd.seconds == 60) {
            //停止倒计时
            clearTimeout(this.newInterval)
          }
        }, 1000);
      },
      PhoneDisableFuc() {
        this.dialogShowUserPhone = false
        clearTimeout(this.newInterval)
      },
      PhoneSureFuc() {

      }
    },
    mounted() {
      this.userInfo.realName = getCookie('jiatu_realName')
      this.userInfo.firstName = getCookie('jiatu_realName').substr(0,1)
      this.userInfo.userName = getCookie('jiatu_userName')
      this.userInfo.avatar = this.$store.getters.avatar
      this.userInfo.name = this.$store.getters.name
      // user/page
      this.getData('/user/get', 'post', {id: getCookie('jiatu_userId')}).then(res => {
        this.userInfo.duty = res.data.dutyName
        this.userInfo.role = res.data.roleName
      }).catch(error => {
        console.log(error)
      })
      this.getData('/org/group/get', 'post', {id: getCookie('jiatu_userId')}).then(res => {
        if (res.data.status === 1) {
          this.userInfo.status = '启用'
        } else {
          this.userInfo.status = '停用'
        }
        this.userInfo.linkPhone = res.data.linkPhone
        this.changePhoneForm.oldPhone = res.data.linkPhone
      }).catch(error => {
        console.log(error)
      })
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .changePwd {
    width: 100%;
    padding: 20px;
    .changePwd-main {
      background-color: white;
      padding-bottom: 75px;
      .userInfo {
        .userInfo-main {
          width: 100%;
          height: 140px;
          padding: 20px;
          & > div:nth-child(1) {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            background-color:#90b8f4;
            margin-right: 20px;
            line-height: 140px;
            font-size:30px;
            color: #fff;
            float: left;
            text-align: center;
            line-height: 80px;
            img {
              width: 100%;
              height: 100%;
              line-height: 100px;
            }
          }
          & > div:nth-child(2) {
            width: calc(100% - 120px);
            height: 100px;
            float: left;
            p {
              line-height: 40px;
              &:nth-child(1) {
                font-size: 22px;
                color: #666666;
              }
              &:nth-child(2) {
                font-size: 14px;
                color: rgb(153, 153, 153);
              }
            }
          }
        }
        .userInfo-text {
          width: 100%;
          height: 430px;
          padding-left: 30px;
          & > ul {
            float: left;
            height: 100%;
          }
          & > ul:nth-child(1) {
            width: 130px;
            li {
              width: 100%;
              text-align: left;
              line-height: 60px;
              font-size: 14px;
              color:#666;
            }
          }
          & > ul:nth-child(2) {
            width: calc(100% - 130px);
            li {
              width: 100%;
              text-align: left;
              font-size: 14px;
              line-height: 60px;
              height: 60px;
              color: #333;
            }
          }
        }
      }
      .changePwdForm {
        .el-form-item {
          .el-form-item__label {
            font-size: 12px;
            width: 126px;
          }
          .el-input {
            width: auto;
            .el-input__inner {
              width: 193px;
              height: 28px;
            }
          }

        }
      }
      .changePhoneForm {
        .el-input {
          width: auto;
          .el-input__inner {
            width: 193px;
            height: 28px;
          }
        }
      }
    }
  }

</style>
