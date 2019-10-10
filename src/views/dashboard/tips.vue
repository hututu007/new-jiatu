<template>
  <div id="tips" class="tips-single">
    <!-- 三角形 -->
    <div class="top"></div>
    <div style="max-height:390px;overflow-y: auto">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="公告(1)" name="first">
          <ul class="msg-list1">
            <li :class="index===listIndex.index1?'active':'noactive'" v-for="(item,index) in mainData.notice" @click="noticeClick(index)">
              <div class="left-img" v-if="item.img"><img src="../../assets/images/img-logo.png"></div>
              <div :class="item.img?'content':'content1'">
                <p class="tip-title">{{item.tit}}</p>
                <p class="tip-content">
                  <span>{{item.time}}</span>
                </p>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="产品快报(2)" name="second">
          <ul class="msg-list1">
            <li :class="index===listIndex.index1?'active':'noactive'" v-for="(item,index) in mainData.notice" @click="noticeClick(index)">
              <div class="left-img" v-if="item.img"><img src="../../assets/images/img-logo.png"></div>
              <div :class="item.img?'content':'content1'">
                <p class="tip-title">{{item.tit}}</p>
                <p class="tip-content">
                  <span>{{item.time}}</span>
                </p>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="待办(3)" name="third">
          <ul class="msg-list">
            <li :class="index===listIndex.index3?'active':'noactive'" v-for="(item, index) in mainData.waitData" @click="waitClick(index)">
              <p class="tip-title">{{item.tit}}</p>
              <p class="tip-content">
                <span>{{item.thing}}</span>
                <span :class="(item.fuc!='审批')?'tips-active1':'tips-active2'">{{item.fuc}}</span>
              </p>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <div class="tip-foot">
        查看更多
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tips",
    data() {
      return {
        activeName: 'first',
        tabIndex:'',
        listIndex:{
          index1:null,
          index2:null,
          index3:null
        },
        mainData:{
          notice:[
            {img:require('../../assets/images/img-logo.png'),tit:'恭喜您获得7天安骑士企业版试用',time:'24分钟前'},
            {img:null,tit:'三大基本功能覆盖车主用户最高频的需求',time:'24分钟前'},
          ],
          fastData:[
            {fuc:'派车',tit:'派车通知',thing:'您有新的任务,请于在2017- 01-12 20:00 前操作'},
            {fuc:'审批',tit:'审批通知',thing:'您有新的任务,请于在2017- 01-12 20:00 前操作'},
            {fuc:'审批',tit:'审批通知',thing:'您有新的任务,请于在2017- 01-12 20:00 前操作'}
          ],
          waitData:[
            {fuc:'派车',tit:'派车通知',thing:'您有新的任务,请于在2017- 01-12 20:00 前操作'},
            {fuc:'审批',tit:'审批通知',thing:'您有新的任务,请于在2017- 01-12 20:00 前操作'},
            {fuc:'审批',tit:'审批通知',thing:'您有新的任务,请于在2017- 01-12 20:00 前操作'}
          ]
        }
      };
    },
    methods: {
      /**
       * tabs点击
       * @param tab 当前tabs对象
       */
      handleClick(tab, event) {
        this.tabIndex=tab.index // string
        this.listIndex.index1=null
        this.listIndex.index2=null
        this.listIndex.index3=null
      },
      /**
       * 公告列表点击
       * @param index 当前下标
       */
      noticeClick(index){
        this.listIndex.index1=index
        this.listIndex.index2=null
        this.listIndex.index3=null
      },
      /**
       * 产品快办列表点击
       * @param index 当前下标
       */
      fastClick(index){
        this.listIndex.index2=index
        this.listIndex.index1=null
        this.listIndex.index3=null
      },
      /**
       * 代办列表点击
       * @param index 当前下标
       */
      waitClick(index){
        this.listIndex.index3=index
        this.listIndex.index2=null
        this.listIndex.index1=null
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">


  #tips {
    width: 274px;
    height: 390px;
    position: absolute;
    background-color: white;
    border-radius: 4px;
    top: 60px;
    left: 34px;
    box-shadow: 0 0px 10px 1px rgba(90, 90, 90, .18);
    .top{
      position: absolute;
      border-style: solid;
      border-width: 10px 10px 10px 10px;
      border-color: #324e80 #324e80 #ffffff #324e80;
      width: 0px;
      height: 0px;
      left: 50%;
      top: -20px;
    }
    .active{
      background-color:#dfefff ;
    }
    .noactive{
      background-color:white ;
    }
    .tips-active1 {
      color: #71d189;
      border: 1px solid #71d189;
    }
    .tips-active2 {
      color: #ffc600;
      border: 1px solid #ffc600;
    }
    .el-tab-pane {
      margin-bottom: 0px;
      padding: 0px;
    }
    .el-tabs__header {
      margin: 0px;
    }
    .el-tabs__item {
      width: auto;
      font-size: 12px;
    }
    .el-tabs__nav{
      transform: translateX(27px) !important;
    }
    .msg-list1 > li {
      width: 100%;
      height: 74px;
      padding: 0px 20px;
      font-size: 12px;
      cursor: pointer;
      border-bottom: 1px dashed #cfdee8;
      .left-img {
        height: 100%;
        width: 50px;
        float: left;
        display: flex;
        align-items: center;
        img {
          line-height: 100%;
          width: 40px;
          height: 40px;
        }
      }
      .content {
        width: calc(100% - 50px);
        float: right;
        .tip-title {
          width: 100%;
          height: 18px;
          text-align: left;
          color: #666;
        }
        .tip-content {
          width: 100%;
          span {
            width: 100%;
            height: 18px;
            color: #aaaaaa;
            text-align: left;
          }
        }
      }
      .content1 {
        width: 100%;
        float: right;
        color: #666;
        .tip-title {
          width: 100%;
          text-align: left;
          height: 18px;
        }
        .tip-content {
          width: 100%;
          span {
            width: 100%;
            height: 18px;
            color: #aaaaaa;
            text-align: left;
          }
        }
      }
    }
    .msg-list > li {
      width: 100%;
      height: 74px;
      cursor: pointer;
      padding: 0px 20px;
      border-bottom: 1px dashed #cfdee8;
      .tip-title {
        width: 100%;
        height: 36px;
        text-align: left;
        font-size: 12px;
        display: flex;
        color: #666;
        align-items: center;
      }
      .tip-content {
        width: 100%;
        height: 35px;
        span:nth-child(1) {
          width: 170px;
          height: 100%;
          text-align: left;
          float: left;
          color: #aaaaaa;
          font-size: 12px;
          line-height: 16px;
        }
        span:nth-child(2) {
          width: 42px;
          height: 20px;
          float: right;
          text-align: center;
          line-height: 20px;
          border-radius: 10px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .tip-foot {
      width: 100%;
      height: 40px;
      text-align: center;
      color: #55a8fd;
      font-size: 12px;
      cursor: pointer;
    }
  }

</style>
