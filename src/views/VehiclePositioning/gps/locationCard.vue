<template>
  <div class="location-card fn-shadow">
    <div @click="Vuetransform = !Vuetransform"
         :class="Vuetransform? 'dian-SearchCar-Card-right-buttom' : 'dian-SearchCar-Card-right-buttom1'"></div>
    <transition name="slide-fade" v-if="Vuetransform">
      <div class="slide-right">
        <el-input
          placeholder="请输入车牌号"
          v-model="val.license"
          @keyup.enter.native="search" 
          >
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="search"
            >
          </i>
        </el-input>

        <jt-more-select ref="moreSelect" @moreCheck="moreCheck"></jt-more-select>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="carGpsList"></el-tab-pane>
          <el-tab-pane label="任务" name="gpsList_9"></el-tab-pane>
          <el-tab-pane label="空闲" name="gpsList_8"></el-tab-pane>
          <el-tab-pane label="异常" name="gpsList_1"></el-tab-pane>
        </el-tabs>
        <div class="carList">
          <p>车辆总数：{{locationList.length>0? locationList.length:'--'}}辆</p>
          <ul id="scrollGps">
            <li  v-for="(item,index) in locationList" :key="item.carId" :class="liId===item.carId?'activeLi':''" @click="carListClick(item,index)">
              <p>
                <img :src="item.logo" >
              </p>
              <p>
                <span>{{item.license}}</span>
                <span class="out_p">{{item.orgName}}</span>
              </p>
              <p>
                <span
                  :class="'activeState' + item.carState"
                >{{item.carState | status({0:'行驶', 1: '熄火', 2:'超速',3:'怠速', 4: '疲劳', 5: '故障', 6: '拔出', 'null': '拔出'})}}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import JtMoreSelect from '@/components/Jtmoreselect'

  export default {
    name: "locationCard",
    components: {JtMoreSelect},
    props:['locationList'],
    data() {
      return {
        val: {
          license: '',
          orgIds: [],
        },
        activeName: 'carGpsList',
        Vuetransform: true,
        liId:"",
      }
    },
    created(){
      //车辆状态点击触发
      this.$bus.$on('carInfoClick',(val)=>{
        if (val.latitude===null||val.longitude===null) {
          this.$message({
            showClose: true,
            message: '该车辆数据异常！',
            type: 'warning'
          });
          return;
        }
        this.liId=val.carId;
        this.$emit('carSelect',val);
      })
    },
    mounted() {
      this.gpsScroolTop()
    },
    methods: {
      gpsScroolTop(){
        var scrollDiv = document.getElementById('scrollGps');
        //绑定事件
        scrollDiv.addEventListener('scroll', function() {
        });
      },
      moreCheck(ids) {
        this.val.orgIds = ids.join(',')
        this.$emit('search',this.val)
      },
      handleClick(val) {
        this.$emit('tabsClick', val.name)
      },
      carListClick(val,index){
        if (val.latitude===null||val.longitude===null) {
           this.$message({
            showClose: true,
            message: '该车辆数据异常！',
            type: 'warning'
          }); 
          return;
        }
        this.liId=val.carId;
        this.$emit('carSelect',val,index);
      },
      search() {
        if (this.val.orgIds==[]||this.val.orgIds=="") {
          this.val = {
            license: this.val.license
          } 
        }
        this.$emit('search',this.val)
      }
    },
   
    watch: {
    },
    computed: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .location-card {
    position: fixed;
    border-radius: 2px;
    right: 20px;
    top: 110px;
    .el-tab-pane {
      padding: 0px;
    }
    .el-icon-search {
      cursor: pointer;
    }
    .el-icon-search:hover {
        color: blue
    }
    .slide-right {
      width: 280px;
      height: 480px;
      background-color: #fff;
      text-align: center;
      .el-input {
        width: 240px;
        margin-top: 20px;
        .el-input__inner {
          height: 28px;
          font-size: 12px;
          color: #666;
        }
        .el-input__icon {
          line-height: 28px;
        }
      }
      .el-tabs__header {
        margin: 0px;
      }
      .el-tabs__nav {
        transform: translateX(32px) !important;
        .el-tabs__item {
          font-size: 12px;
        }

      }
      .carList {
        width: 100%;
        overflow: hidden;
        & > p {
          width: 100%;
          height: 30px;
          background-color: #eff3f8;
          color: #8395ab;
          font-size: 12px;
          padding-left: 10px;
          display: flex;
          align-items: center;
        }
        ul {
          width: 100%;
          overflow-y: auto;
          height: 305px;
          /*滚动条样式*/
          &::-webkit-scrollbar {/*滚动条整体样式*/
            width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
          }
          &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
          }
          &::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(0,0,0,0.1);
          }
        }
        .activeLi{
          background-color: #dfefff;
        }
        ul > li {
          width: 100%;
          height: 50px;
          background-color: white;
          cursor: pointer;
          border-bottom: 1px dashed #d7e4ec;
          &>p{
            float: left;
          }
          & > p:nth-child(1) {
            width: 54px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 32px;
              height: 32px;
              border-radius: 100%;
            }
          }
          & > p:nth-child(2) {
            width: 162px;
            height:100%;
            span {
              width: 100%;
              font-size: 12px;
              float: left;
              text-align: left;
            }
            span:first-child{
              color: #365191;
              font-weight: bold;
              margin-bottom: 6px;
              margin-top: 10px;
            }
            span:last-child{
              color:#999999 ;
            }
          }
          & > p:nth-child(3){
            width:54px ;
            height: 100%;
            float: right;
            span{
              font-size: 12px;
              margin-top: 15px;
              width: 45px;
              height: 20px;
              display: block;
              padding-top: 3px;
              border-radius: 10px;
              border: 1px solid #ffc600;
              color:#ffc600 ;
            }
            //行驶
            .activeState0{
              border: 1px solid #71d189;
              color:#71d189 ;
            }
            //熄火
            .activeState1{
              border: 1px solid #8ba3c2;
              color:#8ba3c2 ;
            }
            // 超速
            .activeState2{
              border: 1px solid #f56767;
              color:#f56767 ;
            }
            //怠速
            .activeState3{
              border: 1px solid #55a8fd;
              color:#55a8fd ;
            }
            //疲劳驾驶
            .activeState4{
              border: 1px solid #736658;
              color:#736658 ;
            }
            //故障
            .activeState5{
              border: 1px solid #feb57f;
              color:#feb57f ;
            }
            //设备拔出
            .activeState6{
              border: 1px solid #ffc600;
              color:#ffc600 ;
            }

          }
        }
      }
    }
    .slide-fade-enter-active {
      transition: all .3s ease;
    }
    .slide-fade-leave-active {
      transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
      transform: translateX(10px);
      opacity: 0;
    }
    .dian-SearchCar-Card-right-buttom {
      height: 28px;
      width: 28px;
      background: #ffffff url('../../../../static/img/icons-sprites.png');
      background-position-x: -83px;
      background-position-y: -79px;
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
      background: #ffffff url('../../../../static/img/icons-sprites.png');
      background-position-x: -57px;
      background-position-y: -79px;
      box-shadow: 0px 0px 1px #888888;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      cursor: pointer;
      position: absolute;
      left: -28px;
      top: 20px;
    }
  }
</style>
