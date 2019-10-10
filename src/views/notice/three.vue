<template>
  <div class="noticeThree">
    <div class="notice-form">
      <el-form :inline="true" :model="noticeForm" class="noticeForm-inline">
        <el-form-item label="公告类型">
          <el-select v-model="noticeForm.typeId" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告状态">
          <el-select
            v-model="noticeForm.release"
            size="small"
            placeholder='请选择'>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="noticeSearch()">查询</el-button>
          <el-button class="fn-btn-reset" size="mini" @click="resetForm()">重置</el-button>
        </el-form-item>
        <div>
          <el-form-item v-if="roleShow">
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="innerNoticeFuc">发布内部公告</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="noticeTable">
      <jt-table v-if="roleShow" ref="carTable" :tableData="notice3TableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>

      <jt-table v-if="!roleShow" ref="carTable" @tableSelectionChange="tableSelectionChange1" :tableData="notice3TableData1">
        <div slot="tablePage">
          <jt-pager :pager="pager1" @handleSizeChange="handleSizeChange1"
                    @changeCurrentPage="changeCurrentPage1"></jt-pager>
        </div>
      </jt-table>
    </div>

    <!-- 发布公告 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="noticeDialogStop.title" :width="noticeDialogStop.width">
      <div slot="dialog">
        <el-form label-position="right" ref="noticeDialogForm" :model="noticeDialogForm"
                 class="noticeDialogForm">
          <el-form-item label="标题">
            <el-input style="width: 320px;" v-model="noticeDialogForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select style="width: 320px;" v-model="noticeDialogForm.typeId" placeholder="请选择">
              <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-button @click="noticeDialogSort=true" size="mini" style="margin-left: 20px">+新增分类</el-button>
          </el-form-item>
          <el-form-item label="公告内容" class="mark">
            <editor ref="noticeEditor"></editor>
          </el-form-item>
          <el-form-item label="发送范围" class="orgBox">
            <jt-more-select ref="moreSelect" width="320px" @moreCheck="moreCheck"></jt-more-select>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addStopFuc(noticeDialogForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
    <!-- 新增分类 -->
    <jt-dialog :dialog-show.sync="noticeDialogSort" :title="SortDialogStop.title" :width="SortDialogStop.width">
      <div slot="dialog">
        <el-form label-position="right" ref="sortAddForm" :model="sortAddForm"
                 class="sortDialogForm">
          <el-form-item label="公告分类">
            <el-input v-model="sortAddForm.name" placeholder="请输入名额(限10个字符)"></el-input>
          </el-form-item>
          <el-form-item style="width: 100%;margin-top: 20px;display: flex;justify-content: center">
            <el-button size="mini" @click="noticeDialogSort = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addSortFuc(sortAddForm)">确 定</el-button>
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
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {getCookie} from '@/utils/auth'
  import JtMoreSelect from '@/components/Jtmoreselect'
  import editor from '@/components/editor'
  import {datetime} from '@/utils/filters'
  import seeDalog from './seeDalog'

  export default {
    components: {JtTable, JtPager, JtDialog, editor, JtMoreSelect, seeDalog},
    data() {
      return {
        content: '',
        val: {
          createTime: '',
          creater: '',
          title: ''
        },
        noticeForm: {
          release: '',
          typeId:'',
          pageSize:10,
          pageNum:1,
        },
        statusOptions: [{value: 0, label: '草稿'}, {value: 1, label: '发布'}],
        roleShow:false,
        notice3TableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'title', title: '标题'},
            {name: 'createTime1', title: '发布时间'},
            {name: 'releaseName', title: '公告状态'},
            {name: 'typeName', title: '公告类型'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.noticeDialogStop.title = '编辑内部公告'
                this.update = true
                this.dialogShow = true
                this.noticeDialogForm = {
                  title: obj.row.title,
                  typeId: obj.row.typeId,
                  content: obj.row.content,
                  suborgIds: obj.row.suborgIds,
                  id: obj.row.id
                }
                setTimeout(() => {
                  this.$bus.$emit('contentFuc', obj.row.content)
                  this.$bus.$emit('nodeIdsFuc', obj.row.suborgIds.split(',').map(Number), obj.row.orgNames)
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
                  this.$confirm('是否撤回此条公告?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/notice/platform/updateRelease', 'post', obj, true).then(res => {
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
                this.viewDialogSort=true
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
                  this.$confirm('是否发布此条公告?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/notice/platform/updateRelease', 'post', obj, true).then(res => {
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
                this.$confirm('是否删除此条公告?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/notice/platform/delete', 'post', {id: obj.row.id}, true).then(res => {
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
          ],
          upload: false,
          downList: []
        },
        notice3TableData1: {
          checkStyle: true,
          signStyle:true,
          list: [],
          headList: [
            {name: 'title', title: '标题'},
            {name: 'createTime1', title: '发布时间'},
            {name: 'releaseName', title: '公告状态'},
            {name: 'typeName', title: '公告类型'}
          ],
          handleList: [
            {
              name: '标记已读',
              handleFunc: (obj) => {
                this.$confirm('此操作将此公告标记为已读信息，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/notice/org/signRead', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getPage1()
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                });
              }
            },
            {
              name: '查看',
              handleFunc: (obj) => {
                this.viewDialogSort=true
                this.content = obj.row.content
                this.val = {
                  createTime: datetime(obj.row.createTime, 'yy:MM:dd hh:mm:ss'),
                  creater: obj.row.creater,
                  title: obj.row.title
                }
              }
            }
          ],
          upload: false,
          downList: [
            {
              name: '标记已读',
              handleFunc: () => {
                this.$confirm('此操作将所选公告标记为已读信息，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/notice/org/batchSignRead', 'post', {infoIds: this.infoIds}, true).then(res => {
                    if (res.code === 0) {
                      this.getPage()
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
                });

              }
            },
            {
              name: '全部标记已读',
              handleFunc: (obj) => {
                this.$confirm('此操作将全部公告标记为已读信息，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/notice/org/allSignRead ', 'post', {allRead : true}, true).then(res => {
                    if (res.code === 0) {
                      this.getPage()
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }).catch(() => {
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
          pageSize: 10
        },
        pager1: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        dialogShow: false,
        noticeDialogStop: {
          title: '发布内部公告',
          width: '800px'
        },
        noticeDialogForm: {
          title: '',
          typeId: '',
          content: '',
          suborgIds: ''
        },
        SortDialogStop: {
          title: '公告分类',
          width: '500px'
        },
        typeList: [],
        noticeDialogSort:false,
        sortAddForm:{
          name:''
        },
        viewDialogSort:false,
        viewDialogStop:{
          title: '预览',
          width: '800px'
        },
        infoIds:'',
        update:false
      }
    },
    methods: {
      resetForm(form){
        this.noticeForm={
          release: '',
          typeId:'',
          pageSize:10,
          pageNum:1,
        }
        if(parseInt(getCookie('jiatu_roleId'))===1){
          this.getPage()
        }else{
          this.getPage1()
        }

      },
      noticeSearch() {
        if(parseInt(getCookie('jiatu_roleId'))===1){
          this.getPage()
        }else{
          this.getPage1()
        }
      },
      innerNoticeFuc(){
        this.update=false
        this.noticeDialogStop.title = '发布内部公告'
        this.dialogShow = true
        this.noticeDialogForm = {
          title: '',
          typeId: '',
          content: '',
          suborgIds: ''
        }
        setTimeout(() => {
          this.$bus.$emit('contentFuc', '')
          this.$bus.$emit('nodeIdsFuc', [], '')
        }, 100)
      },
      handleSizeChange(val) {
        this.noticeForm.pageSize=val
        this.getPage()
      },
      changeCurrentPage(val) {
        this.noticeForm.pageNum=val
        this.getPage()
      },
      tableSelectionChange1(val) {
        var arr = []
        if (val.length) {
          for (var i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
        }
        this.infoIds = arr.join(',')
      },
      handleSizeChange1(val) {
        this.noticeForm.pageSize=val
        this.getPage1()
      },
      changeCurrentPage1(val) {
        this.noticeForm.pageNum=val
        this.getPage1()
      },
      moreCheck(val) {
        this.noticeDialogForm.suborgIds = val.join(',')
      },
      addStopFuc(form) {
        form.content=this.$refs.noticeEditor.Content
        if (this.update) {
          this.getData('/notice/platform/update', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShow = false
              this.getPage()
            }
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.getData('/notice/platform/add', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShow = false
              this.getPage()
            }
          }).catch(error => {
            console.log(error)
          })
        }

      },
      addSortFuc(){
        this.getData('/notice/type/add', 'post', this.sortAddForm, true).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.noticeDialogSort = false
            this.getSortPage()
          }
        }).catch(error => {
          console.log(error)
        })

      },
      getSortPage(){
        this.getData('/notice/type/page', 'post').then(res => {
          this.typeList = res.data.list
        }).catch(error => {
          console.log(error)
        })
      },
      getPage(){
        this.getData('/notice/platform/page ','post',this.noticeForm).then(res => {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].createTime1 = datetime(res.data.list[i].createTime)
            res.data.list[i].releaseName = (res.data.list[i].release ? '发布' : '草稿')
          }
          this.notice3TableData.list=res.data.list
          this.pager.total=res.data.total
        }).catch(error => {
          console.log(error)
        })
      },
      getPage1(){
        this.getData('/notice/org/page', 'post',this.noticeForm).then(res => {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].createTime1 = datetime(res.data.list[i].createTime)
            res.data.list[i].releaseName = (res.data.list[i].release ? '发布' : '草稿')
          }
          this.notice3TableData1.list=res.data.list
          this.pager1.total=res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getSortPage()
      if(parseInt(getCookie('jiatu_roleId'))===1){
        this.roleShow=true
        this.getPage()
      }else{
        this.roleShow=false
        this.getPage1()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .noticeThree {
    .notice-form {
      .noticeForm-inline {
        .el-form-item__label {
          font-size: 12px;
        }
        .el-input__inner {
          width: 180px;
          height: 28px;
          font-size: 12px;
          line-height: 28px;
        }
      }
    }
    .noticeDialogForm{
      .el-form-item__label{
        width: 100px;
      }

      .el-form-item:nth-child(1){
        .el-form-item__content{
          float: left;
          .el-input__inner{
            height: 28px;
          }
        }
      }
      .el-form-item:nth-child(2){
        .el-input__inner{
          height: 28px;
        }
      }
      .el-form-item:nth-child(3){
        .el-form-item__content{
          float: left;
          width:570px;
        }
      }
      .el-form-item:nth-child(4){
        .el-input__inner{
          height: 28px;
        }
      }
    }
    .sortDialogForm{
      .el-form-item__content{
        float: left;
        .el-input__inner{
          height: 28px;
        }
      }
    }
  }
</style>

