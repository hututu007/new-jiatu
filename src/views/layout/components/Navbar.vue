<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->
      <div class="left-nav">
        <p class="avater-img"><img :src="logoUrl"></p>
        <p class="group-name">{{groupName}}</p>
      </div>
      <div class="right-nav">
        <div class="top-nav">
          <span style="cursor:pointer;display:none;">通知<strong>99+</strong></span>
          <span>欢迎您,[{{'&nbsp;'+userName+'&nbsp;'}}]</span>
          <span class="msgSpan" style="cursor:pointer;" @click="tipsShowList">通知
            <!--<strong>5</strong>-->
        </span>
          <span style="cursor:pointer;">帮助</span>
          <span style="cursor:pointer;">反馈</span>
          <!--<span style="cursor:pointer;" v-if="true" @click="conditionTotal">条件统计</span>-->
          <span @click="logout" style="cursor:pointer;">退出</span>
          <Tips ref="tips1" v-show="tipsShow"></Tips>
        </div>
      </div>
      <!-- 底部浮动按钮 -->
      <div class="floatCircle" @click="warnMsg" :class="[newMsg?'animatei':'']"><img src="../../../assets/images/hi.png"/>
      </div>
      <chat-card :dialog-show.sync="dialogShow"></chat-card>
    </el-menu>
    <!-- 条件统计弹窗 -->
    <jt-dialog :dialog-show.sync="cdtdialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <condition-form @closeDialog="closeDialog" @opentDialog="opentDialog"></condition-form>
      </div>
    </jt-dialog>
    <!-- 车辆安全报告统计页弹窗 -->
    <condition-total :dialog-show.sync="tdialogShow"></condition-total>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import Hamburger from '@/components/Hamburger'
  import Tips from '@/views/dashboard/tips'
  import {getCookie} from '@/utils/auth'
  import chatCard from '@/views/dashboard/chatCard'
  import JtDialog from '@/components/JtDialog'
  import ConditionForm from './conditionForm'
  import ConditionTotal from './conditionTotal'

  export default {
    components: {
      Hamburger, Tips, chatCard, JtDialog, ConditionForm, ConditionTotal
    },
    data() {
      return {
        tdialogShow:false,
        cdtdialogShow: false,
        dialog: {
          title: '条件选择',
          width: '800px'
        },
        newMsg: false,
        userName: '',
        logoUrl: '',
        groupName: '',
        tipsShow: false,
        dialogShow: false,
        timer: ''
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar'
      ])
    },
    methods: {
      opentDialog(){
        this.tdialogShow = true
      },
     /* conditionTotal() {
        this.cdtdialogShow = true
      },*/
      closeDialog() {
        this.cdtdialogShow = false
      },
      warnMsg() {
        this.dialogShow = true
        if(this.timer){
          clearInterval(this.timer)
        }
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      },
      // 通知栏
      tipsShowList() {
        this.tipsShow = !this.tipsShow
      },
      /* 查看是否有未处理的消息 */
      animationFuc(){
        this.getData('/inforemind/getList', 'post',{status:1,remindType:0}).then(res => {
          if(res.data.length>0){
            this.timer = setInterval(() => {
              this.newMsg = true
              setTimeout(() => {
                this.newMsg = false
              }, 1000)
            }, 2000)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.userName = getCookie('jiatu_realName')
      this.getData('/org/group/get', 'post', {id: getCookie('jiatu_userId')}).then(res => {
        if (res.code === 0) {
          // 登陆成功过后缓存信息到本地
          window.localStorage.setItem('logoUrl', res.data.logoUrl)
          this.logoUrl = res.data.logoUrl
          //展示平台名称或企业名称，优先展示平台名称
          let groupName = res.data.groupName;
          if (groupName == 'null' || !groupName) {
            groupName = res.data.groupName;
          }
          window.localStorage.setItem('groupName', groupName)
          this.groupName = groupName;
        }
      }).catch(error => {
        console.log(error)
      })


      /*  登录系统获取新消息接口，处理是否有新消息 小圆圈动画 */
      this.animationFuc()



    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @keyframes warn {
    0% {
      box-shadow: 0 0 10px 4px rgba(250, 128, 114, 0);
    }
    25% {
      box-shadow: 0 0 10px 4px rgba(250, 128, 114, 0.2);
    }
    50% {
      box-shadow: 0 0 10px 4px rgba(250, 128, 114, 0.4);
    }
    75% {
      box-shadow: 0 0 10px 4px rgba(250, 128, 114, 0.2);
    }
    100% {
      box-shadow: 0 0 10px 4px rgba(250, 128, 114, 0);
    }
  }

  .animatei {
    animation: warn 1s ease-out;
  }

  .navbar {
    height: 60px;
    line-height: 60px;
    width: 100%;
    min-width: 1024px;
    position: fixed;
    z-index:1001;
    border-radius: 0px !important;
    border-bottom: none;
    background-color: #324e80;
    .floatCircle {
      width: 66px;
      height: 66px;
      position: fixed;
      border-radius: 50%;
      bottom: 50px;
      right: 50px;
      cursor: pointer;
      z-index: 2222;
      text-align: center;
      line-height: 66px;
      img {
        margin-top: 2px;
      }
    }
    .left-nav {
      float: left;
      p {
        float: left;
      }
      .avater-img {
        width: 40px;
        height: 40px;
        margin: 10px 20px 10px 20px;
        overflow: hidden;
        border-radius: 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .group-name {
        height: 100%;
        line-height: 100%;
        margin-top: 24px;
        color: white;
        font-weight: bold;
        font-size: 16px;
      }
    }
    .right-nav {
      float: right;
      height: 100%;
      position: relative;
      .top-nav {
        height: 100%;
        span {
          display: inline-block;
          color: #9aa6c4;
          font-size: 12px;
          margin: 4px 20px 0 0;
        }
        .msgSpan {
          position: relative;
        }
      }

      .top-nav span::before {
        content: '';
        width: 24px;
        height: 24px;
        display: inline-block;
        margin-right: 5px;
        background: url('../../../assets/images/icon-nav.png');
        position: relative;
        top: 10px;
      }
      .top-nav span:nth-child(1) {
        margin-right: 100px;
      }

      .top-nav span:nth-child(1)::before {
        background-position-y: 217px;
        background-position-x: -53px;
      }
      .top-nav span:nth-child(2)::before {
        opacity: 0;
      }

      .top-nav span:nth-child(3)::before {
        background-position-y: 218px;
        background-position-x: -53px;
      }

      .top-nav span:nth-child(4)::before {
        background-position-y: 193px;
        background-position-x: -53px;
      }
      .top-nav span:nth-child(5)::before {
        background-position-y: 169px;
        background-position-x: -53px;
      }
     /* .top-nav span:nth-child(5)::before {
        background: url('../../../assets/images/total.png') no-repeat;
      }*/

      .top-nav span:nth-child(6)::before {
        background-position-y: 145px;
        background-position-x: -53px;
      }
      .top-nav strong {
        display: inline-block;
        padding: 0 5px;
        height: 16px;
        line-height: 16px;
        background: #ff6c60;
        border-radius: 15px;
        color: #ffffff;
        position: relative;
        left: -10px;
        top: -11px;
      }
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 60px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>

