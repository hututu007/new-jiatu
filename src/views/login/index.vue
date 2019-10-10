<template>
  <div class="login-container">
    <el-form class="login-form fn-radius fn-shadow" :model="loginForm" ref="loginForm" label-position="left" :rules="loginRules">
      <p class="avater-login"><img :src="logoUrl"></p>
      <h3 class="title">{{groupName}}</h3>
      <el-form-item class="login-input" prop="userName">
        <span class="svg-container svg-container_login">
          <img src="../../assets/images/login-people.png" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.userName"  placeholder="用户名/手机号" />
      </el-form-item>
      <el-form-item class="login-input" style="margin-bottom: 5px" prop="userPwd">
        <span class="svg-container">
          <img src="../../assets/images/login-suo.png" />
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.userPwd" autoComplete="on"
          placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item class="tips" style="margin-bottom: 25px">
        <el-checkbox v-model="checked">自动登录</el-checkbox>
        <a href="">忘记密码？</a>
      </el-form-item>
      <el-form-item class="login-go">
        <el-button type="primary" style="width:100%;font-size: 14px;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
    <div class="bottom">
      <p><span>帮助</span><span>|</span><span>隐私</span><span>|</span><span>条款</span></p>
      <p style="margin-top: 15px">Copyright &copy; 2017 深圳中兴驾图科技有限公司版权所有</p>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    // 初级验证规则
    // const validateUsername = (rule, value, callback) => {
    //   if (!isvalidUsername(value)) {
    //     callback(new Error('请输入正确的用户名'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      checked: false,
      logoUrl: require('@/assets/images/img-logo.png'),
      groupName:'中兴驾图车辆管理平台',
      loginForm: {
        userName: '',
        userPwd: ''
      },
      loginRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur'}],
        userPwd: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    // showPwd() {
    //   if (this.pwdType === 'password') {
    //     this.pwdType = ''
    //   } else {
    //     this.pwdType = 'password'
    //   }
    // },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  mounted(){
    /** 用户如登陆过显示机构名和logo **/
    if(window.localStorage.getItem('logoUrl')){
      this.logoUrl=window.localStorage.getItem('logoUrl')
    }
    if(window.localStorage.getItem('groupName')){
      this.groupName=window.localStorage.getItem('groupName')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  background: url("../../assets/images/login-bg.jpg") no-repeat center top;
  //  background: url("../../assets/images/login_bg_new.jpg") no-repeat center top;
  /*background-size: 100% 100%;*/
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  }
    .el-form-item{
    height: 36px!important;
    .el-input__inner{
      height: 36px!important;
    }
  }
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{
    border-color: #c4d2d9;
  }
  .el-input {
    display: inline-block;
    height: 100%;
    width: 100%;
    font-size: 12px;
    el-input__inner {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .avater-login {
    width: 102px;
    height: 102px;
    margin: 20px auto;
    border-radius: 50px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-input{
    span{
      position: absolute;
      z-index: 111;
      left: -2px;
      top: -5px;
    }
  }
  .el-form-item {
    width: 320px;
    color: #454545;
    height: 40px;
    margin: 0 auto;
    margin-bottom: 20px;
    position: relative;
    .el-form-item__content{
      line-height: 36px;
      .el-input{
        .el-input__inner{
          padding: 0 36px;
        }
      }
    }
  }
  .login-go{
    border: none;
    height: 36px;
    .el-button{
      padding: 8px 20px;
    }
  }
  .el-checkbox{
    .el-checkbox__label{
      font-size: 12px;
    }
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .bottom{
    width: 100%;
    height: 36px;
    position: fixed;
    bottom: 20px;
    margin: 0 auto;
    color: white;
    font-size: 12px;
    p{
      text-align: center;
    }
    p:nth-child(1){
      span{
        margin-right: 16px;
      }
    }

  }
  .login-form {
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 480px;
    height: 466px;
    line-height: 100%;
    padding: 20px 35px 15px 35px;
    margin: 0px auto;
  }
  .tips {
    border: none;
    .el-form-item__content{
      line-height: 20px;
    }
    a{
      float: right;
      color: #55a8fd;
      font-size: 12px;
    }
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color:white;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 20px;
    font-weight: 400;
    color: #333;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
}
</style>
