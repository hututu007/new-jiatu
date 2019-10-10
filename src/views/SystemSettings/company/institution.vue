<template>
  <div>
    <el-container class="institution" style="min-height: 700px;max-height:850px;">
      <el-aside class="aside" width="250px">
        <el-input placeholder="请输入搜索内容" v-model="filterText" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-tree
          class="filter-tree"
          :data="treeData"
          empty-text="请先添加机构"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false"
          ref="institution">
                <span class="custom-tree-node" slot-scope="{ node, data }" @mouseover="showTool(data.id)"
                      @mouseout="hideTool(data.id)" :node-key="data.id">
                    <span>{{ node.label }}</span>
                    <span class="operation" v-if="data.id==tool?true:false">
                        <i class="el-icon-edit btn_tool" title="编辑" @click="edit(data)"></i>
                        <i class="el-icon-minus btn_tool" title="删除" @click="minus(data.id,node)"></i>
                        <i class="el-icon-plus btn_tool" title="添加" @click="plus(data)"></i>
                    </span>
                </span>
        </el-tree>
      </el-aside>
      <el-main class="main">
        <el-form :inline="true" class="Form-inline">
          <el-form-item label="姓名">
            <el-input placeholder="请输入姓名"
                      v-model="pageObj.realName"></el-input>
          </el-form-item>
          <el-form-item label="角色类别">
            <el-select placeholder="请选择" v-model="pageObj.roleId">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职务">
            <el-select placeholder="请选择" v-model="pageObj.dutyId">
              <el-option v-for="item in dutyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="pickerDate"
              class="date"
              type="datetimerange"
              start-placeholder="开始日期"
              range-separator="至"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="searchList">查询</el-button>
            <el-button class="fn-btn-reset" size="mini" @click="clear">重置</el-button>
          </el-form-item>
          <div>
            <el-form-item>
              <el-button size="mini" icon="el-icon-plus" type="primary" @click.native="add">新增人员</el-button>
            </el-form-item>
          </div>
        </el-form>
        <jt-table
          :tableData="TableData">
          <div slot="tablePage">
            <jt-pager :pager="pager" @changeCurrentPage="changeCurrentPage"
                      @handleSizeChange="handleSizeChange"></jt-pager>
          </div>
        </jt-table>
      </el-main>
    </el-container>

    <!-- 人员设置弹窗 -->
    <jt-dialog
      :dialog-show.sync="dialogShow"
      :title="editor?'编辑人员':'新增人员'"
      width="800px"
    >
      <form-dialog slot="dialog" @closeDialog="closeDialog" @RefreshPage="getPage" :roleList="roleList"
                   :dutyList="dutyList" :editor='editor' :sizeForm="sizeForm"></form-dialog>
    </jt-dialog>
    <!-- 人员设置弹窗 -->

    <!-- 机构新增弹窗 -->
    <jt-dialog
      :dialog-show.sync="organAddShow"
      :title="organForm.editor?'编辑机构/部门':'新增机构/部门'"
      width="550px"
    >
      <organ-dialog slot="dialog" @closeDialog="organCloseDialog" @RefreshPage="getTree"
                    :sizeForm="organForm"></organ-dialog>
    </jt-dialog>
    <!-- 机构新增弹窗 -->
  </div>
