<template>
  <div class="app-container feedBack">
    <div class="feedBack-main">
      <jt-title :titData="feedBackTitData"></jt-title>
      <div class="feedBack-form">
        <el-form :inline="true" :model="feedBackForm" class="feedBackForm-inline">
          <el-form-item label="意见类型">
            <el-select v-model="feedBackForm.returnType" placeholder="请选择">
              <el-option label="功能建议" :value='1'></el-option>
              <el-option label="产品缺陷" :value="2"></el-option>
              <el-option label="产品需求" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态" style="margin-right: 30px">
            <el-select v-model="feedBackForm.handleState" placeholder="请选择">
              <el-option label="已提交" :value="0"></el-option>
              <el-option label="预审通过" :value="1"></el-option>
              <el-option label="已采纳" :value="2"></el-option>
              <el-option label="已实现" :value="3"></el-option>
              <el-option label="拒绝" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="feedBackSearch">查询</el-button>
            <el-button class="fn-btn-reset" size="mini" @click="resetForm">重置</el-button>
          </el-form-item>
          <div>
            <el-form-item>
              <el-button size="mini" icon="el-icon-plus" type="primary" @click="feedBackDialogShow=true">反馈意见
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="feedBackTable">
        <jt-table ref="carTable" @tableSelectionChange="tableSelectionChange" :tableData="feedBackTableData">
          <div slot="tablePage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </div>
    <jt-dialog :dialog-show.sync="feedBackDialogShow" :title="feedBackDialogStop.title"
               :width="feedBackDialogStop.width">
      <div slot="dialog">
        <ul class="feed-tit">
          <li v-for="(item, index) in feedTitList" :class="{activeFeed:index==isActive}" :key="item.id" @click="changeClass(index)">
            <img :src="item.url" />
            <p>
              <span>{{item.tit}}</span>
              <span>{{item.main}}</span>
            </p>
          </li>
        </ul>
        <el-form label-position="right" ref="feedBackDialogForm" :model="feedBackDialogForm"
                class="feedBackDialogForm">
          <el-form-item label="标题">
            <el-input v-model="feedBackDialogForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="描述" class="mark">
            <editor ref="feedBackEditor"></editor>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="feedBackDialogForm.opinionLabel"  placeholder="请选择">
              <el-option
                v-for="item in LabelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="feedBackDialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addStopFuc(feedBackDialogForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
    <!-- 预览 -->
    <jt-dialog :dialog-show.sync="viewDialogSort" :title="viewDialogStop.title" :width="viewDialogStop.width">
      <div slot="dialog">
        <see-dialog :details='details'></see-dialog>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import editor from '@/components/editor'
  import seeDialog from  './seeDialog'
  import { status } from '@/utils/index'
  import { datetime } from '@/utils/filters'

  export default {
    components: {JtTitle, JtTable, JtPager, JtDialog, editor, seeDialog},
    data() {
      return {
        feedBackTitData: {
          typeName: 0,
          name: '反馈意见列表',
          img: '',
          fucName: '',
          fuc: 0
        },
        feedBackForm: {
          returnType: '',
          handleState:'',
          pageNum: 1,
          pageSize: 10
        },
        isActive: null,
        feedTitList: [
          {url: require('../../assets/images/feed0.png'), tit: '功能建议', main: '业务、流程、信息录入等'},
          {url: require('../../assets/images/feed1.png'), tit: '产品缺陷', main: '添加、修改、绑定等'},
          {url: require('../../assets/images/feed2.png'), tit: '产品需求', main: '管理业务需求、无此类功能等'},
        ],
        feedBackTableData: {
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
              name: '查看',
              handleFunc: (obj) => {
                this.viewDialogSort=true;
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
                  this.getData('/opinion/delete', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getPageData()
                    }
                  })
                })
              }
            }
          ],
          upload: false,
          downList: []
        },
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        typeList: [],
        feedBackDialogShow: false,
        feedBackDialogStop: {
          title: '编辑公共信息',
          width: '1000px'
        },
        feedBackDialogForm: {
          title: '',
          content: '',
          returnType: '',
          opinionLabel: ''
        },
        LabelOptions: [
          {value: 0, label: "首页" },
          {value: 1, label: "工作台" },
          {value: 2, label: "目标管理" },
          {value: 3, label: "运营分析" },
          {value: 4, label: "车辆定位" },
          {value: 5, label: "电子围栏" },
          {value: 6, label: "定向行驶" },
          {value: 7, label: "车况分析" },
          {value: 8, label: "出行申请" },
          {value: 9, label: "出行审批" },
          {value: 10, label: "出行派车" },
          {value: 11, label: "调度概览" },
          {value: 12, label: "路线管理" },
          {value: 13, label: "规费管理" },
          {value: 14, label: "加油管理" },
          {value: 15, label: "车辆事务" },
          {value: 16, label: "车务提醒" },
          {value: 17, label: "车辆故障" },
          {value: 18, label: "费用统计" },
          {value: 19, label: "油耗统计" },
          {value: 20, label: "里程统计" },
          {value: 21, label: "任务统计" },
          {value: 22, label: "行为统计" },
          {value: 23, label: "使用率统计" },
          {value: 24, label: "设备异常统计" },
          {value: 25, label: "司机考核" },
          {value: 26, label: "速度统计" },
          {value: 27, label: "企业信息" },
          {value: 28, label: "车辆档案" },
          {value: 29, label: "设备管理" },
          {value: 30, label: "预警设置" },
          {value: 31, label: "参数设置" },
          {value: 32, label: "审批设置" },
          {value: 33, label: "个人信息" },
          {value: 34, label: "公告信息" },
          {value: 35, label: "帮助手册" },
          {value: 36, label: "关于我们" },
          {value: 37, label: "反馈意见" }
        ],
        viewDialogSort:false,
        viewDialogStop:{
          title: '发布预览',
          width: '800px'
        },
        details: ""
      }
    },
    methods: {
      changeClass(index) {
        this.isActive = index;
        this.feedBackDialogForm.returnType = index+1;
      },
      // 意见反馈提交
      addStopFuc() {
        if (!this.feedBackDialogForm.returnType) {
          this.$message({
            showClose: true,
            message: '请选择意见类型',
            type: 'warning'
          });
          return;
        }
        if (!this.feedBackDialogForm.title) {
          this.$message({
            showClose: true,
            message: '请输入标题',
            type: 'warning'
          });
          return;
        }
        if (!this.feedBackDialogForm.opinionLabel&&this.feedBackDialogForm.opinionLabel!==0) {
          this.$message({
            showClose: true,
            message: '请选择标签',
            type: 'warning'
          });
          return;
        }
        this.feedBackDialogForm.content = this.$refs.feedBackEditor.Content;
        this.getData('/opinion/add', 'post', this.feedBackDialogForm).then(res => {
          if (res.code==0) {
            this.$message({
              message: '感谢您对我们的支持，您反馈的问题我们会及时解决，谢谢！',
              type: 'success'
            });
            this.feedBackDialogShow = false;
            this.getPageData();
          }
        })
      },
      //获取page数据
      getPageData() {
        this.getData('/opinion/page', 'post',this.feedBackForm).then(res => {
          this.feedBackTableData.list = res.data.list;
          this.pager.total = res.data.total;
          for (let i = 0; i < res.data.list.length; i++) {
            this.feedBackTableData.list[i].returnTypeName = status(res.data.list[i].returnType, {1:'功能建议', 2: '产品缺陷', 3: '产品需求'})
            this.feedBackTableData.list[i].createTime = datetime(res.data.list[i].createTime, 'yy:MM:dd hh:mm:ss')
          }
        })
      },
      // 搜索
      feedBackSearch() {
        this.getPageData()
      },
      //重置
      resetForm() {
        this.feedBackForm = {
          returnType: '',
          handleState:'',
          pageNum: 1,
          pageSize: 10
        }
        this.getPageData()
      },
      tableSelectionChange() {
      },
      handleSizeChange(size) {
        this.feedBackForm.pageSize = size;
        this.getPageData();
      },
      changeCurrentPage(num) {
        this.feedBackForm.pageNum = num;
        this.getPageData();
      },
    },
    created() {
     this.getPageData();
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .activeFeed {
    background-color: #eef7ff;
    & > p > span:nth-child(1) {
      color: #55a8fd;
    }
  }

  .feedBack {
    .feedBack-main {
      .feedBack-form {
        padding: 20px;
        .feedBackForm-inline {
          .el-form-item__label {
            font-size: 12px;
            font-weight: normal;
            color: #666;
          }
          .el-input__inner {
            width: 180px;
            height: 28px;
            font-size: 12px;
            line-height: 28px;
          }
        }
      }
      .feedBackTable {
        padding: 0px 20px 20px 20px;
      }
    }
    .feed-tit {
      height: 80px;
      & > li {
        display: flex;
        align-items: center;
        width: 304px;
        float: left;
        border: 1px solid #d8e6ee;
        margin-right: 22px;
        border-radius: 4px;
        img {
          display: inline-block;
          float: left;
          margin: 24px;
        }
        p {
          float: left;
          & > span {
            display: block;
            line-height: 20px;
            font-size: 12px;
          }
          & > span:nth-child(1) {
            font-weight: bold;
            color: #666;
          }
          & > span:nth-child(2) {
            color: #999;
          }
        }
      }
      & > li:last-child {
        margin-right: 0px;
      }
    }
    .feedBackDialogForm {
      margin-top: 44px;
      .el-input__inner {
        width: 252px;
        height: 28px!important;
      }
      .el-form-item:nth-child(1),.el-form-item:nth-child(3){
        .el-form-item__content {
          float: left;
        }
      }
      .el-form-item:nth-child(2) {
        .el-form-item__content {
          float: left;
          .quill-editor {
            width: 900px;
            float: left;
          }
        }
      }

    }
    .jt-dialog-wrapper .el-dialog__body {
      padding: 20px;
    }
  }
</style>

