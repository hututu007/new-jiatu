<template>
  <div class="addCarDialog">
    <el-form class="dialogForm" ref="ruleForm" :model="sizeForm" :rules="rules" :inline="true" label-width="120px"
             size="mini">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="车牌号" prop="license">
              <el-input v-model="sizeForm.license" placeholder="请输入车牌号" style="width: 193px;"></el-input>
              <img style="margin-left:5px" src="../../../assets/images/icons-info-01.png"/>
            </el-form-item>
            <el-form-item label="购车日期" prop="buyDate">
              <el-date-picker
                v-model="sizeForm.buyDate"
                type="date"
                placeholder="缴费日期"
                format="yyyy - MM - dd " style="width: 193px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="保险到期日期" prop="insureExpireDate">
              <el-date-picker
                v-model="sizeForm.insureExpireDate"
                type="date"
                placeholder="保险日期"
                format="yyyy - MM - dd " style="width: 193px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="年检到期日期" prop="surveyExpireDate">
              <el-date-picker
                v-model="sizeForm.surveyExpireDate"
                type="date"
                placeholder="保险日期"
                format="yyyy - MM - dd " style="width: 193px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="初始里程(km)">
              <el-input v-model="sizeForm.initMileage" placeholder="请输入里程" style="width: 193px;"></el-input>
            </el-form-item>
            <el-form-item label="油卡号">
              <el-input v-model="sizeForm.oilCardNo" placeholder="请输入油卡信息" style="width: 193px;"></el-input>
            </el-form-item>
            <el-row>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item class="orgTree" label="所属机构/部门" prop="orgId">
              <el-input v-model="sizeForm.orgId" style="display: none"></el-input>
              <jt-org-select ref="upOrgName" :nodeId="nodeId" @orgCurrent="orgCurrent2"></jt-org-select>
            </el-form-item>
            <el-form-item label="车型车款" prop="carModelId">
              <el-input v-model="sizeForm.carModelId" style="display: none"></el-input>
              <!--v-model="sizeForm.modelId1"-->
              <!-- <el-cascader v-model="modelIds" @change="carModelChange" style="width: 193px;" placeholder="请选择车型车款" :options="carModelList"
                           filterable
                           :change-on-select="false"></el-cascader> -->

              <!-- <img style="margin-left: 5px" src="../../../assets/images/icons-info-01.png"/> -->
              <vehicle @modeChangeode="modeChangeode"></vehicle>
              <!--:modelIds="carModelId"-->
            </el-form-item>
            <el-form-item label="保养到期日期" prop="upkeepExpireDate">
              <el-date-picker
                v-model="sizeForm.upkeepExpireDate"
                type="date"
                placeholder="保养日期"
                format="yyyy - MM - dd " style="width: 193px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="车辆标签" prop="carLabel">
              <el-select style="width: 193px" v-model="sizeForm.carLabel" placeholder="请选择标签">
                <el-option  v-for="item in carLabelData" v-if="item.enable" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="油品型号">
              <el-select style="width: 193px" v-model="sizeForm.oilType" placeholder="请选择油品型号">
                <el-option v-for="item in oilTypeList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-input :lable="update" style="display: none">1</el-input>
      <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
        <el-button @click="deleteFuc(sizeForm)">取 消</el-button>
        <el-button type="primary" @click.native="addCarFuc(sizeForm)">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  import {datetime} from '@/utils/filters'
  import vehicle from '@/components/vehicle'

  export default {
    components: {JtOrgSelect, vehicle},
    name: "addcardialog",
    props:['sizeForm', 'nodeId', 'update'],
    data() {
      return {
        loading: '',
        region: [], // 机构部门
        // carModelId:[],
        LicenseData: '', //车辆牌号
        rules: {
          license: [
            {required: true, message: '请输入车牌号', trigger: 'blur'},
          ],
          buyDate: [
            {type: 'date', required: true, message: '请购车日期', trigger: 'change'}
          ],
          insureExpireDate: [
            {type: 'date', required: true, message: '请选择保险到期日期', trigger: 'change'}
          ],
          surveyExpireDate: [
            {type: 'date', required: true, message: '请选择年检到期日期', trigger: 'change'}
          ],
          orgId: [
            {required: true, message: '请选择所属机构/部门', trigger: 'blur'}
          ],
          upkeepExpireDate: [
            {required: true, message: '请选择保养到期日期', trigger: 'change'}
          ],
          carLabel: [
            {required: true, message: '请选择车辆标签', trigger: 'change'}
          ],
          carModelId: [
            {required: true, message: '请选择车型车款', trigger: 'blur'}
          ]
        },
        carLabelData:[],
        oilTypeList: []
      }
    },
    methods: {
      /**
       * 组织机构数据
       * @param data 选择的组织机构数据
       */
      orgCurrent2(data) {
        this.sizeForm.orgId = data.id
      },
      /**
       * 车辆模型级联选择
       * @param val 选择的级联车模id数组
       */
      modeChangeode(val) {
        this.sizeForm.carModelId= val.join(',')
      },
      /**
       *  新增车辆方法
       * @param form 整个表单数据
       */
      addCarFuc(form) {
        if(this.update){
          /* 编辑 */
          if(form.buyDate&&form.license&&form.carLabel&&form.carModelId&&form.insureExpireDate&&form.orgId&&form.surveyExpireDate&&form.upkeepExpireDate){
            form.buyDate = datetime(form.buyDate)
            form.insureExpireDate = datetime(form.insureExpireDate)
            form.surveyExpireDate = datetime(form.surveyExpireDate)
            form.upkeepExpireDate = datetime(form.upkeepExpireDate)
            this.getData('/car/update', 'post', form, true).then(res => {
              if(res.code===0){
                this.$refs.ruleForm.resetFields();
                this.$emit('addSuccess')
              }
            }).catch(error => {
              console.log(error)
            })
          }else{
            this.$message.error('请先完善必填项！')
          }
        }else{
          /* 新增 */
          // if(form.buyDate&&form.license&&form.carLabel&&form.carModelId&&form.insureExpireDate&&form.orgId&&form.surveyExpireDate&&form.upkeepExpireDate){
            form.buyDate = datetime(form.buyDate)
            form.insureExpireDate = datetime(form.insureExpireDate)
            form.surveyExpireDate = datetime(form.surveyExpireDate)
            form.upkeepExpireDate = datetime(form.upkeepExpireDate)

            this.getData('/car/add', 'post', form, true).then(res => {
              if(res.code===0){
                this.$refs.ruleForm.resetFields();
                this.$emit('addSuccess')
              }
            }).catch(error => {
              console.log(error)
            })
          // }else{
          //   this.$message.error('请先完善必填项！')
          // }
        }
      },
      getCarLabel() {
        this.getData('/carLabel/page', 'post').then(res => {
          this.carLabelData = res.data.list
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 关闭弹窗清空数据
       * @param form 整个表单数据
       */
      deleteFuc(form) {
        this.$refs.ruleForm.resetFields();
       this.$emit('deleteFuc',form)
      }
    },
    mounted() {
      this.getCarLabel();
      this.nodeID=this.sizeForm.orgId
      /** 获取油品型号 **/
      this.getData('/car/page', 'post', {pageNum: 1, pageSize: 10}).then(res => {
        if(res.data.oilType.length){
          for (var n = 0; n < res.data.oilType.length; n++) {
            this.oilTypeList.push({
              value: res.data.oilType[n].id,
              label: res.data.oilType[n].name
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
  .addCarDialog{
    .orgTree{
      .el-form-item__content{
        .el-input__inner{
          width: 193px;
        }
      }
    }
  }
</style>
