<template>
  <div id="dian" class="gps">
    <div class="dian-top">
      <ul class="dian-top-one">
        <li :style="topLabel" v-for="(staut, $index) in Status" :key="staut.label"
            @click="dianTopOneClick(staut, $index)">
          {{staut.label
          + '('+ staut.Num +')'}}
        </li>
        <li class="Setdisplay"><span @click="MeSetdisplay()">显示设置</span>
          <!-- 卡片-显示设置 -->
          <el-card class="Setdisplay-box-card fn-shadow1 fn-radius" style="z-index:1;padding: 10px" v-show="Setdisplay">
            <div class="text item" style="height:32px;" v-for="val in Switch" :key="val.label">
              <switc :Switchdata='val'/>
            </div>
          </el-card>
          <!-- end -->
        </li>

        <li class="tool">
          <span @click="MeSetool()">工具</span>
        </li>
        <!-- 卡片-显示设置 -->
        <el-card class="SetTool-box-card" style="z-index:1" v-show="ToolShow">
          <li style="padding:0 10px;font-size:12px;color:#666666;width:100%;" v-for="val in Tool" :key="val.label">
            {{val.label}}
          </li>
        </el-card>
        <!-- end -->
      </ul>
    </div>
    <!-- 地图-点 -->
    <baidu-map class="map" id="map" :center="singlePosition" :zoom="15" :scroll-wheel-zoom="true"
               @click="mapClick" style="position: relative;width: 100%">
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker v-for="item in gpslist" :key="item.id" ref="marker" :position="{lng: item.lng, lat: item.lat}"
                   :dragging="false"
                   :icon="{url: item.url, size: {width: 300, height: 157}}" @click="circle(item)">
          <bm-label ref="bmLabel"
                    :content="'<span></span><line></line>'+'<cursor class=cursorBox>3</cursor>'+item.license"
                    :labelStyle="{color: '#fff', fontSize : '13px'}" :offset="{width: -25, height: -25}"/>
        </bm-marker>
      </bml-marker-clusterer>
    </baidu-map>
    <!-- 右侧卡片弹出 -->
    <div class="dian-SearchCar-Card-right">
      <div @click="Vuetransform = !Vuetransform"
           :class="Vuetransform? 'dian-SearchCar-Card-right-buttom' : 'dian-SearchCar-Card-right-buttom1'"></div>
      <transition name="slide-fade">
        <div v-if="Vuetransform">
          <div class="dian-SearchCar-Card-rightBox">
            <el-form :inline="true" :model="val" class="right-inline">
              <el-form-item>
                <el-input @keyup.native="inputChange(val)" v-model="val.license"
                          placeholder="请输入车牌号"></el-input>
              </el-form-item>
              <el-form-item>
                <jt-org-select ref="upOrgName" @orgCurrent="orgCurrent"></jt-org-select>
              </el-form-item>
            </el-form>
            <div class="car-tabs">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 全部状态 -->
                <el-tab-pane label="全部" name="first">
                  <p
                    style="background-color:#eff3f8;color:#8395ab;font-size:12px;height:30px;line-height:30px;text-align:left;padding-left:10px;">
                    {{'车辆总数:'+Cardata_right_CarStatu.All.length+'辆'}}
                  </p>
                  <ul style="overflow:hidden;width:300px;">
                    <ul class="dian-Card-Cars">
                      <li style="cursor: pointer" ref="gpsIndex"
                          :class="index===listIndex?'blueBg':'whiteBg'"
                          v-for="(val,index) in Cardata_right_CarStatu.All" :key="val.carId"
                          @click="bgChange(index,val)">
                        <div><img :src="val.logo" alt=""></div>
                        <p style="font-weight:800;color:#324e80;">{{val.license}}</p>
                        <p style=";color:#999999;">{{val.orgName}}</p>
                        <p>{{val.taskStatus==0?'空闲':(val.taskStatus==1?'行驶':'异常')}}</p>
                      </li>
                    </ul>
                  </ul>
                </el-tab-pane>
                <!-- 任务状态 -->
                <el-tab-pane label="任务" name="second">
                  <p
                    style="background-color:#eff3f8;color:#8395ab;font-size:12px;height:30px;line-height:30px;text-align:left;padding-left:10px;">
                    {{'车辆总数:'+Cardata_right_CarStatu.task.length+'辆'}}
                  </p>
                  <ul style="overflow:hidden;width:100%;">
                    <ul class="dian-Card-Cars">
                      <li ref="gpsIndex2" :class="index===listIndex2?'blueBg':'whiteBg'"
                          v-for="(val,index) in Cardata_right_CarStatu.task" :key="val.carId"
                          @click="bgChange2(index,val)">
                        <div><img :src="val.logo" alt=""></div>
                        <p style="font-weight:800;color:#324e80;">{{val.license}}</p>
                        <p style=";color:#999999;">{{val.orgName}}</p>
                        <p>行驶</p>
                      </li>
                    </ul>
                  </ul>
                </el-tab-pane>
                <!-- 空闲状态 -->
                <el-tab-pane label="空闲" name="third">
                  <p
                    style="background-color:#eff3f8;color:#8395ab;font-size:12px;height:30px;line-height:30px;text-align:left;padding-left:10px;">
                    {{'车辆总数:'+Cardata_right_CarStatu.free.length+'辆'}}
                  </p>
                  <ul style="overflow:hidden;width:100%;">
                    <ul class="dian-Card-Cars">
                      <li ref="gpsIndex3" :class="index===listIndex3?'blueBg':'whiteBg'"
                          v-for="(val,index) in Cardata_right_CarStatu.free" :key="val.carId"
                          @click="bgChange3(index,val)">
                        <div><img :src="val.logo" alt=""></div>
                        <p style="font-weight:800;color:#324e80;">{{val.license}}</p>
                        <p style=";color:#999999;">{{val.orgName}}</p>
                        <p>空闲</p>
                      </li>
                    </ul>
                  </ul>
                </el-tab-pane>
                <!-- 异常状态 -->
                <el-tab-pane label="异常" name="fourth">
                  <p
                    style="background-color:#eff3f8;color:#8395ab;font-size:12px;height:30px;line-height:30px;text-align:left;padding-left:10px;">
                    {{'车辆总数:'+Cardata_right_CarStatu.CarBug.length+'辆'}}
                  </p>
                  <ul style="overflow:hidden;width:100%;">
                    <ul class="dian-Card-Cars">
                      <li ref="gpsIndex4" :class="index===listIndex4?'blueBg':'whiteBg'"
                          v-for="(val,index) in Cardata_right_CarStatu.CarBug" :key="val.carId"
                          @click="bgChange4(index,val)">
                        <div><img :src="val.logo" alt=""></div>
                        <p style="font-weight:800;color:#324e80;">{{val.license}}</p>
                        <p style=";color:#999999;">{{val.orgName}}</p>
                        <p>异常</p>
                      </li>
                    </ul>
                  </ul>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 左侧卡片 -->
    <left-card :Cardatadisplay="Cardatadisplay" :taskShow="true" :Card_task="Card_task" :Card_Cardata="Card_Cardata"
               :speed="speed" :rpm="rpm"
               @runClick="runClick" @traceClick="traceClick" @stopClick="stopClick" @gpsClick="gpsClick"
    ></left-card>
    <!-- 底部提醒列表 -->
    <warm-table class="botList"></warm-table>
  </div>
