<template>
  <div class="oilMng">
    <div class="oilMng-main">
      <jt-title :titData="TitData"></jt-title>
      <div class="oilMng-form">
        <el-form :inline="true" :model="queryForm" class="oilMngForm-inline">
          <el-form-item label="车牌号">
            <el-input  v-model="queryForm.license"
                      placeholder="请输入车牌号"></el-input>
          </el-form-item>
          <el-form-item label="所属机构/部门" class="orgBox">
            <jt-org-select ref="upOrgName"  :nodeId="queryForm.orgId" @orgCurrent="orgCurrent1"></jt-org-select>
          </el-form-item>
          <el-form-item label="油品类型">
            <el-select v-model="queryForm.typeId" placeholder="请选择">
              <el-option v-for="item in oilTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="加油日期">
            <el-date-picker
              class="range"
              style="width: 230px;margin-right: 30px"
              v-model="pickerDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
             >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="Search">查询</el-button>
            <el-button class="fn-btn-reset" size="mini" @click="resetForm">重置</el-button>
          </el-form-item>
          <div>
            <el-form-item>
              <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFrom">新增油费</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="oilMngTable">
        <jt-table ref="carTable" @tableSelectionChange="tableSelectionChange" :tableData="TableData">
          <div slot="tablePage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </div>
    <!-- 新增编辑弹窗 -->
    <jt-dialog :dialog-show.sync="dialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <el-form label-position="right" :inline="true" ref="addForm" :model="addForm" :rules="rules" id="addForm">
          <!--:rules="rules"-->
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="车牌号" prop="carId">
                  <el-select
                   style="width: 193px;"
                    v-model="addForm.carId"
                    filterable
                    remote
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
                <el-form-item label="加油卡号" prop="cardNo">
                  <el-input v-model="addForm.cardNo" placeholder="请输入加油卡号" style="width: 193px;"></el-input>
                </el-form-item>
                <el-form-item label="加油金额" prop="doAmount">
                  <el-input v-model="addForm.doAmount" placeholder="请输入金额" style="width: 193px;"></el-input>
                </el-form-item>
                <el-form-item label="缴费日期" prop="doDate">
                  <el-date-picker
                    v-model="addForm.doDate"
                    type="date"
                    placeholder="缴费日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: 193px;">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="所属机构/部门" prop="orgId">
                  <jt-org-select ref="upOrgName" :nodeId="addForm.orgId" @orgCurrent="orgCurrent2" width="193px"></jt-org-select>
                </el-form-item>
                <el-form-item label="加油总量" prop="doGas">
                  <el-input v-model="addForm.doGas" placeholder="请输入加油量" style="width: 193px;"></el-input>
                </el-form-item>
                <el-form-item label="油品类型" prop="typeId">
                  <el-select style="width: 193px" v-model="addForm.typeId" placeholder="请选择类型">
                    <el-option v-for="item in oilTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" >
                  <el-input v-model="addForm.remark" placeholder="请输入备注" style="width: 193px;"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dialogShow=false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="oilMngAddFuc">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtOrgSelect from '@/components/Jtorgselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import { datetime } from '@/utils/filters'

  export default {
    components: {JtTitle, JtOrgSelect, JtTable, JtPager, JtDialog},
    data() {
      return {
        oilTypeList:[],
        licenseList:[],
        carOption:[],
        carLoading:false, // 加载状态
        edit:false, //编辑状态
        TitData: {
          typeName: 0,
          name: '油费支出管理',
          img: '',
          fucName: '',
          fuc: 0
        },
        pickerDate:"",// 时间date
        TableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号'},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'cardNo', title: '加油卡号'},
            {name: 'doGas', title: '加油量'},
            {name: 'doAmount', title: '缴费金额（￥）'},
            {name: 'typeName', title: '费用类型'},
            {name: 'doDate', title: '缴费日期'},
            {name: 'remark', title: '备注'}
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                console.log(obj)
                this.dialogShow = true;
                //载入表单数据
                this.addForm={
                   carId: obj.row.carId,
                    doDate:obj.row.doDate,
                    doAmount: obj.row.doAmount,
                    cardNo:obj.row.cardNo,
                    orgId:obj.row.orgId,
                    doGas:obj.row.doGas,
                    id:obj.row.id,
                    typeId:obj.row.typeId,
                    remark:obj.row.remark,
                }
                this.edit = true;
              }
            },
            {
              name: '删除',
              handleFunc: (obj) => {
              this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                this.getData('/oil/delete','post',{id:obj.row.id},true).then(res=>{
                    if (res.code === 0) {
                      //重载表格
                      this.getTableData();
                    }
                  })
              })
              }
            }
          ],
          upload: true,
          upUrl:"/oil/import", //导入接口
          templateUrl:"/template/oil_template.xlsx", //下载模板接口
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
          title: '新增油费',
          width: '800px'
        },
        // 查询传入字段
        queryForm: {
          pageNum: 1, //当前页码
          pageSize: 10,//每页条数
          license:"",//车牌号
          orgId:"",
          typeId:"",
          startDate:null, //起止时间
          endDate:null
        },
        // dialog弹窗
        addForm:{
          carId: "",
          doDate:"",
          doAmount: "",
          cardNo:"",
          orgId:"",
          doGas:"",
          typeId:"",
          remark:"",
        },
        // 正则表达式
        rules: {
          license: [
            {  required: true, message: '请填写正确的信息', trigger: 'change' }
          ],
          doDate: [
            {  required: true, message: '请填写正确的信息', trigger: 'change' }
          ],
          doAmount: [
            {  required: true, message: '请填写正确的信息', trigger: 'blur' }
          ],
          cardNo: [
            {  required: true, message: '请填写正确的信息', trigger: 'blur' }
          ],
          orgId: [
            {  required: true, message: '请填写正确的信息', trigger: 'change' }
          ],
          doGas: [
            {  required: true, message: '请填写正确的信息', trigger: 'blur' }
          ],
          typeId: [
            {  required: true, message: '请填写正确的信息', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      getTableData(){
        this.getData('/oil/page', 'post', this.queryForm).then(res => {
          if (res.code === 0) {
            for (let i = 0; i < res.data.list.length; i++) {
              res.data.list[i].doDate = datetime(res.data.list[i].doDate);
            }
            //绑定table
            this.TableData.list=res.data.list;
            //绑定总数据
            this.pager.total = res.data.total;
          }
          }).catch(error => {
            console.log(error)
        })
      },
      //当前页码
      changeCurrentPage(page){
         this.queryForm.pageNum = page
         this.getTableData();
      },
      //每页数量
      handleSizeChange(pageSize){
        this.queryForm.pageSize = pageSize
        this.getTableData();
      },
      //搜索
      Search(){
        this.getTableData();
      },
      // 重置查询
      resetForm(){
        this.queryForm={
          pageNum: 1, //当前页码
          pageSize: 10,//每页条数
          license:"",//车牌号
          orgId:"",
          typeId:"",
        },
        this.pickerDate=""//时间date

        this.getTableData();
      },

      // 车牌号查询
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
      // 新增button
      addFrom(){
        this.edit = false;
        this.dialogShow=true;

        //重置dialog
        // setTimeout(()=>{
        //   this.$refs['addForm'].resetFields();
        // },200)
        this.addForm={
          carId: '',
          doDate:'',
          doAmount: '',
          cardNo:'',
          orgId:'',
          doGas:'',
          typeId:'',
          remark:'',
        }
      },
      orgCurrent1(val){
        this.queryForm.orgId = val.id;
      },
      orgCurrent2(val){
        this.addForm.orgId = val.id;
      },
      // 提交方法
      oilMngAddFuc(){
        // 判断 新增&编辑状态
        let url = "";
        if (this.edit) {
          url = '/oil/update';
        }else {
          url = '/oil/add';
        }
        if (!url) {
          return;
        }
         this.$refs['addForm'].validate((valid) => {
           if (valid) {
            this.getData(url, 'post', this.addForm,true).then(res => {
              if (res.code === 0) {
                this.dialogShow = false;
                //重载表格
                this.getTableData();
                //重置dialog
                 this.$refs['addForm'].resetFields();
              }
              }).catch(error => {
                console.log(error)
            });
           }
         })

      },
      tableSelectionChange(){},
    },

    created() {
      this.getTableData();
      this.getData('/car/page', 'post').then(res => {
        if (res.code === 0) {
          this.oilTypeList = res.data.oilType;
          this.licenseList = res.data.pv.list
        }
        }).catch(error => {
          console.log(error)
      });
    },
    watch:{
      pickerDate(val){
        if (val) {
            this.queryForm.startDate = val[0];
            this.queryForm.endDate = val[1];
        }else{
            this.queryForm.startDate = null;
            this.queryForm.endDate = null;
        }
        this.getPage();
        }
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .oilMng {
    width: 100%;
    padding: 20px;
    .oilMng-main {
      background-color: white;
      .oilMng-form {
        padding: 20px;
        width: 100%;
        height: 118px;
        .oilMngForm-inline {
          .el-form-item__label {
            font-size: 12px;
            color: #666;
            font-weight: normal;
          }
          .el-input__inner {
            width: 180px;
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
      .oilMngTable {
        padding: 30px 20px 20px 20px;
      }
    }
    #addForm{
      .el-form-item__label{
        width: 110px;
        font-size: 12px;
      }
      .el-input__inner{
        height: 28px;
      }
    }
  }
</style>
