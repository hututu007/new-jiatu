<template>
  <div class="noticeTwo">
    <jt-table ref="carTable" @tableSelectionChange="tableSelectionChange" :tableData="notice1TableData">
      <div slot="tablePage">
        <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                  @changeCurrentPage="changeCurrentPage"></jt-pager>
      </div>
    </jt-table>
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
  import {datetime} from '@/utils/filters'
  import seeDalog from './seeDalog'
  import JtDialog from '@/components/JtDialog'
  export default {
    name: "two",
    components: {JtTable, JtPager, seeDalog, JtDialog},
    data() {
      return {
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
        notice1TableData: {
          checkStyle: true,
          signStyle:true,
          list: [],
          headList: [
            {name: 'title', title: '标题'},
            {name: 'createTime1', title: '发布时间'},
            {name: 'releaseName', title: '快报状态'},
            {name: 'typeName', title: '快报类型'},
          ],
          handleList: [
            {
              name: '标记已读',
              handleFunc: (obj) => {
                this.$confirm('此操作将标记为已读信息，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/product/org/signRead', 'post', {id: obj.row.id}).then(res => {
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
              name: '查看',
              handleFunc: (obj) => {
                this.getData('/product/org/signRead', 'post', {id: obj.row.id}).then(res => {
                  if (res.code === 0) {
                    this.getPage()
                  }
                }).catch(error => {
                  console.log(error)
                })

                this.viewDialogSort = true
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
                this.$confirm('此操作将所选快报标记为已读信息，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/product/org/batchSignRead', 'post', {infoIds: this.infoIds}, true).then(res => {
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
              handleFunc: () => {
                this.$confirm('此操作将全部快报标记为已读信息，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/product/org/allSignRead ', 'post', {allRead : true}, true).then(res => {
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
        infoIds:''
      }
    },
    methods:{
      tableSelectionChange(val){
        var arr = []
        if (val.length) {
          for (var i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
        }
        this.infoIds = arr.join(',')
      },
      handleSizeChange(val){
        this.pager.pageSize=val
        this.getPage()
      },
      changeCurrentPage(val){
        this.pager.currentPage=val
        this.getPage()
      },
      getPage(){
        this.getData('/product/org/page ', 'post',{pageNum: this.pager.currentPage,pageSize: this.pager.pageSize}).then(res => {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].createTime1 = datetime(res.data.list[i].createTime)
            res.data.list[i].releaseName = (res.data.list[i].release ? '发布' : '草稿')
          }
          this.notice1TableData.list=res.data.list
          this.pager.total=res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted(){
      this.getPage()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .noticeTwo {

  }

</style>
