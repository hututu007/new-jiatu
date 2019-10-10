<template>
  <div id="target" class="target">
    <el-container>
      <el-header>
        <el-row class="header" v-loading="loading.loadingOne">
          <el-col :span="2.5" style="margin-top: 28px;">
            <div class="distencetarget">
              <el-progress type="circle" :stroke-width="12" :width="100" :percentage="jmb"></el-progress>
              <p style="font-size: 12px;color: #666;position: absolute;top: 55px;left: 52px">距目标</p>
            </div>
          </el-col>
          <el-col :span="6" style="margin-top: 28px;">
            <div class="propsal">
              <p style="color: #666;font-size: 14px;font-weight: bold">决策管理建议：</p>
              <ul class="orgName">
                <li><img src="../../../assets/images/lightning.png"/><span>驾驶行为管控加大。</span></li>
                <li><img src="../../../assets/images/lightning.png"/><span>费用使用情况正常，请保持</span></li>
                <li><img src="../../../assets/images/lightning.png"/><span>车辆使用率偏低，加大分配</span></li>
              </ul>
            </div>
          </el-col>
          <el-col :span="13" class="grid">
            <div>
              <span>费用预期目标（元）</span>
              <p>{{infoDta.fyCount}}</p>

            </div>
            <div>
              <span>整体驾驶安全评测（分）</span>
              <p>{{infoDta.jsaqCount}}</p>
            </div>
            <div>
              <span>车辆使用率分析</span>
              <p>{{infoDta.sylCount}}</p>
            </div>
          </el-col>
          <el-col :span="2.5">
              <el-button  type="primary" plain style="margin-top:70px;" size='mini' @click="dialogShow=true">预期设置</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="main-text">
        <el-row :gutter="30" class="main-sort">
          <el-col :span="18" class="main-sortl carEchart" v-loading="loading.loadingTwo">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
            <div style="position: relative;overflow: hidden;padding-bottom: 35px">
              <jt-title :titData="allData.TitData">
                <div slot="tabsRight">
                  <el-tabs v-model="feeTarget" @tab-click="handleClick">
                    <el-tab-pane label="本月" name=""></el-tab-pane>
                    <el-tab-pane label="上月" name=""></el-tab-pane>
                  </el-tabs>
                </div>
              </jt-title>
              <div class="dateEchart">
                <div class="swiperBox">
                  <div class="swiper-container " id="swiper">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide"  v-for="(item,index) in swiperData" :key="item.id" :class="{activeS:item.id===swiperIndex}" @click="swiperClick(item.id)">
                        <div style="width: 155px;height: 100%;margin: 0 auto;">
                          <p>
                            <span>{{item.name}}</span>
                            <span>{{item.value+'%'}}</span>
                          </p>
                          <el-progress color="#71d189" type="circle" :stroke-width="10" :width="50" :percentage="item.value"></el-progress>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-button-next"></div>
                </div>
                <div id="echartOne"></div>
              </div>
            </div>
          </div></el-col>
          <el-col :span="6" class="main-sortr one"><div class="grid-content" style="width: 100%;overflow: hidden">
            <el-row>
              <el-col style="background-color: white" v-loading="loading.loadingThree">
                <div class="underline">
                  <jt-title :titData="allData.oneTitData"></jt-title>
                  <div class="oneMain">
                    <p>目标评估</p>
                    <p :class="Obj2.mbpg==='正常'?'active1':''">{{Obj2.mbpg}}</p>
                    <div id="echartTwo">
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col style="margin-top: 30px;background-color: white" v-loading="loading.loadingFour">
                <div class="underline">
                  <jt-title :titData="allData.oneTitData1"></jt-title>
                  <div id="echartThree">

                  </div>
                </div>
              </el-col>
            </el-row>
          </div></el-col>
        </el-row>
        <el-row :gutter="30" class="main-sort">
          <el-col :span="18" class="main-sortl two" v-loading="loading.loadingFive"><div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
            <div class="underline">
              <jt-title :titData="allData.twoTitData"></jt-title>
              <div id="progress" style="width: 100%;">
                <ul>
                  <li>
                    <el-progress type="circle" color="#90b8f4" :stroke-width="12" :width="100"
                                 :percentage="Obj3[0]"></el-progress>
                    <p style="font-size: 12px;color: #666;position: absolute;top: 60px;left:42%">急加速</p>
                  </li>
                  <li>
                    <el-progress type="circle" color="#feb57f" :stroke-width="12" :width="100"
                                 :percentage="Obj3[1]"></el-progress>
                    <p style="font-size: 12px;color: #666;position: absolute;top: 60px;left:42%">急转弯</p>
                  </li>
                  <li>
                    <el-progress type="circle" color="#71d189" :stroke-width="12" :width="100"
                                 :percentage="Obj3[2]"></el-progress>
                    <p style="font-size: 12px;color: #666;position: absolute;top: 60px;left: 42%">急刹车</p>
                  </li>
                  <li>
                    <el-progress type="circle" color="#ff6c60" :stroke-width="12" :width="100"
                                 :percentage="Obj3[3]"></el-progress>
                    <p style="font-size: 12px;color: #666;position: absolute;top: 60px;left:44%">超速</p>
                  </li>
                </ul>

              </div>
            </div>
          </div></el-col>
          <el-col :span="6" class="main-sortr three" v-loading="loading.loadingSix"><div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
            <div class="underline">
              <jt-title :titData="allData.threeTitData"></jt-title>
              <div id="echartFour"></div>
            </div>
          </div></el-col>
        </el-row>
      </el-main>
      <jt-dialog
        :dialog-show.sync="dialogShow"
        title="预期值设置"
        width="550px"
      >
      <expect  slot="dialog" :Form="Form" @submitForm="submitForm" @closeDialog="closeDialog"></expect>
      </jt-dialog>
    </el-container>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import echartsLiquidfill from 'echarts-liquidfill'
  import JtDialog from '@/components/JtDialog'
  import expect from './expect'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'

  export default {
    name: "workEchart",
    components: {JtTitle, JtDialog, expect},
    data() {
      return {
        dialogShow: false,
        feeTarget: '',
        jmb:0,
        Form: {
          fyExpectedvalue: '',
          jsaqExpectedvalue:'',
          clsylExpectedvalue:''
        },
        loading: {
          loadingOne: true,
          loadingTwo: true,
          loadingThree: true,
          loadingFour: true,
          loadingFive: true,
          loadingSix: true,
        },
        infoDta:{
          num:null,
          fyCount:null,
          jsaqCount:null,
          sylCount:null
        },
        allData: {
          TitData: {
            typeName: 0,
            name: '费用预期目标',
            img: '',
            fucName: '',
            fuc: 1
          },
          oneTitData: {
            typeName: 0,
            name: '管理费用预测',
            img: '',
            fucName: '',
            fuc: 0
          },
          oneTitData1: {
            typeName: 0,
            name: '整体驾驶安全评测',
            img: '',
            fucName: '',
            fuc: 0
          },
          twoTitData: {
            typeName: 0,
            name: '各类三急占比',
            img: '',
            fucName: '',
            fuc: 0
          },
          threeTitData: {
            typeName: 0,
            name: '车辆使用率',
            img: '',
            fucName: '',
            fuc: 0
          }
        },
        isActive: 0,
        swiperIndex:null,
        fastData: [
          {name: '目标管理'},
          {name: '运营分析'},
          {name: '工作台'},
          {name: '车辆定位'},
          {name: '消息提醒框'},
          {name: '调度概览'},
          {name: '日常管理'}
        ],
        swiperObj:{},
        swiperData:[
          {name:'燃油费占比',value:0,id:0},
          // {name:'维保费占比',value:78,id:1},
          {name:'保险费占比',value:0,id:2},
          {name:'年检费占比',value:0,id:3},
          {name:'保养费占比',value:0,id:4},
        ],
        myChart1:'',
        myChart2:'',
        myChart3:'',
        myChart4:'',
        Obj1:{},
        Obj2:{},
        Obj3:[0,0,0,0],
        num1:null,
        num2:null
      }
    },
    mounted() {
       this.yqszFuc() // 预期设置数据
       this.topFuc()  // 顶部数据展示
       this.fyyqFuc() //费用预期目标
       this.gfFuc() //管理费用预测
       this.aqFuc() // 整体安全评测
       this.sjFuc() //各类三急占比
       this.clsyFuc() //车辆使用
      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView : 'auto',
        spaceBetween : 20,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        loop:false
      })
      setTimeout(()=>{
        this.$nextTick(()=>{
          let _this=this
          window.addEventListener('resize',function(){
            _this.myChart1.resize()
            _this.myChart2.resize()
            _this.myChart3.resize()
          })
        })
      },0)


    },
    methods: {
      /** 头部 **/
      topFuc() {
        this.getData('mbgl/topCount', 'post').then((res) => {
          this.infoDta=res.data
          this.jmb=parseInt(res.data.jmb.split('%')[0])
          this.loading.loadingOne=false
        })
      },
      /** 预期设置 **/
      yqszFuc(){
        this.getData('targetExpected/getCurrent', 'post').then((res) => {
          if(res.data.id){
            this.Form={
              fyExpectedvalue:res.data.fyExpectedvalue,
              jsaqExpectedvalue:res.data.jsaqExpectedvalue,
              clsylExpectedvalue:res.data.clsylExpectedvalue,
              id:res.data.id
            }
          }
        })
      },
      /** 费用预期目标 **/
      fyyqFuc(){
        // -占比
        this.getData('mbgl/fyyqmbCount', 'post').then((res) => {
          if(res.data){
            this.swiperObj=res.data
            this.swiperData[0].value=parseInt(res.data.curentMonth[3].oilresult.replace("%",""))
            this.swiperData[1].value=parseInt(res.data.curentMonth[0].insureCount.replace("%",""))
            this.swiperData[2].value=parseInt(res.data.curentMonth[2].surveyresult.replace("%",""))
            this.swiperData[3].value=parseInt(res.data.curentMonth[1].upkeepresult.replace("%",""))

          }

        })
        // -图标
        this.getData('mbgl/getfyyqmbChart', 'post',{type:1}).then((res) => {
          console.log(res)
          this.Obj1=res.data
          if(res.data.fyExpectedvalue===null||res.data.fyExpectedvalue==='null'){
            res.data.fyExpectedvalue=0
            this.$confirm('请先进行预期设置', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            })
          }
          var date=[]
          var list=[]
          var list1=[]
          for(var i=0;i<res.data.valueList.length;i++){
            list1.push(res.data.fyExpectedvalue)
            for(var key in res.data.valueList[i]){
              date.push(key.split('-')[2])
              list.push(res.data.valueList[i][key])
            }
          }
          this.drawLine(date,list,list1)
          this.loading.loadingTwo=false
        })

      },

      /** 管理费用预测 **/
      gfFuc(){
        this.getData('mbgl/glfyycChart', 'post').then((res) => {

          this.Obj2=res.data
          var date=[]
          var list=[]
          for(var i=0;i<res.data.valueList.length;i++){
            for(var key in res.data.valueList[i]){
              date.push(key)
              list.push(res.data.valueList[i][key])
            }
          }
          this.myChart2 = this.$echarts.init(document.getElementById('echartTwo'))
          this.myChart2.setOption({
            color: ['#379efd'],
            grid: {
              x: 30,
              y: 10,
              x2: 10,
              y2: 5,
              borderWidth: 2
            },
            xAxis: {
              show:false,
              type: 'category',
              boundaryGap: false,
              axisTick: {
                show: false
              },
              data: date
            },
            yAxis: {
              type: 'value',
              splitNumber: 3,
              axisTick: {
                show: false
              },
              axisLine:{
                show:false
              },
              splitLine: {
                show: true,
                lineStyle:{
                  type:'dashed'
                }
              }

            },
            series: [{
              data: list,
              type: 'line',
              smooth: true,
              areaStyle: {
                color: '#c0eafc'
              }
            }]
          })
          this.loading.loadingThree=false
        })
      },
      /** 整体安全评测 **/
      aqFuc(){
        this.getData('mbgl/jsaqpcCount', 'post').then((res) => {
          this.loading.loadingFour=false
          this.num1=res.data.jsaqCount
          var colorList=[]
          for(var i=0;i<100;i++){
            if(i>this.num1){
              colorList.push(
                [i/100,'#f0f2f5']
              )
            }else{
              colorList.push(
                [i/100,'#379efd']
              )
            }
          }
          // 仪表盘图
          this.myChart3 = this.$echarts.init(document.getElementById('echartThree'))
          this.myChart3.setOption({
            tooltip: {
              formatter: "{a} <br/>{b} : {c}%"
            },
            axisLabel: {
              formatter: function (e) {
                switch (e + "") {
                  case "10":
                    return "";
                  case "20":
                    return "差";
                  case "30":
                    return "";
                  case "40":
                    return "中";
                  case "50":
                    return "";
                  case "60":
                    return "良";
                  case "70":
                    return "";
                  case "80":
                    return "优";
                  case "90":
                    return "";
                  case "100":
                    return "";
                  default:
                    return "";
                }
              },
              textStyle: {       // 属性lineStyle控制线条样式
                color: '#379efd'
              }
            },
            series: [
              {
                name: '安全评分',
                type: 'gauge',
                axisLine: {            // 坐标轴线 f0f2f5 379efd
                  lineStyle: {       // 属性lineStyle控制线条样式
                    color: colorList,
                    width: 10
                  }
                },
                splitLine: {           // 分隔线
                  length: 20,         // 属性length控制线长
                  lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#379efd',
                    shadowColor: '#fff',//默认透明
                  }
                },
                axisTick: {
                  length: 0
                },
                pointer: {           // 分隔线
                  shadowColor: '#fff',//默认透明
                  length: '40%',
                },
                title: {
                  offsetCenter: [0, '40%'],
                  textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#666',
                    fontSize: 12
                  }
                },
                detail: {
                  offsetCenter: [0, '70%'],
                  textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#324e80',
                    marginTop: 20,
                  }
                },
                data: [{
                  value:this.num1,
                  name: '安全评分',
                }]
              }
            ]
          })
        })

      },
      /** 各类三急占比**/
      sjFuc(){
        this.getData('mbgl/sjCount', 'post').then((res) => {
         this.Obj3=[parseInt(res.data.jijiansu.split('%')[0]),parseInt(res.data.jzw.split('%')[0]),
           parseInt(res.data.jijiansu.split('%')[0]),parseInt(res.data.cs.split('%')[0])]
          this.loading.loadingFive=false
        })
      },
      /** 车辆使用率**/
      clsyFuc(){
        this.getData('mbgl/sylCount', 'post').then((res) => {
          var str=res.data.sylCount.replace("%","");
          this.num2=str/100
          this.myChart4 = this.$echarts.init(document.getElementById('echartFour'))
          this.myChart4.setOption({
            series: [{
              type: 'liquidFill',
              data: [{
                value: this.num2,
                itemStyle: {
                  normal: { //正常样式
                    color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#77c6ff'
                    }, {
                      offset: 1,
                      color: '#2296ff'
                    }]),
                    opacity: 1
                  }
                },
              }
              ],
              radius: '90%',
              outline: {
                show: false
              },
              backgroundStyle: {
                borderColor: '#156ACF',
                borderWidth: 1,
                color: '#fff'
              },
              itemStyle: {
                shadowBlur: 0,//波浪的阴影范围
              },
              label: {
                normal: {
                  position: ['50%', '20%'],
                  formatter: function () {
                    // return 'ECharts\nLiquid Fill';
                  },
                  textStyle: {
                    fontSize: 24,
                    color: '#324e80'
                  }
                }
              }
            }]
          })
          this.loading.loadingSix=false
        })

      },
      /** swiper点击 **/
      swiperClick(index){
        this.swiperIndex=index
      },
      /** 本月上月切换 **/
      handleClick(val) {
        if(val.index==='0'){
          this.getData('mbgl/getfyyqmbChart', 'post',{type:1}).then((res) => {
            console.log(res)
            this.Obj1=res.data
            if(res.data.fyExpectedvalue===null||res.data.fyExpectedvalue==='null'){
              res.data.fyExpectedvalue=0
              this.$confirm('请先进行预期设置', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              })
            }
            var date=[]
            var list=[]
            var list1=[]
            for(var i=0;i<res.data.valueList.length;i++){
              list1.push(res.data.fyExpectedvalue)
              for(var key in res.data.valueList[i]){
                date.push(key.split('-')[2])
                list.push(res.data.valueList[i][key])
              }
            }
            this.drawLine(date,list,list1)
            this.loading.loadingTwo=false
          })
          this.swiperData[0].value= parseInt(this.swiperObj.curentMonth[3].oilresult.replace("%",""))
          this.swiperData[1].value= parseInt(this.swiperObj.curentMonth[0].insureCount.replace("%",""))
          this.swiperData[2].value= parseInt(this.swiperObj.curentMonth[2].surveyresult.replace("%",""))
          this.swiperData[3].value= parseInt(this.swiperObj.curentMonth[1].upkeepresult.replace("%",""))
        }else if(val.index==='1'){
          // -图标
          this.getData('mbgl/getfyyqmbChart', 'post',{type:2}).then((res) => {
            console.log(res)
            this.Obj1=res.data
            if(res.data.fyExpectedvalue===null||res.data.fyExpectedvalue==='null'){
              res.data.fyExpectedvalue=0
              this.$confirm('请先进行预期设置', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              })
            }
            var date=[]
            var list=[]
            var list1=[]
            for(var i=0;i<res.data.valueList.length;i++){
              list1.push(res.data.fyExpectedvalue)
              for(var key in res.data.valueList[i]){
                date.push(key.split('-')[2])
                list.push(res.data.valueList[i][key])
              }
            }
            this.drawLine(date,list,list1)
            this.loading.loadingTwo=false
          })
          this.swiperData[0].value= parseInt(this.swiperObj.lastMonth[3].lm_oilresult.replace("%",""))
          this.swiperData[1].value= parseInt(this.swiperObj.lastMonth[0].lm_insureCount.replace("%",""))
          this.swiperData[2].value= parseInt(this.swiperObj.lastMonth[2].lm_surveyresult.replace("%",""))
          this.swiperData[3].value= parseInt(this.swiperObj.lastMonth[1].lm_upkeepresult.replace("%",""))

        }
      },
      /** 图形初始化 **/
      drawLine(date,list,list1) {
        // 折线图
        this.myChart1 = this.$echarts.init(document.getElementById('echartOne'))
        this.myChart1.setOption({
          color: ['#2c99fd', '#55cc79'],
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data:date,
            name : '日期',
            axisLabel: {interval: 0, textStyle: {color: '#666'}},
            axisLine:{
              lineStyle:{
                color:'#dedede',
                width:1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine:{
              show:false
            },
            splitLine: {
              show: true,
              lineStyle:{
                type:'dashed'
              }
            }
          },
          series: [
            {
              data: list1,
              type: 'line'
            },
            {
              data: list,
              type: 'line'
            }
          ]
        })
      },
      /** 设置预期值成功后 **/
      submitForm(){
        this.yqszFuc() // 预期设置数据
        this.topFuc()  // 顶部数据展示
        this.fyyqFuc() //费用预期目标
        this.gfFuc() //管理费用预测
        this.aqFuc() // 整体安全评测
        this.sjFuc() //各类三急占比
        this.clsyFuc() //车辆使用
      },
      /** 关闭弹窗 **/
      closeDialog() {
        this.dialogShow = false;
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  #target .header {
    height: 180px;
    background: #ffffff;
  }

  #target .el-header {
    padding: 0;
  }

  #target .distencetarget {
    width: 125px;
    height: 100%;
    margin: 0px 0px 0px 20px;
    .el-progress__text {
      top: 60%;
      font-size: 22px !important;
      color: #324e80;
    }

  }

  #target .propsal {
    height: 80px;
    margin-top: 50px;
    transform: translateY(-50%);
  }

  #target .propsal p {
    text-align: left;
    margin-bottom: 20px;
  }

  #target .propsal ul > li {
    display: block;
    overflow: hidden;
    line-height: 20px;
  }

  #target .propsal ul > li img {
    text-align: left;
    float: left;
    margin-right: 15px;
  }

  #target .propsal ul > li span {
    font-size: 12px;
    color: #666666;
    text-align: left;
    float: left;
  }

  #target .header .grid {
    margin-top: 90px;
    transform: translateY(-50%);
  }

  #target .grid div {
    float: left;
    width: 33%;
    height: 60px;
    padding-left: 20px;
    border-left: 1px solid #cddde7;
  }

  #target .grid div > span {
    font-size: 14px;
    color: #666666;
    text-align: left;
    width: 100%;
    display: block;
    margin-bottom: 15px;
  }

  #target .grid div p span {
    width: auto;
    font-size: 14px;
    color: #666666;
  }

  #target .grid div p {
    text-align: left;
  }

  #target .grid div p {
    font-size: 24px;
    font-weight: 600;
    color: #324e80;
  }

  .target {
    .active1{
      color: #71d189!important;
    }
    .main-text {
      background: #eef7ff;
      margin-top: 100px;
      padding-top: 50px;
    }

    .main-text > .main-sort {
      margin-bottom: 30px;
    }

    .main-sortl {
      /*margin-right: 30px;*/
    }
    .carEchart {
      .el-tabs__item {
        width: 60px;
        font-size: 12px;
      }
      .el-tabs__active-bar {
        width: 42px !important;
      }
      .el-tabs__header {
        margin: 0;
      }
      .el-tab-pane {
        padding: 0;
      }
      .dateEchart {
        width: 100%;
        .swiperBox {
          width: 100%;
          height: 136px;
          position: relative;
          padding: 0 40px;
          .swiper-button-next, .swiper-button-prev{
            width: 24px;
            height: 24px;
            top: 84px;
            border-radius: 50%;
            background-color: #e8f1f9;
            background-size: 40% ;
            padding: 5px;
          }
          .swiper-button-prev{
            left: 6px;
          }
          .swiper-button-next{
            right: 6px;
          }
          .swiper-container{
            width: 100%;
            height: 100%;
            padding: 20px 30px 0px 30px;
            .swiper-slide{
              width:244px;
              height: 98%;
              cursor: pointer;
              border-radius: 2px;
              border: 1px solid #e4edf3;
              p{
                font-size: 14px;
                color: #666;
                float: left;
                margin-top:22px;
                span{
                  display: block;
                  line-height: 30px;
                }
                span:nth-child(2){
                  font-size: 24px !important;
                  color: #324e80;
                }
              }
              .el-progress--circle{
                float: right;
                margin-top: 30px;
                margin-right: 55px;
                .el-progress__text{
                  font-size: 0px!important;
                }
                .el-progress-circle{
                  position: absolute;
                }
              }
            }
          }
        }
        #echartOne {
          width: 100%;
          height: 380px;
        }
      }
    }
    .one {
      .oneMain {
        padding: 10px;
        & > p:nth-child(1) {
          font-size: 12px;
          color: #666;
          margin: 15px 0px 10px 0px;
        }
        & > p:nth-child(2) {
          font-size: 12px;
          color: #ff6c60;
        }
        #echartTwo {
          width: 100%;
          height: 150px;
          margin-bottom: 10px;
        }
      }
      #echartThree {
        width: 100%;
        padding: 10px;
        height: 240px;
      }
    }
    .two {
      #progress {
        padding: 10px;
        ul > li {
          float: left;
          width: 25%;
          height: 206px;
          text-align: center;
          position: relative;
          padding-top: 30px;
          .el-progress__text {
            top: 60%;
            font-size: 22px !important;
            color: #324e80;
          }
        }
      }
    }
    .three {
      #echartFour {
        padding: 10px;
        width: 100%;
        height: 216px;
      }
    }
    .four {
      .fourUl {
        width: 100%;
        display: flex;
        float: left;
        justify-content: space-between;
        padding: 20px 20px 26px 20px;
        & > li {
          float: left;
          width: 30%;
          height: 130px;
          ul > li {
            width: 100%;
            height: 36px;
            background-color: #e8f1f9;
            padding: 12px 20px 0px 20px;
            &:nth-child(1), &:nth-child(2) {
              margin-bottom: 10px;
            }
            span:nth-child(1) {
              float: left;
              font-size: 12px;
              color: #666;
            }
            span:nth-child(2) {
              float: right;
              font-size: 14px;
              color: #324e80;
            }
          }
        }
        & > li:nth-child(1) {
          display: flex;
          align-items: center;
          background-color: #e8f1f9;
          p {
            width: 100%;
            display: block;
            text-align: center;
            span:nth-child(1) {
              width: 100%;
              display: block;
              font-size: 12px;
              line-height: 30px;
              color: #666;
            }
            span:nth-child(2) {
              width: 100%;
              display: block;
              font-size: 24px;
              line-height: 30px;
              color: #324e80;
            }
          }

        }
      }
    }
    .activeS {
      background-color: #f6fbff;
    }
  }

</style>
