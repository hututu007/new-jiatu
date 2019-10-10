<template>
  <el-scrollbar class="slidebar" wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#324e80"
      text-color="#91abd9"
      :unique-opened="true"
      active-text-color="#fff"
      @select="select"
    >
      <hamburger class="hamburger-container" id="hamburger" :toggleClick="toggleSideBar"
                 :isActive="sidebar.opened"></hamburger>
      <sidebar-item v-for="route in routeList" :key="route.name" :item="route" :base-path="route.path"
                    :menu-index="menuIndex"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>
<script>

  import {mapGetters} from 'vuex'
  import store from '@/store'
  import SidebarItem from './SidebarItem'
  import Hamburger from '@/components/Hamburger'
  import Layout from '../../Layout'
  import {getCookie, setCookie} from '@/utils/auth'
  /*定义全部路由数据*/
  export default {
    components: {SidebarItem, Hamburger},
    data() {
      return {
        menuIndex: "",
        routeData: [
          {
            path: '/dashboard',
            component: Layout,
            name: 'Dashboard',
            value: 131,
            meta: {title: '首页', icon: 'home'},
            children: [{
              path: 'dashboard',
              name: 'First',
              value: 131,
              component: () => import('@/views/dashboard/index'),
              meta: {title: '首页', icon: 'home'}
            }]
          },
          {
            path: '/example',
            component: Layout,
            redirect: '/example/workbench',
            name: 'Example',
            value: 132,
            meta: {title: '运营概览', icon: 'operate'},
            children: [
              {
                path: 'workbench',
                name: 'Workbench',
                value: 145,
                component: () => import('@/views/example/workbench/index'),
                meta: {title: '工作台', icon: 'page'}
              },
              {
                path: 'target',
                name: 'Target',
                value: 146,
                component: () => import('@/views/example/target/index'),
                meta: {title: '目标管理', icon: 'page'}
              },
              {
                path: 'jt-analysis',
                name: 'JtAnalysis',
                value: 147,
                component: () => import('@/views/example/JtAnalysis/index'),
                meta: {title: '运营分析', icon: 'page'}
              }
            ]
          },
          {
            path: '/vehicle-positioning',
            component: Layout,
            redirect: '/vehicle-positioning/gps',
            name: 'VehiclePositioning',
            value: 134,
            meta: {title: '位置服务', icon: 'map'},
            children: [
              {
                path: 'gps',
                name: 'Gps',
                value: 124,
                component: () => import('@/views/VehiclePositioning/gps/index'),
                meta: {title: '车辆定位', icon: 'page'}
              },
              {
                path: 'jt-electronic',
                name: 'Jtelectronic',
                value: 125,
                component: () => import('@/views/VehiclePositioning/jtelectronic/index'),
                meta: {title: '电子围栏', icon: 'page'}
              },
              {
                path: 'test',
                name: 'Test',
                value: 126,
                component: () => import('@/views/VehiclePositioning/test/index'),
                meta: {title: '车况检测', icon: 'page'}
              },
              {
                path: 'directional-driving',
                name: 'directional-driving',
                value: 151,
                component: () => import('@/views/VehiclePositioning/directionalDriving/index'),
                meta: {title: '定向行驶', icon: 'page'}
              }

            ]
          },
          {
            path: '/scheduling-management',
            component: Layout,
            redirect: '/scheduling-management/gps',
            name: 'SchedulingManagement',
            value: 135,
            meta: {title: '调度管理', icon: 'dispatch'},
            children: [
              {
                path: 'travelapplication',
                name: 'TravelApplication',
                value: 101,
                component: () => import('@/views/SchedulingManagement/travelApplication/index'),
                meta: {title: '出行申请', icon: 'page'}
              },
              {
                path: 'travelapproval',
                name: 'TravelApproval',
                value: 102,
                component: () => import('@/views/SchedulingManagement/travelApproval/index'),
                meta: {title: '出行审批', icon: 'page'}
              },
              {
                path: 'truckingorder',
                name: 'TruckingOrder',
                value: 103,
                component: () => import('@/views/SchedulingManagement/truckingOrder/index'),
                meta: {title: '出行派车', icon: 'page'}
              },
              {
                path: 'schedulingview',
                name: 'SchedulingView',
                value: 104,
                component: () => import('@/views/SchedulingManagement/SchedulingView/index'),
                meta: {title: '调度概览', icon: 'page'}
              },
              {
                path: 'route',
                name: 'Route',
                value: 188,
                component: () => import('@/views/SchedulingManagement/route/index'),
                meta: {title: '路线管理', icon: 'page'}
              }
            ]
          },
          {
            path: '/daily-things',
            component: Layout,
            redirect: '/daily-things/carfault',
            name: 'DailyThings',
            value: 136,
            meta: {title: '日常事务', icon: 'day'},
            children: [
              {
                path: 'carfault',
                name: 'CarFault',
                value: 109,
                component: () => import('@/views/DailyThings/CarFault/index'),
                meta: {title: '车辆故障', icon: 'page'}
              },
              {
                path: 'carremind',
                name: 'CarRemind',
                value: 108,
                component: () => import('@/views/DailyThings/carRemind/index'),
                meta: {title: '车务提醒', icon: 'page'}
              },
              {
                path: 'carthings',
                name: 'CarThings',
                value: 107,
                component: () => import('@/views/DailyThings/carThings/index'),
                meta: {title: '车辆事务', icon: 'page'}
              },
              {
                path: 'feesmanagement',
                name: 'FeesManagement',
                value: 105,
                component: () => import('@/views/DailyThings/feesManagement/index'),
                meta: {title: '规费管理', icon: 'page'}
              },
              {
                path: 'oilmanagement',
                name: 'OilManagement',
                value: 106,
                component: () => import('@/views/DailyThings/oilManagement/index'),
                meta: {title: '加油管理', icon: 'page'}
              }
            ]
          },
          {
            path: '/Total-form',
            component: Layout,
            redirect: '/TotalForm/cost',
            name: 'TotalForm',
            value: 137,
            meta: {title: '统计报表', icon: 'total'},
            children: [
              {
                path: 'cost',
                name: 'cost',
                value: 150,
                component: () => import('@/views/TotalForm/cost/index'),
                meta: {title: '费用统计', icon: 'page'}
              },
              {
                path: 'reportRw',
                name: 'reportRw',
                value: 153,
                component: () => import('@/views/TotalForm/reportRw/index'),
                meta: {title: '任务统计', icon: 'page'}
              },
              {
                path: 'fastWarn',
                name: 'FastWarn',
                value: 157,
                component: () => import('@/views/TotalForm/FastWarn/index'),
                meta: {title: '速度统计', icon: 'page'}
              }
            ]
          },
          {
            path: '/platform-function',
            component: Layout,
            redirect: '/PlatformFunction/customer',
            name: 'PlatformFunction',
            value: 138,
            meta: {title: '平台功能', icon: 'platform'},
            children: [
              {
                path: 'customer',
                name: 'Customer',
                value: 128,
                component: () => import('@/views/PlatformFunction/customer/index'),
                meta: {title: '客户管理', icon: 'page'}
              },
              {
                path: 'equipment',
                name: 'Equipment1',
                value: 127,
                component: () => import('@/views/PlatformFunction/equipment/index'),
                meta: {title: '设备管理', icon: 'page'}
              },
              {
                path: 'officialinfo',
                name: 'OfficialInfo',
                value: 129,
                component: () => import('@/views/PlatformFunction/officialinfo/index'),
                meta: {title: '官方公告', icon: 'page'}
              },
              {
                path: 'weServe',
                name: 'WeServe',
                value: 195,
                component: () => import('@/views/PlatformFunction/weServe/index'),
                meta: {title: '服务列表', icon: 'page'}
              },
              {
                path: 'feedback',
                name: 'Feedback',
                value: 130,
                component: () => import('@/views/PlatformFunction/feedback/index'),
                meta: {title: '意见反馈', icon: 'page'}
              }
            ]
          },
          {
            path: '/system-settings',
            component: Layout,
            redirect: '/SystemSettings/company',
            name: 'SystemSettings',
            meta: {title: '系统设置', icon: 'system'},
            value: 139,
            children: [
              {
                path: 'company',
                name: 'Company',
                value: 117,
                component: () => import('@/views/SystemSettings/company/index'),
                meta: {title: '企业信息', icon: 'page'}
              },
              {
                path: 'car-archives',
                name: 'CarArchives',
                value: 119,
                component: () => import('@/views/SystemSettings/carArchives/index'),
                meta: {title: '车辆档案', icon: 'page'}
              },
              {
                path: 'equipment',
                name: 'Equipment',
                value: 120,
                component: () => import('@/views/SystemSettings/equipment/index'),
                meta: {title: '设备管理', icon: 'page'}
              },
              {
                path: 'parameter',
                name: 'Parameter',
                value: 122,
                component: () => import('@/views/SystemSettings/parameter/index'),
                meta: {title: '参数设置', icon: 'page'}
              },
              {
                path: 'warning',
                name: 'Warning',
                value: 115,
                component: () => import('@/views/SystemSettings/warning/index'),
                meta: {title: '预警设置', icon: 'page'}
              },
              {
                path: 'approval',
                name: 'Approval',
                value: 116,
                component: () => import('@/views/SystemSettings/approval/index'),
                meta: {title: '审批设置', icon: 'page'}
              },
              {
                path: 'changepassword',
                name: 'ChangePassword',
                value: 123,
                component: () => import('@/views/SystemSettings/changePassword/index'),
                meta: {title: '个人信息', icon: 'page'}
              }
            ]
          },
          {
            path: '/microServices/index',
            component: Layout,
            name: 'microServices',
            meta: {title: '微服务', icon: 'microServices'},
            value: 194,
            children: [{
              path: 'microServices',
              value: 194,
              name: 'microServices',
              component: () => import('@/views/microServices/index'),
              meta: {title: '微服务', icon: 'microServices'}
            }]
          },
          {
            path: '/notice',
            component: Layout,
            name: 'Notice',
            meta: {title: '公告消息', icon: 'notice'},
            value: 190,
            children: [{
              path: 'notice',
              value: 190,
              name: 'notice',
              component: () => import('@/views/notice/index'),
              meta: {title: '公告消息', icon: 'notice'}
            }]
          },
          {
            path: '/help',
            component: Layout,
            name: 'Help',
            meta: {title: '帮助手册', icon: 'help'},
            value: 193,
            children: [{
              path: 'help',
              name: 'help',
              value: 193,
              component: () => import('@/views/help/index'),
              meta: {title: '帮助手册', icon: 'help'}
            }]
          },
          {
            path: '/aboutMe',
            component: Layout,
            name: 'AboutMe',
            meta: {title: '关于我们', icon: 'we'},
            value: 192,
            children: [{
              path: 'aboutMe',
              name: 'aboutMe',
              value: 192,
              component: () => import('@/views/aboutMe/index'),
              meta: {title: '关于我们', icon: 'we'}
            }]
          },
          {
            path: '/feedBack',
            component: Layout,
            name: 'FeedBack',
            meta: {title: '反馈意见', icon: 'feedback'},
            value: 191,
            children: [{
              path: 'feedBack',
              name: 'feedBack',
              value: 191,
              component: () => import('@/views/feedBack/index'),
              meta: {title: '反馈意见', icon: 'feedback'}
            }]
          }
        ],
        arr: [
          {
            path: '/dashboard',
            component: Layout,
            name: 'Dashboard',
            value: 131,
            meta: {title: '首页', icon: 'home'},
            children: [{
              path: 'dashboard',
              name: 'First',
              value: 131,
              component: () => import('@/views/dashboard/index'),
              meta: {title: '首页', icon: 'home'}
            }]
          },
          {
            path: '/example',
            component: Layout,
            redirect: '/example/workbench',
            name: 'Example',
            value: 132,
            meta: {title: '运营概览', icon: 'operate'},
            children: [
              {
                path: 'workbench',
                name: 'Workbench',
                value: 145,
                component: () => import('@/views/example/workbench/index'),
                meta: {title: '工作台', icon: 'page'}
              },
              {
                path: 'target',
                name: 'Target',
                value: 146,
                component: () => import('@/views/example/target/index'),
                meta: {title: '目标管理', icon: 'page'}
              },
              {
                path: 'jt-analysis',
                name: 'JtAnalysis',
                value: 147,
                component: () => import('@/views/example/JtAnalysis/index'),
                meta: {title: '运营分析', icon: 'page'}
              }
            ]
          },
          {
            path: '/vehicle-positioning',
            component: Layout,
            redirect: '/vehicle-positioning/gps',
            name: 'VehiclePositioning',
            value: 134,
            meta: {title: '位置服务', icon: 'map'},
            children: [
              {
                path: 'gps',
                name: 'Gps',
                value: 124,
                component: () => import('@/views/VehiclePositioning/gps/index'),
                meta: {title: '车辆定位', icon: 'page'}
              },
              {
                path: 'jt-electronic',
                name: 'Jtelectronic',
                value: 125,
                component: () => import('@/views/VehiclePositioning/jtelectronic/index'),
                meta: {title: '电子围栏', icon: 'page'}
              },
              {
                path: 'test',
                name: 'Test',
                value: 126,
                component: () => import('@/views/VehiclePositioning/test/index'),
                meta: {title: '车况检测', icon: 'page'}
              },
              {
                path: 'directional-driving',
                name: 'directional-driving',
                value: 151,
                component: () => import('@/views/VehiclePositioning/directionalDriving/index'),
                meta: {title: '定向行驶', icon: 'page'}
              }
            ]
          },
          {
            path: '/scheduling-management',
            component: Layout,
            redirect: '/scheduling-management/gps',
            name: 'SchedulingManagement',
            value: 135,
            meta: {title: '调度管理', icon: 'dispatch'},
            children: [
              {
                path: 'travelapplication',
                name: 'TravelApplication',
                value: 101,
                component: () => import('@/views/SchedulingManagement/travelApplication/index'),
                meta: {title: '出行申请', icon: 'page'}
              },
              {
                path: 'travelapproval',
                name: 'TravelApproval',
                value: 102,
                component: () => import('@/views/SchedulingManagement/travelApproval/index'),
                meta: {title: '出行审批', icon: 'page'}
              },
              {
                path: 'truckingorder',
                name: 'TruckingOrder',
                value: 103,
                component: () => import('@/views/SchedulingManagement/truckingOrder/index'),
                meta: {title: '出行派车', icon: 'page'}
              },
              {
                path: 'schedulingview',
                name: 'SchedulingView',
                value: 104,
                component: () => import('@/views/SchedulingManagement/SchedulingView/index'),
                meta: {title: '调度概览', icon: 'page'}
              },
              {
                path: 'route',
                name: 'Route',
                value: 188,
                component: () => import('@/views/SchedulingManagement/route/index'),
                meta: {title: '路线管理', icon: 'page'}
              }
            ]
          },
          {
            path: '/daily-things',
            component: Layout,
            redirect: '/daily-things/carfault',
            name: 'DailyThings',
            value: 136,
            meta: {title: '日常事务', icon: 'day'},
            children: [
              {
                path: 'carfault',
                name: 'CarFault',
                value: 109,
                component: () => import('@/views/DailyThings/CarFault/index'),
                meta: {title: '车辆故障', icon: 'page'}
              },
              {
                path: 'carremind',
                name: 'CarRemind',
                value: 108,
                component: () => import('@/views/DailyThings/carRemind/index'),
                meta: {title: '车务提醒', icon: 'page'}
              },
              {
                path: 'carthings',
                name: 'CarThings',
                value: 107,
                component: () => import('@/views/DailyThings/carThings/index'),
                meta: {title: '车辆事务', icon: 'page'}
              },
              {
                path: 'feesmanagement',
                name: 'FeesManagement',
                value: 105,
                component: () => import('@/views/DailyThings/feesManagement/index'),
                meta: {title: '规费管理', icon: 'page'}
              },
              {
                path: 'oilmanagement',
                name: 'OilManagement',
                value: 106,
                component: () => import('@/views/DailyThings/oilManagement/index'),
                meta: {title: '加油管理', icon: 'page'}
              }
            ]
          },
          {
            path: '/Total-form',
            component: Layout,
            redirect: '/TotalForm/cost',
            name: 'TotalForm',
            value: 137,
            meta: {title: '统计报表', icon: 'total'},
            children: [
              {
                path: 'cost',
                name: 'cost',
                value: 150,
                component: () => import('@/views/TotalForm/cost/index'),
                meta: {title: '费用统计', icon: 'page'}
              },
              {
                path: 'reportRw',
                name: 'reportRw',
                value: 153,
                component: () => import('@/views/TotalForm/reportRw/index'),
                meta: {title: '任务统计', icon: 'page'}
              },
              {
                path: 'fastWarn',
                name: 'FastWarn',
                value: 157,
                component: () => import('@/views/TotalForm/FastWarn/index'),
                meta: {title: '速度统计', icon: 'page'}
              }
            ]
          },

          {
            path: '/platform-function',
            component: Layout,
            redirect: '/PlatformFunction/customer',
            name: 'PlatformFunction',
            value: 138,
            meta: {title: '平台功能', icon: 'platform'},
            children: [
              {
                path: 'customer',
                name: 'Customer',
                value: 128,
                component: () => import('@/views/PlatformFunction/customer/index'),
                meta: {title: '客户管理', icon: 'page'}
              },
              {
                path: 'equipment',
                name: 'Equipment1',
                value: 127,
                component: () => import('@/views/PlatformFunction/equipment/index'),
                meta: {title: '设备管理', icon: 'page'}
              },
              {
                path: 'officialinfo',
                name: 'OfficialInfo',
                value: 129,
                component: () => import('@/views/PlatformFunction/officialinfo/index'),
                meta: {title: '官方公告', icon: 'page'}
              },
              {
                path: 'weServe',
                name: 'WeServe',
                value: 195,
                component: () => import('@/views/PlatformFunction/weServe/index'),
                meta: {title: '服务列表', icon: 'page'}
              },
              {
                path: 'feedback',
                name: 'Feedback',
                value: 130,
                component: () => import('@/views/PlatformFunction/feedback/index'),
                meta: {title: '意见反馈', icon: 'page'}
              }
            ]
          },
          {
            path: '/system-settings',
            component: Layout,
            redirect: '/SystemSettings/company',
            name: 'SystemSettings',
            meta: {title: '系统设置', icon: 'system'},
            value: 139,
            children: [
              {
                path: 'company',
                name: 'Company',
                value: 117,
                component: () => import('@/views/SystemSettings/company/index'),
                meta: {title: '企业信息', icon: 'page'}
              },
              {
                path: 'car-archives',
                name: 'CarArchives',
                value: 119,
                component: () => import('@/views/SystemSettings/carArchives/index'),
                meta: {title: '车辆档案', icon: 'page'}
              },
              {
                path: 'equipment',
                name: 'Equipment',
                value: 120,
                component: () => import('@/views/SystemSettings/equipment/index'),
                meta: {title: '设备管理', icon: 'page'}
              },
              {
                path: 'parameter',
                name: 'Parameter',
                value: 122,
                component: () => import('@/views/SystemSettings/parameter/index'),
                meta: {title: '参数设置', icon: 'page'}
              },
              {
                path: 'warning',
                name: 'Warning',
                value: 115,
                component: () => import('@/views/SystemSettings/warning/index'),
                meta: {title: '预警设置', icon: 'page'}
              },
              {
                path: 'approval',
                name: 'Approval',
                value: 116,
                component: () => import('@/views/SystemSettings/approval/index'),
                meta: {title: '审批设置', icon: 'page'}
              },
              {
                path: 'changepassword',
                name: 'ChangePassword',
                value: 123,
                component: () => import('@/views/SystemSettings/changePassword/index'),
                meta: {title: '个人信息', icon: 'page'}
              }
            ]
          },
          {
            path: '/microServices/index',
            component: Layout,
            name: 'microServices',
            meta: {title: '微服务', icon: 'microServices'},
            value: 194,
            children: [{
              path: 'microServices',
              value: 194,
              name: 'microServices',
              component: () => import('@/views/microServices/index'),
              meta: {title: '微服务', icon: 'microServices'}
            }]
          },
          {
            path: '/notice',
            component: Layout,
            name: 'Notice',
            meta: {title: '公告消息', icon: 'notice'},
            value: 190,
            children: [{
              path: 'notice',
              value: 190,
              name: 'notice',
              component: () => import('@/views/notice/index'),
              meta: {title: '公告消息', icon: 'notice'}
            }]
          },
          {
            path: '/help',
            component: Layout,
            name: 'Help',
            meta: {title: '帮助手册', icon: 'help'},
            value: 193,
            children: [{
              path: 'help',
              name: 'help',
              value: 193,
              component: () => import('@/views/help/index'),
              meta: {title: '帮助手册', icon: 'help'}
            }]
          },
          {
            path: '/aboutMe',
            component: Layout,
            name: 'AboutMe',
            meta: {title: '关于我们', icon: 'we'},
            value: 192,
            children: [{
              path: 'aboutMe',
              name: 'aboutMe',
              value: 192,
              component: () => import('@/views/aboutMe/index'),
              meta: {title: '关于我们', icon: 'we'}
            }]
          },
          {
            path: '/feedBack',
            component: Layout,
            name: 'FeedBack',
            meta: {title: '反馈意见', icon: 'feedback'},
            value: 191,
            children: [{
              path: 'feedBack',
              name: 'feedBack',
              value: 191,
              component: () => import('@/views/feedBack/index'),
              meta: {title: '反馈意见', icon: 'feedback'}
            }]
          }
        ],
        routeList: [],
        BarList:[],
        resIds: []
      }
    },
    computed: {
      ...mapGetters([
        'sidebar','barList'
      ]),
      routes() {
        return this.$router.options.routes
      },
      isCollapse() {
        return !this.sidebar.opened
      }
    },
    methods: {
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
       *  判断是否在数组内
       */
      isInArray(arr, value) {
        for (var i = 0; i < arr.length; i++) {
          if (value === arr[i]) {
            return true;
          }
        }
        return false;
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      /**
       * 菜单激活回调
       */
      select(index) {
        this.menuIndex = index;
      }
    },
    mounted() {
      this.menuIndex = this.$route.path

      /*权限列表 共35个 */
      if (getCookie('jiatu_resIds')) {
        this.resIds = this.transferNum(getCookie('jiatu_resIds').split(','))
        /**
         *  数组删除方法
         * @param val 传入的数组
         */
        Array.prototype.remove = function (val) {
          var index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        }
        for (var i = 0; i < this.arr.length; i++) {
          let n=this.arr[i].children.length
          while (n--){
            if(this.isInArray(this.resIds, this.routeData[i].children[n].value) === false){
              console.log(this.routeData[i].children[n].value)
              this.routeData[i].children.splice(n, 1)
            }
          }
        }
        for (var i = 0; i < this.routeData.length; i++) {
          if (this.routeData[i].children.length > 0) {
            this.routeList.push(this.routeData[i])
          }
        }

        for(var m = 0; m < this.routeList.length; m++){
          for(var n = 0; n < this.routeList[m].children.length; n++){
            if(this.routeList[m].path.substr(1,this.routeList[0].path.length-1)===this.routeList[m].children[0].path){
              this.BarList.push({
                path: this.routeList[m].path,
                value: this.routeList[m].children[n].value,
                name: this.routeList[m].children[n].meta.title
              })
            }else{
              this.BarList.push({
                path: this.routeList[m].path+"/"+this.routeList[m].children[n].path,
                value: this.routeList[m].children[n].value,
                name: this.routeList[m].children[n].meta.title
              })
            }

          }
        }
         store.commit('BAR_LIST', this.BarList)
      } else {
        this.routeList = []
      }
    }
  }
</script>
<style>
  .hamburger-container {
    height: 30px;
    line-height: 30px;
    background: #3a5992;
  }

  .slidebar .el-menu-item {
    height: 45px;
    line-height: 45px;
  }

  .slidebar .el-menu-item i {
    color: #91abd9;
  }

  .slidebar .el-submenu__title {
    height: 45px;
    line-height: 45px;
  }

  .slidebar .el-submenu .el-menu-item {
    height: 40px;
    line-height: 40px;
  }

  #app .sidebar-container .svg-icon {
    vertical-align: middle;
  }


</style>
