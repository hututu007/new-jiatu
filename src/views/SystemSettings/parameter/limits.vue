<template>
  <div class="limits">
    <div class="limits-main">
      <div class="li-head">
        <img @click="goBack" src="../../../assets/images/return.png"/>
        <span>返回</span>
      </div>
      <div class="limits-sorts">
        <el-row type="flex" class="li-tit" justify="center">
          <el-col :span="24">
            <div class="grid-content bg-purple-light bg-ul2">
              <span class="el-dhtitle">{{'菜单配置：'+limit.person}}</span>
              <span class="el-flag">
               <el-button type="primary" round size="mini">{{limit.duty}}</el-button>
            </span>
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg bg-ul3" justify="center">
          <el-col :span="24">
            <div class="grid-content bg-purple-light bg-ul3">
              <!-- 权限选择-->
              <el-table
                :data="tableData"
                ref="limitTable"
                :span-method="objectSpanMethod"
                @selection-change="limitsChange"
                :header-cell-class-name="tableheaderClassName"
                tooltip-effect="dark"
                border
                style="width: 100%; margin-top: 20px">
                <el-table-column
                  prop="id"
                  label="主菜单"
                  width="280">
                </el-table-column>
                <el-table-column
                  type="selection">
                  <!--label="选取" prop="name"-->
                </el-table-column>
                <el-table-column
                  prop="amount1"
                  label="权限菜单"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="amount2"
                  label="功能描述">
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-button style="margin:30px auto" center type="primary" size="medium" @click.native="addCarFuc()">提交
          </el-button>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
  import {getCookie} from '@/utils/auth'

  export default {
    name: "limits",
    data() {
      return {
        limit: {
          person: '',
          duty: '',
          dutyId: '',
          id: ''
        },
        resIds: [],
        tableData: [
          {
            parentId: 131,
            value: 131,
            id: '首页',
            name: '首页',
            amount1: '首页',
            amount2: '引导页面，帮助您快速了解产品结构以及入门使用'
          },
          {
            parentId: 132,
            value: 145,
            id: '运营概览',
            name: '工作台',
            amount1: '工作台',
            amount2: '车辆运营状态以及各项指标全面概览，便于管理者快速了解车辆运行的各项数据指标'
          },
          {
            parentId: 132,
            name: '目标管理',
            value: 146,
            id: '运营概览',
            amount1: '目标管理',
            amount2: '设定预期月、季度、年的费用、安全、车辆整体使用率与实际管理数据对比，便于管理者做出决策调整'
          },
          {
            parentId: 132,
            value: 147,
            id: '运营概览',
            name: '运营分析',
            amount1: '运营分析',
            amount2: '车队整体运营数据概览，便于及时了解相关统计，查看具体明细数据，为管理决策提供数据支撑'
          },
          {
            parentId: 134,
            value: 124,
            id: '位置服务',
            name: '车辆定位',
            amount1: '车辆定位',
            amount2: '方便快捷查看车辆定位、历史轨迹、停靠点，及时了解车辆使用动向'
          },
          {
            parentId: 134,
            value: 125,
            id: '位置服务',
            name: '电子围栏',
            amount1: '电子围栏',
            amount2: '用于监控车辆驶入、驶出规定的区域范围，有告警消息提醒'
          },
          {
            parentId: 134,
            value: 151,
            id: '位置服务',
            name: '定向行驶',
            amount1: '定向行驶',
            amount2: '用于监控车辆按规定轨迹行驶，脱离轨迹范围，有告警消息提醒'
          },
          {
            parentId: 134,
            value: 126,
            id: '位置服务',
            name: '车况检测',
            amount1: '车况检测',
            amount2: '全面诊断检测机构车辆健康指数，便于发现车辆安全隐患，及时报修，同时避免过度使用，造成费用增加'
          },
          {
            parentId: 135,
            value: 101,
            id: '调度管理',
            name: '出行申请',
            amount1: '出行申请',
            amount2: '提供相关用车人员快捷提交用车申请单申请用车'
          },
          {
            parentId: 135,
            value: 102,
            id: '调度管理',
            name: '出行审批',
            amount1: '出行审批',
            amount2: '针对用车申请单进行同意、流转、拒绝等操作，进行相关审批动作'
          },
          {
            parentId: 135,
            value: 103,
            id: '调度管理',
            name: '出行派车',
            amount1: '出行派车',
            amount2: '调度人员、车辆管理员等角色，针对出行任务进行车辆以及司机任务分配'
          },
          {
            parentId: 135,
            value: 104,
            id: '调度管理',
            name: '调度概览',
            amount1: '调度概览',
            amount2: '调度人员查看车辆使用情况概况，了解车辆任务状态'
          },
          {
            parentId: 135,
            id: '调度管理',
            value: 188,
            name: '路线管理',
            amount1: '路线管理',
            amount2: '班车统一定制化服务'
          },
          {
            parentId: 136,
            value: 105,
            id: '日常事务',
            name: '规费管理',
            amount1: '规费管理',
            amount2: '常规费用管理，对平台车辆所产生的保养、年检、维修等产生费用进行记录'
          },
          {
            parentId: 136,
            value: 106,
            id: '日常事务',
            name: '油费管理',
            amount1: '油费管理',
            amount2: '营运车辆产生的油费记录，支持导入导出'
          },
          {
            parentId: 136,
            value: 107,
            id: '日常事务',
            name: '车辆事务',
            amount1: '车辆事务',
            amount2: '针对系统车辆的保养、年检、保险进行跟踪定期更新记录'
          },
          {
            parentId: 136,
            value: 108,
            id: '日常事务',
            name: '车务提醒',
            amount1: '车务提醒',
            amount2: '针对车辆的保养、 年检、保险到期提醒'
          },
          {
            parentId: 136,
            value: 109,
            id: '日常事务',
            name: '故障信息',
            amount1: '故障信息',
            amount2: '车辆存在故障时，平台主动上预警，通知管理人员及时处理'
          },
          {
            parentId: 137,
            value: 150,
            id: '统计报表',
            name: '费用统计',
            amount1: '费用统计',
            amount2: '费用统计分析'
          },
          // {
          //   parentId: 137,
          //   value: 151,
          //   id: '统计报表',
          //   name: '油耗统计',
          //   amount1: '油耗统计',
          //   amount2: '油耗统计分析'
          // },
          // {
          //   parentId: 137,
          //   value: 152,
          //   id: '统计报表',
          //   name: '里程统计',
          //   amount1: '里程统计',
          //   amount2: '里程统计分析'
          // },
          {
            parentId: 137,
            value: 153,
            id: '统计报表',
            name: '任务统计',
            amount1: '任务统计',
            amount2: '出行任务统计分析'
          },
          // {
          //   parentId: 137,
          //   value: 154,
          //   id: '统计报表',
          //   name: '行为统计',
          //   amount1: '行为统计',
          //   amount2: '驾驶行为统计分析'
          // },
          // {
          //   parentId: 137,
          //   value: 155,
          //   id: '统计报表',
          //   name: '设备异常统计',
          //   amount1: '设备异常统计',
          //   amount2: '设备异常统计分析'
          // },
          // {
          //   parentId: 137,
          //   value: 156,
          //   id: '统计报表',
          //   name: '司机考核',
          //   amount1: '司机考核',
          //   amount2: '司机考核统计分析'
          // },
          {
            parentId: 137,
            value: 157,
            id: '统计报表',
            name: '速度统计',
            amount1: '速度统计',
            amount2: '车机最大、平均、最小等速度统计分析'
          },
          {
            parentId: 138,
            value: 128,
            id: '平台功能',
            name: '客户管理',
            amount1: '客户管理',
            amount2: '平台自由功能'
          },
          {
            parentId: 138,
            value: 127,
            id: '平台功能',
            name: '设备管理',
            amount1: '设备管理',
            amount2: '平台自主设备管理功能'
          },
          {
            parentId: 138,
            value: 129,
            id: '平台功能',
            name: '官方公告',
            amount1: '官方公告',
            amount2: '官方公告展示与发布等'
          },
          {
            parentId: 138,
            value: 195,
            id: '平台功能',
            name: '服务列表',
            amount1: '服务列表',
            amount2: '平台给与定制化服务的展示列表'
          },
          {
            parentId: 138,
            value: 130,
            id: '平台功能',
            name: '意见列表',
            amount1: '意见列表',
            amount2: '平台自由功能'
          },
          {
            parentId: 139,
            value: 117,
            id: '系统设置',
            name: '企业信息',
            amount1: '企业信息',
            amount2: '通过企业信息录入组织架构，人员档案以及权限配置'
          },
          {
            parentId: 139,
            value: 119,
            id: '系统设置',
            name: '车辆档案',
            amount1: '车辆档案',
            amount2: '对持有车辆进行建档操作'
          },
          {
            parentId: 139,
            value: 120,
            id: '系统设置',
            name: '设备管理',
            amount1: '设备管理',
            amount2: '针对购买设备进行设备记录管理'
          },
          {
            parentId: 139,
            value: 115,
            id: '系统设置',
            name: '预警设置',
            amount1: '预警设置',
            amount2: '可设置告警规则，并针对所设置的参数，平台自动产生告警提醒消息'
          },
          {
            parentId: 139,
            value: 116,
            id: '系统设置',
            name: '审批设置',
            amount1: '审批设置',
            amount2: '审批设置的相关审批流程'
          },
          {
            parentId: 139,
            value: 122,
            id: '系统设置',
            name: '参数设置',
            amount1: '参数设置',
            amount2: '配置平台所需基本参数指标，例如职务、费用类型、用车类型等'
          },
          {
            parentId: 139,
            value: 123,
            id: '系统设置',
            name: '个人信息',
            amount1: '个人信息',
            amount2: '变更账号登录密码'
          },
          {
            parentId: 194,
            id: '微服务',
            value: 194,
            name: '微服务',
            amount1: '微服务',
            amount2: '企业移动端定制化服务，随时随地关注'
          },
          {
            parentId: 190,
            id: '公告消息',
            value: 190,
            name: '公告消息',
            amount1: '公告消息',
            amount2: '企业内部发布通知公告消息'
          },
          {
            parentId: 191,
            id: '反馈意见',
            value: 191,
            name: '反馈意见',
            amount1: '反馈意见',
            amount2: '提交系统使用过程中遇到的问题以及个性需求，反馈给官方'
          },
          {
            parentId: 192,
            id: '关于我们',
            value: 192,
            name: '关于我们',
            amount1: '关于我们',
            amount2: '关于我们'
          },
          {
            parentId: 193,
            value: 193,
            id: '帮助手册',
            name: '帮助手册',
            amount1: '帮助手册',
            amount2: '帮助手册'
          }
        ],
        limitNum: {
          a: 0,
          b: 0,
          c: 0,
          d: 0,
          e: 0,
          f: 0,
          g: 0,
          n1: 0
        },
        limitIds: [],
        userLimit: false, // 人员权限
        userLimitData: [], // 人员当前权限
        arr: []
      }
    },
    methods: {
      /**
       * 改变表格样式规则
       * @param row 当前行
       * @param column 当前列
       * @param rowIndex 当前行号
       * @param columnIndex 当前列号
       */
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          if (row.parentId === 131 || row.parentId === 190 || row.parentId === 191 || row.parentId === 192 || row.parentId === 193||row.parentId === 194) {
            return {
              rowspan: 1,
              colspan: 1
            }
          } else if ((rowIndex === (this.limitNum.n1)) && (this.limitNum.a != 0)) {
            return {
              rowspan: this.limitNum.a,
              colspan: 1
            }
          } else if ((rowIndex === (this.limitNum.a + this.limitNum.n1)) && (this.limitNum.b != 0)) {
            return {
              rowspan: this.limitNum.b,
              colspan: 1
            }
          } else if ((rowIndex === (this.limitNum.a + this.limitNum.b + this.limitNum.n1)) && (this.limitNum.c != 0)) {
            return {
              rowspan: this.limitNum.c,
              colspan: 1
            }
          } else if ((rowIndex === (this.limitNum.a + this.limitNum.b + this.limitNum.c + this.limitNum.n1)) && (this.limitNum.d != 0)) {
            return {
              rowspan: this.limitNum.d,
              colspan: 1
            }
          } else if ((rowIndex === (this.limitNum.a + this.limitNum.b + this.limitNum.c + this.limitNum.d + this.limitNum.n1)) && (this.limitNum.e != 0)) {
            return {
              rowspan: this.limitNum.e,
              colspan: 1
            }
          }else if ((rowIndex === (this.limitNum.a + this.limitNum.b + this.limitNum.c + this.limitNum.d + this.limitNum.e+this.limitNum.n1)) && (this.limitNum.f != 0)) {
            return {
              rowspan: this.limitNum.f,
              colspan: 1
            }
          } else if ((rowIndex === (this.limitNum.a + this.limitNum.b + this.limitNum.c + this.limitNum.d + this.limitNum.e+this.limitNum.f + this.limitNum.n1)) && (this.limitNum.g != 0)) {
            return {
              rowspan: this.limitNum.g,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      /**
       * 返回表格头部颜色class
       * @param row 当前行
       * @param rowIndex 当前行号
       */
      tableheaderClassName({row, rowIndex}) {
        return 'headColor'
      },
      /**
       * 选中需要绑定的权限
       */
      limitsChange(data) {
        this.limitIds=[]
        if (data) {
          for (var i = 0; i < data.length; i++) {
            this.limitIds.push(data[i].value)
          }
        }
      },
      /**
       * 返回权限列表页面
       */
      goBack() {
        if (this.$route.query.type) {
          this.$router.push({
            path: 'Company',
            query: {
              type:'institution'
            }
          })
        }else {
          this.$router.back(-1);
        }

        // this.$router.push({
        //   name: 'Parameter'
        // });
      },
      /**
       * 配置权限确定提交方法
       */
      addCarFuc() {
        // this.limitIds 权限id
        /** 判断是否是修改人员权限或者职务权限 **/
        if (this.$route.query.name === 'duty') {
          /* 职务权限 */
          this.getData('/user/confDuyRes', 'post', {dutyId: this.limit.dutyId, resIds:this.limitIds.join(',')}, true).then(res => {
            if (res.code === 0) {
              // this.$refs.limitTable.clearSelection()
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          /* 人员权限 */
          this.getData('/user/confUserRes', 'post', {id: this.limit.id, resIds: this.limitIds.join(',')}, true).then(res => {
            if (res.code === 0) {
              // this.$refs.limitTable.clearSelection()
            }
          }).catch(error => {
            console.log(error)
          })

        }
      },
      /**
       * 人员权限默认选中
       */
      checkedRow(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.limitTable.toggleRowSelection(row, true);
          })
        } else {
          this.$refs.limitTable.clearSelection()
        }
      },
      /**
       * 将字符串数组转化为数字数组
       * @param data 需要转化的数组
       */
      transferNum(data) {
        var arr = []
        for (var i = 0; i < data.length; i++) {
          arr.push(parseInt(data[i]))
        }
        return arr
      },
      /**
       * 判断数据是否存在于数组
       * @param arr 数组
       * @param value 数据
       * @returns {boolean} 是true，否false
       */
      isInArray(arr, value) {
        for (var i = 0; i < arr.length; i++) {
          if (value === arr[i]) {
            return true;
          }
        }
        return false;
      },
    },
    mounted() {
      /** 移除数组中某一个方法**/
      Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      }
      /** 获取权限ids设置权限数据**/
      if(getCookie('jiatu_userId')==='1'){  // 如果为最高级用户，默认全部权限
        for (var i = 0; i < this.tableData.length; i++) {
          this.arr.push(this.tableData[i])
        }
      }else{                                 // 如果非最高级用户，默认当前权限
        this.resIds = this.transferNum(getCookie('jiatu_resIds').split(','))
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.isInArray(this.resIds,this.tableData[i].value)) {
            this.arr.push(this.tableData[i])
          }
        }
      }
      /** 绑定权限数据**/
      this.tableData = this.arr
      /** 通过权限数据获取每一板块占多少个 **/
      for (var j = 0; j < this.tableData.length; j++) {
        if (this.tableData[j].id === '运营概览') { // 132
          this.limitNum.a++
        } else if (this.tableData[j].id === '位置服务') { // 134
          this.limitNum.b++
        } else if (this.tableData[j].id === '调度管理') { // 135
          this.limitNum.c++
        } else if (this.tableData[j].id === '日常事务') { // 136
          this.limitNum.d++
        } else if (this.tableData[j].id === '统计报表') { // 137
          this.limitNum.e++
        } else if (this.tableData[j].id === '平台功能') { // 138
          this.limitNum.f++
        } else if (this.tableData[j].id === '系统设置') { // 139
          this.limitNum.g++
        } else if (this.tableData[j].id === '首页') {
          this.limitNum.n1++
        }
      }

      /** 获取路由传过来的当前权限 **/
      if(this.$route.query.resIds){
        for(var i=0;i<this.arr.length;i++){
          if(this.isInArray(this.$route.query.resIds, this.arr[i].value)){
            this.userLimitData.push(this.arr[i])
          }
        }
        /** 默认选择人员已有权限 **/
        this.$nextTick(function (){
          this.checkedRow(this.userLimitData)
        })
      }
      /** 当从人员信息传过来的判断 **/
      if (this.$route.query.name != 'duty') {
        this.limit.person = this.$route.query.realName
        this.limit.duty = this.$route.query.dutyName
        this.limit.dutyId = this.$route.query.dutyId
        this.limit.id = this.$route.query.id
      }else {
        this.limit.duty = this.$route.query.dutyName
        this.limit.dutyId = this.$route.query.dutyId
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .limits {
    width: 100%;
    padding: 20px;
    .limits-main {
      background-color: white;
      .li-head {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #e4edf3;
        img {
          line-height: 50px;
          float: left;
          margin: 6px 10px 10px 20px;
          cursor: pointer;
        }
        span {
          line-height: 50px;
          font-size: 12px;
          float: left;
        }
      }
      .limits-sorts {
        padding: 20px;
        .li-tit {
          width: 100%;
          height: 60px;
          padding-left: 20px;
          background-color: #eef7ff;
          .el-dhtitle {
            float: left;
            line-height: 60px;
            margin-left: 10px;
            font-size: 14px;
            color: #7595c5;
            font-size: 14px;
          }
          .el-flag {
            float: left;
            font-size: 14px;
            line-height: 60px;
            color: green;
            font-size: 14px;
            margin-left: 20px;
            border-radius: 10px;
          }
        }
      }
      .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
        padding-left: 14px;
      }
    }
  }

</style>
