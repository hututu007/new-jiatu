<template>
  <div class="app-container aboutMe">
    <div class="banner">
      <div>
        <p class="animated fadeInDown">拥抱协作，持续创新</p>
        <p class="animated fadeInLeftBig">协作，创造无限可能</p>
      </div>
    </div>
    <div class="me">
      <div>
        <p class="animated fadeInDown">关于我们</p>
        <p class="animated fadeInRightBig">深圳中兴驾图科技有限公司成立于2016年，专注于车联网大数据运营的高新科技公司。聚集了众多知名物联网、
          车联网行业专家，借助先进的物联网、大数据以及云计算等技术，
          面向城市管理者提供智慧城市建设、城市动态安全数据监控、网约车监管、
          公务用车管理等成熟的解决方案，同时也面向公众提供安全、
          便捷、经济的场景化服务。通过持续有效的数据运营，
          提升城市管理效率以及公众生活质量，助力智慧城市建设、管理和发展，打造新型车联网生态圈。</p>
      </div>
    </div>
    <div class="wish">
      <div>
        <p class="animated fadeInUp">愿景</p>
        <p class="animated fadeInLeft">成为⼀家拥抱变化、持续创新的好公司</p>
      </div>
    </div>
    <div class="work">
      <div>
        <p class="animated fadeInUp">使命</p>
        <p class="animated fadeInRight">协助更多企业和车队实现智能管理的目标</p>
        <p><img src="../../../static/img/me0.png" /></p>
      </div>
    </div>
    <div class="place">
      <div>
        <p>联系我们</p>
        <p>我们随时为您优质售后服务</p>
      </div>
      <div>
        <div>
          <p>重庆</p>
          <p>重庆市渝北区洪湖西路驾图大厦12楼</p>
          <p>023-63085677 （周一至周日 8:00 ~ 20:00）</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {},
    data() {
      return {
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .aboutMe{
    &>div{
      width: 100%;
    }
    .banner{
      height: 430px;
      background: url("../../../static/img/me3.jpg") 0% 0%/100% 100%;
      padding-top: 110px;
      div{
        width: 100%;
        text-align: center;
        color: white;
        p:nth-child(1){
          font-size: 48px;
          line-height: 110px;
          font-weight: 200;
        }
        p:nth-child(2){
          font-size: 18px;
        }
      }
    }
    .me{
      height: 528px;
      padding-top: 140px;
      div{
        width: 100%;
        text-align: center;
        color: #333;
        p:nth-child(1){
          font-size: 48px;
          line-height: 110px;
          font-weight: 200;
        }
        p:nth-child(2){
          width: 750px;
          height: 156px;
          line-height: 24px;
          margin: 0 auto;
          font-size: 16px;
        }
      }
    }
    .wish{
      height: 226px;
      background: url("../../../static/img/me1.jpg") 0% 0%/100% 100%;
      padding-top: 32px;
      div{
        width: 100%;
        text-align: center;
        color: white;
        p:nth-child(1){
          font-size: 48px;
          line-height: 110px;
          font-weight: 200;
        }
        p:nth-child(2){
          font-size: 18px;
        }
      }
    }
    .work{
      height: 600px;
      div{
        width: 100%;
        text-align: center;
        p:nth-child(1){
          font-size: 48px;
          line-height: 200px;
          font-weight: 200;
        }
        p:nth-child(2){
          font-size: 18px;
        }
        p:nth-child(3){
          width: 750px;
          height: 350px;
          margin: 50px auto;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .place{
      text-align: center;
      padding: 60px 0px;
      div:nth-child(1){
        width: 100%;
        p:nth-child(1){
          font-size: 48px;
          line-height: 150px;
          font-weight: 200;
        }
        p:nth-child(2){
          font-size: 18px;
        }
      }
      div:nth-child(2){
        width: 750px;
        height: 350px;
        background: url("../../../static/img/me2.jpg") 0% 0%/100% 100%;
        margin: 60px auto;
        display: flex;
        justify-content: center;
        align-items: center;
        div{
          width:430px ;
          height:215px ;
          background-color: white;
          box-shadow: 0 4px 20px rgba(0,0,0,.15);
          border-radius: 4px;
          text-align: left;
          padding-left: 30px;
          p:nth-child(1){
            font-size: 20px;
            font-weight: bold;
            line-height: 50px;
            margin-top: 38px;
          }
          p:nth-child(2){
            font-size: 16px;
            line-height: 50px;
          }
          p:nth-child(2){
            font-size: 16px;
            line-height: 50px;
          }
        }
      }
    }
  }
</style>

