<template>
  <div id="state" class="follow">
    <div class="state-top" style="display:none">
      <ul class="state-top-one">
        <li class="Setdisplay"><span @click="MeSetdisplay()">显示设置</span>
          <!-- 卡片-显示设置 -->
          <el-card class="Setdisplay-box-card" style="z-index:1" v-show="Setdisplay">
            <div class="text item" style="height:32px;" v-for="val in Switch" :key="val.label">
              <!--<switc :Switchdata='val'/>-->
            </div>
          </el-card>
          <!-- end -->
        </li>

        <li class="tool">
          <span @click="MeSetool()">工具</span>
        </li>
        <!-- 卡片-显示设置 -->
        <el-card class="SetTool-box-card" style="z-index:1" v-show="ToolShow">
          <li style="padding:0 10px;font-size:12px;color:#666;width:100%;" v-for="val in Tool" :key="val.label">
            {{val.label}}
          </li>
        </el-card>
        <!-- end -->
      </ul>
    </div>
    <!-- 地图-轨迹 -->
    <run-map></run-map>
    <!-- 指定某辆车的信息 -->
    <left-card :Cardatadisplay="cardatadisplay" :carId="carId" :carState='carStateNum'></left-card>
  </div>
</template>

<script>
  // import switc from '../public/form/Switch'
  import runMap from './runMap'
  import leftCard from  './leftCard'
  export default {
    components: {
      // top-开关
      // switc,
      // 表单
      // 轨迹动态组件
      runMap, leftCard
    },
    data() {
      return {
        // top 显示设置的初始状态
        Setdisplay: false,
        ToolShow: false,
        cardatadisplay: true,
        Vuetransform: true,
        // state-SearchCar-Card-right tabs选项卡的默认选项
        activeName: 'first',
        carStateNum:"",
        label: '',
        top: '',
        // Switct 右top显示设置
        Switch: [
          {label: '显示车牌号', class: 'state-display-chepaihao'},
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
        date: '',
        license: '',
        carId:''
      };
    },
    created() {
      /**
       *  通过bus监听由子组件定时器数据改变-相对应传到父组件的数据
       */
      this.$bus.on('interval', (val) => {
        this.carId=val
        this.$bus.$emit('oneCarState',val)
      });
    },
    methods: {
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
    },
    mounted() {
      this.carId = this.$route.params.carId;
      if (this.$route.params.carState) {
        this.carStateNum = this.$route.params.carState
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .blueBg {
    background-color: #dfefff;
  }

  .whiteBg {
    background-color: white;
  }
  .content .map {
    height: 100%;
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
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(0px);
    opacity: 0;
  }

  /* vue动画 */
  .state-SearchCar-Card-right {
    position: absolute;
    top: 60px;
    right: 0;
    /* position: relative; */
  }
  #state {
    position: relative;
  }
  #app .content #state {
    height: 100%;
    height: 100%;
  }

  #state .state-top .text {
    font-size: 14px;
  }

  #state .state-top .Setdisplay .item {
    padding: 20px 0;
    border-bottom: 1px dashed #ccc;
  }

  #state .state-top .item:nth-last-child(1) {
    border: 0;
  }

  #state .state-top .Setdisplay {
    position: relative;
  }

  #state .state-top .tool {
    position: relative;
  }

  #state .state-top .Setdisplay-box-card {
    width: 180px;
    position: absolute;
    left: -90px;
  }

  #state .state-top .Setdisplay-box-card {
    width: 180px;
    position: absolute;
    left: -83px;
    top: 33px;
    z-index: 222 !important;
  }

  #state .state-top .SetTool-box-card {
    width: 90px;
    position: absolute;
    right: 82px;
    top: 34px;
  }

  #state .state-top .SetTool-box-card .el-card__body {
    padding: 0;
  }

  #state .state-top .SetTool-box-card .el-card__body li:hover {
    background: #dfefff;
  }

  #state .state-top ul .Setdisplay-box-card {
    border-radius: 0;
    border: 0;
  }

  #state .state-top ul .Setdisplay-box-card .el-card__body {
    padding: 0;
  }

  #state .state-top ul .Setdisplay-box-card .el-card__body .item .el-switch {
    margin-top: -35px;
  }

  #state .state-top ul .Setdisplay-box-card .el-card__body .item .el-switch .el-switch__label span {
    color: #666666;
    font-size: 12px;
  }

  #state .state-top ul .Setdisplay-box-card .el-card__body .item .el-switch .el-switch__label {
    margin-right: 45px;
  }

  .state-display-chepaihao {
    /*margin-left: 14px;*/
  }

  #state .map .BMapLabel {
    width: 92px;
    height: 28px;
    background-color: #5b8ee2 !important;
    border: 0 !important;
    padding-left: 5px !important;
    padding-top: 5px !important;
    position: relative;
  }

  #state .map .BMapLabel > span:nth-child(1)::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #70ce8d;
    margin-left: 8px;
    margin-right: 6px;
    border-radius: 15px;
  }

  #state .map .BMapLabel > line {
    width: 86px;
    height: 22px;
    display: inline-block;
    position: absolute;
    left: 3px;
    top: 3px;
    border: 1px solid #8db0eb;
  }

  #state .map .BMapLabel > cursor {
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

  #state {
    position: relative;
  }

  #state div p .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
    margin: 0 20px;
  }

  #state div p span div .el-tabs .el-tabs__header .is-scrollable .el-tabs__nav-scroll .el-tabs__nav div {
    background-color: orange;
    font-size: 12px;
    /* width:5%; */
  }

  #state div p span div div .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item {
    left: 0;
  }

  #state .state-top {
    width: 100%;
    /* position: relative;
    left:-20px; */
    height: 30px;
    background-color: #4365a3;
  }

  #state .state-top li {
    cursor: pointer;
    float: left;
    color: #88a3d2;
    display: inline-block;
    line-height: 30px;
    padding: 0 20px;
    font-size: 1em;
  }

  #state .state-top .tool {
    float: right;
    position: relative;
  }

  #state .state-top .tool::before {
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

  #state .state-top .Setdisplay {
    float: right;
    position: relative;
  }

  #state .state-top .Setdisplay::before {
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
    .el-tabs__nav-wrap {
      width: 100%;
    }
  }

  .state-top-one {
    position: relative;
  }

</style>
