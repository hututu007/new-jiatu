<template>
  <div class="app-container weServe">
    <jt-title :titData="servTitData"></jt-title>
    <div class="introduce"><p>方案介绍：中兴驾图解决方案服务平台，制作多项微服务产品体系，构建智能多样化服务生态，
      提供跨越设计与开发的体验解决方案。</p></div>
    <div class="main">
      <ul>
        <li class="add" @click="add">+&nbsp;新增产品</li>
        <li @click="serveInfo" class="main-li" v-for="val in serveList" :key="val.id">
          <div>
            <div><img style="width: 48px;height: 48px" src="../../../../static/img/feed2.png"/> </div>
            <div>
              <p>{{val.name}}</p>
              <p>{{val.dis}}</p>
            </div>
          </div>
          <div>
            <span @click="edit">修改</span><span class="stop">停用</span>
          </div>
        </li>
      </ul>
    </div>
    <p class="more">加载更多...</p>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  export default {
    components:{JtTitle},
    name: "index",
    data() {
      return {
        servTitData:{
          typeName: 0,
          name: '平台解决方案',
          img: '',
          fucName: '',
          fuc: 0
        },
        serveList:[
          {name:'短信服务',dis:'短信服务（Short Message Service）是阿里云为用户提供的一种通信服务的能力，支持快速发送短信验证码、短信...'},
          {name:'班车管理服务',dis:'希望是一个好东西，也许是最好的，好东西是不会消亡的。'},
          {name:'定制化报表服务',dis:'那时候我只会想自己想要什么，从不想自己拥有什么。'},
          {name:'年终工作报告',dis:'生命就像一盒巧克力，结果往往出人意料。'}
        ]
      }
    },
    mounted(){},
    methods:{
      /**
       *  点击查看服务详情
       */
      serveInfo(){
        this.$router.push({
          path: 'serveInfo'
          // query: {
          //   date: this.date,
          // }
        });
      },
      add(){
        this.$router.push({
          path: 'addServe'
        })
      },
      edit(){},
      stop(){}
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .weServe{
    color: #333;
    font-size: 14px;
    padding-bottom: 50px;
    .introduce{
      width: 100%;
      height: 150px;
      display: flex;
      padding-left: 20px;
      align-items: center;
      p{
        width:600px;
        line-height: 30px;
      }
    }
    .main{
      padding: 20px 20px 20px 0px;
      overflow: hidden;
      ul{
        li{
          margin: 0px 0px 20px 20px;
          width: calc((100% - 60px)/3);
          height: 184px;
          float: left;
          box-shadow: 0 0px 10px rgba(205,221,231,1);
          border-radius: 4px;
          border: 1px solid #dcdfe6;
        }
        .add{
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          cursor: pointer;
        }
        .main-li{
          &>div:nth-child(1){
            height: 138px;
            div:nth-child(1){
              width: 84px;
              height: 100%;
              float: left;
              display: flex;
              padding-top: 20px;
              /*align-items: center;*/
              justify-content: center;
            }
            div:nth-child(2){
              width: calc(100% - 84px);
              height: 100%;
              float: left;
              padding-right: 20px;
              p:nth-child(1){
                font-size: 14px;
                font-weight: bold;
                line-height: 56px;
              }
              p:nth-child(2){
               line-height: 20px;
                color: #666;
              }
            }
          }
          &>div:nth-child(2){
            height: 44px;
            background-color: rgba(247, 249, 250, 1);
            display: flex;
            align-items: center;
            span{
              width: 100%;
              height: 16px;
              color: #666;
              font-size: 12px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              &:nth-child(1){
                border-right:1px solid #dcdfe6 ;
              }
            }
          }
        }
      }
    }
    .more{
      width:180px ;
      height: 30px;
      margin: 30px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      cursor: pointer;
    }
  }
</style>
