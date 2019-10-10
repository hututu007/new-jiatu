<template>
  <div class="app-container schedule-container">
    <el-row type="flex" class="header-content" justify="space-between">
      <el-col>
        <div class="grid-content">
          <span class="bg_icon bg_frist"></span>
          <div class="text">
            <p>我的待办</p>
            <h3>{{'当前有'+headInfo.allNum+'个任务'}}</h3>
          </div>
        </div>
      </el-col>
      <el-col style="margin:0 20px;">
        <div class="grid-content">
          <span class="bg_icon bg_second"></span>
          <div class="text">
            <p>本周任务累计出行时长</p>
            <h3>{{headInfo.time}}</h3>
          </div>
        </div>
      </el-col>
      <el-col>
        <div class="grid-content">
          <span class="bg_icon bg_third"></span>
          <div class="text">
            <p>本周完成任务数</p>
            <h3>{{'累计有'+headInfo.overNum+'个任务'}}</h3>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="main">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="全部任务" name="first">
        </el-tab-pane>
        <el-tab-pane label="任务中" name="second">
        </el-tab-pane>
        <el-tab-pane label="待出发" name="third">
        </el-tab-pane>
        <el-tab-pane label="已完成" name="fourth">
        </el-tab-pane>
      </el-tabs>
      <div style="padding: 20px">
        <jt-table ref="carMaintainTable" @tableSelectionChange="tableSelectionChange" :tableData="TableData">
          <div slot="tablePage">
            <jt-pager :pager="pager1" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>

    </div>
    <!-- 弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" title="反馈信息详情" width="800px" :fullscreen="true">
      <dialog-info slot="dialog"></dialog-info>
    </jt-dialog>
  </div>
</template>

