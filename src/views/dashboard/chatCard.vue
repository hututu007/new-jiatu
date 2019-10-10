<template>
  <div id="chatCard" class="chatCard-single">
    <el-dialog title="" width="1000px" :modal-append-to-body="false" :close-on-click-modal="false"
               :visible.sync="dialogShow" :before-close="handleClose">
      <ul class="main">
        <li class="chat-right">
          <div>
            <p>提醒消息</p>
            <div class="right-tit">
              <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="全部" name="first"></el-tab-pane>
                  <el-tab-pane label="已读" name="second"></el-tab-pane>
                  <el-tab-pane label="未读" name="third"></el-tab-pane>
                </el-tabs>
              </div>
              <div><img @click="sortShowClick" :src="imgList"/><img @click="MsgShowClick" :src="imgList1"/>
                <div class="msgSort" v-show="sortShow">
                  <p></p>
                  <ul>
                    <li v-for="(val,index) in msgSortData" :key="val.remindType" :class="sortIndex===index?'activeSort':''"
                        @click="sortClick(index,val.remindType)">{{val.name}}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="right-main">
              <ul>
                <li v-for="item in msgaData" :key="item.id">
                  <div class="right-img"><img src="../../../static/img/msg3.png"/></div>
                  <div class="right-text">
                    <p></p>
                    <p>{{'小助手提醒 ： 【'+item.reason+'】'+item.name}}<img style="cursor: pointer" @click="handleMsg(item)" :src="item.img"/></p>
                    <p>{{'【'+item.thing+'】'+item.dis}}</p>
                    <p>{{item.time}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li class="chat-left">
          <div class="search" style="margin-top: 10px;padding: 0px 10px">
            <!--<input type="text"  v-model="input5" placeholder="搜索" @keyup="searchPeople(input5)"/>-->
            <el-input
              v-model="input5" placeholder="搜索" @keyup="searchPeople(input5)"
              suffix-icon="el-icon-search"
              >
            </el-input>
          </div>
          <div class="chat-sort" style="margin-top: 10px;padding: 0px 10px;overflow:hidden;height: 36px">
            <p @click="msgListClick" :class="(imgshow1===true) ? 'activeChat0' : 'activeChat1'"></p>
            <p @click="peopleListClick" :class="(imgshow2===true) ? 'activeChat3' : 'activeChat2'"></p>
          </div>
          <div class="left-main">
            <!-- 消息列表 -->
            <ul class="msg" v-show="imgshow1">
              <li :class="msgIndex===index?'activeMsg':''" v-for="(item,index) in msgsList" @click="msgClick(index)">
                <div><img :src="item.img"/></div>
                <div>
                  <p>{{item.tit}}</p>
                  <p>{{item.name}}</p>
                </div>
              </li>
            </ul>
            <!-- 联系人列表 -->
            <ul class="people" v-show="imgshow2" @scroll="woListScroll($event)" >
              <li v-for="(item,key,index0) in peopleDta">
                <p>{{key}}</p>
                <ul>
                  <li v-for="(val,index) in item" :class="peopleIndex1===index&&peopleIndex0===index0?'activePeople':''"
                      @mouseover="onePeopleOver(index,index0,key,val)" @mouseout="onePeopleOut()">
                    <img src="../../../static/img/msg4_03.png"/>
                    <span class="name">{{val.real_name}}</span>
                  </li>
                </ul>
              </li>
            </ul>
            <div class="belong" id="belong" v-show="belongShow">
              <p></p>
              <div>
                <p><span>所属机构/部门</span><span>{{belongVal.orgName}}</span></p>
                <p><span>手机</span><span>{{belongVal.phone}}</span></p>
                <p><span>职务</span><span>{{belongVal.dutyName}}</span></p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
  import {datetime} from '@/utils/filters'
  export default {
    name: "chatCard",
    props: {
      dialogShow: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    data() {
      return {
        topH:0,
        imgList: require('../../../static/img/notice.png'),
        imgList1: require('../../../static/img/mail.png'),
        input5: '',
        activeName: 'first',
        propShow: false,
        imgshow1: true,
        imgshow2: false,
        msgsList: [
          {img: require('../../../static/img/msg1.png'), tit: '待办提醒', name: '你有一条新的用车审批申请...'},
          {img: require('../../../static/img/msg2.png'), tit: '企业小助手', name: '欢迎使用中兴驾图车辆智能...'}
        ],
        msgIndex: null,
        peopleDta: {},
        belongVal: {
          orgName: '',
          dutyName: '',
          phone: ''
        },
        tabIndex:'0',
        remindType:0,
        belongShow: false,
        msgaData:[],
        peopleIndex0: null,
        peopleIndex1: null,
        msgSortData: [
          {name: '全部',remindType:0}, {name: '用车审批',remindType:8},{name: '用车申请',remindType:1}, {name: '异常外出',remindType:2},
          {name: '逾期未归',remindType:3}, {name: '故障提醒',remindType:4}, {name: '车务提醒',remindType:5}, {name: '设备拔出',remindType:6},
          {name: '碰撞提醒',remindType:7}
        ],
        sortIndex: null,
        sortShow: false
      };
    },
    mounted(){
     this.getallMsgLidst(null,this.remindType)
     this.getPersonList()
    },
    methods: {
      /** 查询所有消息 **/
      getallMsgLidst(val,type){
        this.msgaData=[]
        if(val===0||val===1){
          this.getData('/inforemind/getList', 'post',{status:val,remindType:type}).then(res => {
            for(var i=0;i<res.data.length;i++){
              this.msgaData.push({
                reason:(res.data[i].remindType===1?'用车申请':(res.data[i].remindType===2?'异常外出': (res.data[i].remindType===3?'逾期未归':(
                  res.data[i].remindType===4?'故障提醒':(res.data[i].remindType===5?'车务提醒':(res.data[i].remindType===6?'设备拔出':(
                    res.data[i].remindType===7?'碰撞提醒':'用车审批'))))))) ,

                name: res.data[i].remindType===1?res.data[i].userName:(res.data[i].remindType===8?res.data[i].auditmanName:res.data[i].license),

                thing: (res.data[i].remindType===1?'用车申请':(res.data[i].remindType===2?'异常提醒': (res.data[i].remindType===3?'逾期未归':(
                  res.data[i].remindType===4?res.data[i].dtcName:(res.data[i].remindType===5?'车务提醒':(res.data[i].remindType===6?'设备拔出':(
                    res.data[i].remindType===7?'碰撞提醒':'审批流程'))))))),

                dis:(res.data[i].remindType===1?(res.data[i].auditmanName+'处理了你的用车申请，请及时查看'):(res.data[i].remindType===2?(res.data[i].license+'于'
                  +datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'非任务外出，行至：'+res.data[i].carAddress+'，请及时处理'): (res.data[i].remindType===3?
                  (res.data[i].license+'在执行任务结束后逾期未归,请及时处理'):(res.data[i].remindType===4?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'发生故障，请及时处理'):
                    (res.data[i].remindType===5?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'产生车务提醒，请及时处理'):
                      (res.data[i].remindType===6?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'设备拔出，请及时处理'):(
                        res.data[i].remindType===7?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'发生碰撞，请及时处理'):
                          (res.data[i].userName+'提交了用车申请，请及时处理')))))))),

                time: datetime(res.data[i].time,'yy:MM:dd hh:mm:ss'),
                img:res.data[i].status===1?require('../../../static/img/msgClose.png'):require('../../../static/img/msgOpen.png'),
                status:res.data[i].status,
                id:res.data[i].id
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }else{
          this.getData('/inforemind/getList', 'post',{remindType:type}).then(res => {
            for(var i=0;i<res.data.length;i++){
              this.msgaData.push({
                reason:(res.data[i].remindType===1?'用车申请':(res.data[i].remindType===2?'异常外出': (res.data[i].remindType===3?'逾期未归':(
                  res.data[i].remindType===4?'故障提醒':(res.data[i].remindType===5?'车务提醒':(res.data[i].remindType===6?'设备拔出':(
                    res.data[i].remindType===7?'碰撞提醒':'用车审批'))))))) ,

                name: res.data[i].remindType===1?res.data[i].userName:(res.data[i].remindType===8?res.data[i].auditmanName:res.data[i].license),

                thing: (res.data[i].remindType===1?'用车申请':(res.data[i].remindType===2?'异常提醒': (res.data[i].remindType===3?'逾期未归':(
                  res.data[i].remindType===4?res.data[i].dtcName:(res.data[i].remindType===5?'车务提醒':(res.data[i].remindType===6?'设备拔出':(
                    res.data[i].remindType===7?'碰撞提醒':'审批流程'))))))),

                dis:(res.data[i].remindType===1?(res.data[i].auditmanName+'处理了你的用车申请，请及时查看'):(res.data[i].remindType===2?(res.data[i].license+'于'
                  +datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'非任务外出，行至：'+res.data[i].carAddress+'，请及时处理'): (res.data[i].remindType===3?
                  (res.data[i].license+'在执行任务结束后逾期未归,请及时处理'):(res.data[i].remindType===4?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'发生故障，请及时处理'):
                    (res.data[i].remindType===5?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'产生车务提醒，请及时处理'):
                      (res.data[i].remindType===6?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'设备拔出，请及时处理'):(
                        res.data[i].remindType===7?(res.data[i].license+'于'+datetime(res.data[i].time,'yy:MM:dd hh:mm:ss')+'发生碰撞，请及时处理'):
                          (res.data[i].userName+'提交了用车申请，请及时处理')))))))),

                time: datetime(res.data[i].time,'yy:MM:dd hh:mm:ss'),
                img:res.data[i].status===1?require('../../../static/img/msgClose.png'):require('../../../static/img/msgOpen.png'),
                status:res.data[i].status,
                id:res.data[i].id
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }

      },
      /** 处理未读消息**/
      handleMsg(obj){
        if(obj.status!=0){
          this.getData('/inforemind/update', 'post',{status:0,id:obj.id},true).then(res => {
            if(res.code===0){
              obj.img=require('../../../static/img/msgOpen.png')
              if(this.tabIndex==='0'){
                this.getallMsgLidst(null,this.remindType)
              }else if(this.tabIndex==='2'){
                this.getallMsgLidst(1,this.remindType)
              }
            }
          }).catch(error => {
            console.log(error)
          })
        }
      },
      /** 通讯录数据 **/
      getPersonList(){
        this.getData('/inforemind/getMailList', 'post').then(res => {
          this.peopleDta=res.data
        }).catch(error => {
          console.log(error)
        })
      },
      /** 通讯录 - 搜索**/
      searchPeople(val){
        this.getData('/inforemind/getMailList', 'post',{real_name:val}).then(res => {
          this.peopleDta=res.data
        }).catch(error => {
          console.log(error)
        })
      },
      msgListClick() {
        this.input5=''
        this.imgshow1 = true
        this.imgshow2 = false
      },
      peopleListClick() {
        this.imgshow1 = false
        this.imgshow2 = true
      },
      handleClose() {
        this.propShow = !this.dialogShow
        this.$emit('update:dialogShow', this.propShow)
        this.$emit('closeDialog')
      },
      /** 消息tab页查看 **/
      handleClick(val) {
        this.tabIndex=val.index
        if(val.index==='0'){
          this.getallMsgLidst(null,this.remindType)
        }else if(val.index==='1'){
          this.getallMsgLidst(0,this.remindType)
        }else if(val.index==='2'){
          this.getallMsgLidst(1,this.remindType)
        }

      },
      /** 通讯录滚动条事件 **/
      woListScroll(e){
        this.belongShow = false
        if(e){
          this.topH=e.srcElement.scrollTop
        }
      },
      /** 鼠标移入 **/
      onePeopleOver(index, index0, key,val) {
        this.peopleIndex1 = index
        this.peopleIndex0 = index0
        var length = 0
        for(var key1 in this.peopleDta){
          if(key1===key){
            break
          }
          length += this.peopleDta[key1].length
        }
        var top = (index0 + 1) * 22 + (index) * 48 + length * 48
        if(this.topH){
          top=top-this.topH
        }
        document.getElementById('belong').style.top=top+'px'
        this.belongShow = true
        this.belongVal={
          orgName: val.orgNames,
          dutyName: val.dutyName,
          phone: val.link_phone
        }


      },
      /** 鼠标移除 **/
      onePeopleOut() {
        this.peopleIndex1 = null
        this.peopleIndex0 = null
        this.belongShow = false
      },
      sortShowClick() {
        this.sortShow = !this.sortShow
        this.imgList1 = require('../../../static/img/mail.png')
        if (!this.sortShow) {
          this.sortIndex = null
          this.imgList = require('../../../static/img/notice.png')
        } else {
          this.imgList = require('../../../static/img/notice-active.png')
        }

      },
      MsgShowClick() {
        this.sortShow = false
        this.imgList = require('../../../static/img/notice.png')
        this.imgList1 = require('../../../static/img/mail-active.png')


      },
      /**  消息分类查询  **/
      sortClick(index,remindType) {
        this.sortIndex = index
        this.remindType=remindType
        if( this.tabIndex==='0'){
          this.getallMsgLidst(null,remindType)
        }else if(this.tabIndex==='1'){
          this.getallMsgLidst(0,remindType)
        }else if(this.tabIndex==='2'){
          this.getallMsgLidst(1,remindType)
        }
      },
      msgClick(index) {
        this.msgIndex = index
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

  #chatCard {
    .belong {
      position: absolute;
      width: 280px;
      display: flex;
      border-radius: 5px;
      box-shadow: 0 0px 10px rgba(205, 221, 231, 1);
      background-color: white;
      left: 220px;
      top: 0px;
      padding: 10px 10px 0px 10px;
      z-index: 22;
      & > p {
        position: absolute;
        border-style: solid;
        border-width: 10px 10px 10px 10px;
        border-color: #e8f1f9 #fff #e8f1f9 #e8f1f9;
        width: 0px;
        height: 0px;
        left: -20px;
        top: 20px;
      }
      & > div {
        width: 100%;
        overflow: hidden;
        p {
          width: 100%;
          margin-bottom: 5px;
          overflow: hidden;
        }
        p > span:first-child {
          width: 94px;
          text-align: left;
          font-size: 12px;
          float: left;
          color: #999999;
        }
        p > span:last-child {
          width: calc(100% - 114px);
          font-size: 12px;
          float: right;
        }
      }
    }
    .el-dialog {
      border-radius: 4px;
      height: 682px;
      overflow-y: hidden;
      background-color: #e8f1f9;
    }
    .el-dialog__wrapper {
      right: 84px;
      bottom: 88px;
      top: auto;
      left: auto;
    }
    .el-dialog__headerbtn {
      top: 14px;
    }
    .el-dialog__body {
      padding: 0px;
    }
    .el-dialog__header {
      padding: 0px;
    }
    .main {
      width: 1000px;
      height: 682px;
      background-color: #e8f1f9;

      & > li {
        float: right;
      }
      .chat-left {
        width: 220px;
        height: 100%;
        background-color: white;
        .search {
          .el-input__inner {
            height: 28px;
          }
          .el-input__icon {
            line-height: 28px;
          }
        }
        .left-main {
          width: 100%;
          float: left;
          margin-bottom: 30px;
          position: relative;
          .msg {
            width: 100%;
            overflow: hidden;
            background-color: white;
            .activeMsg {
              background-color: #e8f1f9;
            }
            & > li {
              padding: 20px 10px;
              float: left;
              cursor: pointer;
              div {
                float: left;
              }
              div:nth-child(2) {
                margin-left: 10px;
                width: 158px;
                p:first-child {
                  font-size: 12px;
                  color: #414141;
                }
                p:last-child {
                  font-size: 12px;
                  color: #aaa;
                }
              }
            }
          }
          .people {
            width: 100%;
            float: left;
            background-color: white;
            overflow-y: auto;
            max-height: 526px;
            /*滚动条样式*/
            &::-webkit-scrollbar { /*滚动条整体样式*/
              width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
              height: 4px;
            }
            &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
              border-radius: 5px;
              -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
              background: rgba(0, 0, 0, 0.2);
            }
            &::-webkit-scrollbar-track { /*滚动条里面轨道*/
              -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
              border-radius: 0;
              background: rgba(0, 0, 0, 0.1);
            }

            & > li {
              width: 100%;
              & > p {
                width: 100%;
                height: 22px;
                background-color: #e1eaf3;
                padding-left: 15px;
                font-size: 12px;

              }
              .activePeople {
                background-color: #e8f1f9;
                .name {
                  color: #55a8fd;
                }
              }
              ul > li {
                width: 100%;
                height: 48px;
                border-bottom: 1px solid #e8f1f9;
                display: flex;
                align-items: center;
                padding-left: 15px;
                position: relative;
                cursor: pointer;
                span {
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
      .chat-right {
        width: 780px;
        height: 100%;

        & > div {
          width: 100%;
          height: 84px;
          padding: 10px 20px;
          border-bottom: 1px dashed #e8f1f9;
          background-color: #f3f9ff;
        }
        & > div > p {
          width: 100%;
          height: 26px;
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
        }
        .right-tit {
          & > div:first-child {
            float: left;
            .el-tabs__header {
              margin: 0px;
            }
            .el-tabs__item {
              font-size: 12px;
              width: 60px;
              height: 48px;
            }
            .el-tab-pane {
              padding: 0px;
            }
            .el-tabs__nav {
              transform: translateX(27px);
            }
            .el-tabs__nav-wrap::after {
              background-color: #e8f1f9;
            }
          }
          & > div:last-child {
            float: right;
            margin-top: 10px;
            position: relative;
            img {
              margin-left: 10px;
              cursor: pointer;
            }
            .msgSort {
              width: 243px;
              position: absolute;
              display: flex;
              border-radius: 5px;
              box-shadow: 0 0px 10px rgba(205, 221, 231, 1);
              background-color: white;
              left: -182px;
              padding: 10px 10px 0px 10px;
              top: 32px;
              z-index: 22;
              .activeSort {
                background-color: #dfefff;
                color: #55a8fd;
              }
              & > p {
                position: absolute;
                border-style: solid;
                border-width: 5px 5px 5px 5px;
                border-color: #f3f9ff #f3f9ff #fff #f3f9ff;
                width: 0px;
                height: 0px;
                left: 193px;
                top: -10px;
              }
              ul > li {
                width: 70px;
                height: 30px;
                font-size: 12px;
                color: #999;
                display: flex;
                float: left;
                cursor: pointer;
                margin-bottom: 10px;
                align-items: center;
                justify-content: center;
              }
            }
          }
        }
        .right-main {
          width: 100%;
          height: 576px;
          overflow-y: auto;
          /*滚动条样式*/
          &::-webkit-scrollbar { /*滚动条整体样式*/
            width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
          }
          &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(0, 0, 0, 0.2);
          }
          &::-webkit-scrollbar-track { /*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 0;
            background: rgba(0, 0, 0, 0.1);
          }
          ul > li {
            margin-top: 20px;
            float: left;
            .right-img {
              width: 32px;
              height: 32px;
              float: left;
            }
            .right-text {
              width: 676px;
              border-radius: 5px;
              float: left;
              background-color: white;
              margin-left: 22px;
              position: relative;
              padding: 20px;
              font-size: 12px;
              & > p:first-child {
                position: absolute;
                border-style: solid;
                border-width: 10px 10px 10px 10px;
                border-color: #e8f1f9 #fff #e8f1f9 #e8f1f9;
                width: 0px;
                height: 0px;
                left: -20px;
                top: 10px;
              }
              & > p:nth-child(2) {
                width: 100%;
                color: #414141;
                padding-left: 6px;
                margin-bottom: 6px;
                img {
                  float: right;
                }
              }
              & > p:nth-child(3) {
                color: #999;
              }
              & > p:nth-child(4) {
                color: #999;
                padding-left: 6px;
              }
            }
          }

        }
      }
    }
    .chat-sort {
      width: 100%;
      border-bottom: 1px dashed #e8f1f9;
      p {
        width: 28px;
        height: 28px;
        float: left;
        overflow: hidden;
        cursor: pointer;
      }
      .activeChat0 {
        background: url("../../../static/img/chat1.png") no-repeat -30px -5px;
        float: left;
        margin-left: 30px;
      }
      .activeChat1 {
        background: url("../../../static/img/chat1.png") no-repeat 0px -5px;
        float: left;
        margin-left: 30px;
      }
      .activeChat2 {
        background: url("../../../static/img/chat1.png") no-repeat -60px -5px;
        float: right;
        margin-right: 30px;
      }
      .activeChat3 {
        background: url("../../../static/img/chat1.png") no-repeat -90px -5px;
        float: right;
        margin-right: 30px;
      }
    }
  }
</style>
