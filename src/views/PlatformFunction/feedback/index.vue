<template>
  <div class="app-container schedule-container">
    <el-row type="flex" class="header-content" justify="space-between">
      <el-col>
        <div class="grid-content">
          <span class="bg_icon bg_frist"></span>
          <div class="text">
            <p>功能建议</p>
            <h3>累计{{count.gnjyTotal}}个已处理{{count.gnjyHandle}}个</h3>
          </div>
        </div>
      </el-col>
      <el-col style="margin:0 20px;">
        <div class="grid-content">
          <span class="bg_icon bg_frist"></span>
          <div class="text">
            <p>产品缺陷</p>
            <h3>累计{{count.cpqxTotal}}个已处理{{count.cpqxHandle}}个</h3>
          </div>
        </div>
      </el-col>
      <el-col>
        <div class="grid-content">
          <span class="bg_icon bg_third"></span>
          <div class="text">
            <p>产品需求</p>
            <h3>累计{{count.cpxqTotal}}个已处理{{count.cpxqHandle}}个</h3>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="main">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="全部反馈" name="-1">
        </el-tab-pane>
        <el-tab-pane label="已提交" name="0">
        </el-tab-pane>
        <el-tab-pane label="预审通过" name="1">
        </el-tab-pane>
        <el-tab-pane label="已采纳" name="2">
        </el-tab-pane>
        <el-tab-pane label="已实现" name="3">
        </el-tab-pane>
        <el-tab-pane label="拒绝" name="4">
        </el-tab-pane>
      </el-tabs>
      <div style="padding: 20px">
        <jt-table ref="carMaintainTable" @tableSelectionChange="tableSelectionChange" :tableData="TableData">
          <div slot="tablePage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </div>
    
    <!-- 弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" title="反馈信息详情" width="800px" :fullscreen="true">
      <dialog-info slot="dialog" @closeDialog="closeDialog" :details="details"></dialog-info>
    </jt-dialog>
  </div>
</template>

<script>
  import {cnTime} from '@/utils/hmsFilters'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'
  import { status } from '@/utils/index'
  import dialogInfo from './dialog'

  export default {
    components: {JtTable, JtPager, JtDialog, dialogInfo},
    data() {
      return {
        activeName: '-1',
        dialogShow: false,
        taskIds: '',
        count:"", //统计
        details: {},
        headInfo: {
          allNum: 0,
          time: '0秒',
          overNum: 0
        },
        TableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'title', title: '标题'},
            {name: 'returnTypeName', title: '意见类型'},
            {name: 'orgName', title: '提交机构'},
            {name: 'opinionLabelName', title: '意见标签'},
            {name: 'createTime', title: '反馈时间'},
            {name: 'handleStateName', title: '处理状态'}
          ],
          handleList: [
            {
              name: '处理',
              handleFunc: (obj) => {
                this.dialogShow = true;
                this.details = obj.row;
              }
            },
             {
                name: '删除',
                handleFunc: (obj) => {
                  this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/opinion/platform/delete', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getPageData()
                      }
                    })
                  })
                }
            }
          ],
          upload: false,
          downList: [
          ]
        },
        pager: {
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
        tabIndex: '',
        total: null
      }
    },
    mounted() {
      this.getTableList()
      this.getData('/opinion/platform/count', 'post').then(res => {
        this.count = res.data
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
        this.pager.pageSize = val
        this.getTableList()
      },
      /**
       * 切换当前页
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getTableList()
      },
      tabClick(val) {
        this.tabIndex = val.name
        if (this.tabIndex==='-1') {
          this.tabIndex = "";
        }
        
        this.pager.currentPage = 1
        this.pager.pageSize = 10
        this.getTableList()
      },
      /**
       * 关闭dialog
       */
      closeDialog() {
        this.dialogShow = false;
        this.getTableList();
      },
      getTableList() {
        this.getData('/opinion/platform/page ', 'post',{handleState:this.tabIndex}).then(res => {
          this.TableData.list = res.data.list;
          this.pager.total = res.data.total;
          for (let i = 0; i < res.data.list.length; i++) {
            this.TableData.list[i].returnTypeName = status(res.data.list[i].returnType, {1:'功能建议', 2: '产品缺陷', 3: '产品需求'})
            this.TableData.list[i].createTime = datetime(res.data.list[i].createTime, 'yy:MM:dd hh:mm:ss')
          }
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
    .el-tabs__header{ 
      margin: 0;
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
    .jt-table {
      padding: 5px 20px 80px 20px;
    }
  }
</style>