<script>
  import {cnTime} from '@/utils/hmsFilters'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'

  export default {
    components: {JtTable, JtPager, JtDialog},
    data() {
      return {
        activeName: 'first',
        dialogShow: false,
        taskIds: '',
        headInfo: {
          allNum: 0,
          time: '0秒',
          overNum: 0
        },
        TableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'usemanName', title: '用车人'},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'startAddress', title: '出发地-目的地'},
            {name: 'backAddress', title: '返回地'},
            {name: 'usetypeName', title: '用车事由'},
            {name: 'useTime', title: '用车时间'},
            {name: 'license', title: '任务车辆'},
            {name: 'driverName', title: '驾驶员'},
            {name: 'statusName', title: '状态',},
          ],
          handleList: [
            {
              name: '开始任务',
              handleFunc: (obj) => {
                this.$confirm('此操作将开始该任务, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/apply/task/start', 'post', {id: obj.row.id}).then(res => {
                    console.log(res)
                    if (res.code === 0) {
                      this.getApplyList()
                      this.$message({
                        type: 'success',
                        message: '成功!'
                      });
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                  this.$message({
                    message: '已取消',
                    type: 'info'
                  });
                });
              }
            },
            {
              name: '结束任务',
              handleFunc: (obj) => {
                this.$confirm('此操作将结束该任务, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/apply/task/over', 'post', {id: obj.row.id}).then(res => {
                    console.log(res)
                    if (res.code === 0) {
                      this.getApplyList()
                      this.$message({
                        type: 'success',
                        message: '成功!'
                      });
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                  this.$message({
                    message: '已取消',
                    type: 'info'
                  });
                });
              }
            }
          ],
          upload: false,
          downList: [
            {
              name: '批量开始',
              handleFunc: (obj) => {
                this.$confirm('此操作将批量开始该任务, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/apply/task/batchStart', 'post', {taskIds: this.taskIds}).then(res => {
                    console.log(res)
                    if (res.code === 0) {
                      this.getApplyList()
                      this.$message({
                        type: 'success',
                        message: '成功!'
                      });
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                  this.$message({
                    message: '已取消',
                    type: 'info'
                  });
                });
              }
            },
            {
              name: '批量结束',
              handleFunc: (obj) => {
                this.$confirm('此操作将批量结束该任务, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/apply/task/batchOver', 'post', {taskIds: this.taskIds}).then(res => {
                    console.log(res)
                    if (res.code === 0) {
                      this.getApplyList()
                      this.$message({
                        type: 'success',
                        message: '成功!'
                      });
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                  this.$message({
                    message: '已取消',
                    type: 'info'
                  });
                });
              }
            }
          ]
        },
        pager1: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        applyList: {
          all: [],
          ing: [],
          wait: [],
          over: []
        },
        tabIndex: '0',
        total: null
      }
    },
    mounted() {
      this.getApplyList()
      this.getData('/apply/overview', 'post').then(res => {
        console.log(res)
        this.headInfo = {
          allNum: res.data.waitDealt,
          time: cnTime(res.data.TimeStamp),
          overNum: res.data.taskOver
        }
      }).catch(error => {
        console.log(error)
      })
    },
    methods: {
      tableSelectionChange(val) {
        this.taskIds = ''
        if (val) {
          for (var i = 0; i < val.length; i++) {
            this.taskIds += val[i].id + ','
          }
        }
        this.taskIds = this.taskIds.substr(0, this.taskIds.length - 1)
      },
      /**
       * 切换页码大小
       */
      handleSizeChange(val) {
        this.pager1.pageSize = val
        this.getApplyList()
      },
      /**
       * 切换当前页
       */
      changeCurrentPage(val) {
        this.pager1.currentPage = val
        this.getApplyList()
      },
      tabClick(val) {
        this.tabIndex = val.index
        this.pager1.currentPage = 1
        this.pager1.pageSize = 10
        this.getApplyList()
      },
      getApplyList() {
        // 1 245，待出发；6，任务中；7，已完成
        var obj = {}
        obj.pageNum = this.pager1.currentPage
        obj.pageSize = this.pager1.pageSize
        obj.sign = parseInt(this.tabIndex) + 1
        this.getData('/apply/list', 'post', obj).then(res => {
          if (res.data) {
            this.pager1.total = res.data.total
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].useTime = datetime(res.data.list[i].preStartTime, 'yy:MM:dd hh:mm:ss') + '至' + datetime(res.data.list[i].preStopTime, 'yy:MM:dd hh:mm:ss')
              res.data.list[i].startAddress = res.data.list[i].startAddress + '-' + res.data.list[i].stopAddress

              if (res.data.list[i].status === 1) {
                res.data.list[i].statusName = '待审核'
              } else if (res.data.list[i].status === 2) {
                res.data.list[i].statusName = '流转中'
              } else if (res.data.list[i].status === 4) {
                res.data.list[i].statusName = '待派车'
              } else if (res.data.list[i].status === 5) {
                res.data.list[i].statusName = '待执行'
              } else if (res.data.list[i].status === 6) {
                res.data.list[i].statusName = '任务中'
              } else if (res.data.list[i].status === 7) {
                res.data.list[i].statusName = '已结束'
              } else if (res.data.list[i].status === 8) {
                res.data.list[i].statusName = '任务取消'
              }
            }
            // this.headInfo.time = totalTime(res.data.list)
            this.TableData.list = res.data.list
            // this.pageFuc(this.tabIndex)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>
<style lang="scss">
  .schedule-container {
    .el-tabs__nav-scroll {
      padding-left: 20px;
    }
    background-color: #eef7ff;
    .header-content {
      .grid-content {
        display: flex;
        align-items: center;
        height: 130px;
        background: #fff;
        .text > h3 {
          color: #324e80;
          font-size: 24px;
          font-weight: 500;
          margin-top: 10px;
        }
        .text > p {
          color: #666666;
          font-size: 14px;
        }
        .bg_icon {
          display: block;
          width: 80px;
          height: 80px;
          margin: 0 20px 0 30px;
          background-image: url('../../../assets/images/icon-diaodu.png');
        }
        .bg_frist {
          background-position-x: 0;
        }
        .bg_second {
          background-position-x: 160px;
        }
        .bg_third {
          background-position-x: 80px;
        }
      }
    }
    .main {
      background: #fff;
      margin-top: 20px;
    }
    .el-tab-pane {
      padding: 0;
    }
  }
</style>

