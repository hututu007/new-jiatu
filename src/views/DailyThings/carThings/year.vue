<template>
  <div class="year-thing">
    <div class="year-thing-form">
      <el-form :inline="true" :model="carYearForm" class="carYearForm-inline">
        <el-form-item label="车牌号">
          <el-input @keyup.native="inputChange(carYearForm)" v-model="carYearForm.license"
                    placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="所属机构/部门" class="orgBox">
          <jt-org-select ref="yearOrg" @orgCurrent="orgCurrent1"></jt-org-select>
        </el-form-item>
        <el-form-item label="年检日期">
          <el-date-picker
            class="range"
            style="width: 230px;margin-right: 30px"
            v-model="carYearForm.doDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="carYearSearch(carYearForm)">查询</el-button>
          <el-button class="fn-btn-reset" size="mini" @click="resetForm(carYearForm)">重置</el-button>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="addYearThingFuc">新增年检事物</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="carYearTable">
      <jt-table ref="carYearTable" @tableSelectionChange="tableSelectionChange" :tableData="carYearTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!-- 新增编辑弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <el-form label-position="right" ref="yearAddForm" :model="yearAddForm" id="yearAddForm">
          <!--:rules="rules"-->
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="车牌号" prop="license">
                  <el-select
                    style="width: 193px;"
                    v-model="yearAddForm.carId"
                    filterable
                    remote
                    @change="carChange"
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="carLoading">
                    <el-option
                      v-for="item in carOption"
                      :key="item.id"
                      :label="item.license"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="缴费日期" prop="buyDate">
                  <el-date-picker
                    v-model="yearAddForm.doDate"
                    type="date"
                    placeholder="缴费日期"
                    format="yyyy - MM - dd " style="width: 193px;">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="mark">
                  <el-input v-model="yearAddForm.remark" placeholder="请输入备注信息" style="width: 193px;"></el-input>
                </el-form-item>
                <el-row>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="所属机构/部门" prop="orgId">
                  <!--<el-input v-model="sizeForm.orgId" style="display: none"></el-input>-->
                  <jt-org-select ref="upOrgName" :nodeId="nodeId" @orgCurrent="orgCurrent2"></jt-org-select>
                </el-form-item>
                <el-form-item label="缴费金额" prop="price">
                  <el-input v-model="yearAddForm.doAmount" placeholder="请输入金额" style="width: 193px;"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShow=false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="yearAddFuc(yearAddForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'
  import {nullFuc} from '@/utils/index'

  export default {
    components: {JtOrgSelect, JtTable, JtPager, JtDialog},
    data() {
      return {
        carYearForm: {
          license: '',
          doDate: '',
          startTime:'',
          endTime:'',
          orgId: '',
          pageSize: 10,
          pageNum: 1
        },
        carYearTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号'},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'doAmount', title: '年检金额'},
            {name: 'doDate', title: '年检日期'},
            {name: 'operator', title: '经办人'},
            {name: 'remark', title: '备注'},
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                this.dialogShow = true
                this.update=true
                nullFuc(obj.row)
                this.yearAddForm={
                  remark: obj.row.remark,
                  carId: obj.row.carId,
                  doDate: obj.row.doDate,
                  doAmount: obj.row.doAmount,
                  orgId: obj.row.orgId,
                  doMileage:obj.row.doMileage,
                  id:obj.row.id
                }
                this.nodeId=obj.row.orgId
              }
            },
            {
              name: '删除',
              handleFunc: (obj) => {
                this.$confirm('此操作将删除该年检, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/survey/delete', 'post', {id:obj.row.id}, true).then(res => {
                    if (res.code === 0) {
                      this.getPageFuc()
                    }
                  })
                })
              }
            }
          ],
          upload: true,
          templateUrl: '/template/year_model.xlsx',
          // upUrl: "/fms-web/car/import",
          downList: [
            // {
            //   name: '批量删除',
            //   handleFunc: () => {
            //
            //   }
            // }
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
          title: '新增年检信息',
          width: '800px'
        },
        yearAddForm: {
          remark: '',
          carId: '',
          doAmount: '',
          doMileage: '',
          doDate: '',
          orgId: ''
        },
        nodeId: '',
        yearIds: '',
        update: false,
        carLoading: false,
        carOption: [],
        licenseList: []
      }
    },
    methods: {
      /**
       * 弹窗车牌号选择-车辆过滤
       * @param query 查询结果
       */
      remoteMethod(query) {
        if (query !== '') {
          this.carLoading = true;
          setTimeout(() => {
            this.carLoading = false;
            this.carOption = this.licenseList.filter(item => {
              return item.license.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.carOption = [];
        }
      },
      /**
       *  选择车牌号获取当前车所在的组织机构id
       */
      carChange(val){
        for(var i=0,len=this.carOption.length;i<len;i++){
          if(val===this.carOption[i].id){
            this.nodeId=this.carOption[i].orgId
            this.yearAddForm.orgId=this.carOption[i].orgId
          }
        }
      },
      /**
       *  车牌号模糊查询
       */
      inputChange() {
        this.getPageFuc()
      },
      /**
       *  根据条件查询
       */
      carYearSearch() {
        if(this.carYearForm.doDate){
          this.carYearForm.startTime=this.carYearForm.doDate[0]
          this.carYearForm.endTime=this.carYearForm.doDate[1]
        }

        this.getPageFuc()
      },
      /**
       * 重置查询表单
       */
      resetForm() {
        this.$refs.yearOrg.val.orgValue=''
        this.carYearForm = {
          license: '',
          doDate: '',
          startTime:'',
          endTime:'',
          orgId: '',
          pageSize: 10,
          pageNum: 1
        }
        this.getPageFuc()
      },
      /**
       * 查询-组织机构选择
       * @param val 组织机构id
       */
      orgCurrent1(val) {
        this.carYearForm.orgId = val.id
      },
      /**
       * 弹窗中的组织机构选择
       * @param val 组织机构id
       */
      orgCurrent2(val) {
        this.yearAddForm.orgId = val.id
      },
      /**
       * 打开新增弹窗-按钮
       */
      addYearThingFuc() {
        this.update=false
        this.nodeId = ''
        this.yearAddForm = {
          remark: '',
          carId: '',
          doAmount: '',
          doMileage: '',
          doDate: '',
          orgId: ''
        }
        this.dialogShow = true
      },
      /**
       * 分table表格多选
       */
      tableSelectionChange() {
        this.yearIds = ''
        if (val) {
          for (var i = 0; i < val.length; i++) {
            this.yearIds += val[i].id + ','
          }
        }
        this.yearIds = this.yearIds.substr(0, this.yearIds.length - 1)
      },
      /**
       * 分页-当前显示数量
       */
      handleSizeChange(val) {
        this.carYearForm.pageSize = val
        this.getPageFuc();
      },
      /**
       * 分页-当前页
       */
      changeCurrentPage(val) {
        this.carYearForm.pageNum = val
        this.getPageFuc();
      },
      /**
       * 新增，编辑确定方法
       */
      yearAddFuc() {
        this.yearAddForm.doDate=datetime(this.yearAddForm.doDate)
        if(this.update){
          this.getData('/survey/update', 'post', this.yearAddForm, true).then(res => {
            if (res.code === 0) {
              this.getPageFuc();
              this.dialogShow = false
            }
          }).catch(error => {
            console.log(error)
          });
        }else{
          this.getData('/survey/add', 'post', this.yearAddForm, true).then(res => {
            if (res.code === 0) {
              this.getPageFuc();
              this.dialogShow = false
            }
          }).catch(error => {
            console.log(error)
          });
        }

      },
      /**
       * 页面数据获取方法
       */
      getPageFuc() {
        this.getData('/survey/page', 'post', this.carYearForm).then(res => {
          if (res.code === 0) {
            this.pager.total=res.data.total
            res.data.list.forEach((ele) => {
              ele.doDate = datetime(ele.doDate)
            })
            this.carYearTableData.list = res.data.list
          }
        }).catch(error => {
          console.log(error)
        });
      }
    },
    mounted() {
      this.getData('/car/insureCarList', 'post').then(res => {
        if (res.code === 0) {
          this.licenseList = res.data
        }
      }).catch(error => {
        console.log(error)
      });
      this.getPageFuc()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .year-thing {
    .el-range-separator {
      color: #666;
      font-size: 12px;
    }
    .year-thing-form {
      .carYearForm-inline {
        .el-form-item__label {
          font-size: 12px;
          color: #666;
          font-weight: normal;
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
          color: #666;
          line-height: 28px;
        }
      }
      .orgBox > .el-form-item__content > .jt-org-select > .el-select > .el-input > .el-input__inner {
        width: 193px;
      }
    }
    #yearAddForm {
      .el-form-item__label {
        width: 110px;
        font-size: 12px;
      }
      .el-input__inner {
        height: 28px;
      }
    }
  }

</style>
