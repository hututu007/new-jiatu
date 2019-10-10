<template>
  <div class="progress">
    <div class="progress-main">
      <jt-title :titData="flowTitData">
        <div slot="tabsLeft">
          <img style="float: left;margin-top: 7px;cursor: pointer" @click="returnPage"
               src="../../assets/images/return.png"/>
          <span style="font-size: 14px;color:#999;float: left;margin-top: 18px;margin-left: 10px">返回</span>
        </div>
      </jt-title>
      <div class="tabs" style="padding: 20px">
        <div class="tab">
          <div class="tab-one">
            <div class="grid-content">
              <el-row type="flex" class="detailed-tit" justify="space-between"
                      style="border:1px solid #eaf2f5; border-top:0;">
                <el-col :span="8">
                  <div class="grid-content tabList">
                    <div>
                      <img style="position: relative;top: 17px; float: left" src="../../assets/images/icon-check.png"/>
                      <span class="el-dhtitle">用车申请单</span>
                      <span class="el-flag">
                        <el-button type="primary" round size="mini">{{titObj.name}}</el-button>
                      </span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                </el-col>
                <el-col :span="8" class="print">
                  <p style="cursor: pointer" @click="printCard"><img src="../../assets/images/print.png"/><span
                    style="margin-left: 8px;position: relative;bottom: 12px">打印审批清单</span></p>
                </el-col>
              </el-row>
            </div>
            <div class="grid-content">
              <el-row v-for="item in oneInfobox" :key="item.value" type="flex" class="detailed-main"
                      justify="space-between"
                      style="border:1px solid #eaf2f5; border-top:0;">
                <el-col :span="8" v-for="(son,index) in item.list" :key="index">
                  <div class="grid-content tabList">
                    <div class="title">{{son.tit}}</div>
                    <span class="conten">{{son.value}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="tab-progress">
            <div class="transform" style="margin-top:30px;">
              <div class="grid-content progressBox">
                <div class="old one" :class="{'percentageZindex':percentage>=0}">
                  <div style="color:#666;font-size:12px;"
                       :class="{'ProgressFont':percentage==0,'ProgressWaitfor':percentage<=0}">创建申请单
                    <p style="line-height:0;font-size:12px; color:#666;"
                       :class="{'ProgressWaitfor':percentage<0,'ProgressWaitfor-tow':percentage==0}">
                      {{progressList.start.usemanName}}</p>
                    <p style="line-height:50px;width:150px;color:#999999;font-size:12px;" v-show="percentage>0">
                      {{progressList.start.createTime}}</p></div>
                </div>
                <div class="old Three" :class="{'percentageZindex':percentage>=33}">
                  <div style="color:#666;font-size:12px;" v-show="progressList.shen.realName"
                       :class="{'ProgressFont':percentage==33,'ProgressWaitfor':percentage<=33}">
                    {{progressList.shen.status===0?'等待审批':(progressList.shen.status===1?'已审批':(progressList.shen.status===2?'拒绝审批':'审批'))}}
                    <p
                      style="line-height:0;font-size:12px; color:#666;"
                      :class="{'ProgressWaitfor':percentage<33,'ProgressWaitfor-tow':percentage==33}">
                      {{progressList.shen.auditMode?(progressList.shen.orgLeavel===1?('直接上级'+((progressList.shen.auditMode===1)?'会签':'或签')):
                      ( '第'+progressList.shen.orgLeavel+
                      '上级'+((progressList.shen.auditMode===1)?'会签':'或签'))):progressList.shen.realName}}</p>
                    <p style="line-height:50px;width:150px;color:#999999;font-size:12px;"
                       v-show="percentage>=33">{{progressList.shen.createTime}}</p>
                  </div>
                  <div style="color:#666;font-size:12px;" v-show="progressList.move.realName"
                       :class="{'ProgressFont':percentage==33,'ProgressWaitfor':percentage<=33}">
                    {{progressList.move.status===0?'等待流转':(progressList.move.status===1?'已流转':(progressList.move.status===2?'拒绝流转':'流转'))}}
                    <p
                      style="line-height:0;font-size:12px; color:#666;"
                      :class="{'ProgressWaitfor':percentage<33,'ProgressWaitfor-tow':percentage==33}">
                      {{progressList.move.auditMode?(progressList.move.orgLeavel===1?('直接上级'+((progressList.move.auditMode===1)?'会签':'或签')):
                      ( '第'+progressList.move.orgLeavel+
                      '上级'+((progressList.move.auditMode===1)?'会签':'或签'))):progressList.move.realName}}</p>
                    <p style="line-height:50px;width:150px;color:#999999;font-size:12px;"
                       v-show="percentage>=33">{{progressList.move.createTime}}</p>
                  </div>
                </div>
                <!--<div class="old Three" :class="{'percentageZindex':percentage>=33}" v-if="!progressList.shen">-->
                <!--<div style="color:#666;font-size:12px;" v-if="secondTime"-->
                <!--:class="{'ProgressFont':percentage==33,'ProgressWaitfor':percentage<=33}">-->
                <!--{{progressList.shen.status===0?'等待审批':(progressList.shen.status===1?'已审批':(progressList.shen.status===2?'拒绝审批':'审批'))}}-->
                <!--<p-->
                <!--style="line-height:0;font-size:12px; color:#666;transform:translateX(4%)translateY(20%);"-->
                <!--:class="{'ProgressWaitfor':percentage<33,'ProgressWaitfor-tow':percentage==33}">-->
                <!--{{progressList.shen.realName}}</p>-->
                <!--<p style="line-height:50px;width:150px;color:#999999;font-size:12px;transform:translateX(-22%)"-->
                <!--v-show="percentage>=33">{{progressList.shen.createTime}}</p></div>-->
                <!--<div style="color:#666;font-size:12px;" v-if="firstTime"-->
                <!--:class="{'ProgressFont':percentage==33,'ProgressWaitfor':percentage<=33}">-->
                <!--{{progressList.move.status===0?'等待流转':(progressList.move.status===1?'已流转':(progressList.move.status===2?'拒绝流转':'流转'))}}-->
                <!--<p-->
                <!--style="line-height:0;font-size:12px; color:#666;transform:translateX(4%)translateY(20%);"-->
                <!--:class="{'ProgressWaitfor':percentage<33,'ProgressWaitfor-tow':percentage==33}">-->
                <!--{{progressList.move.realName}}</p>-->
                <!--<p style="line-height:50px;width:150px;color:#999999;font-size:12px;transform:translateX(-23%)"-->
                <!--v-show="percentage>=33">{{progressList.move.createTime}}</p></div>-->
                <!--</div>-->

                <div class="old Four" :class="{'percentageZindex':percentage>=67}">
                  <div style="color:#666;font-size:12px;"
                       :class="{'ProgressFont':percentage==67,'ProgressWaitfor':percentage<=67}">
                    {{progressList.car.status===0?'等待派车':(progressList.car.status===1?'已派车':(progressList.car.status===2?'拒绝派车':'派车'))}}
                    <p
                      style="line-height:0;font-size:12px; color:#666;"
                      :class="{'ProgressWaitfor':percentage<67,'ProgressWaitfor-tow':percentage==67}">
                      {{progressList.car.realName}}</p>
                    <p style="line-height:50px;width:150px;color:#999999;font-size:12px;"
                       v-show="percentage>=67">{{progressList.car.createTime}}</p></div>
                </div>
                <div class="old Five" :class="{'percentageZindex':percentage>=100}">
                  <div style="color:#666;font-size:12px;"
                       :class="{'ProgressFont':percentage==100,'ProgressWaitfor':percentage<=100}">任务结束<p
                    style="line-height:0;font-size:12px; color:#666;transform:translateX(20%)translateY(20%);"
                    :class="{'ProgressWaitfor':percentage<100,'ProgressWaitfor-tow':percentage==100}">{{''}}</p>
                    <p style="line-height:50px;width:150px;color:#999999;font-size:12px;transform:translateX(-10%)"
                       v-show="percentage>=100">{{''}}</p></div>
                </div>

                <div class="current" v-show="percentage==0" :class="{'currentZindex':percentage>=0}"
                     style="position:absolute;left:0%;transform:translateX(0 )translateY(-35%);"><p></p></div>
                <!--<div class="current" v-show="percentage==33" :class="{'currentZindex':percentage>=25,}"-->
                <!--style="position:absolute;left:25%"><p></p></div>-->
                <div class="current" v-show="percentage==33" :class="{'currentZindex':percentage>=33}"
                     style="position:absolute;left:33%"><p></p></div>
                <div class="current" v-show="percentage==67" :class="{'currentZindex':percentage>=67}"
                     style="position:absolute;left:67%"><p></p></div>
                <div class="current" v-show="percentage==100" :class="{'currentZindex':percentage>=100}"
                     style="position:absolute;left:100%;transform: translateX(-100%) translateY(-35%);"><p></p>
                </div>

                <div class="new one"></div>
                <!--<div class="new tow"></div>-->
                <div class="new Three"></div>
                <div class="new Four"></div>
                <div class="new Five"></div>
                <el-progress :stroke-width="8" :percentage="percentage" status="exception" ref="percentage">
                </el-progress>
              </div>

            </div>
            <div style="width: 100%;text-align: center">
              <el-button style="margin-top: 144px;margin-bottom: 20px" type="primary" size="mini">提醒一下审批人</el-button>
            </div>
          </div>
          <div class="tab-bot">
            <p class="Journal-title"><span></span><span>流程操作日志</span></p>
            <div class="Journal-form">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  align='left'
                  prop="type"
                  label="操作类型"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  align='left'
                  label="操作员"
                  width="180">
                </el-table-column>
                <el-table-column
                  width="200"
                  align='left'
                  prop="address"
                  label="执行结果">
                </el-table-column>
                <el-table-column
                  width="200"
                  prop="date"
                  align='left'
                  label="操作时间">
                </el-table-column>
                <el-table-column
                  prop="TimeSize"
                  align='left'
                  label="耗时">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div>
          <div class="right-card fn-shadow1 fn-radius">
            <p><span></span><span>审批助手</span></p>
            <ul>
              <li>
                <p><img src="../../assets/images/icon-lou0.png"/></p>
                <p><span>状态</span><span style="color: #71d189">{{cardList.dsc}}</span></p>
              </li>
              <li>
                <p><img src="../../assets/images/icon-lou1.png"/></p>
                <p><span>审批人</span><span style="color: #7595c5">{{cardList.name}}</span></p>
              </li>
            </ul>
            <div style="text-align: center" v-if="fucShow">
              <el-button type="primary" size="mini" @click="agreement">{{(cardList.dsc.indexOf('派车')>-1)?'派车':'同意'}}
              </el-button>
              <!--<el-button size="mini" @click="moving">流转</el-button>-->
              <el-button size="mini" @click="refuse">拒绝</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 同意 -->
      <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
        <div slot="dialog">
          <el-form label-position="right" ref="agreeForm" :model="agreeForm"
                   class="agreeForm">
            <el-form-item label="同意原因" class="mark">
              <el-input type="textarea" v-model="agreeForm.desc" rows="3"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
              <el-button size="mini" @click="dialogShow = false">取 消</el-button>
              <el-button size="mini" type="primary" @click.native="agreeFuc(agreeForm)">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </jt-dialog>
      <!-- 流转 -->
      <jt-dialog :dialog-show.sync="dialogShow1" :title="dialog1.title" :width="dialog1.width">
        <div slot="dialog">
          <el-form label-position="right" ref="moveForm" :model="moveForm"
                   class="agreeForm">
            <el-form-item label="流转方式" prop="resource">
              <el-radio-group v-model="moveForm.status">
                <el-radio label="普通流转" value="0"></el-radio>
                <el-radio label="同意并流转" value="1"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审批领导" prop="region">
              <el-select v-model="moveForm.man" placeholder="请选择审批人">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流转原因" class="mark">
              <el-input type="textarea" v-model="moveForm.desc" rows="3"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
              <el-button size="mini" @click="dialogShow1 = false">取 消</el-button>
              <el-button size="mini" type="primary" @click.native="moveFuc(moveForm)">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </jt-dialog>
      <!-- 拒绝 -->
      <jt-dialog :dialog-show.sync="dialogShow2" :title="dialog2.title" :width="dialog2.width">
        <div slot="dialog">
          <el-form label-position="right" ref="refuseForm" :model="refuseForm"
                   class="agreeForm">
            <el-form-item label="拒绝原因" class="mark">
              <el-input type="textarea" v-model="refuseForm.desc" rows="3"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
              <el-button size="mini" @click="dialogShow2 = false">取 消</el-button>
              <el-button size="mini" type="primary" @click.native="refuseFuc(refuseForm)">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </jt-dialog>
      <!-- 打印弹窗 -->
      <jt-dialog :dialog-show.sync="PrintDialogShow" :title="PrintDialog.title" :width="PrintDialog.width">
        <div slot="dialog">
          <print-card :data="printData"></print-card>
        </div>
      </jt-dialog>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'
  import {getCookie} from '@/utils/auth'
  import {secondTime, totalTime, rightTime} from '@/utils/hmsFilters'
  import {status} from '@/utils/index'
  import PrintCard from './print.vue'

  export default {
    name: "index",
    components: {JtTitle, JtDialog, PrintCard},
    data() {
      return {
        printData:{},
        PrintDialogShow: false,
        PrintDialog: {
          title: '出行申请单打印预览',
          width: '1000px'
        },
        dialogShow: false,
        dialog: {
          title: '同意',
          width: '500px'
        },
        fucShow: false,
        dialogShow1: false,
        dialog1: {
          title: '拒绝',
          width: '500px'
        },
        dialogShow2: false,
        dialog2: {
          title: '流转',
          width: '500px'
        },
        agreeForm: {
          desc: ''
        },
        moveForm: {
          desc: '',
          status: '',
          man: ''
        },
        refuseForm: {
          desc: ''
        },
        flowTitData: {
          typeName: 1,
          name: '内部审批流程',
          img: '',
          fucName: '',
          fuc: 0
        },
        oneInfobox: [
          {
            list: [{tit: '用车人', value: '曲丽丽'}, {tit: '代申请人', value: '曲丽丽1'}, {tit: '出发地', value: '重庆市渝北洪湖西路上丁企业园'}],
            value: 0
          },
          {
            list: [{tit: '目的地', value: '高级人民法院'}, {tit: '返回地', value: '重庆市渝北洪湖西路上丁企业园'}, {
              tit: '用车时间',
              value: '05-02 18:30 - 05-02 18:30'
            }], value: 1
          },
          {list: [{tit: '用车类型', value: '学习'}, {tit: '用车事由', value: '接人'}, {tit: '乘车人数', value: '3'}], value: 2},
          {
            list: [{tit: '是否需要驾驶员', value: '否'}, {tit: '是否紧急', value: '是'}, {tit: '备注', value: '本次学习需要全天8小时，上午下午'}],
            value: 3
          },
          {list: [{tit: '驾驶员', value: '小李'}, {tit: '任务车辆', value: '--'}, {tit: '', value: ''}], value: 4}
        ],
        activeName: "first",
        titObj: {
          value: '0908098890',
          name: '待派车'
        },
        //   进度条
        percentage: 0,
        // 状态
        cardList: {
          name: '',
          dsc: ''
        },
        progressList: {
          start: {},
          shen: {},
          move: {},
          car: {},
          end: {}
        },
        dailyList: [],
        //   操作流程
        tableData: [],
        // 审批领导
        options: [],
        auditManId: '',
        userId: ''
      }
    },
    methods: {
      /**
       * 打印审批单
       */
      printCard() {
        this.PrintDialogShow = true
        var now=new Date()
        setTimeout(()=>{
          this.$bus.$emit('changeTime',now)
        },0)

      },
      /**
       * 同意
       */
      agreement() {
        if (this.cardList.dsc != '待审核' || this.cardList.dsc != '待流转' || this.cardList.dsc != '待派车') {
          this.dialogShow = false
          this.$message.error('对不起，您不能作此操作');
        } else {
          this.dialogShow = true
        }
      },
      /**
       * 同意确定操作
       */
      agreeFuc() {
        var obj = {}
        if (this.cardList.dsc === '待审核') {
          obj.type = 1
        } else if (this.cardList.dsc === '待流转') {
          obj.type = 2
        } else if (this.cardList.dsc === '待派车') {
          obj.type = 3
        }
        obj.userId = getCookie('jiatu_userId')
        obj.applyId = this.$route.query.id
        obj.status = 1
        obj.remark = this.agreeForm.desc
        this.getData('/apply/audit', 'post', obj).then(data => {
          if (data.code === 0) {
            this.$message({
              showClose: true,
              message: '成功',
              type: 'success'
            });
            setTimeout(function () {
              location.reload()
            }, 2000)
          }
          this.dialogShow = false
        })
      },
      /**
       *  流转
       */
      // moving() {
      //   if (this.cardList.dsc === '已审核' || this.cardList.dsc === '已流转' || this.cardList.dsc === '已派车') {
      //     this.dialogShow1 = false
      //     this.$message.error('对不起，您不能作此操作');
      //   } else {
      //     this.dialogShow1 = true
      //   }
      // },
      /**
       * 流转确定操作
       */
      // moveFuc() {
      //   var obj = {}
      //   obj.type = 2
      //   obj.userId = getCookie('jiatu_userId')
      //   obj.applyId = this.$route.query.id
      //   obj.status = 0
      //   obj.remark = this.moveForm.desc
      //   this.getData('/apply/audit', 'post', obj).then(data => {
      //     if (data.code === 0) {
      //       this.$message({
      //           showClose: true,
      //           message: '成功',
      //           type: 'success'
      //         }
      //       );
      //       setTimeout(function () {
      //         location.reload()
      //       }, 2000)
      //     }
      //     this.dialogShow1 = false
      //   })
      // },
      /**
       * 拒绝
       */
      refuse() {
        if (this.cardList.dsc != '待审核' || this.cardList.dsc === '待流转' || this.cardList.dsc === '待派车') {
          this.dialogShow2 = false
          this.$message.error('对不起，您不能作此操作');
        } else {
          this.dialogShow2 = true
        }
      },
      /**
       * 拒绝确定操作
       */
      refuseFuc() {
        var obj = {}
        if (this.cardList.dsc.indexOf('审核')) {
          obj.type = 1
        } else if (this.cardList.dsc.indexOf('流转')) {
          obj.type = 2
        } else if (this.cardList.dsc.indexOf('派车')) {
          obj.type = 3
        }
        obj.userId = getCookie('jiatu_userId')
        obj.applyId = this.$route.query.id
        obj.status = 2
        obj.remark = this.refuseForm.desc
        this.getData('/apply/audit', 'post', obj).then(data => {
          if (data.code === 0) {
            this.$message({
                showClose: true,
                message: '成功',
                type: 'success'
              }
            );
            setTimeout(function () {
              location.reload()
            }, 2000)
          }
          this.dialogShow2 = false
        })
      },
      /**
       * 返回前一个路由
       */
      returnPage() {
        if (this.$route.query.sign === '1' || this.$route.query.sign === 1) {
          this.$router.push({
            name: 'TravelApplication',
            query: {
              name: 'first'
            }
          });
        } else if (this.$route.query.sign === '2' || this.$route.query.sign === 2) {
          this.$router.push({
            name: 'TravelApplication',
            query: {
              name: 'second'
            }
          });
        } else if (this.$route.query.sign === '3' || this.$route.query.sign === 3) {
          this.$router.push({
            name: 'TravelApplication',
            query: {
              name: 'third'
            }
          });
        } else if (this.$route.query.sign === '4' || this.$route.query.sign === 4) {
          this.$router.push({
            name: 'TravelApproval',
            query: {
              name: 'first'
            }
          });
        } else if (this.$route.query.sign === '5' || this.$route.query.sign === 5) {
          this.$router.push({
            name: 'TravelApproval',
            query: {
              name: 'second'
            }
          });
        } else if (this.$route.query.sign === '6' || this.$route.query.sign === 6) {
          this.$router.push({
            name: 'TravelApproval',
            query: {
              name: 'third'
            }
          });
        } else if (this.$route.query.sign === '7' || this.$route.query.sign === 7) {
          this.$router.push({
            name: 'TravelApproval',
            query: {
              name: 'four'
            }
          });
        } else if (this.$route.query.sign === '8' || this.$route.query.sign === 8) {
          this.$router.push({
            name: 'TruckingOrder',
            query: {
              name: 'first'
            }
          });
        } else if (this.$route.query.sign === '9' || this.$route.query.sign === 9) {
          this.$router.push({
            name: 'TruckingOrder',
            query: {
              name: 'second'
            }
          });
        } else if (this.$route.query.sign === '10' || this.$route.query.sign === 10) {
          this.$router.push({
            name: 'TruckingOrder',
            query: {
              name: 'third'
            }
          });
        }

      },
      /**
       * 时分秒换算机制
       */
      formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        var theTime3 = 0;// 天
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60);
          theTime = parseInt(theTime % 60);
          if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
            if (theTime2 > 60) {
              theTime3 = parseInt(theTime2 / 60);
              theTime2 = parseInt(theTime2 % 60);
            }
          }
        }
        var result = "" + parseInt(theTime) + "秒";
        if (theTime1 > 0) {
          result = "" + parseInt(theTime1) + "分" + result;
        }
        if (theTime2 > 0) {
          result = "" + parseInt(theTime2) + "小时" + result;
        }
        if (theTime3 > 0) {
          result = "" + parseInt(theTime3) + "天" + result;
        }
        return result;

      }
    },
    mounted() {
      this.userId = getCookie('jiatu_userId')
      /**********   处理整体进度数据   **********/
      this.getData('/apply/audit/list', 'post', {id: this.$route.query.id}).then(data => {

        for (var i = 0; i < data.data.length; i++) {
          if (data.data[i].userId.toString() === this.userId) {
            this.fucShow = true
          }
        }
        /********** 右上角卡片**********/
        /**********处理进度接口三大类（审批、流转、派车）数据 **********/


        if (data.data) {
          var crr = []
          for (var j = 0; j < data.data.length; j++) {
            this.dailyList.push(data.data[j])
            /**  寻找并冻结的前一组流转（会签，或签）  **/
            if (data.data[j].status === 66) {
              this.progressList.move = data.data[j - 1]
              this.progressList.shen = {}
              this.cardList.name = data.data[j - 1].realName
              if (data.data[j - 1].status === 0) {
                this.cardList.dsc = '待流转'
                this.titObj.name = '待流转'

              } else if (data.data[j - 1].status === 1) {
                this.cardList.dsc = '已流转'
                this.titObj.name = '已流转'
                this.fucShow = false
              } else {
                this.cardList.dsc = '拒绝流转'
                this.titObj.name = '拒绝流转'
                this.fucShow = false
              }
              this.percentage = 33


            } else if (data.data[j].type === 3) {
              // 派车数据
              this.progressList.car = data.data[data.data.length - 1]
              this.progressList.shen = data.data[data.data.length - 2]
              this.cardList.name = data.data[data.data.length - 1].realName
              if (data.data[data.data.length - 1].status === 0) {
                this.cardList.dsc = '待派车'
                this.titObj.name = '待派车'
              } else if (data.data[data.data.length - 1].status === 1) {
                this.cardList.dsc = '已派车'
                this.titObj.name = '已派车'
                this.fucShow = false
              } else {
                this.cardList.dsc = '拒绝派车'
                this.titObj.name = '拒绝派车'
                this.fucShow = false
              }
              this.percentage = 67
            } else {
              /**  寻最后一组为审批（会签，或签）  **/
              this.progressList.shen = data.data[data.data.length - 1]
              this.percentage = 33
              this.cardList.name = data.data[data.data.length - 1].realName
              if (data.data[data.data.length - 1].status === 0) {
                this.cardList.dsc = '待审核'
                this.titObj.name = '待审核'
              } else if (data.data[data.data.length - 1].status === 1) {
                this.cardList.dsc = '已审核'
                this.titObj.name = '已审核'
                this.fucShow = false
              } else if (data.data[data.data.length - 1].status === 2) {
                this.cardList.dsc = '拒绝审核'
                this.titObj.name = '拒绝审核'
                this.fucShow = false
              }
            }
          }
        }
        /**********处理流程操作日志 **********/
        for (var k = 0; k < this.dailyList.length; k++) {
          // 将时间戳转化为(年月日 时间)表达
          var getdate2 = () => {
            var now = new Date(this.dailyList[k].createTime),
              y = now.getFullYear(),
              m = now.getMonth() + 1,
              d = now.getDate();
            return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
          }
          var getdate3 = () => {
            var now = new Date(this.dailyList[k].doTime),
              y = now.getFullYear(),
              m = now.getMonth() + 1,
              d = now.getDate();
            return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
          }
          this.dailyList[k].createTime = getdate2()
          // 判断doTime是否存在，如存在则处理时间差
          if (!this.dailyList[k].doTime) {
            this.dailyList[k].doTime = '进行中'
          } else {
            this.dailyList[k].doTime = getdate3()
            var d1 = this.dailyList[k].createTime.replace(/\-/g, "/");
            var date1 = new Date(d1);
            var d2 = this.dailyList[k].doTime.replace(/\-/g, "/");
            var date2 = new Date(d2);
            // doTime-createTime得到时间差---耗时
            this.dailyList[k].doTime = this.formatSeconds(Math.abs(parseInt(date2 - date1) / 1000))
          }

          // 判断日志每一个的type-----审批、流转、派车
          if (this.dailyList[k].type === 1) {
            this.tableData.push({
              type: "部门审批",
              name: this.dailyList[k].realName,
              address: this.dailyList[k].status === 0 ? '等待' : (this.dailyList[k].status === 1 ? '成功' : (this.dailyList[k].status === 66) ? '冻结' : '拒绝'),
              date: this.dailyList[k].createTime,
              TimeSize: this.dailyList[k].doTime
            })
          } else if (this.dailyList[k].type === 2) {
            this.tableData.push({
              type: "部门流转",
              name: this.dailyList[k].realName,
              address: this.dailyList[k].status === 0 ? '等待' : (this.dailyList[k].status === 1 ? '成功' : (this.dailyList[k].status === 66) ? '冻结' : '拒绝'),
              date: this.dailyList[k].createTime,
              TimeSize: this.dailyList[k].doTime
            })
          } else if (this.dailyList[k].type === 3) {
            this.tableData.push({
              type: "部门派车",
              name: this.dailyList[k].realName,
              address: this.dailyList[k].status === 0 ? '等待' : (this.dailyList[k].status === 1 ? '成功' : (this.dailyList[k].status === 66) ? '冻结' : '拒绝'),
              date: this.dailyList[k].createTime,
              TimeSize: this.dailyList[k].doTime
            })
          }

        }
      }).catch(error => {
        console.log(error)
      })

      /** 审批清单数据 **/
      this.getData('/apply/wait/page', 'post', {id: this.$route.query.id, sign: this.$route.query.sign}).then(res => {
        res.data.list[0].createTime = datetime(res.data.list[0].createTime, 'yy:MM:dd hh:mm:ss')
        res.data.list[0].preStartTime=datetime(res.data.list[0].preStartTime,'yy:MM:dd hh:mm:ss')
        res.data.list[0].preStopTime=datetime(res.data.list[0].preStopTime,'yy:MM:dd hh:mm:ss')
        this.oneInfobox[0].list[0].value = res.data.list[0].usemanName
        this.oneInfobox[0].list[1].value = res.data.list[0].createrName
        this.oneInfobox[0].list[2].value = res.data.list[0].startAddress
        this.oneInfobox[1].list[0].value = res.data.list[0].stopAddress
        this.oneInfobox[1].list[1].value = res.data.list[0].backAddress
        this.oneInfobox[1].list[2].value = res.data.list[0].preStartTime + '至' + res.data.list[0].preStopTime
        this.oneInfobox[2].list[0].value = res.data.list[0].usetypeName
        this.oneInfobox[2].list[1].value = res.data.list[0].useReason
        this.oneInfobox[2].list[2].value = res.data.list[0].passengerNum
        this.oneInfobox[3].list[0].value = status(res.data.list[0].needDriver, {0: '不需要', 1: '需要'})
        this.oneInfobox[3].list[1].value = status(res.data.list[0].urgency, {0: '否', 1: '是'})
        this.oneInfobox[3].list[2].value = res.data.list[0].remark
        this.oneInfobox[4].list[0].value = res.data.list[0].driverName
        this.oneInfobox[4].list[1].value = res.data.list[0].license
        this.printData=res.data.list[0]
        //  讲申请信息添加至操作日志
        this.progressList.start = res.data.list[0]
        this.tableData.unshift(
          {
            type: "部门申请",
            name: res.data.list[0].createrName,
            address: '成功',
            date: res.data.list[0].createTime,
            TimeSize: this.formatSeconds(Math.floor(Math.random() * 10 + 1))
          }
        )

      }).catch(error => {
        console.log(error)
      })

      /** 用车人数据 **/
      this.getData('/apply/auditman/list', 'post').then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.options.push({
            label: res.data[i].realName,
            value: res.data[i].id
          })
        }
      }).catch(error => {
        console.log(error)
      })


    }

  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .progress {
    width: 100%;
    padding: 20px;
    .progress-main {
      background-color: white;
      overflow: hidden;
      .right-card {
        width: 280px;
        height: 284px;
        padding: 20px;
        float: right;
        & > p {
          width: 100%;
          height: 20px;
          span:nth-child(1) {
            width: 2px;
            height: 18px;
            float: left;
            background-color: #55a8fd;
            margin-right: 10px;
          }
          span:nth-child(2) {
            font-size: 14px;
            color: #333;
          }
        }
        & > ul {
          margin-top: 10px;
          li {
            padding-top: 20px;
            &:nth-child(1) {
              border-bottom: 1px dashed rgb(220, 231, 238);
            }
            width: 100%;
            height: 90px;
            p {
              height: 100%;
              float: left;
              img {
                width: 35px;
                height: 40px;
              }
              &:nth-child(1) {
                width: 33px;
                margin-right: 20px;
              }
              &:nth-child(2) {
                width: calc(100% - 53px);
                span {
                  width: 100%;
                  line-height: 20px;
                  display: inline-block;
                  &:nth-child(1) {
                    font-size: 12px;
                    color: #666;
                  }
                  &:nth-child(2) {
                    font-size: 16px;
                    font-weight: bold;
                  }
                }
              }
            }
          }
        }

      }
      .tabs {
        & > div {
          float: left;
        }
        .tab {
          width: calc(100% - 300px);
          margin-right: 20px;
        }
        .tab-one {
          width: 100%;
          padding-bottom: 20px;
          overflow: hidden;
          .grid-content {
            line-height: 50px;
          }
          .detailed-main {
            font-size: 12px;
            .title {
              width: 90px;
              text-align: right;
              float: left;
              color: #999999;
            }
            .conten {
              color: #333333;
              float: left;
              margin-left: 10px;
            }
          }
          .detailed-tit {
            background-color: #dfefff;
            .grid-content {
              padding-left: 10px;
              div > span {
                font-size: 14px;
                color: #7595c5;
                font-weight: bold;
              }
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
            .print {
              p {
                float: right;
                margin-right: 20px;
                margin-top: 16px;
                width: 122px;
                text-align: center;
                height: 28px;
                color: #55a8fd;
                font-size: 14px;
                border: 1px solid #55a8fd;
                border-radius: 2px;
                background-color: white;
                img {
                  margin-bottom: 11px;
                }
              }
            }
          }
        }
        .tab-progress {
          padding-top: 20px;
          padding-left: 30px;
          padding-right: 30px;
          height: 225px;
          .transform {
            .progressBox {
              position: relative;
              .one > div, .tow > div, .Three > div, .Four > div, .Five > div {
                width: 100px;
                text-align: left;
                font-size: 14px;
                transform: translateX(-25%);
                line-height: 100px;
              }
              .el-progress-bar {
                padding-right: 0px;
                width: 100%;
                margin-right: -55px;
                box-sizing: border-box;
              }
              .el-progress-bar__innerText {
                display: none;
              }
              .el-progress-bar__inner {
                background: #ffc600;
              }
              .el-progress-bar__outer {
                background: #e6ebf4;
              }
              .new {
                width: 12px;
                height: 12px;
                background: #ffffff;
                padding: 6px;
                border-radius: 50%;
                box-shadow: 0 0 10px 1px rgba(90, 90, 90, 0.1);
                float: left;
                transform: translateX(-15%);
                border: 6px solid #e6ebf4;
              }
              .old {
                width: 12px;
                height: 12px;
                background: #ffffff;
                padding: 6px;
                border-radius: 50%;
                box-shadow: 0 0 10px 1px rgba(90, 90, 90, 0.1);
                float: left;
                transform: translateX(-15%);
                border: 6px solid #ffc600;
              }
              .one {
                position: absolute;
                left: 0%;
                z-index: 1;
                transform: translateX(0);
                top: -3px;
              }
              .tow {
                position: absolute;
                left: 25%;
                z-index: 1;
                top: -3px;
                & > div {
                  transform: translateX(-19%);
                }
              }
              .Three {
                position: absolute;
                left: 33%;
                z-index: 1;
                top: -3px;
                & > div {
                  transform: translateX(-20%);
                }
              }
              .Four {
                position: absolute;
                left: 67%;
                z-index: 1;
                top: -3px;
                & > div {
                  transform: translateX(-20%);
                }
              }
              .Five {
                position: absolute;
                left: 100%;
                z-index: 1;
                transform: translateX(-100%);
                top: -3px;
                & > div {
                  transform: translateX(-36%);
                }
              }
              .percentageZindex {
                z-index: 2;
              }
              .current {
                width: 50px;
                height: 50px;
                border: 10px solid #ffc600;
                border-radius: 50%;
                transform: translateX(-50%) translateY(-35%);
              }
              .currentZindex {
                z-index: 3;
              }
              .current p {
                display: inline-block;
                width: 36px;
                height: 36px;
                background: #fff url("../../../static/img/Shape2.png") 3px 12px no-repeat;
                border-radius: 50%;
                transform: translateX(-50%) translateY(-50%);
                margin-top: 50%;
                margin-left: 50%;
              }
              .ProgressFont {
                font-size: 14px;
                color: #ffc600 !important;
                margin-left: -6px;
              }
              .ProgressWaitfor {
                color: #aaaaaa;
              }
              .ProgressWaitfor-tow {
                color: #333333;
              }
            }
          }
        }
        .tab-bot {
          margin-top: 56px;
          margin-bottom: 30px;
          .Journal-title {
            width: 100%;
            height: 20px;
            span:nth-child(1) {
              width: 2px;
              height: 18px;
              float: left;
              background-color: #55a8fd;
              margin-right: 10px;
            }
            span:nth-child(2) {
              font-size: 14px;
              color: #333;
            }
            margin-bottom: 20px;
          }
          .Journal-form tr th {
            background-color: #eef7ff;
            color: #7595c5;
          }
          .Journal-form {
            .el-table {
              font-size: 12px;
            }
          }
        }
      }
    }
    .agreeForm {
      .mark {
        .el-form-item__content {
          float: left;
        }
      }
      .el-form-item {
        .el-textarea__inner {
          width: 193px;
        }
        .el-input__inner {
          width: 193px;
          height: 28px;
        }
      }
    }
  }

</style>
