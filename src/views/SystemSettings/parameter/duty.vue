<template>
  <div class="pa-duty">
    <div class="addDuty">
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addDuty">新增职务类型</el-button>
    </div>
    <div class="dutyTable">
      <jt-table ref="dutyTable" :tableData="dutyTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增职务类型弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShowDuty" :title="dialogDuty.title" :width="dialogDuty.width">
      <div slot="dialog">
        <el-form label-position="right" ref="addDutyForm" :model="addDutyForm"
                 class="addDutyForm">
          <el-form-item label="职务类型">
            <el-input v-model="addDutyForm.name"
                      placeholder="请输入职务类型"></el-input>
          </el-form-item>
          <el-form-item label="职务状态" class="mark">
            <el-select v-model="addDutyForm.enable" placeholder="请选择">
              <!--<el-option label="全部" value=""></el-option>-->
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShowDuty = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="addDutyFuc(addDutyForm)">确 定</el-button>
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
    name: "duty",
    components: {JtTable, JtPager, JtDialog},
    data() {
      return {
        dialogShowDuty: false,
        dialogDuty: {
          title: '新增职务类型',
          width: '500px'
        },
        addDutyForm: {
          name: '',
          enable: '1'
        },
        limitId: '',
        update: false,
        hasNumber:false,
        dutyTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'name', title: '职务类型'},
            {name: 'number', title: '职务人数'},
            {name: 'enable', title: '职务状态'},
            {name: 'createTime', title: '设置时间'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.dialogDuty.title = '编辑职务类型'
                this.limitId = obj.row.id
                this.update = true
                this.dialogShowDuty = true
                this.addDutyForm = {
                  name: obj.row.name,
                  enable: obj.row.enable
                }
                if(obj.row.number === 0){
                  this.hasNumber=false
                }else {
                  this.hasNumber=true
                }
              }
            },
            {
              name: '启用',
              handleFunc: (obj) => {
                if (obj.row.enable === '停用') {
                  /** 启用接口 **/
                  this.$confirm('此操作将启用该职务，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/duty/type/enable', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getDutyData()
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
                  /** 停用接口 - 如果有职务人数提示不能停用 **/
                  if (obj.row.number === 0) {
                    this.$confirm('此操作将停用该职务，是否继续?', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      this.getData('/duty/type/disEnable', 'post', {id: obj.row.id}, true).then(res => {
                        if (res.code === 0) {
                          this.getDutyData()
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
                    this.$confirm('此职务下存在人员不予停用!', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    })
                  }
                }
              }
            },
            {
              name: '配置权限',
              handleFunc: (obj) => {
                this.$router.push({
                  name: 'limits',
                  query: {
                    dutyId: obj.row.id,
                    dutyName: obj.row.name,
                    name:'duty',
                    resIds:obj.row.resIds
                  }
                });
              }
            },
            {
              name: '删除',
              handleFunc: (obj) => {
                if(obj.row.number != 0){
                  this.$alert('此职务下存在人员不予删除！', '提示', {
                    confirmButtonText: '确定',
                  });
                }else{
                  this.$confirm('此操作将删除该职务，是否继续?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.getData('/duty/type/delete', 'post', {id: obj.row.id}, true).then(res => {
                      if (res.code === 0) {
                        this.getDutyData()
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
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        }
      }
    },
    methods: {
      /**
       *  新增职务类型
       */
      addDuty() {
        this.dialogShowDuty = true
      },
      /**
       * 新增、编辑职务类型方法
       * @param form 表单数据
       */
      addDutyFuc(form) {
        if (this.update) {
          if (form.enable === '0'&&this.hasNumber) {
            /** 编辑接口 - 不能编辑状态为停用 **/
            this.$confirm('存在人员不允许编辑职务状态', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
          } else {
            if(form.enable==='启用'){
              form.enable='1'
            }else if(form.enable==='停用'){
              form.enable='0'
            }
            this.getData('/duty/type/update', 'post', {
              name: form.name,
              enable: form.enable,
              id: this.limitId
            }, true).then(res => {
              if (res.code === 0) {
                this.dialogShowDuty = false
                this.update = false
                this.getDutyData()
              }
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          this.getData('/duty/type/add', 'post', form, true).then(res => {
            if (res.code === 0) {
              this.dialogShowDuty = false
              this.addDutyForm = {
                name: '',
                enable: ''
              }
              this.getDutyData()
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
        this.getDutyData()
      },
      /**
       * 点击切换页码
       * @param val 当前页面
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getDutyData()
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
       * 获取职务类型table数据
       */
      getDutyData() {
        this.getData('/duty/type/page', 'post', {
          pageNum: this.pager.currentPage,
          pageSize: this.pager.pageSize
        }).then(res => {
          this.filterTime(res.data.list)
          this.carStatus(res.data.list)
          this.dutyTableData.list = res.data.list
          this.pager.total = res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      this.getDutyData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .pa-duty {
    background-color: white;
    .addDutyForm {
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

  .dutyTable {
    margin-top: 20px;
  }

</style>
