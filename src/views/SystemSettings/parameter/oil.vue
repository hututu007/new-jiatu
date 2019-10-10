<template>
  <div class="pa-oil">
    <div class="addOil">
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addOil">新增油品类型</el-button>
    </div>
    <div class="oilTable">
      <jt-table ref="oilTable" :tableData="oilTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增规费类型弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShowOil" :title="dialogOil.title" :width="dialogOil.width">
      <div slot="dialog">
        <el-form label-position="right" ref="addOilForm" :model="addOilForm"
                 class="addOilForm">
          <el-form-item label="油品型号">
            <el-input v-model="addOilForm.name"
                      placeholder="请输入油品型号"></el-input>
          </el-form-item>
          <el-form-item label="油品单价">
            <el-input v-model="addOilForm.price"
                      placeholder="请输入油品单价"></el-input>
          </el-form-item>
          <el-form-item label="油品状态" class="mark">
            <el-select v-model="addOilForm.enable" placeholder="请选择">
              <!--<el-option label="全部" value=""></el-option>-->
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShowOil = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addOilFuc(addOilForm)">确 定</el-button>
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
    name: "oil",
    components: {JtTable, JtPager, JtDialog},
    data() {
      return {
        dialogShowOil: false,
        dialogOil: {
          title: '新增油品类型',
          width: '500px'
        },
        addOilForm: {
          name: '',
          price: '',
          enable: ''
        },
        oilTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'name', title: '油品型号'},
            {name: 'price', title: '油品现价'},
            {name: 'enable', title: '类型状态'},
            {name: 'createTime', title: '设置日期'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.dialogOil.title = '编辑油品类型'
                this.dialogShowOil = true
                this.oilId = obj.row.id
                this.update = true
                if(obj.row.enable==='启用'){
                  this.addOilForm={
                    name:obj.row.name,
                    price: obj.row.price,
                    enable:'1'
                  }
                }else{
                  this.addOilForm={
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
                  this.$confirm('此操作将启用该油品类型，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/oil/type/enable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getOilData()
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
                  this.$confirm('此操作将停用该油品类型，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/oil/type/disEnable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getOilData()
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
                this.$confirm('此操作将删除该油品类型，是否继续?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/oil/type/delete', 'post', {id: obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getOilData()
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
        oilId: '',
        update: false
      }
    },
    methods: {
      /**
       *  新增规费类型
       */
      addOil() {
        this.addOilForm = {
          name: '',
          price: '',
          enable: '1'
        }
        this.dialogShowOil = true
      },
      /**
       * 新增、编辑油品类型方法
       * @param form 表单数据
       */
      addOilFuc(form) {
        if(this.update){
          this.getData('/oil/type/update', 'post', {name:form.name, price: form.price,enable:form.enable,id:this.oilId}, true).then(res => {
            if (res.code === 0) {
              this.dialogShowOil = false
              this.update=false
              this.getOilData()
            }
          }).catch(error => {
            console.log(error)
          })
        }else{
          this.getData('/oil/type/add', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShowOil = false
              this.getOilData()
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
        this.getOilData()
      },
      /**
       * 点击切换页码
       * @param val 当前页面
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getOilData()
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
       * 获取油品类型table数据
       */
      getOilData() {
        this.getData('/oil/type/page', 'post', {
          pageNum: this.pager.currentPage,
          pageSize: this.pager.pageSize
        }).then(res => {
          this.filterTime(res.data.list)
          this.carStatus(res.data.list)
          this.oilTableData.list = res.data.list
          this.pager.total = res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getOilData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .pa-oil {
    background-color: white;
    .addOilForm {
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

  .oilTable {
    margin-top: 20px;
  }

</style>
