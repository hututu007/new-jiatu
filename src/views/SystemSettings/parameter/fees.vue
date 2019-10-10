<template>
  <div class="pa-fees">
    <div class="addFees">
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFees">新增规费类型</el-button>
    </div>
    <div class="dutyTable">
      <jt-table ref="feesTable" :tableData="feesTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增规费类型弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShowFees" :title="dialogFees.title" :width="dialogFees.width">
      <div slot="dialog">
        <el-form label-position="right" ref="addFeesForm" :model="addFeesForm"
                 class="addFeesForm">
          <el-form-item label="规费类型">
            <el-input v-model="addFeesForm.name"
                      placeholder="请输入规费类型"></el-input>
          </el-form-item>
          <el-form-item label="规费状态" class="mark">
            <el-select v-model="addFeesForm.enable" placeholder="请选择">
              <!--<el-option label="全部" value=""></el-option>-->
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShowFees = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addFeesFuc(addFeesForm)">确 定</el-button>
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
    name: "fees",
    components: {JtTable, JtPager, JtDialog},
    data() {
      return {
        dialogShowFees: false,
        dialogFees: {
          title: '新增规费类型',
          width: '500px'
        },
        addFeesForm: {
          name: '',
          enable: '1'
        },
        update:false,
        feesTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'name', title: '规费类型'},
            {name: 'enable', title: '规费状态'},
            {name: 'createTime', title: '设置日期'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.dialogFees.title='编辑规费类型'
                this.dialogShowFees = true
                this.feeId=obj.row.id
                this.update=true
                if(obj.row.enable==='启用'){
                  this.addFeesForm={
                    name:obj.row.name,
                    enable:'1'
                  }
                }else{
                  this.addFeesForm={
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
                  this.$confirm('此操作将启用该规费类型，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/fee/type/enable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getFeesData()
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
                  this.$confirm('此操作将停用该规费类型，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/fee/type/disEnable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getFeesData()
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
                this.$confirm('此操作将删除该规费类型，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/fee/type/delete', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getFeesData()
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
        feeId:''
      }
    },
    methods: {
      /**
       *  新增规费类型
       */
      addFees() {
        this.addFeesForm = {
          name: '',
          enable: '1'
        }
        this.dialogShowFees = true
      },
      /**
       * 新增、编辑规费类型方法
       * @param form 表单数据
       */
      addFeesFuc(form) {
        if(this.update){
          this.getData('/fee/type/update', 'post',{name:form.name, enable:form.enable, id: this.feeId}, true).then(res => {
            if (res.code === 0) {
              this.dialogShowFees = false
              this.update=false
              this.getFeesData()
            }
          }).catch(error => {
            console.log(error)
          })
        }else{
          this.getData('/fee/type/add', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShowFees = false
              this.getFeesData()
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
        this.getFeesData()
      },
      /**
       * 点击切换页码
       * @param val 当前页面
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getFeesData()
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
       * 获取规费类型table数据
       */
      getFeesData() {
        this.getData('/fee/type/page', 'post', {
          pageNum: this.pager.currentPage,
          pageSize: this.pager.pageSize
        }).then(res => {
          this.filterTime(res.data.list)
          this.carStatus(res.data.list)
          this.feesTableData.list = res.data.list
          this.pager.total = res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getFeesData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .pa-fees {
    background-color: white;
    .addFeesForm {
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

  .feesTable {
    margin-top: 20px;
  }

</style>