</template>
<script>
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import {datetime} from '@/utils/filters'
  import JtDialog from '@/components/JtDialog'
  import FormDialog from './formDialog'
  import organDialog from './organDialog'
  import {status} from '@/utils/index'
  import axios from 'axios'

  export default {
    components: {
      JtTable,
      JtPager,
      JtDialog,
      FormDialog,
      organDialog
    },
    data() {
      return {
        tool: "",
        filterText: '',
        treeData: [], //树形数据
        pickerDate: "",
        pageObj: { //page接口参数
          orgIds: "", // 机构ID拼串
          pageNum: 1, //当前页码
          dutyId: "", //职务ID
          pageSize: 10,//每页条数
          roleId: "", //角色ID
          realName: "", //真实姓名
          startDate: null, //起止时间
          stopDate: null
        },
        roleList: [], //角色类别
        dutyList: [],// 职务
        roleIdStatus: {},
        dutyIdStatus: {},
        editor: false, // 编辑
        sizeForm: "",
        organForm: "",
        value1: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        TableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'userName', title: '用户名'},
            {name: 'realName', title: '姓名'},
            {name: 'orgNames', title: '所属机构/部门',width:'120px'},
            {name: 'dutyName', title: '职务'},
            {name: 'linkPhone', title: '联系电话'},
            {name: 'roleName', title: '角色类别'},
            {name: 'createTime', title: '创建时间'},
            {name: 'statusName', title: '账号状态'},
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (val) => {
                this.dialogShow = true;
                this.sizeForm = val.row;
                this.editor = true;
              }
            },
            {
              name: '配置权限',
              handleFunc: (obj) => {
                this.$router.push({
                  name: 'limits',
                  query: {
                    type:'institution',
                    id: obj.row.id,
                    realName: obj.row.realName,
                    dutyId: obj.row.dutyId,
                    dutyName: obj.row.dutyName,
                    resIds: obj.row.resIds
                  }
                });
              }
            },
            {
              name: '删除',
              handleFunc: (val) => {
                this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true
                }).then(() => {
                  this.getData('/user/delete', 'post', {id: val.row.id}, true).then(res => {
                    if (res.code == 0) {
                      this.getPage();
                    }
                  })
                })
              }
            },
             {
              name: '初始化密码',
              handleFunc: (val) => {
                this.getData('/user/pwd/init', 'post', {userId: val.row.id, password:'123456'}, true).then(res => {
                  if (res.code == 0) {
                    this.getPage();
                  }
                })
              }
            },
          ],
          templateUrl: '/template/car_template.xlsx',
          upUrl: "/car/import",
          upload: true
        },
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        dialogShow: false, //人员弹窗
        organAddShow: false, // 机构组织弹窗

      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 显示工具栏
      showTool(id) {
        this.tool = id;
      },
      // 隐藏显示工具栏
      hideTool() {
        this.tool = "";
      },

      /**
       * 请求树形结构数据
       */
      getTree() {
        this.getData('/org/tree', 'post').then(res => {
          this.treeData = JSON.stringify(res.data);
          this.treeData = this.treeData.replace(/childList/g, 'children');
          this.treeData = this.treeData.replace(/name/g, 'label');
          this.treeData = JSON.parse(this.treeData);
          this.traverseTree(this.treeData[0]);
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 表格列表数据请求
       */
      getPage() {
        this.getData('/user/page', 'post', this.pageObj).then(res => {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].createTime = datetime(res.data.list[i].createTime)
            // res.data.list[i].roleName = status(res.data.list[i].roleId,this.roleIdStatus)
            // res.data.list[i].dutyName = status(res.data.list[i].dutyId, this.dutyIdStatus)
            res.data.list[i].statusName = status(res.data.list[i].status, {1: "启用", 2: "停用", 3: "冻结"})
          }
          this.TableData.list = res.data.list;
          // 绑定页码
          this.pager.total = res.data.total;
          if (res.data.pageNum && res.data.pageNum != 'null') {
            this.pager.currentPage = res.data.pageNum;
          }

        }).catch(error => {
          console.log(error)
        })
      },
      /**
       *  姓名模糊查询
       */
      nameChange() {  // 必须输入全名才行---bug
        this.getPage()
      },
      // 页码切换
      changeCurrentPage(nowPage) {
        this.pageObj.pageNum = nowPage;
        this.getPage();
      },
      // 单页查询条数选择
      handleSizeChange(pageNum) {
        this.pageObj.pageSize = pageNum;
        this.getPage();
      },
      // 单个树结构点击方法
      nodeClick(val) {
        // 清空orgIds
        this.pageObj.orgIds = ""
        // 初始化orgIds
        this.traverseTree(val)
        // 初始化请求方法
        this.getPage();
      },
      // 搜索
      searchList() {
        this.getPage();
      },
      //重置方法
      clear() {
        this.pageObj =
          { //page接口参数
            orgIds: "", // 机构ID拼串
            pageNum: 1, //当前页码
            dutyId: "", //职务ID
            pageSize: 10,//每页条数
            roleId: "", //角色ID
            realName: "", //真实姓名
            startDate: null, //起止时间
            stopDate: null
          }
        // 清空时间
        this.pickerDate = ""
        this.getPage();
      },
      // 关闭dialog
      closeDialog() {
        this.dialogShow = false;
      },
      organCloseDialog() {
        this.organAddShow = false;
      },
      // 递归遍历机构id串
      traverseTree(node) {
        let _this = this;
        if (!node) {
          return;
        }
        this.pageObj.orgIds += node.id + ",";
        if (node.children && node.children.length > 0) {
          var i = 0;
          for (i = 0; i < node.children.length; i++) {
            _this.traverseTree(node.children[i]);
          }
        }
      },
      // 人员添加方法
      add() {
        this.dialogShow = true;
        this.editor = false; //编辑状态设为false
        this.sizeForm = {status:1}; //数据清空
      },
      /**
       * 编辑
       */
      edit(obj) {
        let child = false;
        if (obj.children == null || obj.children == 'null') {
          child = true
        }
        this.organAddShow = true;
        this.organForm = {
          editor: true,
          id: obj.id,
          label: obj.label,
          parentId: obj.parentId,
          typeId: obj.typeId,
          child: child
        };
      },
      /**
       * 删除
       */
      minus(id, node) {
        let _this = this;
        this.$confirm('此操作将删除该机构或部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.getData('/org/delete', 'post', {orgIds: id}, true).then((res) => {
            // 更新数据
            if (res.code == 0 || res.code == '0') {
              _this.$refs.institution.remove(node)
            }
          });
        })
      },
      /**
       * 添加
       */
      plus(obj) {
        this.organAddShow = true;
        this.organForm = {id: obj.id, editor: false, child: true, parentId: obj.parentId}; //传id

      },

    },
    created() {
      this.getTree();
      //角色类别列表
      this.getData('/role/list', 'post').then(res => {
        this.roleList = res.data
        for (let i = 0; i < this.roleList.length; i++) {
          this.roleIdStatus[this.roleList[i].id] = this.roleList[i].name
        }
      }).catch(error => {
        console.log(error)
      })
      //职务列表
      this.getData('duty/type/getDutyType', 'post').then(res => {
        this.dutyList = res.data
        for (let i = 0; i < this.dutyList.length; i++) {
          this.dutyIdStatus[this.dutyList[i].id] = this.dutyList[i].name
        }
      }).catch(error => {
        console.log(error)
      })
      this.getPage()
    },
    watch: {
      filterText(val) {
        this.$refs.institution.filter(val);
      },
      pickerDate(val) {
        if (val) {
          this.pageObj.startDate = val[0];
          this.pageObj.stopDate = val[1];
        } else {
          this.pageObj.startDate = null;
          this.pageObj.stopDate = null;
        }
        this.getPage();
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  $primary: #55a8fd;
  .institution {
    .date{
      .el-range-separator {
        font-size: 12px;
        color: #666;
      }
    }
    .Form-inline > .el-form-item > .el-form-item__content > .el-range-editor {
      width: 256px;
      padding: 0px 10px 0px 10px;
      margin-top: 5px;
      .el-range-separator {
        width: 10%;
      }
    }

    .aside {
      width: 250px;
      padding-right: 20px;
      border-right: 1px solid #cddde7;
      .el-input__inner {
        height: 30px;
      }
      .el-input-group__append, .el-input-group__prepend {
        padding: 0 8px;
        background: $primary;
        color: #fff;
        border: 1px solid $primary;
      }
      .filter-tree {
        margin-top: 20px;
        min-height: 500px;
        max-width: 1000px;
        color: #8395ab;
        font-size: 14px;
        .btn_tool {
          background: #fff;
          border: 1px solid #c4d4dd;
          z-index: 55555;
        }

        .btn_tool:hover {
          background: $primary;
          color: #fff;
          border: 1px solid $primary;
        }
        .custom-tree-node {
          width: 100%;
          position: relative;
          .operation {
            position: absolute;
            right: 0;
          }
          &>span:first-child{
            font-size: 12px;
          }
        }
        .el-tree-node__content:hover {
          background: #dfefff;
        }
        .el-tree-node:focus > .el-tree-node__content {
          background: #dfefff;
        }
      }
    }
    .main {
      padding: 0 20px;
      .Form-inline{
        .el-form-item__label {
          font-size: 12px;
          color: #666666;
        }
        .el-input__inner, .el-input {
          width: 180px;
          height: 30px;
          font-size: 12px;
          margin-right: 10px;
        }
      }
    }
  }
</style>


