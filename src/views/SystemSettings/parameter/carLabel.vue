<template>
  <div class="pa-CarLabel">
    <div class="addCarLabel">
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addCarLabel">新增车辆标签</el-button>
    </div>
    <div class="CarLabelTable">
      <jt-table ref="CarLabelTable" :tableData="CarLabelTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增规费类型弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShowCarLabel" :title="dialogCarLabel.title" :width="dialogCarLabel.width">
      <div slot="dialog">
        <el-form label-position="right" ref="addCarLabelForm" label-width="65px" :model="addCarLabelForm"
                 class="addCarLabelForm">
          <el-form-item label="车辆标签">
            <el-input v-model="addCarLabelForm.name"
                      placeholder="请输入车辆标签"></el-input>
          </el-form-item>
          <el-form-item label="状态" >
            <el-select v-model="addCarLabelForm.enable" placeholder="请选择">
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="备注">-->
            <!--<el-input v-model="addCarLabelForm.remark"-->
                      <!--type="textarea"-->
                      <!--style="width:193px"-->
                      <!--placeholder="请填写备注"></el-input>-->
          <!--</el-form-item>-->
          <div style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShowCarLabel = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addCarLabelFuc(addCarLabelForm)">确 定</el-button>
          </div>
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
    name: "CarLabel",
    components: {JtTable, JtPager, JtDialog},
    data() {
      return {
        dialogShowCarLabel: false,
        dialogCarLabel: {
          title: '新增车辆标签',
          width: '500px'
        },
        addCarLabelForm: {
          name: '',
          // remark: '',
          enable: '1',
        },
        CarLabelTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'name', title: '车辆标签'},
            // {name: 'remark', title: '备注'},
            {name: 'enable', title: '状态'},
            {name: 'createTime', title: '设置日期'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.dialogCarLabel.title = '编辑车辆标签'
                this.dialogShowCarLabel = true
                this.update = true
                if(obj.row.enable==='启用'){
                  this.addCarLabelForm={
                    name:obj.row.name,
                    id: obj.row.id,
                    // remark: obj.row.remark,
                    enable:'1'
                  }
                }else{
                  this.addCarLabelForm={
                    name:obj.row.name,
                    price: obj.row.price,
                    enable:'0'
                  }
                }
              }
            },
            {
              name: '启用',
              handleFunc: (obj) => {
                if (obj.row.enable === '停用') {
                  /** 启用接口 **/
                  this.$confirm('此操作将启用该车辆标签，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/carLabel/enable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getCarLabelData()
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
                } else {
                  /** 停用接口 **/
                  this.$confirm('此操作将停用该车辆标签，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/carLabel/disEnable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getCarLabelData()
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
                this.$confirm('此操作将删除该车辆标签，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/carLabel/delete', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getCarLabelData()
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
        CarLabelId: '',
        update: false
      }
    },
    methods: {
      /**
       *  新增规费类型
       */
      addCarLabel() {
        //清空
        this.addCarLabelForm = {
          name: '',
          // remark: '',
          enable: '1',
        },
        this.dialogShowCarLabel = true
      },
      /**
       * 新增、编辑油品类型方法
       * @param form 表单数据
       */
      addCarLabelFuc(form) {
        if(this.update){
          this.getData('/carLabel/update', 'post',form, true).then(res => {
            if (res.code === 0) {
              this.dialogShowCarLabel = false
              this.update=false
              this.getCarLabelData()
            }
          }).catch(error => {
            console.log(error)
          })
        }else{
          this.getData('/carLabel/add', 'post', form, true).then(res => {

            if (res.code === 0) {
              this.dialogShowCarLabel = false
              this.getCarLabelData()
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
        this.getCarLabelData()
      },
      /**
       * 点击切换页码
       * @param val 当前页面
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getCarLabelData()
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
       * 获取类型table数据
       */
      getCarLabelData() {
        this.getData('/carLabel/page', 'post', {
          pageNum: this.pager.currentPage,
          pageSize: this.pager.pageSize
        }).then(res => {
          this.filterTime(res.data.list)
          this.carStatus(res.data.list)
          this.CarLabelTableData.list = res.data.list
          this.pager.total = res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getCarLabelData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .pa-CarLabel {
    background-color: white;
    .addCarLabelForm {
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
        &:nth-child(2) {
          .el-form-item__content > .el-input {
            width: auto;
          }
        }
      }
    }
  }

  .CarLabelTable {
    margin-top: 20px;
  }

</style>
