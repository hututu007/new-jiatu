<template>
  <div class="leftCardRoute">
    <div class="head">
      <p>{{titText.name}}</p>
      <p>
        <el-button size="mini" type="primary" @click="addRoutes(titText)">{{titText.btn}}</el-button>
      </p>
      <span v-show="classRouteShow" @click="gobackList"></span>
    </div>
    <!-- 时刻表 -->
    <div class="time" v-if="timeShow">
      <div class="timeTop" :class="{activeTime:panelShow===true}"><span>往</span><span>前往</span><span
        @click="goTimeSchedule" style="cursor: pointer"><img :src="timeImg.bot"/></span></div>
      <ul v-show="panelShow">
        <li v-for="(val, index) in timeList.go" :key="index">{{val.classlineTime}}</li>
      </ul>
      <div class="timeBot" :class="{activeTime:panelShow===false}"><span>返</span><span>返程</span><span
        @click="reTimeSchedule" style="cursor: pointer"><img :src="timeImg.top"/></span></div>
      <ul v-show="!panelShow">
        <li v-for="(val, index) in timeList.back" :key="index">{{val.classlineTime}}</li>
      </ul>
    </div>
    <div class="leftCard-main">
      <!-- 路线 -->
      <div class="route" v-show="routeShow">
        <ul>
          <li v-for="item in routeData" :key="item.id">
            <div class="route-tit" @click="openRoute(item)">
              <div>{{item.rbInfo.classlineName}}</div>
              <div>
                <div>
                  <p><span>{{item.siteList.startpoint.siteName}}</span><span>——</span><span>{{item.siteList.endpoint.siteName}}</span>
                  </p>
                  <span @click="timeSchedule(item)">时刻表</span>
                </div>
                <p><span>{{'状态：'+(item.rbInfo.status===0?'启用':'停用')}}</span><span><i @click="deletRoute(item)"
                  style="color:#324e80;cursor: pointer"
                  title="删除"
                  class="el-icon-delete"></i><i
                  style="color:#324e80;cursor: pointer" class="el-icon-edit" title="编辑" @click="editRoute(item)"></i></span></p>
                <p style="width: 100%;float: left;margin-top: 20px;font-size: 12px;padding-right: 5px"><span
                  style="float: left">{{'车牌号：'+item.rbInfo.license}}</span><span style="float: right">{{'驾驶员：'+item.rbInfo.driverName}}</span>
                </p>
              </div>
            </div>
            <div class="route-list">
              <p v-on:click="pointsClick(item)"><i style="color:#409eff;margin-right: 5px"
                                                   class="el-icon-circle-plus"></i><span style="cursor: pointer;">途径站点</span></p>
              <transition name="el-zoom-in-top">
                <div v-show="item.show">
                  <p v-for="val in item.pathList">{{val.path.siteName}}</p>
                </div>
              </transition>
            </div>
          </li>
        </ul>
      </div>
      <!-- 班线 -->
      <div class="classRoute" v-show="classRouteShow">
        <p>
          <span>班线名称：</span>
          <el-input v-model="info.classlineName" placeholder="请输入"></el-input>
        </p>
        <el-tabs tab-position="left" @tab-click="tabClick" v-model="tabsIndex">
          <el-tab-pane label="前往">
            <el-tag
              :key="index"
              v-for="(tag,index) in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              style="width: 90px;float: left"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(0)"
              @blur="handleInputConfirm(0)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="addTime">+ 添加时间</el-button>
          </el-tab-pane>
          <el-tab-pane label="返程">
            <el-tag
              :key="index"
              v-for="(tag, index) in dynamicTags1"
              closable
              :disable-transitions="false"
              @close="handleClose1(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              style="width: 90px;float: left"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(1)"
              @blur="handleInputConfirm(1)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="addTime">+ 添加时间</el-button>
          </el-tab-pane>
        </el-tabs>
        <!--绑定车辆、驾驶员 -->
        <div style="margin-bottom: 30px;overflow: hidden">
          <p style="margin-bottom: 20px;overflow: hidden">
            <span style="float: left;width: 100px;text-align: right">绑定车辆：</span>
            <el-select style="float: left;width: 217px" v-model="info.carId" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.license"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
          <p style="overflow: hidden">
            <span style="float: left;width: 100px;text-align: right">绑定驾驶员：</span>
            <el-select style="float: left;width: 217px" v-model="info.driverId" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.realName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <div class="station">
          <p><span>途径站点</span></p>
          <ul>
            <li>
              <img src="../../../../static/img/icon-map_07.png"/>
              <input v-model="val.startPlace"  @keyup="keySearch(0,val.startPlace,-1)" @focus="placeSort(0)" placeholder="输入起点或在地图选点"/>
              <i style="color:#409eff;margin-right: 5px" class="el-icon-circle-plus" @click="addOne"></i>
              <i style="color:#c3d3de;margin-right: 5px" class="el-icon-remove" @click="deleteStart"></i>
            </li>
            <li v-for="(item, index) in val.pointsList">
              <span></span><input @focus="duringPlaceSort(index)" @keyup="keySearch(1,item.duringPlace,index)" v-model="item.duringPlace" placeholder="输入途径点"/>
              <i style="color:#c3d3de;margin-right: 5px" class="el-icon-remove" @click="deleteOne(index)"></i>
            </li>
            <li>
              <img src="../../../../static/img/icon-map_08.png"/>
              <input @focus="placeSort(2)" @keyup="keySearch(2,val.stopPlace,-1)" v-model="val.stopPlace" placeholder="输入终点或在地图选点"/>
              <i style="color:#c3d3de;margin-right: 5px" class="el-icon-remove" @click="deleteStop"></i>
            </li>
          </ul>
        </div>
        <div class="packUp" style="padding: 20px"><span>检索相关地点</span><span @click="packUp">{{search.text}}</span></div>
        <div class="searchMap" style="padding: 20px">
          <ul>
            <li v-for="(item, index) in placeList" :key="index" @click="placeClick(item)" style="width: 100%;cursor:pointer;height: 30px;overflow: hidden;border-bottom: 1px solid #eff3f8">
              <i class="el-icon-search" style="float: left;margin-right: 20px;height: 30px;line-height: 30px"></i>
              <span style="float: left;height: 30px;width: 254px;line-height: 30px;overflow: hidden">{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div style="text-align: left;margin-bottom: 30px;padding-left: 20px">
          <span style="margin-right: 10px">状态：</span>
          <el-switch v-model="info.status"></el-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {pointsFuc, pathFuc, arrayList, timeList} from './filters'

  export default {
    name: "leftCard",
    data() {
      return {
        titText: {
          name: '班车线路列表',
          btn: '新增班线'
        },
        info: {
          classlineName: '',
          status: '',
          carId: '',
          driverId: ''
        },
        timeList: {
          go: [],
          back: []
        },
        placeList:[],
        timeImg: {
          top: '../../../../static/img/top.png',
          bot: '../../../../static/img/bot.png'
        },
        panelShow: true,
        routeShow: true, // 线路列表
        classRouteShow: false, // 班车线路表
        timeShow: false, // 时刻表
        member: '',
        outCar: '',
        options: [],
        options1: [],
        routeData: [],
        inputVisible: false,
        inputValue: '',
        dynamicTags: [],
        dynamicTags1: [],
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        val: {},
        rval: { // 返程站点input值
          startPlace: '',
          pointsList: [{duringPlace: ''}],
          stopPlace: ''
        },
        gval: { // 前往站点input值
          startPlace: '',
          pointsList: [{duringPlace: ''}],
          stopPlace: ''
        },
        rPoints: { // 返程的点集合
          startPoint: {},
          duringPoints: [],
          stopPoint: {}
        },
        gPoints: { // 前往的点集合
          startPoint: {},
          duringPoints: [],
          stopPoint: {}
        },
        tabsIndex: '0', // 途径点list
        success: {
          one: false,
          two: false,
          three: false
        },
        routeId: '', // 班线id
        routeIndex:0,
        routeIndex1:0,
        roundtripType: '',
        search:{
          text:'',
          searchShow:true
        }
      }
    },
    created() {
      this.$bus.$on('startPlaceVal', (data, index, points) => {
        if (index === '0') {
          this.val.startPlace = data
          this.gPoints = points
        } else if (index === '1') {
          this.rval.startPlace = data
          this.rPoints = points
        }
      })
      this.$bus.$on('stopPlaceVal', (data, index, points) => {
        if (index === '0') {
          this.val.stopPlace = data
          this.gPoints = points
        } else if (index === '1') {
          this.rval.stopPlace = data
          this.rPoints = points
        }
      })
      this.$bus.$on('duringPlaceList', (data, index, points) => {
        if (index === '0') {
          this.gval.pointsList = []
          this.gPoints = points
          this.$nextTick(() => {
            this.gval.pointsList = data
          })
        } else if (index === '1') {
          this.rval.pointsList = []
          this.rPoints = points
          this.$nextTick(() => {
            this.rval.pointsList = data
          })
        }
      })
      this.$bus.$on('keySearch1',(data,text)=>{
        this.placeList=data
        this.search.text=text
      })
    },
    mounted() {
      this.val = this.gval
      /** 获取所有车辆 **/
      this.getData('/car/getCarList', 'post').then(res => {
        this.options = res.data
      }).catch(error => {})
      /** 获取所有车驾驶员 **/
      this.getData('/user/getUserList', 'post').then(res => {
        this.options1 = res.data
      }).catch(error => {})
      /** 获取所有班车线路列表 **/
      this.getClassData()
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      packUp(){
        this.search.searchShow=!this.search.searchShow
        if(this.search.searchShow){
          this.search.text='收起'
        }else{
          this.search.text='展开'
        }
      },
      /** 地图检索关键字 **/
      keySearch(index,val,routeIndex){
        if (this.tabsIndex === '0') { // 前往
          if(routeIndex>-1){
            this.routeIndex=routeIndex
          }
        }else if(this.tabsIndex === '1'){ // 返回
          if(routeIndex>-1){
            this.routeIndex1=routeIndex
          }
        }
        this.$bus.$emit('keySearch', index, val)
      },
      /** 点击搜索出来的地点列表 **/
      placeClick(val){
        if (this.tabsIndex === '0') { // 前往
          if(val.index===0){ // 起点
            this.gval.startPlace=val.name
            this.gPoints.startPoint=new BMap.Point(val.point.lng,val.point.lat)
          }else if(val.index===1){ // 途径点
            this.gval.pointsList[this.routeIndex].duringPlace=val.name
            this.gPoints.duringPoints[this.routeIndex]=new BMap.Point(val.point.lng,val.point.lat)
          }else if(val.index===2){ // 终点
            this.gval.stopPlace=val.name
            this.gPoints.stopPoint=new BMap.Point(val.point.lng,val.point.lat)
          }
          this.$bus.$emit('placeClick', this.tabsIndex, this.gPoints)

        } else if (this.tabsIndex === '1') { // 返程
          if(val.index===0){ // 起点
            this.rval.startPlace=val.name
            this.rPoints.startPoint=new BMap.Point(val.point.lng,val.point.lat)
          }else if(val.index===1){ // 途径点
            this.rval.pointsList[this.routeIndex1].duringPlace=val.name
            this.rPoints.duringPoints[this.routeIndex1]=new BMap.Point(val.point.lng,val.point.lat)
          }else if(val.index===2){ // 终点
            this.rval.stopPlace=val.name
            this.rPoints.stopPoint=new BMap.Point(val.point.lng,val.point.lat)
          }
          this.$bus.$emit('placeClick', this.tabsIndex, this.rPoints)
        }
      },
      /** 获取班车线路列表数据方法 **/
      getClassData() {
        this.getData('/regularbusinfo/getStationLineList', 'post').then(res => {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].show = false
            res.data[i].pathList = pathFuc(res.data[i].siteList.startpoint, res.data[i].siteList.endpoint, res.data[i].siteList.pathpoint)
            if(!res.data[i].rbInfo.driverName){
              res.data[i].rbInfo.driverName='--'
            }
          }
          this.routeData = res.data
        }).catch(error => {

        })
      },
      /** tabs切换方法 **/
      tabClick(tab, event) {
        this.tabsIndex = tab.index
        if (this.tabsIndex === '0') { // 前往
          this.val = this.gval
          this.$bus.$emit('tabClick', this.tabsIndex, this.gPoints)
        } else if (this.tabsIndex === '1') { // 返程
          this.val = this.rval
          this.$bus.$emit('tabClick', this.tabsIndex, this.rPoints)
        }
      },
      /** 新增班线 **/
      addRoutes(val) {
        this.$bus.$emit('addRoute',val)
        if (val.btn === '保存') {
          // 判断提交的来回线路时间和路线点是否齐全
          if (((this.dynamicTags1.length && this.rval.startPlace && this.rval.stopPlace && this.rPoints.startPoint && this.rPoints.stopPoint)
            || (
              !this.dynamicTags.length && !this.gval.startPlace && !this.gval.stopPlace && !this.gPoints.startPoint && !this.gPoints.stopPoint && !this.gval.pointsList[0].duringPlace && !this.gPoints.duringPoints
            ))
            // 前往有
            || ((this.dynamicTags.length && this.gval.startPlace && this.gval.stopPlace && this.gPoints.startPoint && this.gPoints.stopPoint)
              || (
                !this.dynamicTags1.length && !this.rval.startPlace && !this.rval.stopPlace && !this.rPoints.startPoint && !this.rPoints.stopPoint && !this.rval.pointsList[0].duringPlace && !this.rPoints.duringPoints
              ))
            // 前往返回都有
            || (this.dynamicTags.length && this.gval.startPlace && this.gval.stopPlace && this.gPoints.startPoint && this.gPoints.stopPoint)
            || (
              this.dynamicTags1.length && this.rval.startPlace && this.rval.stopPlace && this.rPoints.startPoint && this.rPoints.stopPoint
            ))  {
            this.changeRoute()
          } else {
            this.$message({
              message: '请检查线路（可不填或填写完整）',
              type: 'warning'
            });
            return false
          }
        } else {
          this.classRouteShow = true
          this.routeShow = false
          this.timeShow = false
          this.titText = {
            name: '新增班车线路',
            btn: '保存'
          }
        }
        // this.
      },
      /** 新增编辑数据方法 **/
      changeRoute() {
        if (this.titText.name === '编辑班车线路') {
          var obj = {} // 新增班线基本信息
          obj.classlineName = this.info.classlineName
          if (this.info.status === true) {
            obj.status = 0
          } else {
            obj.status = 1
          }
          obj.id = this.routeId
          obj.carId = this.info.carId
          obj.driverId = this.info.driverId
          this.getData('/regularbusinfo/updateRegularbusInfo', 'post', obj).then(res => {
            if (res.code === 0) {
              this.success.one = true
            }
            var objTime = {} // 新增班线时间
            objTime.gotoTimes = this.dynamicTags.join(',')
            objTime.gobackTimes = this.dynamicTags1.join(',')
            objTime.classlineId = this.routeId
            objTime.roundtripType = this.roundtripType

            this.getData('/regularbusinfo/updateRegularbusTimes', 'post', objTime).then(res1 => {
              if (res1.code === 0) {
                this.success.two = true
              }
              var objPoints = {} // 新增班线站点--来回
              objPoints.classlineId = this.routeId
              objPoints.roundtripType = this.roundtripType
              if (!this.gval.startPlace || !this.gval.stopPlace || !this.gPoints.duringPoints || !this.gPoints.startPoint || !this.gPoints.stopPoint || !this.gval.pointsList[0].duringPlace) {
                objPoints.gotojson = ''
              } else {
                objPoints.gotojson = JSON.stringify({
                  startpoint: {
                    siteName: this.gval.startPlace,
                    longitude: this.gPoints.startPoint.lng,
                    latitude: this.gPoints.startPoint.lat
                  },
                  endpoint: {
                    siteName: this.gval.stopPlace,
                    longitude: this.gPoints.stopPoint.lng,
                    latitude: this.gPoints.stopPoint.lat
                  },
                  pathpoint: pointsFuc(this.gPoints.duringPoints, this.gval.pointsList)
                })
              }
              if (!this.rval.startPlace || !this.rval.stopPlace || !this.rPoints.duringPoints || !this.rPoints.startPoint || !this.rPoints.stopPoint || !this.rval.pointsList[0].duringPlace) {
                objPoints.gobackjson = ''
              } else {
                objPoints.gobackjson = JSON.stringify({
                  startpoint: {
                    siteName: this.rval.startPlace,
                    longitude: this.rPoints.startPoint.lng,
                    latitude: this.rPoints.startPoint.lat
                  },
                  endpoint: {
                    siteName: this.rval.stopPlace,
                    longitude: this.rPoints.stopPoint.lng,
                    latitude: this.rPoints.stopPoint.lat
                  },
                  pathpoint: pointsFuc(this.rPoints.duringPoints, this.rval.pointsList)
                })
              }
              this.getData('/regularbusinfo/updateRegularbusSite', 'post', objPoints).then(res2 => {
                if (res2.code === 0) {
                  this.success.three = true
                }
                if (this.success.three && this.success.two && this.success.one) {
                  this.$message({
                    message: '编辑路线成功',
                    type: 'success'
                  });
                  this.getClassData()
                } else {
                  this.$message.error('失败');
                }
              }).catch(error => {
                console.log(error)
              })

            }).catch(error => {
              console.log(error)
            })

          }).catch(error => {
            console.log(error)
          })
        } else {
          var obj = {} // 新增班线基本信息
          obj.classlineName = this.info.classlineName
          if (this.info.status === true) {
            obj.status = 0
          } else {
            obj.status = 1
          }
          obj.carId = this.info.carId
          obj.driverId = this.info.driverId
          this.getData('/regularbusinfo/addRegularbusInfo', 'post', obj).then(res=> {
            if (res.code === 0) {
              this.success.one = true
            }
            var objTime = {} // 新增班线时间
            objTime.gotoTimes = this.dynamicTags.join(',')
            objTime.gobackTimes = this.dynamicTags1.join(',')
            objTime.classlineId = res.data[0].classlineId
            this.getData('/regularbusinfo/addRegularbusTimes', 'post', objTime).then(res1 => {
              if (res1.code === 0) {
                this.success.two = true
              }
              var objPoints = {} // 新增班线站点--来回
              objPoints.classlineId = res.data[0].classlineId
              if (!this.gval.startPlace || !this.gval.stopPlace || !this.gPoints.duringPoints || !this.gPoints.startPoint || !this.gPoints.stopPoint || !this.gval.pointsList[0].duringPlace) {
                objPoints.gotojson = ''
              } else {
                objPoints.gotojson = JSON.stringify({
                  startpoint: {
                    siteName: this.gval.startPlace,
                    longitude: this.gPoints.startPoint.lng,
                    latitude: this.gPoints.startPoint.lat
                  },
                  endpoint: {
                    siteName: this.gval.stopPlace,
                    longitude: this.gPoints.stopPoint.lng,
                    latitude: this.gPoints.stopPoint.lat
                  },
                  pathpoint: pointsFuc(this.gPoints.duringPoints, this.gval.pointsList)
                })
              }
              if (!this.rval.startPlace || !this.rval.stopPlace || !this.rPoints.duringPoints || !this.rPoints.startPoint || !this.rPoints.stopPoint || !this.rval.pointsList[0].duringPlace) {
                objPoints.gobackjson = ''
              } else {
                objPoints.gobackjson = JSON.stringify({
                  startpoint: {
                    siteName: this.rval.startPlace,
                    longitude: this.rPoints.startPoint.lng,
                    latitude: this.rPoints.startPoint.lat
                  },
                  endpoint: {
                    siteName: this.rval.stopPlace,
                    longitude: this.rPoints.stopPoint.lng,
                    latitude: this.rPoints.stopPoint.lat
                  },
                  pathpoint: pointsFuc(this.rPoints.duringPoints, this.rval.pointsList)
                })
              }
              this.getData('/regularbusinfo/addRegularbusSite', 'post', objPoints).then(res2 => {
                if (res2.code === 0) {
                  this.success.three = true
                }
                if (this.success.three && this.success.two && this.success.one) {
                  this.$message({
                    message: '添加路线成功',
                    type: 'success'
                  });
                  this.getClassData()
                } else {
                  this.$message.error('失败');
                }
              }).catch(error => {
                console.log(error)
              })

            }).catch(error => {
              console.log(error)
            })

          }).catch(error => {
            console.log(error)
          })
        }

      },
      /** 删除班线 **/
      deletRoute(val) {
        var obj = {}
        obj.id = val.rbInfo.id
        if (val.timeList[0].roundtripType === 1) { // 前往
          obj.roundtripType = 1
        } else {
          obj.roundtripType = 2
        }
        this.$confirm('是否删除此条班车线路?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getData('/regularbusinfo/deleteRegularbusInfo', 'post', obj).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getClassData()
            }
          }).catch(error => {
            console.log(error)
          })

          // this.getData('/gps/location', 'post', {license: this.$route.query.license}).then(res => {
          //
          // }).catch(error => {
          //   console.log(error)
          // })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      /** 编辑班线 **/
      editRoute(val) {
        console.log(val.rbInfo.status)
        this.roundtripType = val.timeList[0].roundtripType
        this.routeId = val.rbInfo.id
        this.classRouteShow = true
        this.routeShow = false
        this.timeShow = false
        this.titText = {
          name: '编辑班车线路',
          btn: '保存'
        }
        // 基本信息绑定
        this.info = {
          classlineName: val.rbInfo.classlineName.substring(0, val.rbInfo.classlineName.length - 3),
          status: val.rbInfo.status?false:true,
          carId: val.rbInfo.carId?val.rbInfo.carId:'',
          driverId: val.rbInfo.driverId?val.rbInfo.driverId:''
        }
        if (val.timeList[0].roundtripType === 1) { // 前往
          this.dynamicTags = timeList(val.timeList)
          this.gval = { // 前往站点input值
            startPlace: val.siteList.startpoint.siteName,
            pointsList: arrayList(val.siteList.pathpoint, 0),
            stopPlace: val.siteList.endpoint.siteName
          }
          this.gPoints = { // 前往的点集合
            startPoint: {lng: val.siteList.startpoint.longitude, lat: val.siteList.startpoint.latitude},
            duringPoints: arrayList(val.siteList.pathpoint, 1),
            stopPoint: {lng: val.siteList.endpoint.longitude, lat: val.siteList.endpoint.latitude}
          }
          this.tabsIndex = '0'
          this.val = this.gval
          this.$bus.$emit('editRoute', this.tabsIndex, this.gPoints)
        } else {
          this.dynamicTags1 = timeList(val.timeList)
          this.rval = { // 返回站点input值
            startPlace: val.siteList.startpoint.siteName,
            pointsList: arrayList(val.siteList.pathpoint, 0),
            stopPlace: val.siteList.endpoint.siteName
          }
          this.rPoints = { // 返程的点集合
            startPoint: {lng: val.siteList.startpoint.longitude, lat: val.siteList.startpoint.latitude},
            duringPoints: arrayList(val.siteList.pathpoint, 1),
            stopPoint: {lng: val.siteList.endpoint.longitude, lat: val.siteList.endpoint.latitude}
          }
          this.val = this.rval
          this.tabsIndex = '1'
          this.$bus.$emit('editRoute', this.tabsIndex, this.rPoints)
        }
      },
      /** 返回列表 **/
      gobackList() {
        this.classRouteShow = false
        this.routeShow = true
        this.timeShow = false
        this.titText = {
          name: '班车线路列表',
          btn: '新增班线'
        }
        // 清空数据
        this.info = {
          classlineName: '', status: '', carId: '', driverId: ''
        }
        this.placeList=[]
        this.dynamicTags = []
        this.dynamicTags1 = []
        this.val = { // 返程站点input值
          startPlace: '', pointsList: [{duringPlace: ''}], stopPlace: ''
        }
        this.rPoints = { // 返程的点集合
          startPoint: {}, duringPoints: [], stopPoint: {}
        }
        this.gPoints = { // 前往的点集合
          startPoint: {}, duringPoints: [], stopPoint: {}
        }
        this.$bus.$emit('gobackList', 1)
      },
      /** 添加途经线路点 **/
      addOne() {
        this.val.pointsList.push({
          duringPlace: ''
        })
      },
      /** 删除途经线路点 **/
      deleteOne(index) {
        console.log(index)
        if (this.tabsIndex === '0') { // 前往
          this.gval.pointsList.splice(index, 1)
          this.$bus.$emit('deleteOne', index, this.tabsIndex)
        } else if (this.tabsIndex === '1') { // 返程
          this.rval.pointsList.splice(index, 1)
          this.$bus.$emit('deleteOne', index, this.tabsIndex)
        }
      },
      /** 删除终点 **/
      deleteStop() {
        if (this.tabsIndex === '0') { // 前往
          this.gval.stopPlace = ''
          this.$bus.$emit('deleteStop', 1, this.tabsIndex)
        } else if (this.tabsIndex === '1') { // 返程
          this.rval.stopPlace = ''
          this.$bus.$emit('deleteStop', 1, this.tabsIndex)
        }
      },
      /** 删除起点 **/
      deleteStart() {
        if (this.tabsIndex === '0') { // 前往
          this.gval.startPlace = ''
          this.$bus.$emit('deleteStart', 1, this.tabsIndex)
        } else if (this.tabsIndex === '1') { // 返程
          this.rval.startPlace = ''
          this.$bus.$emit('deleteStart', 1, this.tabsIndex)
        }
      },
      /** 打开时刻表 **/
      timeSchedule(data) {
        this.timeShow = !this.timeShow
        if (data.timeList[0].roundtripType === 1) { // 前往
          this.timeList.go = data.timeList
          this.panelShow = true
        } else {
          this.timeList.back = data.timeList
          this.panelShow = false
        }
      },
      /** 打开路线显示 **/
      pointsClick(val) {
        val.show = !val.show
      },
      openRoute(val) {
          // 基本信息绑定
          if (val.timeList[0].roundtripType === 1) { // 前往
            this.dynamicTags = timeList(val.timeList)
            this.gPoints = { // 前往的点集合
              startPoint: {lng: val.siteList.startpoint.longitude, lat: val.siteList.startpoint.latitude},
              duringPoints: arrayList(val.siteList.pathpoint, 1),
              stopPoint: {lng: val.siteList.endpoint.longitude, lat: val.siteList.endpoint.latitude}
            }
            this.tabsIndex = '0'
            this.$bus.$emit('openRoute', this.tabsIndex, this.gPoints, 1)
          } else {
            this.dynamicTags1 = timeList(val.timeList)
            this.rPoints = { // 返程的点集合
              startPoint: {lng: val.siteList.startpoint.longitude, lat: val.siteList.startpoint.latitude},
              duringPoints: arrayList(val.siteList.pathpoint, 1),
              stopPoint: {lng: val.siteList.endpoint.longitude, lat: val.siteList.endpoint.latitude}
            }
            this.tabsIndex = '1'
            this.$bus.$emit('openRoute', this.tabsIndex, this.rPoints, 1)
          }

      },
      /** 前往时刻表 **/
      goTimeSchedule() {
        this.panelShow = true
        this.timeImg = {
          top: require('../../../../static/img/top.png'),
          bot: require('../../../../static/img/bot.png')
        }

      },
      /** 返回时刻表 **/
      reTimeSchedule() {
        this.panelShow = false
        this.timeImg = {
          bot: require('../../../../static/img/top.png'),
          top: require('../../../../static/img/bot.png')
        }
      },
      /** 关闭标签 **/
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      handleClose1(tag) {
        this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag), 1);
      },
      /** 添加时间 **/
      addTime() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      /** 添加时间的input方法 **/
      handleInputConfirm(val) {
        if (val === 0) {
          let inputValue = this.inputValue;
          if (inputValue) {
            this.dynamicTags.push(inputValue);
          }
          this.inputVisible = false;
          this.inputValue = '';
        } else if (val === 1) {
          let inputValue = this.inputValue;
          if (inputValue) {
            this.dynamicTags1.push(inputValue);
          }
          this.inputVisible = false;
          this.inputValue = '';
        }

      },
      /** 搜索成员 **/
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      /** 起点终点focus**/
      placeSort(val) {
        this.$bus.$emit('placeSort', val, this.tabsIndex)
      },
      /** 途径点focus **/
      duringPlaceSort(index) {
        this.$bus.$emit('duringPlaceSort', index, this.tabsIndex)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .leftCardRoute {
    position: absolute;
    top: 50px;
    left: 30px;
    width: 366px;
    max-height: 710px;
    .el-input__inner{
      height: 28px;
      line-height: 40px;
    }
    .activeTime {
      background-color: #eef7ff;
      span:nth-child(2) {
        color: #365191 !important;
      }
    }
    .head {
      position: relative;
      width: 100%;
      height: 50px;
      background-color: white;
      margin-bottom: 20px;
      padding: 10px;
      box-shadow: 0 0 10px 1px rgba(90, 90, 90, 0.1);
      border-radius: 5px;
      P:nth-child(1) {
        float: left;
        font-size: 14px;
        color: #666;
        font-weight: bold;
        margin-top: 5px;
      }
      P:nth-child(2) {
        float: right;
      }
      & > span {
        height: 28px;
        width: 28px;
        background: #fff url("../../../../static/img/icons-sprites.png") -57px -79px no-repeat;
        -webkit-box-shadow: 0px 0px 1px #888888;
        box-shadow: 0px 0px 1px #888888;
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
        cursor: pointer;
        position: absolute;
        left: -28px;
        top: 12px;
      }
    }
    .leftCard-main {
      height: 650px;
      background-color: white;
      padding: 10px;
      box-shadow: 0 0 10px 1px rgba(90, 90, 90, 0.1);
      border-radius: 5px;
      max-height: 800px;
      overflow: auto;
      position: relative;
      .route {
        & > ul > li {
          width: 100%;
          font-size: 14px;
          color: #666;
          padding-bottom: 10px;
          .route-tit {
            cursor: pointer;
            overflow: hidden;
            /*min-height: 60px;*/
            position: relative;
            /*z-index: 110;*/
            border: 1px solid #324e80;
            & > div:nth-child(1) {
              float: left;
              text-align: center;
              width: 96px;
              background-color: #324e80;
              position: absolute;
              /*z-index: 110;*/
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
            }
            & > div:nth-child(2) {
              float: right;
              width: calc(100% - 96px);
              min-height: 58px;
              text-align: left;
              padding: 10px 0px 10px 20px;
              & > div {
                width: 100%;
                overflow: hidden;
                p {
                  width: 158px;
                  color: #324e80;
                  font-weight: bold;
                  margin-bottom: 20px;
                  overflow: hidden;
                  float: left;
                  span {
                    margin-right: 10px;
                  }
                }
                & > span {
                  padding: 5px;
                  background-color: #2ccbcc;
                  border-radius: 5px;
                  font-size: 12px;
                  color: white;
                  float: right;
                  font-weight: normal;
                  margin-right: 5px;
                  cursor: pointer;
                }
              }
              & > p {
                span:first-child {
                  float: left;
                }
                span:last-child {
                  float: right;
                  i {
                    margin-right: 10px;
                  }
                }
              }
            }
          }
          .route-list {
            margin-top: 20px;
            text-align: left;
            position: relative;
            border-bottom: 1px solid #eff3f8;
            & > p {
              height: 30px;
            }
            & > div {
              width: 100%;
              cursor: pointer;
              p {
                line-height: 25px;
                padding-left: 16px;
              }
            }
          }
        }
      }
      .classRoute {
        width: 100%;
        font-size: 14px;
        color: #666;
        padding-bottom: 10px;
        .el-tabs__content {
          width: auto;
        }
        & > p {
          display: flex;
          justify-content: center;
          margin: 10px 0px 20px 0px;
          .el-input {
            width: 217px;
          }
        }
        .el-tabs {
          margin-bottom: 20px;
          .el-tag {
            margin-right: 10px;
            margin-bottom: 10px;
            float: left;
          }
          .el-button {
            float: left;
          }
        }
        .station {
          width: 100%;
          & > p {
            position: relative;
            width: 100%;
            height: 20px;
            border-bottom: 1px solid #eff3f8;
            margin-bottom: 10px;
            span {
              background-color: white;
              padding: 0px 10px;
              height: 20px;
              position: absolute;
              left: 136px;
              top: 10px;
            }
          }
          ul {
            padding: 10px;
            li {
              width: 100%;
              height: 50px;
              border-bottom: 1px solid #eff3f8;
              display: flex;
              align-items: center;
              span:nth-child(1) {
                width: 10px;
                height: 10px;
                border: 2px solid #42c8b3;
                border-radius: 50%;
                margin-right: 4px;
                margin-left: 4px;
              }
              & > img {
                width: 18px;
                height: 28px;
              }
              input {
                border: none;
                padding-left: 20px;
                width: 286px;
                outline: none;
              }
              i {
                cursor: pointer;
              }
            }
          }

        }
        .packUp{
          width: 100%;
          height: 30px;
          margin-bottom: 20px;
          span:nth-child(1){
            float: left;
            font-size: 14px;
          }
          span:nth-child(2){
            float: right;
            color:#409EFF ;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
    }
    .time {
      position: absolute;
      left: 400px;
      width: 408px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 0 10px 1px rgba(90, 90, 90, 0.1);
      & > div {
        padding: 0px 20px;
        display: flex;
        align-items: center;
      }
      .timeTop {
        height: 50px;
        width: 100%;
        border-bottom: 1px solid #eff3f8;
        span:nth-child(1) {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          float: left;
          text-align: center;
          background-color: #92dea5;
          font-size: 12px;
          color: white;
          line-height: 24px;
        }
        span:nth-child(2) {
          margin-left: 10px;
          font-size: 14px;
          color: #999;
          font-weight: bold;
        }
        span:nth-child(3) {
          width: 24px;
          height: 24px;
          margin-left: 282px;
        }
      }
      .timeBot {
        height: 50px;
        width: 100%;
        border-top: 1px solid #eff3f8;
        span:nth-child(1) {
          width: 24px;
          height: 24px;
          color: white;
          float: left;
          line-height: 24px;
          border-radius: 50%;
          font-size: 12px;
          text-align: center;
          background-color: #feb57f;
        }
        span:nth-child(2) {
          margin-left: 10px;
          font-size: 14px;
          color: #999;
          font-weight: bold;
        }
        span:nth-child(3) {
          width: 24px;
          height: 24px;
          margin-left: 282px;
        }
      }
      ul {
        width: 100%;
        overflow: hidden;
        padding-top: 20px;
        li {
          float: left;
          margin: 0px 20px 20px 20px;
          /*width: ;*/
          height: 20px;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
</style>
