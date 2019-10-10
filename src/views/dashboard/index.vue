<template>
  <div class="dashboard">
    <!-- 头部消息条 -->
    <div class="news">
      <p><img src="../../assets/images/news-star.png"/></p>
      <p><span style="font-weight: bold">欢迎你来到智慧车辆管理平台</span> 您可以通过“云-管-端”快速建立车辆以及人员日常管理，您还可以去 </p>
      <p>邀请成员</p>
    </div>
    <!-- 首页主题内容 -->
    <div class="dashboard-main">
      <!-- 上半部分 -->
      <div class="dashboard-main-top">
        <p>一站式企业车辆管理协同平台</p>
        <p><img src="../../assets/images/first-top.png"/></p>
        <p>
          <el-button type="primary" size="medium" style="padding: 10px 0px;text-align: center;width: 90px;height: 36px;font-size: 14px">快速开始</el-button>
        </p>
      </div>
      <!-- 下部分信息数据 -->
      <div class="dashboard-main-bottom">
        <div class="dmb-left">
          <jt-title :titData="dashboardTitData1"></jt-title>
          <p>借助简单的向导和自动化工作流程开始使用你的解决方案。</p>
          <ul class="dmb-left-main">
            <li>
              <div><img src="../../assets/images/icons-first-04.png"/></div>
              <div>
                <p>短信息通知服务</p>
                <p>完美支撑短信发送通知！三网合一3秒触达，99%到达率。</p>
                <p>了解详情</p>
              </div>
            </li>
            <li>
              <div><img src="../../assets/images/icons-first-06.png"/></div>
              <div>
                <p>定制化报表服务</p>
                <p>支撑独立定制企业自有报表，及时统计数据信息呈现。</p>
                <p>了解详情</p>
              </div>
            </li>
            <li>
              <div><img src="../../assets/images/icons-first-05.png"/></div>
              <div>
                <p>班车管控服务</p>
                <p>班车管理服务插件，企业为员工打造福利。</p>
                <p>了解详情</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="dmb-right">
          <jt-title :titData="dashboardTitData2"></jt-title>
          <div class="dmb-right-top">
            <ul>
              <li>
                <div><img src="../../assets/images/icons-first-03.png"/></div>
                <div>
                  <p>
                    <span style="color: #666">【新功能】新版车队正式上线，邀请您开通体验</span>
                    <span>2018-11-10</span></p>
                  <p>&nbsp;2天前</p>
                </div>
              </li>
              <li>
                <div><img src="../../assets/images/icons-first-03.png"/></div>
                <div>
                  <p><span>【产品发布】调度企业微信版正式上线，邀请您开通体验</span><span>2018-11-10</span></p>
                  <p>&nbsp;2天前</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="dmb-right-bot">
            <jt-title :titData="dashboardTitData3"></jt-title>
            <ul>
              <li>
                <p>产品文档</p>
                <p>查看所有产品文档说明</p>
              </li>
              <li>
                <p>服务条款相关</p>
                <p>查看服务条款相关</p>
              </li>
              <li>
                <p>快速入门</p>
                <p>查看所有快速入门</p>
              </li>
              <li>
                <p>常见问题分析</p>
                <p>查看常见问题分析</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
   <!-- 底部浮动按钮 -->
    <!--<div class="floatCircle" @click="warnMsg"><img src="../../assets/images/hi.png" /> </div>-->
    <!--<chat-card :dialog-show.sync="dialogShow"></chat-card>-->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import JtTitle from '../../components/JtTitle'
  // import chatCard from '@/views/dashboard/chatCard'
  export default {
    name: 'dashboard',
    components: {
      JtTitle
    },
    data() {
      return {
        // dialogShow: false,
        dashboardTitData1: {
          typeName: 0,
          name: '解决方案',
          img: require('../../assets/images/icons-info-01.png'),
          fucName: '查看更多',
          fuc: 0
        },
        dashboardTitData2: {
          typeName: 0,
          name: '产品快报',
          img: '',
          fucName: '查看更多',
          fuc: 0
        },
        dashboardTitData3: {
          typeName: 0,
          name: '产品文档与帮助',
          img: '',
          fucName: '',
          fuc: 0
        }
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'resIds'
      ])
    },
    methods: {
      // warnMsg(){
      //   console.log(this.dialogShow)
      //   this.dialogShow=true
      // }
    },
    mounted() {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    width: 100%;
    height: 100%;
    padding-bottom: 50px;
    /*.floatCircle{*/
      /*position: fixed;*/
      /*bottom: 50px;*/
      /*right: 50px;*/
      /*cursor: pointer;*/
      /*z-index: 2222;*/
    /*}*/
    .news {
      width: 100%;
      height: 30px;
      background-color: #fffae7;
      p {
        height: 100%;
        float: left;
        color: #feb57f;
        font-size: 12px;
        line-height: 30px;
        &:nth-child(1) {
          margin-left: 20px;
          margin-right: 5px;
          img {
            margin-top: 5px;
          }
        }
        &:nth-child(3) {
          color: #55a8fd;
          margin-left: 5px;
        }
      }
    }
    .dashboard-main {
      width: 100%;
      padding: 20px;
      .dashboard-main-top {
        width: 100%;
        height: 396px;
        background-color: white;
        margin-bottom: 20px;
        padding-top: 60px;
        p {
          width: 100%;
          &:nth-child(1) {
            width: 100%;
            height: 34px;
            text-align: center;
            font-size: 26px;
            color: #333;
            margin-bottom: 30px;
          }
          &:nth-child(2) {
            width: 100%;
            height: 166px;
            margin-bottom: 30px;
            text-align: center;
            img {
              margin: 0 auto;
            }
          }
          &:nth-child(3) {
            text-align: center;
          }
        }
      }
      .dashboard-main-bottom {
        width: 100%;
        height: 472px;
        & > div {
          width: calc(50% - 10px);
          height: 100%;
          float: left;
        }
        & > div:nth-child(1) {
          background-color: white;
        }
        .dmb-left {
          margin-right: 20px;
          & > p {
            font-size: 12px;
            margin-top: 32px;
            margin-left: 20px;
            color: #666;
          }
          .dmb-left-main {
            width: 100%;
            padding: 10px;
            li {
              height: 120px;
              padding-top: 20px;
              border-bottom: 1px solid #d5e3eb;
              padding-left: 10px;
              div {
                float: left;
                &:nth-child(1) {
                  margin-right: 20px;
                }
                &:nth-child(2) {
                  padding-top: 8px;
                  p:nth-child(1) {
                    font-size: 14px;
                    margin-bottom: 10px;
                  }
                  p:nth-child(2) {
                    font-size: 12px;
                    margin-bottom: 15px;
                    color: #999;
                  }
                  p:nth-child(3) {
                    font-size: 12px;
                    color: #55a8fd;
                    cursor: pointer;
                  }
                }
              }
            }
            li:nth-child(3) {
              border-bottom: none;
            }
          }

        }
        .dmb-right {
          .dmb-right-top {
            width: 100%;
            height: 184px;
            background-color: white;
            ul {
              width: 100%;
              height: 160px;
              padding-left: 18px;
              padding-right: 16px;
              li {
                padding-top: 15px;
                &:nth-child(1) {
                  border-bottom: 1px solid #d5e3eb;
                }
                width: 100%;
                height: 80px;
                & > div {
                  float: left;
                  &:nth-child(1) {
                    width: 60px;
                    height: 100%;
                  }
                  &:nth-child(2) {
                    width: calc(100% - 70px);
                    p {
                      width: 100%;
                      font-size: 12px;
                      color: #aaa;
                      height: 26px;
                      line-height: 26px;
                      &:nth-child(1) span:nth-child(1) {
                        color: #666666;
                        float: left;
                      }
                      &:nth-child(1) span:nth-child(2) {
                        color: #aaa;
                        float: right;
                      }
                    }
                  }
                }

              }
            }
          }
          .dmb-right-bot {
            margin-top: 20px;
            ul{
              width: 100%;
              height: 170px;
              background-color: white;
              padding: 20px 20px 0px 20px;
              li{
                width: 33%;
                height: 70px;
                float: left;
                p:nth-child(1){
                  font-size: 14px;
                  height: 35px;
                  line-height: 35px;
                  color: #666;
                }
                p:nth-child(2){
                  font-size: 12px;
                  height: 35px;
                  line-height: 35px;
                  color: #55a8fd;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