</template>

<script>
  import { BmlMarkerClusterer } from 'vue-baidu-map'
  import switc from '@/components/switch'
  import JtOrgSelect from '@/components/Jtorgselect'
  import leftCard from './leftCard'
  import axios from 'axios'
  import warmTable from '@/views/VehiclePositioning/gps/WarnTable'
  import Vue from 'vue'

  export default {
    components: {switc, JtOrgSelect, leftCard, BmlMarkerClusterer, warmTable},// top-开关
    data() {
      return {
        taskCarData: [], //任务信息数据
        warmData: [], //报警信息数据
        // 定位中心点
        singlePosition: {lng: 106.554547, lat: 29.554941},
        // top 显示设置的初始状态
        Setdisplay: false,
        ToolShow: false,
        Cardatadisplay: true,
        Vuetransform: true,
        // 背景色切换
        listIndex: null,
        listIndex2: null,
        listIndex3: null,
        listIndex4: null,
        bgShow: false,
        // dian-SearchCar-Card-right tabs选项卡的默认选项
        activeName: 'first',
        label: '',
        top: '',
        topLabel: '',
        // 状态 top的状态查看
        Status: [
          {label: '行驶中', Num: 24},
          {label: '熄火', Num: 24},
          {label: '超速', Num: 24},
          {label: '怠速', Num: 24},
          {label: '故障', Num: 24},
          {label: '设备拔出', Num: 24},
        ],
        // Switct 右top显示设置
        Switch: [
          {label: '显示车牌号', class: 'dian-display-chepaihao'},
          {label: '超速告警提醒'},
          {label: '怠速告警提醒'},
          {label: '插拔告警提醒'},
        ],
        // Tool 右top的工具
        Tool: [
          {label: '实时路况'},
          {label: '测距'},
          {label: '标记'},
          {label: '围栏查车'},
        ],
        // Card-Cardata 车辆信息
        Card_Cardata: [],
        // Card-Cardata 任务信息
        Card_task: [],
        // Card-Cardata-right formdata
        /* 判断任务种类 */
        Cardata_right_CarStatu: {
          All: [],
          task: [],
          free: [],
          CarBug: [],
        },
        /* 判断行为类型 */
        CarRunList: {
          run: [], // 行驶
          flameout: [], // 熄火
          runFast: [], // 超速
          runSlow: [], // 怠速
          wrong: [], // 故障
          out: [] // 设备拔出
        },
        gpslist: [],
        val: {
          license: '',
          orgIds: ''
        },
        rpm: '',
        speed: '',
        carId: '',
        date: '',
        license: ''
      };
    },
    mounted() {
      // document.getElementsByClassName('content')[0].style.height = window.outerHeight + 'px'
      // total = document.documentElement.clientHeight;
      // document.getElementById('map').style.height = (parseInt(total) - 90) + "px";
      this.getInfoGps()
      // 初始化地图
      // this.MeSetdisplay() // 开关check
      // this.MeSetool() // 左边tips
    },
    created() {
      // for (let k in this.formdata) {
      //   if (this.formdata[k].type == "link") {
      //     api.dt(this.formdata[k], val => {
      //       this.formdata[k].data = val;
      //     });
      //   }
      // }
    },
    methods: {
      /**
       * 点击机构组织
       * @param  val  数据
       */
      orgCurrent(val) {
        this.val.orgIds = val.id
        this.Cardata_right_CarStatu.All = []
        this.Cardata_right_CarStatu.task = []
        this.Cardata_right_CarStatu.free = []
        this.Cardata_right_CarStatu.CarBug = []
        if (!this.val.license) {
          this.getData('/gps/location', 'post', {orgIds: this.val.orgIds}).then(res => {
            for (var i = 0; i < res.data.carGpsList.length; i++) {
              this.Cardata_right_CarStatu.All.push(res.data.carGpsList[i])
              /* 地图车辆覆盖物数据 */
              this.gpslistFuc(res.data.carGpsList, i)
              if (res.data.carGpsList[i].taskStatus === 0) {
                this.Cardata_right_CarStatu.free.push(res.data.carGpsList[i])
              } else if (res.data.carGpsList[i].taskStatus === 1) {
                this.Cardata_right_CarStatu.task.push(res.data.carGpsList[i])
              } else {
                this.Cardata_right_CarStatu.CarBug.push(res.data.carGpsList[i])
              }
            }
          }).catch(error => {
            console.log(error)
          })

        } else {
          this.$message({
            message: '请先清空车牌号',
            type: 'warning'
          });
        }
        this.sortStatusList()
      },
      /**
       * 模糊查询
       * @param  val  车牌号input框数值
       */
      inputChange(val) {
        this.Cardata_right_CarStatu.All = []
        this.Cardata_right_CarStatu.task = []
        this.Cardata_right_CarStatu.free = []
        this.Cardata_right_CarStatu.CarBug = []
        if (val.license && !val.orgIds) {
          this.getData('/gps/location', 'post', {license: val}).then(res => {
            for (var i = 0; i < res.data.length; i++) {
              this.Cardata_right_CarStatu.All.push(res.data[i])
              /* 地图车辆覆盖物数据 */
              this.gpslistFuc(res.data, i)
              if (res.data[i].taskStatus === 0) {
                this.Cardata_right_CarStatu.free.push(res.data[i])
              } else if (res.data[i].taskStatus === 1) {
                this.Cardata_right_CarStatu.task.push(res.data[i])
              } else {
                this.Cardata_right_CarStatu.CarBug.push(res.data[i])
              }
            }
          }).catch(error => {
            console.log(error)
          })

        } else if (!val.license) {
          this.getInfoGps()
        }
        this.sortStatusList()
      },
      /**
       * 初始化所有数据
       */
      getInfoGps() {
        this.getData('/gps/location', 'post').then(res => {
          for (var i = 0; i < res.data.carGpsList.length; i++) {
            this.Cardata_right_CarStatu.All.push(res.data.carGpsList[i])
            /* 地图车辆覆盖物数据 */
            this.gpslistFuc(res.data.carGpsList, i)
            if (res.data.carGpsList[i].taskStatus === 0) {
              this.Cardata_right_CarStatu.free.push(res.data.carGpsList[i])
            } else if (res.data.carGpsList[i].taskStatus === 1) {
              this.Cardata_right_CarStatu.task.push(res.data.carGpsList[i])
            } else {
              this.Cardata_right_CarStatu.CarBug.push(res.data.carGpsList[i])
            }
          }
          /* 任务信息数据/ 报警信息数据  taskCarData:[], //任务信息数据
           warmData:[], //报警信息数据 */
          for (var j = 0; j < res.data.applyList.length; j++) {
            var date = Vue.filter('datetime');
            res.data.applyList[j].preStartTime = date(res.data.applyList[j].preStartTime, "yy:MM:dd hh:mm:ss")
            this.taskCarData.push({
              user: res.data.applyList[j].useMan,
              applyName: res.data.applyList[j].aplyMan,
              address: res.data.applyList[j].stopAddress,
              orgName: res.data.applyList[j].orgId,
              reason: res.data.applyList[j].useReason,
              time: res.data.applyList[j].preStartTime,
              urgency: (res.data.applyList[j].urgency === 0 ? '正常' : '紧急'),
              driver: (res.data.applyList[j].needDriver === 1) ? '需要' : '不需要',
              status: (res.data.applyList[j].status === 1 ? '审核' : '流转'),
              carId: res.data.applyList[j].carId,
              license: res.data.applyList[j].license
            })
          }
          /* 车辆状态列表数据 */
          this.sortStatusList()
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 地图车辆覆盖物列表
       * @param  data  总定位数据
       * @param  i  循环角标
       */
      gpslistFuc(data, i) {
        /*判断车辆颜色*/
        var carUrlList = ['/static/img/car/car-行驶绿色-1.png', '/static/img/car/car-熄火灰色-1.png', '/static/img/car/car-超速红色-1.png',
          '/static/img/car/car-怠速蓝色-1.png', '/static/img/car/car-故障橙色-1.png', '/static/img/car/car-设备拔出黄色-1.png']
        var carImg = ''
        if (data[i].accStatus === 1 && data[i].speed) {
          carImg = carUrlList[0] // 行驶中
        } else if (data[i].accStatus === 0) {
          carImg = carUrlList[1]  // 熄火
        } else if (data[i].eventType === 4) {
          carImg = carUrlList[2] // 超速
        } else if (data[i].eventType === 6) {
          carImg = carUrlList[3] // 怠速
        } else if (data[i].dtc === true) {
          carImg = carUrlList[4] // 故障
        } else if (data[i].carPlugType === 6) {
          carImg = carUrlList[5] // 设备拔出
        } else {
          carImg = carUrlList[0] // 行驶中
        }
        if (!data[i].applyInfo) {
          this.gpslist.push({
            lng: data[i].longitude,
            lat: data[i].latitude,
            license: data[i].license,
            acc: data[i].acc,
            batteryVoltage: data[i].batteryVoltage,
            carId: data[i].carId,
            din: data[i].din,
            driverName: data[i].driverName,
            heading: data[i].heading,
            kmph: data[i].kmph,
            mileage: data[i].mileage,
            rpm: data[i].rpm,
            satellites: data[i].satellites,
            speed: data[i].speed,
            taskStatus: data[i].taskStatus,
            time: data[i].time,
            taskTime: '无',
            place: '',
            url: carImg,
            useMan: '无',
            useReason: '无',
            stopAddress: '无',
            driverName: '无'
          })
        } else {
          this.gpslist.push({
            lng: data[i].longitude,
            lat: data[i].latitude,
            license: data[i].license,
            acc: data[i].acc,
            batteryVoltage: data[i].batteryVoltage,
            carId: data[i].carId,
            din: data[i].din,
            driverName: data[i].driverName,
            heading: data[i].heading,
            kmph: data[i].kmph,
            mileage: data[i].mileage,
            rpm: data[i].rpm,
            satellites: data[i].satellites,
            speed: data[i].speed,
            taskStatus: data[i].taskStatus,
            time: data[i].time,
            place: '',
            url: carImg,
            taskTime: data[i].time,
            useMan: data[i].applyInfo.useMan,
            useReason: data[i].applyInfo.useReason,
            stopAddress: data[i].applyInfo.stopAddress,
            driverName: data[i].applyInfo.driverName
          })
        }

      },
      /**
       * 过滤车辆状态信息列表
       */
      sortStatusList() {
        var list = this.Cardata_right_CarStatu.All
        for (var i = 0; i < list.length; i++) {
          if (list[i].accStatus === 1 && list[i].speed) {
            this.CarRunList.run.push(list[i]) // 行驶中
          } else if (list[i].accStatus === 0) {
            this.CarRunList.flameout.push(list[i])  // 熄火
          } else if (list[i].eventType === 4) {
            this.CarRunList.runFast.push(list[i]) // 超速
          } else if (list[i].eventType === 6) {
            this.CarRunList.runSlow.push(list[i]) // 怠速
          } else if (list[i].dtc === true) {
            this.CarRunList.wrong.push(list[i]) // 故障
          } else if (list[i].carPlugType === 6) {
            this.CarRunList.out.push(list[i]) // 设备拔出
          }
        }
        this.Status = [
          {label: '行驶中', Num: this.CarRunList.run.length ? this.CarRunList.run.length : '0'},
          {label: '熄火', Num: this.CarRunList.flameout.length ? this.CarRunList.flameout.length : '0'},
          {label: '超速', Num: this.CarRunList.runFast.length ? this.CarRunList.runFast.length : '0'},
          {label: '怠速', Num: this.CarRunList.runSlow.length ? this.CarRunList.runSlow.length : '0'},
          {label: '故障', Num: this.CarRunList.wrong.length ? this.CarRunList.wrong.length : '0'},
          {label: '设备拔出', Num: this.CarRunList.out.length ? this.CarRunList.out.length : '0'},
        ]
      },
      /**
       * 点击列表
       */
      bgChange(index, val) {
        this.carId = val.carId
        this.license = val.license
        if (this.$refs.gpsIndex[index].className === 'blueBg') {
          this.listIndex = null
        } else {
          this.listIndex = index
        }
        // 定位到某个车辆地址
        this.singlePosition = {lng: val.longitude, lat: val.latitude}
      },
      bgChange2(index, val) {
        if (this.$refs.gpsIndex2[index].className === 'blueBg') {
          this.listIndex = null
        } else {
          this.listIndex2 = index
        }
        this.singlePosition = {lng: val.longitude, lat: val.latitude}
      },
      bgChange3(index, val) {
        if (this.$refs.gpsIndex3[index].className === 'blueBg') {
          this.listIndex3 = null
        } else {
          this.listIndex3 = index
        }
        this.singlePosition = {lng: val.longitude, lat: val.latitude}
      },
      bgChange4(index, val) {
        if (this.$refs.gpsIndex4[index].className === 'blueBg') {
          this.listIndex4 = null
        } else {
          this.listIndex4 = index
        }
        this.singlePosition = {lng: val.longitude, lat: val.latitude}
      },
      /**
       * top 显示设置
       */
      MeSetdisplay() {
        this.Setdisplay = !this.Setdisplay;
        this.ToolShow = false;
        var SetdisplayHtml = document.getElementsByClassName('Setdisplay')[0];
        var toolHtml = document.getElementsByClassName('tool')[0];
        // 取消当前标签的样式
        SetdisplayHtml.style.color == '' ? SetdisplayHtml.style.color = '#fff' : SetdisplayHtml.style.color = ''
        // 取消另一个标签的样式
        toolHtml.style.color == '#fff' ? toolHtml.style.color = '' : toolHtml.style.color = ''
      },
      /**
       * top 工具设置
       */
      MeSetool() {
        this.ToolShow = !this.ToolShow;
        this.Setdisplay = false;

        var toolHtml = document.getElementsByClassName('tool')[0];
        var SetdisplayHtml = document.getElementsByClassName('Setdisplay')[0];
        // 取消当前标签的样式
        toolHtml.style.color == '' ? toolHtml.style.color = '#fff' : toolHtml.style.color = ''
        // 取消另一个标签的样式
        SetdisplayHtml.style.color == '#fff' ? SetdisplayHtml.style.color = '' : SetdisplayHtml.style.color = ''

      },
      /**
       * 点击某个车辆执行方法
       */
      circle(data) {
        this.date = data.time
        // 速度和转速
        this.rpm = data.rpm
        this.speed = data.speed
        // 计算定位位置名称
        this.$nextTick(() => {
          var gc = new BMap.Geocoder();
          gc.getLocation((new BMap.Point(data.lng, data.lat)), (res) => {
            var addComp = res.addressComponents;
            data.place = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street
            this.Card_Cardata = [
              {label: '车牌号', value: data.license},
              {label: '设备状态', value: '正常'},
              {label: '总里程', value: data.mileage + 'km'},
              {label: '故障码', value: '0 个'},
              {label: '时间', value: data.taskTime},
              {label: '位置', value: data.place},
            ]
          })
        })

        // 转化时间戳
        var getdateCar = () => {
          var now = new Date(data.time),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
          return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
        }
        data.time = getdateCar()
        this.Card_task = [
          {label: '用车人', value: data.useMan},
          {label: '事由', value: data.useReason},
          {label: '用车时间', value: data.time},
          {label: '目的地', value: data.stopAddress},
          {label: '驾驶员', value: data.driverName},
        ]

        // 控制当前 “点” 的光圈的显示或隐藏
        var leftCard = document.getElementsByClassName('BMapLabel')
        if (leftCard[1].children.length > 0) {
          var cursorBox = leftCard[1].children[2].style.display;
          if (!cursorBox) {
            leftCard[1].children[2].style.display = 'inline-block';
            this.Cardatadisplay = !this.Cardatadisplay;
          } else if (cursorBox == 'none') {
            leftCard[1].children[2].style.display = 'inline-block';
            this.Cardatadisplay = !this.Cardatadisplay;
          } else {
            leftCard[1].children[2].style.display = 'none';
            this.Cardatadisplay = !this.Cardatadisplay;
          }
        } else {
          var cursorBox = leftCard[2].children[2].style.display;
          if (!cursorBox) {
            leftCard[2].children[2].style.display = 'inline-block';
            this.Cardatadisplay = !this.Cardatadisplay;
          } else if (cursorBox == 'none') {
            leftCard[2].children[2].style.display = 'inline-block';
            this.Cardatadisplay = !this.Cardatadisplay;
          } else {
            leftCard[2].children[2].style.display = 'none';
            this.Cardatadisplay = !this.Cardatadisplay;
          }
        }

      },

      /**
       * 停靠点、轨迹、动态方法
       */
      stopClick() {
        this.$router.push({
          path: 'stop',
          query: {
            date: this.date,
            carId: this.carId,
            license: this.license
          }
        });

      },
      traceClick() {
        this.$router.push({
          path: 'path',
          query: {
            date: this.date,
            carId: this.carId,
            license: this.license
          }
        });
      },
      runClick() {
        this.$router.push({
          path: 'state',
          query: {
            date: this.date,
            carId: this.carId,
            license: this.license
          }
        });
      },
      gpsClick(){
        this.$router.push({
          path: 'gps',
          query: {
            date: this.date,
            carId: this.carId,
            license: this.license
          }
        });
      },
      mapClick({type, target, point, pixel, overlay}) {
      },
      /**
       *  top Status 标签的点击事件
       */
      dianTopOneClick(staut, index) {
        if (index === 0) {
          this.gpslist = this.CarRunList.run
          this.Cardata_right_CarStatu.All = this.CarRunList.run
        } else if (index === 1) {
          this.gpslist = this.CarRunList.flameout
          this.Cardata_right_CarStatu.All = this.CarRunList.flameout
        } else if (index === 2) {
          this.gpslist = this.CarRunList.runFast
          this.Cardata_right_CarStatu.All = this.CarRunList.runFast
        } else if (index === 3) {
          this.gpslist = this.CarRunList.runSlow
          this.Cardata_right_CarStatu.All = this.CarRunList.runSlow
        } else if (index === 4) {
          this.gpslist = this.CarRunList.wrong
          this.Cardata_right_CarStatu.All = this.CarRunList.wrong
        } else {
          this.gpslist = this.CarRunList.out
          this.Cardata_right_CarStatu.All = this.CarRunList.out
        }

        /* 状态样式改变 */
        let topStatus = document.getElementsByClassName('dian-top-one')[0].children;
        for (let k in topStatus) {
          if (topStatus[k].className == '') {
            topStatus[k].style.backgroundColor = ''
            topStatus[k].style.color = '#88a3d2'
          }
        }
        event.path[0].style.backgroundColor = '#2ccbcc'
        event.path[0].style.color = '#ffffff'
      },
      /**
       *  dian-SearchCar-Card-right tabs选项卡的方法
       */
      handleClick(tab, event) {
        // console.log(tab, event);
      },
    },
    watch: {}
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .gps {
    position: relative;
    width: 100%;
    .botList{
      width: 100%;
      position: absolute;
      bottom: 0px;
    }
    .dian-SearchCar-Card-right {
      text-align: center;
      .right-inline {
        .el-input__inner {
          width: 217px;
          height: 28px;
        }
      }
    }
  }

  #dian {
    width: 100%;
    .map {
      width: 100%;
      height: 900px;
    }
    .gpsBottom {
      width: 100%;
      position: absolute;
      bottom: -40px;
      left: 0px;
      z-index: 997;
    }
  }

  .blueBg {
    background-color: #dfefff;
  }

  .whiteBg {
    background-color: white;
  }

  .content .map {
    height: 932px;
  }

  .el-tabs__item:focus.is-active.is-focus:not(:active) {
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  /* vue动画 */
  /* 进入状态 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  /* 离开状态 */
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  /* 偏移度 */
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateX(0px);
    opacity: 0;
  }

  /* vue动画 */
  .dian-SearchCar-Card-right {
    position: absolute;
    top: 60px;
    right: 0;
    /* position: relative; */
  }

  .dian-SearchCar-Card-right-buttom {
    height: 28px;
    width: 28px;
    background-image: url('../../../../static/img/icons-sprites.png');
    background-position-x: -83px;
    background-position-y: -79px;
    background-color: #ffffff;
    box-shadow: 0px 0px 1px #888888;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    cursor: pointer;
    position: absolute;
    left: -28px;
    top: 20px;
  }

  .dian-SearchCar-Card-right-buttom1 {
    height: 28px;
    width: 28px;
    background-image: url('../../../../static/img/icons-sprites.png');
    background-position-x: -57px;
    background-position-y: -79px;
    background-color: #ffffff;
    box-shadow: 0px 0px 1px #888888;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    cursor: pointer;
    position: absolute;
    left: -28px;
    top: 20px;
  }

  .dian-SearchCar-Card-rightBox {
    display: inline-block;
    width: 280px;
    padding: 20px 0;
    padding-bottom: 0;
    background-color: #ffffff;
  }

  .dian-SearchCar-Card-rightBox form > div:nth-child(1) {
    margin-bottom: 10px;
  }

  #dian .dian-SearchCar-Card-rightBox #formPage .el-form .dian-SearchCar-Card-rightBox-form .el-form-item__content {
    margin-left: 0 !important;
  }

  #dian .dian-SearchCar-Card-rightBox #formPage .el-form .dian-SearchCar-Card-rightBox-form .el-form-item__content .el-autocomplete, .el-select {
    float: left;
    width: 100%;
  }

  .dian-SearchCar-Card-rightBox #formPage .el-form .el-form-item .el-form-item__content .el-input {
    width: 100%;
  }

  .dian-SearchCar-Card-rightBox #formPage .el-form .el-form-item .el-form-item__content {
    line-height: 0;
  }

  #dian div p span #formPage .el-input__suffix .el-input__suffix-inner .el-input__icon {
    line-height: 100%;
  }

  #dian {
    position: relative;
  }

  #app .content #dian {
    height: 100%;
    height: 100%;
  }

  #dian .dian-top .text {
    font-size: 14px;
  }

  #dian .dian-top .Setdisplay .item {
    padding: 20px 0;
    border-bottom: 1px dashed #ccc;
  }

  #dian .dian-top .item:nth-last-child(1) {
    border: 0;
  }

  #dian .dian-top .Setdisplay {
    position: relative;
  }

  #dian .dian-top .tool {
    position: relative;
  }

  #dian .dian-top .Setdisplay-box-card {
    width: 180px;
    position: absolute;
    left: -90px;
  }

  #dian .dian-top .Setdisplay-box-card {
    width: 180px;
    position: absolute;
    left: -83px;
    top: 33px;
    z-index: 222 !important;
  }

  #dian .dian-top .SetTool-box-card {
    width: 90px;
    position: absolute;
    right: 82px;
    top: 34px;
  }

  #dian .dian-top .SetTool-box-card .el-card__body {
    padding: 0;
  }

  #dian .dian-top .SetTool-box-card .el-card__body li:hover {
    background: #dfefff;
  }

  #dian .dian-top ul .Setdisplay-box-card {
    border: 0;
    .text {
      .el-switch__label {
        width: 72px;
      }
    }
  }

  #dian .dian-top ul .Setdisplay-box-card .el-card__body {
    padding: 0;
  }

  #dian .dian-top ul .Setdisplay-box-card .el-card__body .item .el-switch {
    margin-top: -35px;
  }

  #dian .dian-top ul .Setdisplay-box-card .el-card__body .item .el-switch .el-switch__label span {
    color: #666666;
    font-size: 12px;
  }

  #dian .dian-top ul .Setdisplay-box-card .el-card__body .item .el-switch .el-switch__label {
    margin-right: 45px;
  }

  .dian-display-chepaihao {
    /*margin-left: 14px;*/
  }

  #dian .map .BMapLabel {
    width: 92px;
    height: 28px;
    background-color: #5b8ee2 !important;
    border: 0 !important;
    padding-left: 5px !important;
    padding-top: 5px !important;
    position: relative;
  }

  #dian .map .BMapLabel > span:nth-child(1)::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #70ce8d;
    margin-left: 8px;
    margin-right: 6px;
    border-radius: 15px;
  }

  #dian .map .BMapLabel > line {
    width: 86px;
    height: 22px;
    display: inline-block;
    position: absolute;
    left: 3px;
    top: 3px;
    border: 1px solid #8db0eb;
  }

  #dian .map .BMapLabel > cursor {
    display: none;
    width: 110px;
    position: absolute;
    height: 110px;
    background: #55a8fd;
    border-radius: 50%;
    opacity: 0.3;
    left: 50%;
    top: -50%;
    transform: translateX(-50%);
  }

  #dian {
    position: relative;
  }

  #dian div p .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
    margin: 0 20px;
  }

  #dian div p span div .el-tabs .el-tabs__header .is-scrollable .el-tabs__nav-scroll .el-tabs__nav div {
    background-color: orange;
    font-size: 12px;
    /* width:5%; */
  }

  #dian div p span div div .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item {
    left: 0;
  }

  #dian .dian-SearchCar-Card-right p .dian-SearchCar-Card-rightBox #formPage .demo-dynamic {
    margin: 0 20px;
  }

  #dian .dian-SearchCar-Card-right p .dian-SearchCar-Card-rightBox div .el-tabs .el-tabs__content {
    top: -14px;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars {
    max-height: 300px;
    overflow-y: auto;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li {
    height: 50px;
    /* background-color: orange; */
    border-bottom: 1px dashed #cccccc;
    padding: 10px;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li {
    /* height: 300px; */
    position: relative;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars {
    height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li > div {
    width: 32px;
    height: 32px;
    float: left;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li > div img {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li > span {
    display: inline-block;
    float: right;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li > p {
    display: block;
    text-align: left;
    margin-left: 40px;
    /* line-height: 10px; */
    font-size: 12px;
  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li > p:nth-of-type(2) {
    /* margin-bottom: 15px; */

  }

  #dian .dian-SearchCar-Card-right .dian-Card-Cars > li > p:nth-of-type(3) {
    display: inline-block;
    width: 42px;
    height: 20px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid orange;
    top: 15px;
    right: 10px;
    color: orange;
  }

  #dian div p .dian-SearchCar-Card-rightBox div .el-tabs--top .el-tabs__content .el-tab-pane {
    margin-bottom: 0;
  }

  #dian .dian-top {
    width: 100%;
    /* position: relative;
    left:-20px; */
    height: 30px;
    background-color: #4365a3;
  }

  #dian .dian-top li {
    cursor: pointer;
    float: left;
    color: #91abd9;
    display: inline-block;
    line-height: 30px;
    padding: 0 20px;
    font-size: 12px;
    font-weight: bold;
  }

  #dian .dian-top .tool {
    float: right;
    position: relative;
  }

  #dian .dian-top .tool::before {
    display: inline-block;
    content: '';
    width: 16px;
    height: 20px;
    background-image: url('../../../../static/img/icon-map.png');
    background-position-x: -56px;
    background-position-y: -117px;
    position: absolute;
    left: -2px;
    top: 4px;
  }

  #dian .dian-top .Setdisplay {
    float: right;
    position: relative;
  }

  #dian .dian-top .Setdisplay::before {
    display: inline-block;
    content: '';
    width: 16px;
    height: 20px;
    background-image: url('../../../../static/img/icon-map.png');
    background-position-x: -72px;
    background-position-y: -117px;
    position: absolute;
    left: -3px;
    top: 4px;
  }

  .el-tabs__content {
    width: 100%;
  }

  .car-tabs {
    width: 100%;
    float: left;
    position: relative;
    .el-tabs__nav {
      transform: translateX(26px) !important;
    }
    .el-tabs__nav-wrap {
      width: 100%;
    }
    .el-tabs__item {
      width: auto;
      font-weight: normal;
      color: black;
    }
    .el-tabs__active-bar {
      width: 28px !important;
    }
    .el-tab-pane {
      padding: 0px;
    }
  }

  .dian-SearchCar-Card-rightBox {
    .el-form-item {
      margin-left: 28px;
      margin-bottom: 0px;
    }
  }

  .dian-top-one {
    position: relative;
  }

  #dian {
    .dian-SearchCar-Card-right {
      .selectTree {
        border: 1px solid #409eff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        margin-top: 0px;
        position: absolute;
        width: 217px;
        z-index: 111;
      }
      .card-input {
        .el-select {
          .el-input__suffix {
            top: 7px !important;
          }
        }
        .el-input {
          .el-input__suffix {
            top: -6px;
          }
        }
      }
    }
  }
</style>

