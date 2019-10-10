<template>
    <div class="app-container microServices">
        <jt-title :titData="carFaultTitData"></jt-title>
        <div class="app-main">
            <p class="introduce">方案介绍：中兴驾图解决方案服务平台，制作多项微服务产品体系，<br/>构建智能多样化服务生态，提供跨越设计与开发的体验解决方案。<br/><br/></p>
            <ul class="item" >
                <li>
                    <div class="images_box">
                        <img src="@/assets/images/feed2.png" width="100%">
                    </div>
                    <div style="flex: 1;margin-left:20px;">
                        <p class="title">短信服务</p>
                        <p class="out_p3 details">短信服务（Short Message Service）是阿里云为用户提供的一种通信服务的能力，支持快速发送短信验证码、短信</p>
                    </div>
                    <div class="bottom">
                        <ul class="content_box">
                            <li>
                                <router-link to="/microServices/details" style="width:100%; height:100%;">了解详情</router-link>
                            </li>
                            <li>停用</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div class="images_box">
                        <img src="@/assets/images/feed2.png" width="100%">
                    </div>
                    <div style="flex: 1;margin-left:20px;">
                        <p class="title">短信服务</p>
                        <p class="out_p3 details">短信服务（Short Message Service）是阿里云为用户提供的一种通信服务的能力，支持快速发送短信验证码、短信</p>
                    </div>
                    <div class="bottom">
                        <ul class="content_box">
                            <li>了解详情</li>
                            <li>停用</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div class="images_box">
                        <img src="@/assets/images/feed2.png" width="100%">
                    </div>
                    <div style="flex: 1;margin-left:20px;">
                        <p class="title">短信服务</p>
                        <p class="out_p3 details">短信服务（Short Message Service）是阿里云为用户提供的一种通信服务的能力，支持快速发送短信验证码、短信，支持快速发送短信验证码、短信，支持快速发送短信验证码、短信，支持快速发送短信验证码、短信</p>
                        
                    </div>
                    <div class="bottom">
                        <ul class="content_box">
                            <li>了解详情</li>
                            <li>停用</li>
                        </ul>
                    </div>
                </li>
                <li>
                    <div class="images_box">
                        <img src="@/assets/images/feed2.png" width="100%">
                    </div>
                    <div style="flex: 1;margin-left:20px;">
                        <p class="title">短信服务</p>
                        <p class="out_p3 details">短信服务（Short Message Service）是阿里云为用户提供的一种通信服务的能力，支持快速发送短信验证码、短信，支持快速发送短信验证码、短信，支持快速发送短信验证码、短信，支持快速发送短信验证码、短信</p>
                        
                    </div>
                    <div class="bottom">
                        <ul class="content_box">
                            <li>了解详情</li>
                            <li>停用</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div> 
</template>

<script>
import JtTitle from '@/components/JtTitle'

export default {
  name: 'microServices',
  components: {
    JtTitle
  },
  data() {
    return {
      carFaultTitData: {
        typeName: 0,
        name: '平台微服务应用方案',
        img: '',
        fucName: '',
        fuc: 0,
      },
    }
  }
}
</script>

<style lang="scss" scoped >
.microServices {
    min-height: 800px;
    .app-main {
        padding: 20px;
        .introduce {
            font-size: 14px;
            line-height: 20px;
            color: #666666;
            margin: 20px 0;
        }
        .item {
            display: flex;
            max-width: 1200px;
            flex-wrap: wrap;

        }
        .item>li {
            width: 360px;
            height: 180px;
            border: 1px solid rgba(233, 233, 233, 1);
            display: flex;
            padding: 20px;
            margin-right: 30px;
            position: relative;
            margin-bottom: 30px;
        }
        .item .images_box {
            overflow: hidden;
            width: 48px;
            height: 48px;
        }
        .item .title{
            font-weight: bold;
            margin-bottom: 20px;
        }
        .item .details {
            font-size: 14px;
            color: #666666;
            line-height: 20px;
        }
        .item .bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 48px;
            border-top: 1px solid rgba(233, 233, 233, 1);
            background: rgba(247, 249, 250, 1);
            .content_box {
                display: flex;
                height: 100%;
                align-items:center;
                li {
                    width: 50%;
                    text-align: center;
                    font-size: 14px;
                    color: #666666;
                }
            }
            .content_box  :last-child {
                border-left: 1px solid rgba(233, 233, 233, 1)
            }
        }
    }
}
</style>

