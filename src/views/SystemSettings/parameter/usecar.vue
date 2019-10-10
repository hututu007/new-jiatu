<template>
  <div class="pa-usecar">
    <div class="addUsecar">
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addUsecar">新增用车类型</el-button>
    </div>
    <div class="usecarTable">
      <jt-table ref="feesTable" :tableData="usecarTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增用车类型弹窗-->
    <jt-dialog :dialog-show.sync="dialogShowUsecar" :title="dialogUsecar.title" :width="dialogUsecar.width">
      <div slot="dialog">
        <el-form label-position="right" ref="addUsecarForm" :model="addUsecarForm"
                 class="addUsecarForm">
          <el-form-item label="用车类型">
            <el-input v-model="addUsecarForm.name"
                      placeholder="请输入用车类型"></el-input>
          </el-form-item>
          <el-form-item label="用车状态" class="mark">
            <el-select v-model="addUsecarForm.enable" placeholder="请选择">
              <!--<el-option label="全部" value=""></el-option>-->
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShowUsecar = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addUsecarFuc(addUsecarForm)">确 定</el-button>
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
    name: "usecar",
    components: {JtTable, JtPager, JtDialog},
    data() {
      return {
        dialogShowUsecar: false,
        dialogUsecar: {
          title: '新增用车类型',
          width: '500px'
        },
        addUsecarForm: {
          name: '',
          enable: '1'
        },
        usecarTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'name', title: '用车类型'},
            {name: 'enable', title: '类型状态'},
            {name: 'createTime', title: '设置日期'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.dialogUsecar.title='编辑用车类型'
                this.update=true
                this.usecarId=obj.row.id
                this.dialogShowUsecar = true
                if(obj.row.enable==='启用'){
                  this.addUsecarForm={
                    name:obj.row.name,
                    enable:'1'
                  }
                }else{
                  this.addUsecarForm={
                    name:obj.row.name,
                    enable:'0'
                  }
                }
              }
            },
            {
              name: '启用',
              handleFunc: (obj) => {
                if(obj.row.enable==='停用'){
                  /** 启用接口 **/
                  this.$confirm('此操作将启用该用车类型，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/apply/usetype/enable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getUsecarData()
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
                      type: 'info',
                      message: '已取消'
                    });
                  });
                }else{
                  /** 停用接口 **/
                  this.$confirm('此操作将停用该用车类型，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/apply/usetype/disEnable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getUsecarData()
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
                      type: 'info',
                      message: '已取消'
                    });
                  });
                }
              }
            },
            {
              name: '删除',
              handleFunc: (obj) => {
                this.$confirm('此操作将删除该用车类型，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/apply/usetype/delete', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getUsecarData()
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
                    type: 'info',
                    message: '已取消'
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
          pageSize: 10
        },
        usecarId:'',
        update:false
      }
    },
    methods: {
      /**
       *  新增规费类型
       */
      addUsecar() {
        this.addUsecarForm = {
          name: '',
          enable: '1'
        }
        this.dialogShowUsecar = true
      },
      /**
       * 新增、编辑用车类型方法
       * @param form 表单数据
       */
      addUsecarFuc(form) {
        if(this.update){
          this.getData('/apply/usetype/update', 'post', {name:form.name, enable:form.enable, id: this.usecarId}, true).then(res => {
            if (res.code === 0) {
              this.dialogShowUsecar = false
              this.update=false
              this.getUsecarData()
            }
          }).catch(error => {
            console.log(error)
          })
        }else{
          this.getData('/apply/usetype/add', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShowUsecar = false
              this.getUsecarData()
            }
          }).catch(error => {
            console.log(error)
          })
        }


      },
      /**
       * 点击切换当前页数量
       * @param val 当前页数量
       */
      handleSizeChange(val) {
        this.pager.pageSize = val
        this.getUsecarData()
      },
      /**
       * 点击切换页码
       * @param val 当前页面
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getUsecarData()
      },
      /**
       * 过滤后台数据时间格式
       */
      filterTime(data) {
        for (var i = 0; i < data.length; i++) {
          data[i].createTime = datetime(data[i].createTime)
        }
      },
      /**
       * 循环绑定规费类型状态方法
       */
      carStatus(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].enable === false) {
            data[i].enable = '停用'
          } else {
            data[i].enable = '启用'
          }
        }
      },
      /**
       * 获取用车类型table数据
       */
      getUsecarData() {
        this.getData('/apply/usetype/page', 'post', {
          pageNum: this.pager.currentPage,
          pageSize: this.pager.pageSize
        }).then(res => {
          this.filterTime(res.data.list)
          this.carStatus(res.data.list)
          this.usecarTableData.list = res.data.list
          this.pager.total = res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getUsecarData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .pa-usecar {
    background-color: white;
    .addUsecarForm {
      .el-form-item {
        .el-input__inner {
          width: 193px;
          height: 28px;
        }
        &:nth-child(1) {
          .el-form-item__content > .el-input {
            width: auto;
          }
        }
      }
    }
  }

  .usecarTable {
    margin-top: 20px;
  }
</style>
