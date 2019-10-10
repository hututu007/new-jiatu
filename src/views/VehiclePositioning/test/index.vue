<template>
  <div class="test app-container">
    <div class="top">
      <div class="total">
        <div>
          <img id="count" src="../../../assets/images/gpsImg/u11747.png"/>
          <div class="leftNum">{{countNum}}</div>
          <div class="rightNum">
            <p><span>发现一项问题</span><span>取消</span></p>
            <p class="pro">
              <el-progress :show-text="false" :stroke-width="10" :percentage="50"
                           color="rgba(255, 51, 0, 1)"></el-progress>
            </p>
            <p>正在扫描：检测车辆故障信息...</p>
          </div>
        </div>
        <div @click="makeSafe">全面体检</div>
      </div>
    </div>
    <div class="bot">
      <img id="loading" src="../../../assets/images/gpsImg/loding.png"/>
      <ul>
        <li class="out" v-for="item in Data" :key="item.name">
          <p><span>{{item.name}}</span><span>{{item.dsc}}</span><img :src="downImg"></p>
          <ul>
            <li class="inner" v-for="items in item.wrongList" :key="items.license">
              <p>{{items.license}}</p>
              <p>详情</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        countNum:0,
        downImg: require('../../../assets/images/gpsImg/u11788.png'),
        Data:[
          {name:'车辆故障',dsc:'全面检测车辆故障信息，提高行驶安全',
            wrongList:[
              {license:'渝DBB800'},
              {license:'渝DBB801'},
              {license:'渝DBB802'}
            ]
          },
          {name:'汽车蓄电池',dsc:'检测车辆蓄电池，避免电量过低无法启动车辆',
            wrongList:[
              {license:'渝DBB800'},
              {license:'渝DBB801'},
              {license:'渝DBB802'}
            ]
          },
        ],
        timer:''
      }
    },
    beforeDestroy(){
      clearInterval(this.timer)
    },
    mounted(){
      this.timer=setInterval(()=>{
        this.countNum++
        if(this.countNum>84){
          clearInterval(this.timer)
        }
      },100)

    },
    methods: {
      makeSafe() {
        var n = 0;
        setInterval(()=>{
          n++;
          var deg = 30*n;
          if(n>12){
            console.log(111)
            n=1
          }
          document.getElementById('count').style.transform="rotate("+deg+"deg)";
          document.getElementById('loading').style.transform="rotate("+deg+"deg)";

        },100)

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .test {
    .rotateCount{
      transition: all 0.1s ease;
    }
    .top {
      color: white;
      font-size: 14px;
      width: 100%;
      height: 420px;
      background: url("../../../assets/images/gpsImg/u11725.jpg") 0% 0%/100% 100%;
      padding-top: 90px;
      padding-left: 200px;
      .total {
        width: 480px;
        height: 300px;
        position: relative;
        & > div:first-child {
          width: 100%;
          float: left;
          display: flex;
          align-items: center;
          #count {
            position: absolute;
            width: 84px;
            height: 84px;
            transform-origin:50% 50%;/*定义动画的旋转中心点*/
            top: 14px;
            left: 0px;
          }
          .leftNum {
            width: 88px;
            height: 86px;
            color: #ff5a28;
            font-size: 28px;
            text-align: center;
            line-height: 86px;
            margin-right: 15px;
          }
          .rightNum {
            width: 390px;
            p {
              margin-bottom: 10px;
            }
            & > p:first-child {
              margin-bottom: 30px;
              span:nth-child(1) {
                font-size: 28px;
                font-weight: bold;
                margin-right: 30px;
              }
              span:nth-child(2) {
                padding: 2px 10px;
                background: white;
                cursor: pointer;
                color: #666;
                border-radius: 10px;
                height: 20px;
              }
            }
            & > p:last-child {

            }
          }
        }
        & > div:last-child {
          font-size: 20px;
          font-weight: bold;
          width: 144px;
          height: 50px;
          float: left;
          cursor: pointer;
          border-radius: 4px;
          text-align: center;
          line-height: 50px;
          margin-top: 50px;
          background-color: rgba(19, 231, 134, 1);
        }
      }
    }
    .bot {
      width: 100%;
      padding: 60px;
      overflow: hidden;
      position: relative;
      #loading {
        position: absolute;
        left: 16px;
        top: 50px;
        transform-origin:50% 50%;/*定义动画的旋转中心点*/
      }
      ul > .out {
        overflow: hidden;
        margin-bottom: 20px;
        & > p {
          width: 100%;
          height: 28px;
          span:first-child {
            width: 130px;
            color: #666;
            float: left;
            font-size: 14px;
          }
          span:nth-child(2) {
            color: #999;
            width: 300px;
            font-size: 12px;
            float: left;
          }
          img {
            cursor: pointer;
          }
        }
        .inner {
          float: left;
          margin-right: 20px;
          width: 122px;
          p:first-child {
            width: 100%;
            height: 45px;
            font-size: 20px;
            color: white;
            text-align: center;
            line-height: 45px;
            background: url("../../../assets/images/gpsImg/unffgfgf.png") 0% 0%/100% 100% no-repeat;
          }
          p:last-child {
            width: 100%;
            height: 30px;
            text-align: center;
            line-height: 30px;
            color: white;
            font-size: 14px;
            cursor: pointer;
            margin-top: 10px;
            border-radius: 4px;
            background-color: rgba(255, 126, 0, 1);
          }
        }
      }
    }
  }
</style>
