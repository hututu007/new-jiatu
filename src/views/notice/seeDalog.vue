<template>
  <div class="notice-view">
    <div class="notice-tit">
      <ul>
        <li><p><i class="el-icon-share" style="margin-right:28px"></i>深圳中兴驾图-车辆综合管理平台</p> <p>{{'发布时间：'+val.createTime}}</p></li>
        <li><p>{{'来自：'+val.creater}}</p></li>
        <li><p>{{'标题：'+val.title}}</p></li>
      </ul>
    </div>
    <div class="notice-main">
      <div v-html="content">

      </div>
      <!--<ul>-->
        <!--<li>-->
          <!--<p><img src="../../../assets/images/wenang.png"/> </p>-->
          <!--<p>云雀2.3 正式发布</p>-->
          <!--<p>这次更新的意义，比如“这不单单是设计文件管理或文档管理的功能优化，这更是友好的在线协作的开始。</p>-->
        <!--</li>-->
      <!--</ul>-->
    </div>
  </div>
</template>

<script>
  export default {
    props:['content','val'],
    data(){
      return{

      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .notice-view{
    .notice-tit{
      height: 160px;
      padding:25px ;
      ul>li{
        height: 34px;
        line-height: 34px;
        p{
          font-size: 14px;
        }
      }
      ul>li:nth-child(1)>p:nth-child(1){
        float: left;
        display: inline-block;
      }
      ul>li:nth-child(1)>p:nth-child(2){
        float: right;
        display: inline-block;
      }
    }
    .notice-main{
      margin: 0 auto;
      border-top: 1px dashed rgb(220, 231, 238);
      padding: 40px 0px;
      text-align: center;
      /*ul>li{*/
        /*margin-bottom: 40px;*/
      /*}*/
      /*ul>li>p{*/
        /*margin-bottom: 20px;*/
      /*}*/

    }
  }
</style>
