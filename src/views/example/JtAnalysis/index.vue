<template>
  <div id="analysis" class="analysis">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content top">
          <div>
            <p><span>整体费用支出（元）</span><img src="../../../assets/images/icons-info-01.png"/></p>
            <p>789,650.00</p>
            <div class="month"><span>月同比</span><img src="../../../assets/images/top.png"/><span>16%</span></div>
          </div>
          <p><span>本月费用支出（元）</span><span>26,450.00</span></p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content top">
          <div>
            <p><span>整体安全驾驶评测（分）</span><img src="../../../assets/images/icons-info-01.png"/></p>
            <p>82</p>
            <div id="echat1" style="width:100%;height: 84px"></div>
          </div>
          <p><span>本月三急（次）</span><span>15</span></p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content top">
          <div>
            <p><span>整体车辆使用率（元）</span><img src="../../../assets/images/icons-info-01.png"/></p>
            <p>94%</p>
            <div id="echart2" style="width:100%;height: 84px"></div>
          </div>
          <p><span>本月任务数</span><span>68%</span></p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content top">
          <div>
            <p><span>设备异常率</span><img src="../../../assets/images/icons-info-01.png"/></p>
            <p>15%</p>
            <div class="progress">
              <el-progress :show-text="false" :stroke-width="12" :percentage="50" color="#71d189"></el-progress>
            </div>
          </div>
          <p><span>本月异常（次）</span><span>9</span></p>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content mid">
          <jt-title :titData="fee.feeTitData">
            <div slot="tabsLeft">
              <el-tabs class="leftTab" v-model="fee.activeName" @tab-click="handleClick">
                <el-tab-pane label="费用趋势" name="first">
                </el-tab-pane>
                <el-tab-pane label="油耗走势" name="second">
                </el-tab-pane>
              </el-tabs>
            </div>
            <div slot="tabsRight">
              <el-date-picker
                style="float: right;"
                v-model="fee.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-tabs class="rightTab" style="float: right" v-model="fee.activeName1" @tab-click="handleClick1">
                <el-tab-pane label="本周" name="first">
                </el-tab-pane>
                <el-tab-pane label="本月" name="second">
                </el-tab-pane>
                <el-tab-pane label="全年" name="third">
                </el-tab-pane>
              </el-tabs>
            </div>
          </jt-title>
          <div class="mid-main">
            <el-row :gutter="30">
              <el-col :span="18">
                <div class="grid-content" style="width: 100%">
                  <div class="mid-main-left">
                    <div id="midEchart" style="width: 100%;height: 100%"></div>
                  </div>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <div class="mid-main-right">
                    <p>机构/部门费用排名</p>
                    <ul>
                      <li v-for="(item, index) in rankingList" :key="index"><span
                        :class="{ranking:(index===3||index===4)}">{{index}}</span><span>{{item.name}}</span><span>{{item.value}}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content mid1">
          <jt-title :titData="behave.oneTitData"></jt-title>
          <div class="behave-main">
            <el-row :gutter="30">
              <el-col :span="12">
                <div class="grid-content">
                  <div class="behave-main-son">
                    <p><span>共计三急行为</span><img src="../../../assets/images/icons-info-01.png"/></p>
                    <div class="month"><span>1,846</span><span>同比</span><img :src="img.top"/><span>24%</span></div>
                    <div id="behaveEchart" style="width: 100%;height: 80px"></div>
                    <div class="behave-main-rank">
                      <p><span>排名</span><span>机构/部门</span><span>周涨幅</span><span>三急次数</span></p>
                      <ul>
                        <li v-for="(item,index) in behaveList" :key="index"><span
                          :class="{ranking:(index===3||index===4)}">{{index}}</span><span>{{item.name}}</span>
                          <p><img :src="img.top"/><span>{{item.num}}</span></p><span>{{item.value}}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <div class="behave-main-son">
                    <p><span>人均三急次数</span><img src="../../../assets/images/icons-info-01.png"/></p>
                    <div class="month"><span>3.8</span><span>同比</span><img :src="img.bot"/><span>24%</span></div>
                    <div id="behaveEchart1" style="width: 100%;height: 80px"></div>
                    <div class="behave-main-rank">
                      <p><span>排名</span><span>机构/部门</span><span>周涨幅</span><span>三急次数</span></p>
                      <ul>
                        <li v-for="(item,index) in behaveList" :key="index"><span
                          :class="{ranking:(index===3||index===4)}">{{index}}</span><span>{{item.name}}</span>
                          <p><img :src="img.bot"/><span>{{item.num}}</span></p><span>{{item.value}}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content mid1">
          <jt-title :titData="behave.twoTitData">
            <div slot="tabsRight">
              <el-tabs class="rightTab1" v-model="behave.activeName" @tab-click="handleClick2">
                <el-tab-pane label="近一周" name="first">
                </el-tab-pane>
                <el-tab-pane label="近一月" name="second">
                </el-tab-pane>
                <el-tab-pane label="近一年" name="third">
                </el-tab-pane>
              </el-tabs>
            </div>
          </jt-title>
          <div style="width: 100%;height:462px;position: relative">
            <p style="position: absolute;width: 140px;text-align: center;left: 130px;top: 200px;">
              <span style="font-size: 12px;display: block;margin-bottom: 10px">费用总额（元）</span>
              <span style="font-size: 28px;color: #324e80;display: block">526,680</span>
            </p>
            <div id="behaveEchart2" style="width: 50%;height:100%;float: left"></div>
            <ul class="vertical-list" style="width: 50%;height:100%;float: right">
              <li v-for="(item, index) in verticalList">
                <span :style="{'border-color':item.color}"></span>
                <span>{{item.name}}</span>
                <span>{{item.value}}</span>
                <span>{{item.num}}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bot">
          <div class="bot-top">
            <div class="swiper-container " id="swiper">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in swiperData" :key="item.value"
                     :class="{activeS:item.id===swiperIndex}" @click="swiperClick(item.id)">
                  <!--@click="swiperClick(index)"-->
                  <div style="width: 155px;height: 100%;margin: 0 auto;">
                    <p>
                      <span>{{item.tit}}</span>
                      <span>{{item.value+'%'}}</span>
                      <span>{{item.name}}</span>
                    </p>
                    <el-progress color="#71d189" type="circle" :stroke-width="10" :width="50"
                                 :percentage="item.value"></el-progress>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
          <div class="bot-bottom">
            <div id="bigData" style="width: 100%;height: 100%"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  export default {
    name: "workEchart",
    components: {JtTitle},
    props: [],
    data() {
      return {
        img: {
          top: require('@/assets/images/top.png'),
          bot: require('@/assets/images/bot.png'),
          smooth: require('@/assets/images/smooth.png'),
        },
        fee: {
          feeTitData: {
            typeName: 1,
            name: '',
            img: '',
            fucName: '',
            fuc: 1
          },
          activeName: 'first',
          activeName1: 'first',
          date: ''
        },
        behave: {
          oneTitData: {
            typeName: 0,
            name: '驾驶行为统计',
            img: '',
            fucName: '',
            fuc: 0
          },
          activeName: 'first',
          twoTitData: {
            typeName: 0,
            name: '费用类别占比',
            img: '',
            fucName: '',
            fuc: 1
          }
        },
        swiperData: [
          {name: '燃油费占比', value: 82, tit: '重庆电信/人力资源部',id:0},
          {name: '维保费占比', value: 78, tit: '重庆电信/信息部',id:1},
          {name: '保险费占比', value: 45, tit: '重庆电信/销售部',id:2},
          {name: '年检费占比', value: 52, tit: '重庆电信/行政部',id:3},
          {name: '保养费占比', value: 66, tit: '重庆电信/业务部',id:4},
          {name: '保养费占比', value: 67, tit: '重庆电信/后勤部',id:5},
          {name: '保养费占比', value: 68, tit: '重庆电信/科技部',id:6},
        ],
        swiperIndex: '',
        rankingList: [
          {name: '重庆电信/销售部', value: '320,500'},
          {name: '重庆电信/业务部', value: '320,500'},
          {name: '重庆电信/人力资源部', value: '320,500'},
          {name: '重庆电信/科技部', value: '320,500'},
          {name: '重庆电信/行政部', value: '320,500'}
        ],
        behaveList: [
          {name: '重庆电信/销售部', value: '320,500', num: '15%'},
          {name: '重庆电信/业务部', value: '320,500', num: '15%'},
          {name: '重庆电信/人力资源部', value: '320,500', num: '15%'},
          {name: '重庆电信/科技部', value: '320,500', num: '15%'},
          {name: '重庆电信/行政部', value: '320,500', num: '15%'}
        ],
        verticalList:[
          {name: '燃油费', value: '320,500', num: '15%',color:'#55a8fd'},
          {name: '保养费', value: '320,500', num: '15%',color:'#ffc600'},
          {name: '年检费', value: '320,500', num: '15%',color:'#feb57f'},
          {name: '维修费', value: '320,500', num: '15%',color:'#62eeb4'},
          {name: '违章费', value: '320,500', num: '15%',color:'#aa89e7'},
          {name: '其他', value: '320,500', num: '15%',color:'#71d189'}
      ]
      }
    },
    mounted() {
      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView : 'auto',
        spaceBetween : 20,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        loop: false
      })
      this.drawLine()
    },
    methods: {
      drawLine() {
        let myChart1 = this.$echarts.init(document.getElementById('echat1'))
        let myChart2 = this.$echarts.init(document.getElementById('echart2'))
        let midEchart = this.$echarts.init(document.getElementById('midEchart'))
        let behaveEchart = this.$echarts.init(document.getElementById('behaveEchart'))
        let behaveEchart1 = this.$echarts.init(document.getElementById('behaveEchart1'))
        let behaveEchart2 = this.$echarts.init(document.getElementById('behaveEchart2'))
        let bigDataEchart = this.$echarts.init(document.getElementById('bigData'))
        myChart1.setOption({
          color: ['#feb57f'],
          grid: {
            x: 10,
            y: 10,
            x2: 10,
            y2: 10,
            borderWidth: 2
          },
          xAxis: {
            show: false,
            type: 'category',
            boundaryGap: false,
            data: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
          },
          yAxis: {
            show: false,
            type: 'value',
            splitNumber: 3
          },
          series: [{
            data: [0, 53, 5, 65, 60, 3, 70, 60, 9, 68],
            type: 'line',
            smooth: true,
            areaStyle: {
              color: '#feb57f'
            },
          }]
        })
        myChart2.setOption({
          color: ['#55a8fd'],
          tooltip: {
            show: false,
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            width: "auto", //图例宽度
            height: "100%", //图例高度
          },
          xAxis: [
            {
              show: false,
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisLabel: {interval: 0}
            }
          ],
          yAxis: [
            {
              show: false,
              type: 'value'
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '12px',
              data: [10, 43, 55, 75, 50, 70, 60],
              itemStyle: {
                normal: {
                  //柱形图圆角，初始化效果
                  barBorderRadius: [10, 10, 10, 10]
                }
              }
            }
          ]
        })
        midEchart.setOption({
          color: ['#55a8fd'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: "20px",
            left: "50px",
            right: "0px",
            bottom: "50px",
            width: "auto", //图例宽度
            height: "80%", //图例高度
          },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisLabel: {interval: 0, textStyle: {color: '#666'}},
              axisLine:{
                lineStyle:{
                  color:'#c2d4e4',
                  width:1,//这里是为了突出显示加上的
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisLabel: {interval: 0, textStyle: {color: '#666'}},
              axisLine:{
                lineStyle:{
                  color:'#c2d4e4',
                  width:1,//这里是为了突出显示加上的
                }
              }
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '24px',
              data: [10, 43, 55, 75, 50, 70, 60],
            }
          ]
        })
        behaveEchart.setOption({
          color: ['#2db9ff'],
          grid: {
            x: 0,
            y: 10,
            x2: 0,
            y2: 10,
            borderWidth: 2
          },
          xAxis: {
            show: false,
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            show: false,
            type: 'value',
            splitNumber: 3
          },
          series: [{
            data: [0, 93, 5, 15, 60, 90, 100],
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: { //正常样式
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#c0eafc'
                }, {
                  offset: 1,
                  color: 'white'
                }]),
                opacity: 1
              }
            },
          }]
        })
        behaveEchart1.setOption({
          color: ['#7f5be6'],
          grid: {
            x: 0,
            y: 10,
            x2: 0,
            y2: 10,
            borderWidth: 2
          },
          xAxis: {
            show: false,
            type: 'category',
            boundaryGap: false,
            data: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
          },
          yAxis: {
            show: false,
            type: 'value',
            splitNumber: 3
          },
          series: [{
            data: [0, 53, 5, 65, 60, 3, 70, 60, 9, 68],
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: { //正常样式
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#e2dafb'
                }, {
                  offset: 1,
                  color: 'white'
                }]),
                opacity: 1
              }
            },
          }]
        })
        behaveEchart2.setOption({
          color: ['#55a8fd', '#ffc600', '#feb57f', '#62eeb4', '#aa89e7', '#71d189'],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          grid: {
            x: 10,
            y: 10,
            x2: 10,
            y2: 10,
          },
          legend: {
            show:false,
            orient: 'horizontal',
            x: 'right',
            bottom: 20,
            textStyle: {color: '#999999'},
            itemWidth: 10,
            itemHeight: 10,
            data: ['燃油费', '保养费', '年检费', '维修费', '违章费', '其他']
          },
          series: [
            {
              name: '占比',
              type: 'pie',
              radius: ['50%', '70%'],
              center: [200, 220],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: 335, name: '燃油费'},
                {value: 310, name: '保养费'},
                {value: 234, name: '年检费'},
                {value: 135, name: '维修费'},
                {value: 1548, name: '违章费'},
                {value: 500, name: '其他'}
              ]
            }
          ]
        })
        // 大数据data
        var timtData=[
          '07-01','07-02','07-03','07-04','07-05','07-06','07-07','07-08','07-09','07-10','07-11','07-12',
          '08-01','08-02','08-03','08-04','08-05','08-06','08-07','08-08','08-09','08-10','08-11','08-12',
          '09-01','09-02','09-03','09-04','09-05','09-06','09-07','09-08','09-09','09-10','09-11','09-12'
        ]
        timtData = timtData.map(function (str) {
          return str.replace('', '\n');
        });
        bigDataEchart.setOption({
          color: ['#40c768', '#359eff'],
          title: {
            text: '里程趋势',
            textStyle: {
              fontSize: 14,
              fontWeight:'bold'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            orient: 'horizontal',
            x: 'right',
            textStyle: {color: '#999999'},
            itemWidth: 10,
            itemHeight: 10,
            data: [{name: '任务', icon: 'circle'}, {name: '非常规里程', icon: 'circle'}]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 65,
              end: 85
            },
            {
              type: 'inside',
              realtime: true,
              start: 65,
              end: 85
            }
          ],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:timtData,
            axisLabel: {interval: 0, textStyle: {color: '#666'}},
            axisLine:{
              lineStyle:{
                onZero: true,
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
              name:'任务',
              type:'line',
              data:[820, 332, 301, 334, 190, 850, 320,500,600,130,420,156,122,321,652,451,741,777,921,563,222,333,
                444,216,321,652,451,741,777,921,563,222,333,444,216,555]
            },
            {
              name:'非常规里程',
              type:'line',
              data:[120, 932, 901, 934, 200, 330, 820,820, 332, 301, 334, 190, 850, 320,500,600,130,420,156,800,512,
                432,589,842,122,321,652,451,741,777,921,563,222,333,444,216]
            }
          ]
        })
        window.addEventListener('resize',function(){
          myChart1.resize()
          myChart2.resize()
          midEchart.resize()
          behaveEchart.resize()
          behaveEchart1.resize()
          behaveEchart2.resize()
        })
      },
      handleClick() {
      },
      handleClick1() {
      },
      handleClick2() {
      },
      swiperClick(index) {
        this.swiperIndex = index
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .analysis {
    padding: 20px;
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .top {
      height: 228px;
      background-color: white;
      & > div {
        width: 100%;
        height: 186px;
        padding: 20px;
        border-bottom: 1px solid #e4edf3;
        .month {
          span {
            font-size: 12px;
            color: #666;
            margin-right: 10px;
          }
          span:nth-child(3) {
            color: #71d189;
            font-weight: bold;
            margin-left: 10px;
          }
        }
        p:nth-child(1) {
          margin-bottom: 24px;
          span:nth-child(1) {
            font-size: 14px;
            float: left;
            color: #414141;
          }
          img {
            float: right;
          }
        }
        p:nth-child(2) {
          font-size: 24px;
          color: #324e80;
          margin-bottom: 20px;
        }
        div {

        }
      }
      & > p {
        margin-top: 14px;
        padding: 0px 20px 0px 20px;
        span:nth-child(1) {
          font-size: 12px;
          color: #666;
          float: left;
        }
        span:nth-child(2) {
          font-size: 14px;
          color: #324e80;
          float: right;
        }
      }
      .progress {
        margin-top: 46px;
      }
    }
    .mid {
      height: 362px;
      width: 100%;
      background-color: white;
      .el-tabs__item {
        font-size: 12px;
      }
      .leftTab {
        .el-tabs__item {
          width: 80px;
        }
      }
      .rightTab {
        .el-tabs__item {
          width: 60px;
        }
      }
      .el-date-editor .el-range-input, .el-date-editor .el-range-separator{
        font-size: 12px;
      }
      .el-input__inner {
        width: 240px;
        height: 28px;
        line-height: 28px;
        margin-top: 10px;
        margin-left: 10px;
        font-size: 12px;
        .el-range-separator {
          font-size: 12px;
          padding: 0px;
          line-height: 24px;
        }
        .el-range__icon {
          line-height: 22px;
        }
      }
      .mid-main {
        height: 306px;
        width: 100%;
        padding: 30px 20px;
        .mid-main-left {
          height: 248px;
        }
        .mid-main-right {
          height: 240px;
          & > p {
            width: 100%;
            height: 30px;
            font-size: 12px;
            font-weight: bold;
            padding: 10px;
            color: #666;
          }
          & > ul {
            width: 100%;
            overflow: hidden;
            li {
              width: 100%;
              height: 42px;
              font-size: 12px;
              border-bottom: 1px dashed #dadada;
              padding: 10px;
              span:nth-child(1) {
                width: 24px;
                height: 24px;
                float: left;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                color: white;
                background-color: #71d189;
              }
              span:nth-child(2) {
                float: left;
                color: #666;
                margin-left: 10px;
                margin-top: 6px;
              }
              span:nth-child(3) {
                float: right;
                color: #324e80;
                margin-top: 6px;
              }
            }
          }
        }
      }
    }
    .mid1 {
      height: 512px;
      width: 100%;
      background-color: white;
      .behave-main {
        padding: 30px;
        .behave-main-son {
          height: 402px;
          & > p {
            font-size: 14px;
            color: #999;
            width: 100%;
            height: 30px;
            display: flex;
            align-items: center;
            span {
              margin-right: 5px;
            }
          }
          .month {
            width: 100%;
            height: 30px;
            span {
              font-size: 12px;
              color: #666;
              margin-right: 10px;
            }
            span:nth-child(1) {
              font-size: 24px;
              color: #324e80;
            }
            span:nth-child(4) {
              color: #71d189;
              font-weight: bold;
              margin-left: 10px;
            }
          }
          .behave-main-rank {
            font-size: 12px;
            & > p {
              width: 100%;
              height: 20px;
              margin-top: 20px;
              span:nth-child(1) {
                float: left;
                margin-right: 20px;
              }
              span:nth-child(2) {
                float: left;
              }
              span:nth-child(3) {
                float: right;
                margin-left: 30px;
              }
              span:nth-child(4) {
                float: right;
              }
            }
            & > ul {
              width: 100%;
              overflow: hidden;
              li {
                color: #666;
                height: 42px;
                padding: 10px 0px;
                & > span:nth-child(1) {
                  width: 24px;
                  height: 24px;
                  background-color: #71d189;
                  color: white;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  float: left;
                  border-radius: 50%;
                  margin-right: 10px;
                }
                & > span:nth-child(2) {
                  float: left;
                  margin-top: 6px;
                }
                p {
                  float: right;
                  margin-left: 30px;
                  margin-top: 6px;
                  span {
                    color: #71d189;
                  }
                }
                & > span:nth-child(4) {
                  float: right;
                  margin-top: 6px;
                }
              }
            }
          }
        }
      }
      .rightTab1 {
        .el-tabs__item {
          width: 64px;
          font-size: 12px;
        }
      }
      .vertical-list{
        height: 100%;
        padding: 70px 20px 20px 40px;
        li{
          border-bottom: 1px dashed #dadada;
          width: 100%;
          height: 50px;
          font-size: 12px;
          padding-top: 20px;
          span:nth-child(1){
            width: 10px;
            float:left;
            height: 10px;
            border: 2px solid #55a8fd;
            border-radius: 50%;
          }
          span:nth-child(2){
            float: left;
            color: #666;
            font-weight: bold;
            margin-left: 10px;
          }
          span:nth-child(3){
            float: right;
            color: #324e80;
            font-size: 12px;
            font-weight: bold;
            margin-left: 40px;
          }
          span:nth-child(4){
            float: right;
            color: #666;
          }
        }
      }
    }
    .bot {
      height: 600px;
      width: 100%;
      background-color: white;
      padding: 20px;
      .bot-top {
        width: 100%;
        height: 136px;
        padding: 0px 30px;
        position: relative;
        .swiper-button-next, .swiper-button-prev {
          width: 24px;
          height: 24px;
          top: 84px;
          border-radius: 50%;
          background-color: #e8f1f9;
          background-size: 40%;
          padding: 5px;
        }
        .swiper-button-prev{
          left: -10px;
        }
        .swiper-button-next{
          right: -10px;
        }
        .swiper-container {
          width: 100%;
          height: 100%;
          padding: 20px 30px 0px 30px;
          .swiper-slide {
            width: 240px;
            height: 98%;
            cursor: pointer;
            border-radius: 2px;
            border: 1px solid #e4edf3;
            & > div {
              width: 100% !important;
              display: flex;
              justify-content: center;
            }
            p {
              font-size: 14px;
              color: #666;
              float: left;
              margin-top: 14px;
              margin-right: 20px;
              span {
                display: block;
                line-height: 30px;
              }
              span:nth-child(2) {
                font-size: 24px !important;
                color: #324e80;
              }
              span:nth-child(3) {
                font-size: 12px;
                color: #999;
              }
            }
            .el-progress--circle {
              float: right;
              margin-top: 30px;
              margin-right: 55px;
              .el-progress__text {
                font-size: 0px !important;
              }
              .el-progress-circle {
                position: absolute;
              }
            }
          }
        }
      }
      .bot-bottom{
        width: 100%;
        height: 400px;
        margin-top: 30px;
      }
    }
    .activeS {
      background-color: #f6fbff;
    }
    .ranking {
      background-color: #c2d4e4 !important;
    }
  }

</style>
