<template>
  <div class="bot-card">
    <div class="top">
      <div class="topDown">
        <span>更多内容</span>
        <span @click="closeSecLevelMenu" style="cursor: pointer;margin-left: 10px"><img :src=goTopUrl></span>
      </div>
      <el-tabs v-model="activeName" class="warmTabs" @tab-click="handleClick">
        <el-tab-pane :label="'车辆信息('+val.num+')'" name="0"></el-tab-pane>
        <el-tab-pane :label="'告警消息('+val.num1+')'" name="1"></el-tab-pane>
      </el-tabs>
    </div>
    <transition name="el-zoom-in-top">
      <!--table数据-->
      <div class="wtbale" v-show="secLevelNavVisable">
        <jt-table ref="carTableEq" :tableData="wtbaleData" @tableSelectionChange="tableSelectionChange"
                  :class="{active:canPage===false}">
          <div slot="tablePage" v-if="canPage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </transition>
    <!-- <&#45;&#45; 处理 弹窗&ndash;&gt;-->
    <jt-dialog :dialog-show.sync="dealdialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <el-form label-position="right" ref="dealForm" :model="dealForm"
                 class="deal">
          <el-form-item label="处理方式" prop="license">
            <!--<el-input v-model="insurance1AddForm.license" placeholder="请输入车牌号" style="width: 193px;"></el-input>-->
            <el-select style="width: 193px;" v-model="dealForm.type" placeholder="请选择">
              <!--<el-option label="忽略告警" value="1"> </el-option>-->
              <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理意见" prop="remark">
            <el-input type="textarea" v-model="dealForm.remark" placeholder="请输入处理意见" style="width: 193px;"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dealdialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="dealFuc(dealForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'

  export default {
    components: {JtTable, JtPager, JtDialog},
    name: "WarnTable",
    // props: ['wtbaleData'],
    data() {
      return {
        val: {
          num: 0,
          num1: 0
        },
        typeList: [
          {name: '忽略告警', id: 1}
        ],
        dealdialogShow: false,
        dialog: {
          title: '告警处理',
          width: '500px'
        },

        dealForm: {
          remark: '',
          type: 1
        },
        canPage: false,
        one: [
          {name: 'license', title: '车牌号'},
          {name: 'usemanName', title: '用车人'},
          {name: 'driverName', title: '驾驶员'},
          {name: 'currentAddress', title: '当前定位'},
          {name: 'kmph', title: '车速'},
          {name: 'time', title: '定位时间'},
          {name: 'taskName', title: '任务状态'} // 0空闲中，1任务中
        ],
        two: [
          {name: 'license', title: '车牌号'},
          {name: 'driverName', title: '驾驶员'},
          {name: 'position', title: '告警位置'},
          {name: 'time', title: '告警时间'},
          {name: 'typeName', title: '告警类别'}, // 1 超速告警
          {name: 'maxSpeed', title: '最大车速'},
          {name: 'avgSpeed', title: '平均车速'},
          {name: 'minSpeed', title: '最小车速'}
        ],
        secLevelNavVisable: false,
        wtbaleData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号'},
            {name: 'usemanName', title: '用车人'},
            {name: 'driverName', title: '驾驶员'},
            {name: 'currentAddress', title: '当前定位'},
            {name: 'kmph', title: '车速'},
            {name: 'time', title: '定位时间'},
            {name: 'taskName', title: '任务状态'} // 0空闲中，1任务中
          ],
          handleList: [
            {
              name: '查看',
              show: false,
              handleFunc: (obj) => {
                console.log(obj)
                this.$bus.$emit('carInfoClick', obj.row)
              }
            },
            {
              name: '处理',
              show: true,
              handleFunc: (obj) => {
                this.dealdialogShow = true
                this.dealForm = obj.row
              }
            }
          ],
          downList: [
            {
              name: '批量处理',
              show: true,
              handleFunc: () => {
                this.allDeal = true
                this.dealdialogShow = true
              }
            },
            {
              name: '全部忽略',
              show: true,
              handleFunc: () => {
                this.$confirm('此操作将全部忽略已选消息?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/speedWarn/batchDispose', 'post', {ids: this.ids}, true).then(res => {
                    if (res.code === 0) {
                      this.getPage()
                    }
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            }
          ]
        },
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 5
        },
        ids: '',
        activeName: '0',
        runCarData: [],
        warnData: [],
        goTopUrl: '/static/mark/icon-map_13.png',
        allDeal: false
      }
    },
    created() {
      /**
       *  index页面获取完数据后传递 车辆信息
       */
      this.$bus.$on('gpsBotInfo', (val) => {
        for (var i = 0; i < val.length; i++) {
          if (val[i].applyInfo === null) {
            val[i].usemanName = '--'
          } else {
            val[i].usemanName = val.applyInfo.useMan
          }
          if (val[i].taskStatus === 0) {  //0空闲中，1任务中
            val[i].taskName = '空闲中'
          } else if (val[i].taskStatus === 1) {
            val[i].taskName = '任务中'
          }
          if (val[i].driverName === null) {  //0空闲中，1任务中
            val[i].driverName = '--'
          }
          if (val[i].kmph === null) {  //0空闲中，1任务中
            val[i].kmph = '--'
          }
          if (val[i].time === null) {  //0空闲中，1任务中
            val[i].time = '--'
          } else {
            val[i].time = datetime(val[i].time, 'yy:MM:dd hh:mm:ss')
          }

        }
        this.runCarData = val
        this.val.num = val.length
        this.wtbaleData.handleList[0].show = false
        this.wtbaleData.downList[0].show = true
        this.wtbaleData.downList[1].show = true
        this.wtbaleData.headList = this.one
        this.wtbaleData.list = this.runCarData
        this.canPage = false
      })
    },
    mounted() {
      this.getPage()
    },
    methods: {
      /**
       * 获取车辆告警数据
       */
      getPage() {
        this.getData('/speedWarn/page', 'post', {
          pageSize: this.pager.pageSize,
          pageNum: this.pager.currentPage
        }).then(res => {
          if (res.code === 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              if (res.data.list[i].type === 1) {
                res.data.list[i].typeName = '超速告警'
                res.data.list[i].time = datetime(res.data.list[i].time, 'yy:MM:dd hh:mm:ss')
                if (res.data.list[i].driverName === null) {  //0空闲中，1任务中
                  res.data.list[i].driverName = '--'
                }
              }
            }
            this.pager.total = res.data.total
            console.log(res.data.list)
            this.warnData = res.data.list
            this.wtbaleData.list = this.warnData
            this.val.num1 = res.data.total
          }
        })
      },
      /**
       * 表格多选
       * @param val  多选的id集合
       */
      tableSelectionChange(val) {
        var arr = []
        if (val.length) {
          for (var i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
        }
        this.ids = arr.join(',')
      },
      /**
       * 分页-切换显示数量
       * @param val  值
       */
      handleSizeChange(val) {
        this.pager.pageSize = val
        this.getPage()
      },
      /**
       * 分页-切换当前页码
       * @param val  值
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getPage()
      },
      /**
       * 底部tabs点击事件
       * @param event 每一个点击对象
       */
      handleClick(event) {
        if (event.index === '1') {
          console.log(1111)

          this.wtbaleData.handleList[0].show = true
          this.wtbaleData.handleList[1].show = false
          this.wtbaleData.downList[0].show = false
          this.wtbaleData.downList[1].show = false
          this.wtbaleData.headList = this.two
          this.wtbaleData.list = this.warnData
          this.canPage = true
        } else {
          this.wtbaleData.handleList[0].show = false
          this.wtbaleData.handleList[1].show = true
          this.wtbaleData.downList[0].show = true
          this.wtbaleData.downList[1].show = true
          this.wtbaleData.headList = this.one
          this.wtbaleData.list = this.runCarData
          this.canPage = false
        }
      },
      /**
       * 处理确定操作
       * @param form 提交的表单数据
       */
      dealFuc(form) {
        if (this.allDeal) {
          this.getData('/speedWarn/batchDispose', 'post', {ids: this.ids}, true).then(res => {
            if (res.code === 0) {
              this.dealdialogShow = false
              this.getPage()
            }
          })
        } else {
          for (var key in form) {    //遍历键值对
            if (form[key] === '--'||form[key] === null) {
              form[key] = ''
            }
          }
          console.log(form)
          this.getData('/speedWarn/dispose', 'post',form,true).then(res => {
            if(res.code===0){
              this.dealdialogShow=false
              this.getPage()
            }
          })
        }

      },
      /**
       * 开关底部警告信息列表
       */
      closeSecLevelMenu() {
        this.secLevelNavVisable = !this.secLevelNavVisable
        if (this.secLevelNavVisable === true) {
          this.goTopUrl = '/static/mark/icon-map_12.png'
        } else {
          this.goTopUrl = '/static/mark/icon-map_13.png'
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .bot-card {
    .el-input__inner {
      height: 28px;
    }
    width: 100%;
    background-color: white;
    position: absolute;
    bottom: 0px;
    .top {
      width: 100%;
      .warmTabs {
        height: 40px;
        font-size: 12px;
      }
      .el-tabs__item {
        height: 40px;
        font-size: 12px;
        width: 116px;
      }
    }
    .topDown {
      position: absolute;
      width: 85px;
      height: 15px;
      right: 20px;
      top: 12px;
      z-index: 998;
      span {
        font-size: 14px;
        color: #72b7fd;
      }
    }
    .wtbale {
      padding: 20px;
      position: relative;
      .active {
        max-height: 300px;
        overflow-y: auto;
      }
      .jt-table {
        padding: 0px 0px 30px 0;
        .el-table td, .el-table th {
          padding: 8px 0;
          font-size: 12px;
          color: #7595c5;
        }
      }
      .pagination {
        position: absolute;
        right: 40px;
        bottom: 20px;
      }
      .el-pager {
        .active {
          overflow: inherit !important;
        }
      }
    }
  }

</style>
