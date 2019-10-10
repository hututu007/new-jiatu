<template>
  <div class="schedule">
    <div class="schedule-head">
      <div>
        <el-radio-group v-model="value" style="margin-bottom: 30px;">
          <el-radio-button label="day">日</el-radio-button>
          <el-radio-button label="week">周</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
        </el-radio-group>
        <span>今天</span>
      </div>
      <p>2018年3月</p>
    </div>00
    <p style="width: 100%;height: 20px;background-color:#e8f1f9 "></p>
    <div class="schedule-main">
      <div class="week">
        <ul>
          <li>日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
        </ul>
      </div>
      <div class="day">
        <ul>
          <li v-for="(item, index) in oneMonthList" :key="index" :class="{grayClass:(activeIndex.indexOf(item)>-1 && index<activeIndex.length)}">
            <!--:class="{grayClass:index>actieindex}"-->
            <!--grayClass | dayCut(index, oneMonthList)-->
            <p><span :class="{greenClass:index===currentIndex[currentIndex.length-1]}">{{item}}</span></p>
            <ul>
              <li><span>早班班车</span><span>12:00凌晨</span></li>
              <li><span>晚班班车</span><span>6:00晚上</span></li>
            </ul>
          </li>

        </ul>
      </div>

    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { dayCut } from "./filters"
  export default {
    name: "schedule",
    data() {
      return {
        value: '',
        daysArr:[[], [], [], [], [], []], // 6*7的日历数组
        oneMonthList:[],
        activeIndex:[],
        currentIndex:[],
      }
    },
    mounted(){
      this.monthDay(new Date())
    },
    methods:{
      monthDay(date) {
        const currentWeekday = moment(date).date(1).weekday(); // 获取当月1日为星期几
        const lastMonthDays = moment(date).subtract(1, 'month').daysInMonth(); // 获取上月天数
        const currentMonthDays = moment(date).daysInMonth(); // 获取当月天数
        const getDay = day => (day <= lastMonthDays ? day : (day <= (lastMonthDays + currentMonthDays)) ? day - lastMonthDays : day - (lastMonthDays + currentMonthDays)); // 日期处理
        for (let i = 0; i < 7; i += 1) {
          let virtualDay = (lastMonthDays - currentWeekday+1) + i;
          for (let j = 0; j < 6; j += 1) {
            this.daysArr[j][i] = getDay(virtualDay + (j * 7));
          }
        }
        let one = 0
        for(var m=0;m<this.daysArr.length;m++){
          for(var n=0;n<this.daysArr[m].length;n++){
            if(this.daysArr[m][n]===1){
              this.oneMonthList.push(this.daysArr[m][n])
              one++
              if(one===2){
                this.oneMonthList.pop()
                break
              }
            }else{
              this.oneMonthList.push(this.daysArr[m][n])
            }
          }
        }
        for(var i=0;i<this.oneMonthList.length;i++){
          if(this.oneMonthList[i]===1){
            break
          }else {
            this.activeIndex.push(this.oneMonthList[i])
          }
        }
        for(var k=0;k<this.oneMonthList.length;k++){
          if(this.oneMonthList[k]===moment().date()){
            this.currentIndex.push(k)
          }
        }
      }
    }
  }
</script>

<style lang="less">
  .schedule {
    width: 100%;
    .schedule-head {
      width: 100%;
      height: 50px;
      background-color: white;
      border-bottom: 1px solid #eff3f8;
      position: relative;
      & > p {
        width: 100%;
        height: 100%;
        font-size: 22px;
        font-weight: bold;
        color: #666;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      & > div {
        position: absolute;
        width: 236px;
        height: 30px;
        left: 20px;
        top: 10px;
        .el-radio-group{
          height: 30px;
          float: left;
          .el-radio-button__inner{
            height: 30px;
            line-height: 30px;
            padding:0px 20px ;
          }
        }
        &>span{
          margin-left: 20px;
          margin-top: 4px;
          padding: 3px 10px;
          float: left;
          background-color:#409EFF;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
    .schedule-main{
      background-color: white;
      .week{
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #eff3f8;
        ul{
          width: 100%;
          height: 100%;
          li{
            float: left;
            width: 14.285%;
            height: 100%;
            background-color: #dfefff;
            border: 1px solid #eff3f8;
            font-size: 14px;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .day{
        width: 100%;
        overflow: hidden;
        &>ul{
          width: 100%;
          overflow: hidden;
          &>li{
            width:14.285%;
            height:164px;
            border: 1px solid #eff3f8;
            float: left;
            &>p{
              width: 100%;
              height: 30px;
              padding-left: 10px;
              text-align: left;
              span{
                font-size: 12px;
                line-height: 30px;
                color: #666;
              }
            }
            &>ul{
              width: 100%;
              overflow: hidden;
              padding: 0px 2px;
              li{
                width: 100%;
                height:24px;
                padding: 0px 5px;
                border-radius: 5px;
                margin-bottom: 2px;
                background-color:#dfefff;
                span:nth-child(1){
                  float: left;
                  font-size: 12px;
                  color: #5e71a2;
                  line-height: 24px;
                }
                span:nth-child(2){
                  float: right;
                  font-size: 12px;
                  line-height: 24px;
                  color: #5e71a2;
                }
              }
            }
          }
        }
      }
    }
    .grayClass{
      background-color: #f9f7f7;
    }
    .greenClass{
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-color: #55a8fd;
      color: white!important;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
