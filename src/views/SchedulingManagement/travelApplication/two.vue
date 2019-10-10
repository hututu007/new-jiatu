<template>
  <div class="applicationTwo">
    <div class="applicationTwo-form">
      <el-form :inline="true" :model="applicationTwoHeadForm" class="applicationTwoForm-inline">
        <car-type @checkedChange="checkedChange"></car-type>
        <el-form-item label="用车人" class="useMan">
          <el-select @change="useManchange" v-model="useManIds" multiple filterable placeholder="请选择" size="mini">
            <el-option
              v-for="item in useManList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="addapplicationTwo">填写申请</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="applicationTwoTable">
      <jt-table ref="carTable" @tableSelectionChange="tableSelectionChange" :tableData="applicationTwoTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增编辑弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <applay-add @dialogHide="dialogHide" @applicationOneAddFuc="applicationOneAddFuc" :disabled="disabled"></applay-add>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import CarType from '@/components/Cartype'
  import applayAdd from '@/components/applayAdd'
  import {datetime} from '@/utils/filters'
  import {status} from '@/utils/index'
  import {getCookie} from '@/utils/auth'
  export default {
    components:{CarType, JtTable, JtPager, JtDialog, JtOrgSelect, applayAdd},
    name: "Two",
    data() {
      return{
        disabled:false,
        applicationTwoHeadForm:{
          usemanIds:'',
          useTypesStr: '',
          pageSize:10,
          pageNum:1,
          sign: 2
        },
        useManList:[],
        applicationTwoTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'usemanName', title: '用车人', width: '120px'},
            {name: 'createrName', title: '代理申请人', width: '120px'},
            {name: 'orgName', title: '所属机构/部门', width: '150px'},
            {name: 'stopAddress', title: '目的地'},
            {name: 'useReason', title: '用车事由'},
            {name: 'useTime', title: '用车时间'},
            {name: 'urgencyName', title: '紧急状态', width: '100px'},
            {name: 'needName', title: '是否需要驾驶员', width: '150px'},
            {name: 'statusName', title: '审核状态', width: '100px'}
          ],
          handleList: [
            {
              name: '重置',
              handleFunc: (obj) => {
                setTimeout(() => {
                  this.$bus.$emit('resetAddDialog',obj.row)
                }, 30)
                this.dialogShow=true
                this.disabled=true
              }
            },
            {
              name: '查看详情',
              handleFunc: (obj) => {
                this.$router.push({
                  name: 'Progress',
                  query: {
                    id: obj.row.id,
                    sign:2
                  }
                });
              }
            },
            {
              name: '取消',
              handleFunc: (obj) => {
                if(obj.row.canRevoke===0){
                  this.$message({
                    message: '不允许取消此条申请',
                    type: 'warning'
                  });
                }else{
                  this.$confirm('确定取消?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/apply/cancel', 'post', {id:obj.row.id}).then(res => {
                      if(res.code===0){
                        this.$message({
                          message: '已取消',
                          type: 'success'
                        })
                        this.getApplicationTwoList()
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消'
                    });
                  });

                }

              }
            }
          ],
          upload: false,
          downList: [
            {
              name: '批量取消',
              handleFunc: () => {
                if(this.applyIds.split(',').indexOf('0')!=-1){
                  this.$message({
                    message: '包含不允许取消的申请，请检查',
                    type: 'warning'
                  });
                }else{
                  this.$confirm('确定取消?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/apply/batchCancel', 'post', {applyIds :this.applyIds}).then(res => {
                      if(res.code===0){
                        this.$message({
                          message: '已取消',
                          type: 'success'
                        })
                        this.getApplicationTwoList()
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消'
                    });
                  });
                }

              }
            }
          ]
        },
        pager:{
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        applyIds:'',
        useManIds:'',
        dialogShow:false,
        dialog: {
          title: '填写出行申请单',
          width: '800px'
        }
      }
    },
    methods: {
      /**
       * 添加编辑确定过后关闭弹窗
       */
      applicationOneAddFuc() {
        this.getApplicationTwoList()
        this.disabled = false
        this.dialogShow = false
      },
      /**
       * 关闭弹窗
       */
      dialogHide(){
        this.disabled=false
        this.dialogShow=false
      },
      /**
       * 用车类型点击选择
       * @param val id集合
       */
      checkedChange(val) {
        this.applicationTwoHeadForm.useTypesStr=val
        this.getApplicationTwoList()
      },
      /**
       * 用车人点击选择
       * @param val 选中的id
       */
      useManchange(val){
        this.applicationTwoHeadForm.usemanIds=val.join(',')
        this.getApplicationTwoList()
      },
      /**
       *  获取page数据方法
       */
      getApplicationTwoList() {
        this.getData('/apply/wait/page', 'post', this.applicationTwoHeadForm).then(res => {
          this.pager.total=res.data.total
          this.applicationTwoTableData.list = res.data.list
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].useTime = datetime(res.data.list[i].preStartTime,'yy:MM:dd hh:mm:ss') + '至' + datetime(res.data.list[i].preStopTime,'yy:MM:dd hh:mm:ss')
            res.data.list[i].urgencyName = status(res.data.list[i].urgency, {0: '否', 1: '是'})
            res.data.list[i].needName = status(res.data.list[i].needDriver, {0: '不需要', 1: '需要'})
            res.data.list[i].statusName = status(res.data.list[i].status, {
              0: '草稿', 1: '待审核', 2: '流转中', 3: '不通过',
              4: '待派车', 5: '待开始', 6: '任务中', 7: '任务结束', 8: '任务取消', 9: '删除', 10: '拒绝派车'
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       *  填写申请
       */
      addapplicationTwo(){
        setTimeout(() => {
          this.$bus.$emit('addApplicationOne')
        }, 30)
        this.dialogShow=true
        this.disabled=false
      },
      /**
       * 表格多选择
       * @param val 选择的所有数据数组
       */
      tableSelectionChange(val){
        var arr = []
        if (val.length) {
          for (var i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
        }
        this.applyIds = arr.join(',')
      },
      /**
       * 分页每页显示数量选择
       * @param val
       */
      handleSizeChange(val){
        this.applicationTwoHeadForm.pageSize=val
        this.getApplicationTwoList()
      },
      /**
       * 分页当前页码选择
       * @param val 当前页码
       */
      changeCurrentPage(val){
        this.applicationTwoHeadForm.pageNum=val
        this.getApplicationTwoList()
      },
    },
    mounted() {
      this.getApplicationTwoList()
      /** 用车人数据 **/
      this.getData('/apply/useman/list', 'post').then(res => {
        for (var i = 0; i < res.data.length; i++) {
          if(res.data[i].id!=getCookie('jiatu_userId')){
            this.useManList.push({
              label: res.data[i].realName,
              value: res.data[i].id
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .applicationTwo{
    .applicationTwo-form{
      .applicationTwoForm-inline{
        &>div{
          width: 100%;
          float: left;
        }
        .useMan{
          .el-form-item__label{
            font-size: 12px;
            font-weight: normal;
            color: #999;
          }
        }
      }
      .applicationTwoTable {
        padding: 30px 20px 20px 20px;
      }
    }
  }
</style>
