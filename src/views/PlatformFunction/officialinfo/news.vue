<template>
  <div class="publicTable1">
    <div class="publicTable-form">
      <el-form :inline="true" :model="search1Form" class="searchForm-inline">
        <el-form-item label="快报类型">
          <el-select
            v-model="search1Form.typeId"
            size="small"
            placeholder='请选择'
            style="width: 193px;">
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快报状态" >
          <el-select
            v-model="search1Form.release"
            size="small"
            placeholder='请选择'
            style="width: 193px;">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="newsSearch()">查询</el-button>
          <el-button class="fn-btn-reset" size="mini" @click="resetForm()">重置</el-button>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFastFuc">发布快报</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="Table">
      <jt-table ref="Table" :tableData="TableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增编辑弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <el-form label-position="right" ref="AddForm" :model="yearAddForm" id="yearAddForm">
          <!--:rules="rules"-->
              <div class="grid-content bg-purple">
                <el-form-item label="标题" prop="">
                  <el-input v-model="yearAddForm.title" placeholder="请输入标题" style="width: 320px;"></el-input>
                </el-form-item>
                  <el-form-item label="类型" prop="">
                    <el-select
                      v-model="yearAddForm.typeId"
                      size="small"
                      placeholder='请选择'
                      style="width: 320px;">
                      <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                    <el-button size="mini" style="margin-left: 20px" icon="el-icon-plus" @click="addNewsFuc">新增分类</el-button>
                  </el-form-item>
                  <el-form-item label="活动形式" class="editorBox">
                    <editor ref="newsEditor"></editor>
                  </el-form-item>
                  <el-form-item label="发送范围">
                    <jt-more-select ref="upOrgName"  width="320px"  @moreCheck="moreCheck"></jt-more-select>
                  </el-form-item>
              </div>
          <el-form-item style="display:flex;justify-content:center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShow=false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="yearAddFuc(yearAddForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
    <!-- 新增分类 -->
    <jt-dialog :dialog-show.sync="dialogSortShow" :title="dialog1.title" :width="dialog1.width">
      <div slot="dialog">
        <el-form  class="sort" label-position="right" :model="sortAddForm">
          <el-form-item label="快报分类" prop="">
            <el-input v-model="sortAddForm.name" placeholder="请输入" style="width: 193px;"></el-input>
          </el-form-item>
          <el-form-item style="display:flex;justify-content:center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogSortShow=false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="sortAddFuc(sortAddForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
    <!-- 预览 -->
    <jt-dialog :dialog-show.sync="viewDialogSort" :title="viewDialogStop.title" :width="viewDialogStop.width">
      <div slot="dialog">
        <see-dalog :content="content" :val="val"></see-dalog>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtMoreSelect from '@/components/Jtmoreselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import editor from '@/components/editor'
  import {datetime} from '@/utils/filters'
  import seeDalog from './seeDalog'
  export default {
    components:{JtMoreSelect, JtTable, JtPager, JtDialog, editor, seeDalog},
    data() {
      return {
        typeOptions:[],
        content: '',
        val: {
          createTime: '',
          creater: '',
          title: ''
        },
        viewDialogSort: false,
        viewDialogStop: {
          title: '预览',
          width: '800px'
        },
        statusOptions: [{value: 0, label: '草稿'}, {value: 1, label: '发布'}],
        search1Form:{
          typeId: '',
          release: '',
          pageSize: 10,
          pageNum:1
        },
        TableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'title', title: '标题'},
            {name: 'createTime1', title: '发布时间'},
            {name: 'releaseName', title: '快报状态'},
            {name: 'typeName', title: '快报类型'},
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.dialogShow=true
                this.dialog.title = '编辑快报'
                this.update = true
                this.yearAddForm = {
                  title: obj.row.title,
                  typeId: obj.row.typeId,
                  content: obj.row.content,
                  suborgids: obj.row.suborgids,
                  id: obj.row.id
                }
                setTimeout(() => {
                  this.$bus.$emit('contentFuc', obj.row.content)
                  this.$bus.$emit('nodeIdsFuc', obj.row.suborgids.split(',').map(Number), obj.row.orgNames)
                }, 100)
              }
            },
            {
              name: '撤回',
              handleFunc: (obj) => {
                if (obj.row.release === 0) {
                  this.$confirm('已为草稿状态不可撤回?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                  }).catch(() => {
                  })
                } else if (obj.row.release === 1) {
                  var obj = {
                    release: 0,
                    id: obj.row.id
                  }
                  this.$confirm('是否撤回此条快报?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/product/platform/updateRelease', 'post', obj, true).then(res => {
                      if (res.code === 0) {
                        this.getPage()
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }).catch(() => {
                  })
                }

              }
            },
            {
              name: '预览',
              handleFunc: (obj) => {
                this.viewDialogSort = true
                this.content = obj.row.content
                this.val = {
                  createTime: datetime(obj.row.createTime, 'yy:MM:dd hh:mm:ss'),
                  creater: obj.row.creater,
                  title: obj.row.title
                }
              }
            },
            {
              name: '发布',
              handleFunc: (obj) => {
                if (obj.row.release === 1) {
                  this.$confirm('已为发布状态不可发布?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                  }).catch(() => {
                  })
                } else if (obj.row.release === 0) {
                  var obj = {
                    release: 1,
                    id: obj.row.id
                  }
                  this.$confirm('是否发布此条快报?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/product/platform/updateRelease', 'post', obj, true).then(res => {
                      if (res.code === 0) {
                        this.getPage()
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }).catch(() => {
                  })
                }
              }
            },
            {
              name: '删除',
              handleFunc: (obj) => {
                this.$confirm('是否删除此条快报?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/product/platform/delete', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getPage()
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                })
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
          pageSize: 10
        },
        dialogShow: false,
        dialog: {
          title: '新增快报',
          width: '800px'
        },
        yearAddForm:{
          title: '',
          typeId: '',
          content: '',
          suborgids: ''
        },
        dialogSortShow:false,
        dialog1: {
          title: '新增产品快报分类',
          width: '500px'
        },
        sortAddForm:{
          name:''
        },
        update:false
      }
    },
    methods: {
      newsSearch() {
        this.getPage()
      },
      resetForm() {
        this.search1Form = {
          typeId: '',
          release: '',
          pageSize: 10,
          pageNum: 1
        }
        this.getPage()
      },
      addFastFuc(){
        this.dialog.title = '发布快报'
        this.update = false
        this.dialogShow = true

        this.yearAddForm = {
          title: '',
          typeId: '',
          content: '',
          suborgids: ''
        }
        setTimeout(() => {
          this.$bus.$emit('contentFuc', '')
          this.$bus.$emit('nodeIdsFuc', [], '')
        }, 100)
      },
      addNewsFuc(){
        this.dialogSortShow = true
      },
      moreCheck(val){
        this.yearAddForm.suborgids = val.join(',')
      },
      handleSizeChange(val) {
        this.search1Form.pageSize=val
        this.getPage()
      },
      changeCurrentPage(val) {
        this.search1Form.pageNum=val
        this.getPage()
      },
      yearAddFuc(form){
        form.content=this.$refs.newsEditor.Content
        if (this.update) {
          this.getData('/product/platform/update', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShow = false
              this.getPage()
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.getData('/product/platform/add', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShow = false
              this.getPage()
            }
          }).catch(error => {
            console.log(error)
          })
        }
      },
      sortAddFuc(){
        this.getData('/product/type/add', 'post', this.sortAddForm, true).then(res => {
          if (res.code === 0) {
            this.dialogSortShow = false
            this.getSortPage()
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getSortPage() {
        this.getData('/product/type/page', 'post').then(res => {
          this.typeOptions = res.data.list
        }).catch(error => {
          console.log(error)
        })
      },
      getPage(){
        this.getData('/product/platform/page', 'post',this.search1Form).then(res => {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].createTime1 = datetime(res.data.list[i].createTime)
            res.data.list[i].releaseName = (res.data.list[i].release ? '发布' : '草稿')
          }
          this.TableData.list=res.data.list
          this.pager.total=res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getSortPage()
      this.getPage()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .publicTable1 {
    .sort{
      .el-input__inner {
        width: 193px;
        height: 28px;
        font-size: 12px;
        line-height: 28px;
      }
    }
    .publicTable-form {
      .searchForm-inline {
        .el-form-item__label {
          font-size: 12px;
        }
        .el-input__inner {
          width: 193px;
          height: 28px;
          font-size: 12px;
          line-height: 28px;
        }
        .range {
          padding: 0px 10px;
        }
        .range > .el-input__icon {
          line-height: 28px;
        }
        .range > input {
          font-size: 12px;
        }
        .range > span {
          font-size: 12px;
          padding: 0px 14px 0px 5px;
        }
      }
      .orgBox > .el-form-item__content > .jt-org-select > .el-select > .el-input > .el-input__inner {
        width: 193px;
      }
    }
    #yearAddForm{
      .el-form-item__label{
        width: 110px;
        font-size: 12px;
      }
      .el-input__inner{
        height: 28px;
      }
      .editorBox{
        .el-form-item__content{
          float: left;
          .editor{
            width: 540px;
          }
        }
      }
    }
  }

</style>
