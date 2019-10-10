<template>
  <div id="workbench" class="workbench">
    <el-container>
      <el-header>
        <el-row class="header" v-loading="loading.loadingOne">
          <el-col :span="2.5" style="margin-top: 28px;">
            <div class="distenceworkbench">
              <p>{{infoData.firstName}}</p>
            </div>
          </el-col>
          <el-col :span="7" style="margin-top: 28px;">
            <div class="propsal">
              <header style="color: #333333;font-size: 22px">{{'早安，'+infoData.userName+'，祝您工作愉快！'}}</header>
              <ul class="orgName">
                <li><span style="font-size: 14px">{{infoData.roleName}}</span><span
                  style="padding: 0px 5px 0px 5px;font-size: 14px">|</span><span style="font-size: 14px">{{infoData.dutyTypeName}}</span>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="13" class="grid">
            <div>
              <span>车辆使用</span>
              <p>{{infoData.carUse}}<span>/</span><span style="font-weight: normal">{{infoData.carTotal}}</span></p>
            </div>
            <div>
              <span>驾乘人员</span>
              <p>{{infoData.driverUse}}<span>/</span><span style="font-weight: normal">{{infoData.driverTotal}}</span>
              </p>
            </div>
            <div>
              <span>预警次数</span>
              <p>{{infoData.eventTypeNum}}</p>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="main-text">
        <el-row :gutter="20" class="main-sort">
          <el-col :span="14" class="main-sortl carEchart" v-loading="loading.loadingTwo">
            <div class="grid-content" id="carEchart" style="width: 100%;background-color: white;overflow: hidden">
              <div style="position: relative;">
                <div id="myChart" style="width: 330px;height: 172px;float: left;"></div>
                <div class="progress1">
                  <el-progress type="circle" :stroke-width="12" :width="100" :percentage="sylCount.count"></el-progress>
                  <!--<p style="font-size: 12px;color: #666;position: absolute;top: 30px;left: 34px">-->
                  <!--{{sylCount.count+'%'}}</p>-->
                </div>
                <ul>
                  <li>
                    <p><span>{{sylCount.normalCarNum}}</span><span>辆车</span></p>
                    <p>当前处于监控状态</p>
                    <p>
                      <el-button size="mini" type="primary">
                        <router-link to="/vehicle-positioning/gps">地图查看</router-link>
                      </el-button>
                    </p>
                  </li>
                  <li>
                    <p><span>{{sylCount.carTotal}}</span><span>辆车</span></p>
                    <p>当前录入总车辆</p>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
          <el-col :span="10" id="barList" class="main-sortr one" v-loading="loading.loadingThree">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
              <div class="underline">
                <jt-title :titData="allData.oneTitData" @add="addBar" @edit="editBar"></jt-title>
                <ul>
                  <li v-for="(item,index) in fastData" :class="{activeF:index==isActive}" @click="liClick(index)"
                      :key="item.value">
                    <router-link :to="item.path" class="path">{{item.name}}</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-sort">
          <el-col :span="14" class="main-sortl two" v-loading="loading.loadingFour">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
              <div class="underline">
                <jt-title :titData="allData.twoTitData"></jt-title>
                <div style="width: 100%;overflow: hidden">
                  <ul class="left">
                    <li>
                      <p>
                        <span>{{safeDta.sanjiNum}}</span>
                        <span>三急事件</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>{{safeDta.clgzNum}}</span>
                        <span>车辆故障</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>{{safeDta.csxsNum}}</span>
                        <span>超速行驶</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        <span>{{safeDta.clpzNum}}</span>
                        <span>车辆碰撞</span>
                      </p>
                    </li>
                  </ul>
                  <ul class="right">
                    <li><span>怠速超长</span><span>辆</span><span>{{safeDta.dsccNum}}</span></li>
                    <li><span>油耗异常</span><span>辆</span><span>{{safeDta.sbycNum}}</span></li>
                    <li><span>设备异常</span><span>辆</span><span>{{safeDta.yhycNum}}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="10" class="main-sortr three" v-loading="loading.loadingFive">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
              <div class="underline">
                <jt-title :titData="allData.threeTitData"></jt-title>
                <div style="width: 100%;overflow: hidden">
                  <ul class="threeUl">
                    <li v-for="(item,index) in waitData" :class="{activeT:index==isActive1}" :key="item.name"
                        @click="threeClick(index)">
                      <router-link :to="item.path">
                        <span>{{item.name}}</span><span>{{item.value}}</span>
                      </router-link>

                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-sort">
          <el-col :span="14" class="main-sortl four" v-loading="loading.loadingSix">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
              <div class="underline">
                <jt-title :titData="allData.fourTitData"></jt-title>
                <div style="width: 100%;overflow: hidden">
                  <p style="padding-left: 20px;font-size: 12px;font-weight: bold;color: #666;padding-top: 20px">
                    近一个月各项费用总览</p>
                  <ul class="fourUl">
                    <li>
                      <p><span>总费用（元）</span><span>{{yyData.alltotal}}</span></p>
                    </li>
                    <li>
                      <ul>
                        <li><span>燃油费(元)</span><span>{{yyData.oiltotal}}</span></li>
                        <li><span>维保费(元)</span><span>{{yyData.upkeeptotal}}</span></li>
                        <li><span>保险费(元)</span><span>{{yyData.insuretotal}}</span></li>
                      </ul>
                    </li>
                    <li>
                      <ul>
                        <li><span>年检费(元)</span><span>{{yyData.surveytotal}}</span></li>
                        <li><span>规费(元)</span><span>{{yyData.feetotal}}</span></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="10" class="main-sortr five" v-loading="loading.loadingSeven">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
              <div class="underline">
                <jt-title :titData="allData.fiveTitData"></jt-title>
                <div style="width: 100%;overflow: hidden">
                  <ul class="fiveUl">
                    <li v-for="item in targrtData" :key="item.name">
                      <span>{{item.name}}</span><span><img style="width: 50px;height: 25px"
                                                           :src="item.img"/></span><span :style="{color:item.color}">{{item.value}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="main-sort">
          <el-col :span="14" class="main-sortl six" v-loading="loading.loadingEight">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
              <div class="underline">
                <jt-title :titData="allData.sixTitData"></jt-title>
                <div style="width: 100%;overflow: hidden">
                  <ul class="sixUl" v-if="warnData.length">
                    <li v-for="item in warnData" :key="item.license">
                      <p><span><img
                        :src="(item.insureType===1||item.insureType===2)?img[0]:(item.insureType===3?img[1]:img[2])"/></span><span>{{item.license}}</span>
                        <span>{{(item.insureType===1||item.insureType===2)?'保险到期':(item.insureType===3?'保养到期':'年检到期')}}</span>
                        <!--<span>{{item.time}}</span>-->
                      </p>
                      <p>{{((item.insureType===1||item.insureType===2)?'保险':(item.insureType===3?'保养':'年检'))+
                        (item.surplusDays?('于'+item.surplusDays+'天后到期，请尽快进行'):('已超'+item.exceedDays+'天，请尽快进行'))+
                        ((item.insureType===1||item.insureType===2)?'保险':(item.insureType===3?'保养':'年检'))}}</p>
                    </li>
                  </ul>
                  <div v-else
                       style="height: 396px;font-size: 12px;color: #324e80;line-height: 396px;text-align: center">
                    无车辆到期提醒
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="10" class="main-sortr seven" v-loading="loading.loadingNine">
            <div class="grid-content" style="width: 100%;background-color: white;overflow: hidden">
              <div class="underline">
                <jt-title :titData="allData.sevenTitData"></jt-title>
                <div style="width: 100%;overflow: hidden;padding-bottom: 20px">
                  <div id="myChart3" style="width: 360px;height: 286px;margin: 0px auto;">
                  </div>
                  <div class="sevenBot">
                    <p><span>驾驶员</span><span>{{runSafeData.driverNum}}</span></p>
                    <p></p>
                    <p><span>部门</span><span>{{runSafeData.orgNum}}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog" class="bar">
        <el-checkbox-group :max="maxNum" v-model="checkList">
          <el-checkbox :max="10" v-for="item in barList" :label="item.value" :key="item.value">{{item.name}}
          </el-checkbox>
        </el-checkbox-group>
        <div style="width: 100%;height: 50px;margin-top: 30px;text-align: center">
          <el-button size="mini" @click="dialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click.native="dealFuc(checkList)">确 定</el-button>
        </div>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtDialog from '@/components/JtDialog'
  import {getCookie} from '@/utils/auth'

  export default {
    name: "workEchart",
    components: {JtTitle, JtDialog},
    props: [],
    data() {
      return {
        loading: {
          loadingOne: true,
          loadingTwo: true,
          loadingThree: true,
          loadingFour: true,
          loadingFive: true,
          loadingSix: true,
          loadingSeven: false,
          loadingEight: true,
          loadingNine: true,
        },
        dialogShow: false,
        dialog: {
          title: '添加导航',
          width: '800px'
        },
        screenHeight: '',
        maxNum: 10,
        infoData: {
          userName: ' 张德宝',
          firstName: '张',
          dutyTypeName: '国防部部长',
          roleName: '系统管理员',
          carTotal: 0,
          carUse: 0,
          driverTotal: 0,
          driverUse: 0,
          eventTypeNum: 0
        },
        sylCount: {
          carTotal: 0,
          normalCarNum: 0,
          abnormalCar: 0,
          count: 0,
          taskCar: 0,
          freeCar: 0
        },
        yyData: {
          feetotal: 0,
          oiltotal: 0,
          insuretotal: 0,
          upkeeptotal: 0,
          surveytotal: 0,
          alltotal: 0,
        },
        safeDta: {},
        runSafeData: {},
        Totaldata:null,
        checkList: [],
        checkData: [],
        barList: [],
        allData: {
          oneTitData: {
            typeName: 0,
            name: '快速开始 / 便捷导航',
            img: '',
            fucName: '',
            fuc: 3
          },
          twoTitData: {
            typeName: 0,
            name: '安全预警消息',
            img: '',
            fucName: '',
            fuc: 0
          },
          threeTitData: {
            typeName: 0,
            name: '待办事项',
            img: '',
            fucName: '',
            fuc: 0
          },
          fourTitData: {
            typeName: 0,
            name: '运营概况',
            img: require('../../../assets/images/icons-info-01.png'),
            fucName: '查看详情',
            path: '/example/jt-analysis',
            fuc: 0
          },
          fiveTitData: {
            typeName: 0,
            name: '目标管理概况',
            img: require('../../../assets/images/icons-info-01.png'),
            fucName: '查看详情',
            path: '/example/target',
            fuc: 0
          },
          sixTitData: {
            typeName: 0,
            name: '车辆事务到期提醒',
            img: require('../../../assets/images/icons-info-01.png'),
            fucName: '查看详情',
            path: '/daily-things/carthings',
            fuc: 0
          },
          sevenTitData: {
            typeName: 0,
            name: '行驶安全指数',
            img: require('../../../assets/images/icons-info-01.png'),
            // fucName: '查看详情',
            fucName: '',
            fuc: 0
          }
        },
        isActive: 0,
        isActive1: 0,
        fastData: [],
        waitData: [
          {name: '流程事项', value: 0, path: '/scheduling-management/travelapproval'},
          {name: '设备到期提醒', value: 0, path: '/system-settings/equipment'},
          {name: '车务到期提醒', value: 0, path: '/daily-things/carremind'}
        ],
        targrtData: [
          {name: '目标走势', value: '正常', img: require('../../../assets/images/Chart0.png'), color: '#71d189'},
          {name: '整体费用分析', value: '异常', img: require('../../../assets/images/Chart1.png'), color: '#ff6c60'},
          {name: '整体车辆使用率', value: '预警', img: require('../../../assets/images/Chart2.png'), color: '#ffc600'},
          {name: '整体驾驶安全分析', value: '正常', img: require('../../../assets/images/Chart0.png'), color: '#71d189'},
          {name: '整体车辆分析', value: '正常', img: require('../../../assets/images/Chart0.png'), color: '#71d189'},
        ],
        img: [
          require('../../../assets/images/warn0.png'),
          require('../../../assets/images/warn1.png'),
          require('../../../assets/images/warn2.png')
        ],
        warnData: []
      }
    },
    watch: {
      screenHeight(val) {
        if (val === 224) {
          document.getElementById("carEchart").style.height = '224px'
        } else {
          document.getElementById("carEchart").style.height = '172px'
        }
      }
    },
    mounted() {
      this.topFuc()  //顶部
      this.stlFuc()  // 统计率
      this.getFastBar() //快速导航
      this.getSafeMsg() // 安全预警
      this.getApplyThing()// 待办事项
      this.getOperate()//运营概况
      this.getCarThing()// 车辆事务到期
      this.getRunSafe() // 行驶安全指数

      this.barList = this.$store.state.user.barList

      /* 挂载窗口改变的大小 */
      window.onresize = () => {
        return (() => {
          this.screenHeight = document.getElementById("barList").offsetHeight
        })()
      }

    },
    methods: {
      /* 添加导航 */
      addBar() {
        this.checkList = []
        this.dialogShow = true

      },
      /* 编辑导航 */
      editBar() {
        console.log(this.checkData)
        this.checkList = this.checkData
        this.dialogShow = true
      },
      /* 确定导航 */
      dealFuc(val) {
        this.getData('gzt/addbjdh', 'post', {ids: val}, true).then((res) => {
          if (res.code === 0) {
            this.fastData = []
            this.dialogShow = false
            this.getFastBar()
          }
        })
      },
      liClick(index) {
        this.isActive = index
      },
      threeClick(index) {
        this.isActive1 = index
      },
      oneDraw() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        myChart.setOption({
          color: ['#71d189', '#90b8f4', '#ff6c60'],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            x: 'right',
            bottom: 20,
            textStyle: {color: '#999999'},
            itemWidth: 10,
            itemHeight: 10,
            data: [{name: '任务', icon: 'circle'}, {name: '空闲', icon: 'circle'}, {name: '异常外出', icon: 'circle'}]
          },
          series: [
            {
              name: '车辆状态',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              center: [80, 80],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '14',
                    fontWeight: 'bold',
                    color: '#324e80'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: this.sylCount.taskCar, name: '任务'},
                {value: this.sylCount.freeCar, name: '空闲'},
                {value: this.sylCount.abnormalCar, name: '异常外出'}
              ]
            }
          ]
        });
      },
      drawLine() {
        let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
        // 绘制图表
        myChart3.setOption({
          tooltip: {
            trigger: 'axis',
            show: true,
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          radar: {
            indicator: [
              {text: '急减速', max: this.Totaldata},
              {text: '急转弯', max: this.Totaldata},
              {text: '超速', max: this.Totaldata},
              {text: '疲劳驾驶', max: this.Totaldata},
              {text: '急加速', max: this.Totaldata}
            ],
            splitArea: {
              areaStyle: {
                color: ['#3e3145',
                  '#4e3d56', '#614c6b)',
                  '#795f86', '#9777a8'],
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            name: {
              formatter: '{value}',
              textStyle: {
                color: '#666'
              }
            },
            center: ['50%', '50%'],
            radius: 80
          },
          series: [
            {
              color: ['rgba(115, 186, 136)'],
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              itemStyle: {normal: {areaStyle: {type: 'default'}}},
              data: [
                {
                  value: [this.runSafeData.jijiansuNum, this.runSafeData.jzwNum,
                    this.runSafeData.csxsNum, this.runSafeData.pljsNum, this.runSafeData.jijiasuNum],
                  name: '安全指数'
                }
              ]
            }
          ]
        })
      },
      GetPercent(num, total) {
        num = parseFloat(num);
        total = parseFloat(total);
        if (isNaN(num) || isNaN(total)) {
          return "-";
        }
        return total <= 0 ? 0 : (Math.round(num / total * 10000) / 100.00);
      },
      /** 顶部数据 **/
      topFuc() {
        this.getData('gzt/topCount', 'post').then((res) => {
          res.data.firstName = res.data.userName.substr(0, 1)
          this.infoData = res.data
          this.loading.loadingOne = false
        })
      },
      /** 使用率 **/
      stlFuc() {
        this.getData('gzt/sylCount', 'post').then((res) => {
          res.data.count = parseInt(this.GetPercent(res.data.normalCarNum, res.data.carTotal))
          this.sylCount = res.data
          this.oneDraw()
          this.loading.loadingTwo = false
        })
      },
      /** 获取快速导航 **/
      getFastBar() {
        this.getData('gzt/getbjdh', 'post').then((res) => {
          var arr=res.data.split(',')
          this.checkData = []
          for (var i = 0; i < arr.length; i++) {
            this.checkData.push(parseInt(arr[i]))
          }
          this.checkList = this.checkData
          for (var i = 0; i < this.barList.length; i++) {
            if (res.data.indexOf(this.barList[i].value.toString()) != -1) {
              this.fastData.push(this.barList[i])
            }
          }
          this.$nextTick(() => {
            /* 初始化高度 */
            this.screenHeight = document.getElementById("barList").offsetHeight
            if (this.screenHeight === 224) {
              document.getElementById("carEchart").style.height = '224px'
            } else {
              document.getElementById("carEchart").style.height = '172px'
            }
          })
        })
        this.loading.loadingThree = false

      },
      /** 安全预警消息 **/
      getSafeMsg() {
        this.getData('gzt/aqyjCount', 'post').then((res) => {
          this.safeDta = res.data
          this.loading.loadingFour = false
        })
      },
      /** 待办事项 **/
      getApplyThing() {
        this.getData('gzt/dbCount', 'post').then((res) => {
          this.waitData[0].value = res.data.flowtotal
          this.waitData[1].value = res.data.devicetotal
          this.waitData[2].value = res.data.cwtotal
          this.loading.loadingFive = false
        })
      },
      /** 运营概况 **/
      getOperate() {
        this.getData('gzt/yygkCount', 'post').then((res) => {
          this.yyData = res.data
          this.loading.loadingSix = false
        })
      },
      /** 车辆事务到期 **/
      getCarThing() {
        this.getData('gzt/cwtxCount', 'post').then((res) => {
          console.log(res)
          this.warnData = res.data.insure.concat(res.data.survey).concat(res.data.upkeep)
          console.log(this.warnData)
          this.loading.loadingEight = false
        })
      },
      /** 行驶安全 **/
      getRunSafe() {
        this.getData('gzt/xsaqCount', 'post').then((res) => {
          this.runSafeData = res.data
          this.Totaldata=res.data.jijiansuNum+res.data.jzwNum+res.data.csxsNum+res.data.pljsNum+res.data.jijiasuNum
          console.log(res.data)
          this.drawLine()
          this.loading.loadingNine = false
        })
      }


    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  #workbench .header {
    height: 180px;
    background: #ffffff;
  }

  #workbench .el-header {
    padding: 0;
  }

  #workbench .distenceworkbench {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background-color: #90b8f4;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 120px;
    margin: 0px 20px;
    p {
      font-size: 30px;
      color: white;
    }
  }

  #workbench .propsal {
    height: 80px;
    margin-top: 64px;
    transform: translateY(-50%);
  }

  #workbench .propsal header {
    font-size: 20px;
    font-weight: 600;
    color: black;
    text-align: left;
    margin-bottom: 20px;
  }

  #workbench .propsal ul > li span {
    font-size: 16px;
    color: #666666;
    text-align: left;
    float: left;
  }

  #workbench .header .grid {
    margin-top: 90px;
    transform: translateY(-50%);
  }

  #workbench .grid div {
    float: left;
    width: 33%;
    height: 60px;
    padding-left: 20px;
    border-left: 1px solid #cddde7;
  }

  #workbench .grid div > span {
    font-size: 14px;
    color: #666666;
    text-align: left;
    width: 100%;
    display: block;
    margin-bottom: 15px;
  }

  #workbench .grid div p span {
    width: auto;
    font-size: 14px;
    color: #666666;
  }

  #workbench .grid div p {
    text-align: left;
  }

  #workbench .grid div p {
    font-size: 24px;
    font-weight: 600;
    color: #324e80;
  }

  .workbench {
    .bar {
      .el-checkbox {
        margin-left: 0px;
        width: 100px;
        .el-checkbox__label{
          font-size: 12px;
          color: #666;
        }
      }
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
      ul {
        width: 300px;
        height: 128px;
        position: absolute;
        position: absolute;
        left: 164px;
        top: 16px;
        li:nth-child(1) {
          margin-right: 80px;
        }
        li {
          float: left;
          p {
            margin-bottom: 10px;
          }
          p:nth-child(1) {
            span:nth-child(1) {
              font-size: 24px;
              color: #324e80;
            }
            span:nth-child(2) {
              font-size: 12px;
              color: #999999;
              margin-left: 10px;
            }
          }
          p:nth-child(2) {
            font-size: 14px;
            color: #666;
          }
        }
      }
      .progress1 {
        position: relative;
        width: 124px;
        height: 124px;
        float: right;
        margin-top: 30px;
        padding-right: 20px;
        .el-progress__text {
          top: 50%;
          font-size: 22px !important;
          color: #324e80;
        }
      }
    }
    .one {
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        padding-bottom: 18px;
        li {
          cursor: pointer;
          float: left;
          width: 102px;
          height: 34px;
          border-radius: 2px;
          display: flex;
          font-size: 12px;
          color: #666;
          align-items: center;
          margin: 18px 0px 0px 18px;
          justify-content: center;
          border: 1px solid #d8e6ee;
        }
      }
    }
    .two {
      .left {
        width: 68%;
        display: flex;
        float: left;
        justify-content: space-between;
        padding: 20px 0px 20px 20px;
        li {
          float: left;
          width: 20%;
          height: 128px;
          display: flex;
          align-items: center;
          border: 1px solid #d8e6ee;
          p {
            width: 100%;
            display: block;
            text-align: center;
            span:nth-child(1) {
              display: block;
              height: 30px;
              line-height: 30px;
              font-size: 24px;
              color: #324e80;
            }
            span:nth-child(2) {
              display: block;
              height: 30px;
              line-height: 30px;
              font-size: 12px;
              font-weight: bold;
              color: #666;
            }
          }

        }
      }
      .right {
        width: 32%;
        float: right;
        padding: 20px;
        li {
          width: 100%;
          height: 36px;
          background-color: #e8f1f9;
          margin-bottom: 10px;
          padding: 0px 10px 0px 10px;
          span {
            font-size: 12px;
            color: #666;
            line-height: 36px;
          }
          span:nth-child(3) {
            float: right;
            margin-right: 5px;
            color: #324e80;
          }
          span:nth-child(2) {
            float: right;
          }
        }
      }
    }
    .three {
      .threeUl {
        padding: 20px;
        li {
          height: 36px;
          line-height: 36px;
          padding: 0px 10px 0px 20px;
          cursor: pointer;
          background-color: #e8f1f9;
          margin-bottom: 10px;
          span {
            display: inline-block;
          }
          span:nth-child(1) {
            float: left;
            font-size: 12px;
            margin-bottom: 10px;
            color: #666;
          }
          span:nth-child(2) {
            float: right;
            height: 22px;
            font-size: 12px;
            color: white;
            margin-top: 7px;
            font-weight: bold;
            display: flex;
            align-items: center;
            padding: 0px 10px;
            border-radius: 14px;
            background-color: #c2d4e4;
          }
        }
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
    .five {
      .fiveUl {
        width: 100%;
        overflow: hidden;
        padding: 20px;
        li {
          width: 47%;
          height: 36px;
          float: left;
          border: 1px solid #e4edf3;
          line-height: 36px;
          margin-bottom: 20px;
          padding: 0px 20px;
          &:nth-child(2n-1) {
            margin-right: 5%;
          }
          span:first-child {
            font-size: 12px;
            color: #666;
            float: left;
          }
          span:nth-child(2) {
            float: right;
            padding-top: 5px;
          }
          span:nth-child(3) {
            font-size: 12px;
            float: right;
            margin-right: 10px;
          }
        }
      }
    }
    .six {
      .sixUl {
        width: 100%;
        overflow: hidden;
        padding: 20px;
        height: 396px;
        li {
          width: 32.333333%;
          background-color: #e8f1f9;
          padding: 20px 10px 20px 10px;
          float: left;
          margin-right: 1.4%;
          margin-bottom: 12px;
          &:nth-child(3n) {
            margin-right: 0px
          }
          p:nth-child(1) {
            line-height: 30px;
            width: 100%;
            overflow: hidden;
            span:nth-child(1) {
              width: 30px;
              height: 30px;
              float: left;
              margin-right: 10px;
              background-color: white;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            span:nth-child(2) {
              margin-right: 10px;
              font-weight: bold;
            }
            span:nth-child(2), span:nth-child(3) {
              float: left;
              font-size: 12px;
              color: #666;
            }
            span:nth-child(4) {
              float: right;
              font-size: 12px;
              color: #666;
            }
          }
          p:nth-child(2) {
            font-size: 12px;
            line-height: 30px;
            color: #666;
          }
        }
      }
    }
    .seven {
      .sevenBot {
        width: 220px;
        padding-bottom: 30px;
        padding-top: 10px;
        margin: 0 auto;
        p {
          float: left;
          height: 62px;
        }
        p:nth-child(2) {
          width: 1px;
          height: 80px;
          background-color: #e4e9ee;
        }
        p:nth-child(3) {
          text-align: right;
        }
        p:nth-child(1) {
          margin-left: 24px;
        }
        p:nth-child(1), p:nth-child(3) {
          width: 86px;
          span {
            display: block;
            &:nth-child(1) {
              font-size: 14px;
              color: #666;
              margin-bottom: 25px;
            }
            &:nth-child(2) {
              font-size: 24px;
              color: #365191;
            }
          }
        }
      }
    }
    .activeF {
      background-color: #e8f1f9;
    }
    .activeT {
      background-color: #dfefff !important;
      span:nth-child(1) {
        color: #55a8fd !important;
      }
      span:nth-child(2) {
        background-color: #55a8fd !important;
      }
    }
  }

</style>
