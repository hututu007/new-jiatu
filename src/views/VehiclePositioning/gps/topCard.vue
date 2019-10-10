<template>
  <div class="gps-top-card">
    <div class="dian-top">
      <ul class="dian-top-one">
        <li :style="topLabel" v-for="(staut, $index) in topCarState" :key="staut.label"
            @click="dianTopOneClick(staut, $index)">
          {{staut.label
          + '（'+ staut.Num +'）'}}
        </li>
        <li class="Setdisplay"><span @click="MeSetdisplay()">显示设置</span>
          <!-- 卡片-显示设置 -->
          <el-card class="Setdisplay-box-card fn-shadow1 fn-radius" style="z-index:1;padding: 10px" v-show="Setdisplay">
            <div class="text item" style="height:32px;" v-for="val in Switch" :key="val.label">
              <switc :Switchdata='val' @changeSwitch="changeSwitch"/>
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
  </div>
</template>

<script>
  import switc from '@/components/switch'
  export default {
    name: "topCard",
    components:{switc},
    props: ['topCarState'],
    data(){
      return{
        // 状态 top的状态查看
        topLabel: '',
        // Switct 右top显示设置
        Switch: [
          {label: '显示车牌号' , id:1},
          {label: '超速告警提醒', id:2},
          {label: '怠速告警提醒', id:3},
          {label: '插拔告警提醒', id:4},
        ],
        // Tool 右top的工具
        Tool: [
          {label: '实时路况'},
          {label: '测距'},
          {label: '标记'},
          {label: '围栏查车'},
        ],
        Setdisplay:false,
        ToolShow:false
      }
    },
    methods:{
      changeSwitch(val,id){
        this.$emit('showSettings',val,id)
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
       *  top Status 标签的点击事件
       */
      dianTopOneClick(staut, index) {
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
        this.$emit('tabsClick', staut.value)
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .gps-top-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .dian-top .text {
      font-size: 14px;
    }

    .dian-top .Setdisplay .item {
      padding: 20px 0;
      border-bottom: 1px dashed #ccc;
    }

    .dian-top .item:nth-last-child(1) {
      border: 0;
    }

    .dian-top .Setdisplay {
      position: relative;
    }

    .dian-top .tool {
      position: relative;
    }

    .dian-top .Setdisplay-box-card {
      width: 180px;
      position: absolute;
      left: -90px;
    }

    .dian-top .Setdisplay-box-card {
      width: 180px;
      position: absolute;
      left: -83px;
      top: 33px;
      z-index: 222 !important;
    }

    .dian-top .SetTool-box-card {
      width: 90px;
      position: absolute;
      right: 82px;
      top: 34px;
    }

    .dian-top .SetTool-box-card .el-card__body {
      padding: 0;
    }

    .dian-top .SetTool-box-card .el-card__body li:hover {
      background: #dfefff;
    }

    .dian-top ul .Setdisplay-box-card {
      border: 0;
      .text {
        .el-switch__label {
          width: 72px;
        }
      }
    }

    .dian-top ul .Setdisplay-box-card .el-card__body {
      padding: 0;
    }

    .dian-top ul .Setdisplay-box-card .el-card__body .item .el-switch {
      margin-top: -35px;
    }

    .dian-top ul .Setdisplay-box-card .el-card__body .item .el-switch .el-switch__label span {
      color: #666666;
      font-size: 12px;
    }

    .dian-top ul .Setdisplay-box-card .el-card__body .item .el-switch .el-switch__label {
      margin-right: 45px;
    }
    .dian-top {
      /* position: relative;
      left:-20px; */
      height: 30px;
      background-color: #4365a3;
    }
    .dian-top li {
      cursor: pointer;
      float: left;
      color: #91abd9;
      display: inline-block;
      line-height: 30px;
      padding: 0 20px;
      font-size: 12px;
      font-weight: bold;
    }
    .dian-top .tool {
      float: right;
      position: relative;
    }
    .dian-top .tool::before {
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
    .dian-top .Setdisplay {
      float: right;
      position: relative;
    }
    .dian-top .Setdisplay::before {
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
  }
</style>
