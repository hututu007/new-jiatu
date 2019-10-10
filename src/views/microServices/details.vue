<template>
  <div class="app-container serveInfo">
    <div class="tit">
      <img @click="returnPage" style="cursor: pointer"
           src="../../assets/images/return.png"/>
      <span style="font-size: 14px;color:#666;margin-left: 10px">平台解决方案-短信服务介绍</span>
    </div>
    <div class="main">
      <div class="top">
        <p>sms</p>
        <p>发短信</p>
        <p v-if="$route.name!='serveInfo'" style="margin-top: 20px;text-align: center" @click="add"><el-button type="primary" size="mini ">添加</el-button></p>
      </div>
      <p class="info">基本信息</p>
      <div class="info-list">
        <ul>
          <li><span>AppID</span><span>wxba41ef17c5d26700</span></li>
          <li><span>介绍</span><span>专为小程序设计，通知提醒验证码，不设起充门槛，现最大优惠3分一条。</span></li>
          <li><span>类目</span><span>工具>办公</span></li>
          <li><span>标签</span><span>发短信 sms</span></li>
          <li><span>更新记录</span><div>
            <ul>
              <li v-for="val in recordList" :key="val.id">
                <p>{{val.versions}}</p>
                <p>
                  <span>{{'发布时间：'+val.time}}</span>
                  <span>{{'更新日志：'+val.name}}</span>
                </p>
              </li>
            </ul>
          </div></li>
        </ul>
      </div>
      <p class="more" @click="all">展开全部记录</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "serveInfo",
    data() {
      return {
        recordList:[
          {versions:'1.2.0',time:'2017-02-12 09:04:00',name:'增加用户ID配置'},
          {versions:'1.3.0',time:'2017-05-12 09:04:00',name:'增加用户ID配置'},
          {versions:'1.4.0',time:'2017-06-12 09:04:00',name:'增加用户ID配置'}
        ]
      }
    },
    mounted() {
    },
    methods: {
      returnPage(){
        this.$router.back(-1)
      },
      add(){
        this.$router.push({
          path: 'addServe'
        })
      },
      all(){

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .serveInfo{
    padding-bottom: 30px;
    .tit{
      width: 100%;
      height: 50px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
    }
    .main{
      width: 100%;
      overflow: hidden;
      color: #666;
      font-size: 14px;
      .top{
        height:214px ;
        text-align: center;
        padding-top: 50px;
        p:nth-child(1){
          width: 50px;
          height: 50px;
          border-radius: 50%;
          color: white;
          background-color: #409EFF;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          margin-bottom: 30px;
        }
        p:nth-child(2){
          font-size: 20px;
        }
      }
      .info{
        width: 100%;
        height: 30px;
        font-weight: bold;
        padding-left: 20px;
        color: #409EFF ;
      }
      .info-list{
        padding: 20px;
        width: 100%;
        overflow: hidden;
        &>ul>li{
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          &>span:nth-child(1){
            width: 100px;
            height: 100%;
            font-size: 14px;
            color: #666;
            display: flex;
            align-items: center;
          }
          &>span:nth-child(2){
            width: calc(100% - 120px);
            font-size: 14px;
            height: 100%;
            color: #333;
            margin-left: 20px;
            border-bottom: 1px solid #dcdfe6;
            display: flex;
            align-items: center;
          }
          &>div{
            width: calc(100% - 120px);
            font-size: 14px;
            float: left;
            color: #333;
            margin-left: 20px;
            ul>li{
              width: 100%;
              float: none;
              overflow: hidden;
              display: block;
              margin-top: 20px;
              p{
                float: left;
                span{
                  display: block;
                }
              }
              p:last-child{
                margin-left: 20px;
              }
            }
          }
        }
        &>ul>li:last-child{
          height: auto;
          display: inherit;
          align-items: inherit;
          &>span:nth-child(1){
            width: 100px;
            height:30px;
            font-size: 14px;
            float: left;
            margin-top: 20px;
            color: #666;
          }
        }
      }
    }
    .more{
      width: 100%;
      height: 30px;
      color: rgb(58, 89, 146);
      padding-left: 140px;
      cursor: pointer;
    }
  }
</style>
