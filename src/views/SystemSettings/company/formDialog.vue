<template>
  <div class="addCarDialog">
    <el-form class="dialogForm" ref="ruleForm" :model="sizeForm" :rules="rules" :inline="true" label-width="120px"
             size="mini">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="登录账号" prop="userName">
              <el-input v-model="sizeForm.userName" placeholder="请输入手机号" style="width: 193px;"  :disabled="editor"></el-input>
            </el-form-item>
            <el-form-item label="登录密码"  prop="userPwd" v-if="!editor">
              <el-input v-model="sizeForm.userPwd"  type="password" style="width: 193px;"  :disabled="editor"></el-input>
            </el-form-item>
            <el-form-item label="职务" prop="dutyId">
              <el-select style="width: 193px" v-model="sizeForm.dutyId"  placeholder="请选择"  @change="$set(sizeForm,sizeForm.dutyId,$event)">
                  <el-option  v-for="item in dutyList" :key="item.id" :label="item.name" :value="item.id"  ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="linkPhone" >
              <el-input  style="width: 193px;" v-model="sizeForm.linkPhone" ></el-input>
            </el-form-item>
            <el-form-item label="账号状态" prop="status" v-if="editor">
              <el-select style="width: 193px" v-model="sizeForm.status" @change="$set(sizeForm,sizeForm.statusId,$event)" placeholder="请选择">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="停用" :value="2"></el-option>
                <el-option label="冻结" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>

        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item class="orgTree" label="所属机构/部门" prop="orgId">
              <!-- <el-input v-model="sizeForm.orgId" style="display: none" ></el-input> -->
              <jt-org-select ref="upOrgName" :nodeId="sizeForm.orgId"  @orgCurrent="orgCurrent2" ></jt-org-select>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realName" >
              <el-input  style="width: 193px;" v-model="sizeForm.realName" ></el-input>
            </el-form-item>
             <el-form-item label="角色类别"  prop="roleId">
              <el-select style="width: 193px" v-model="sizeForm.roleId" placeholder="请选择" @change="$set(sizeForm,sizeForm.roleId,$event)">
                <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="账号状态" prop="status" v-if="!editor">
              <el-select style="width: 193px" v-model="sizeForm.status"  @change="$set(sizeForm,sizeForm.statusId,$event)" placeholder="请选择">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="停用" :value="2"></el-option>
                <el-option label="冻结" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
        <el-button  @click="close">取 消</el-button>
        <el-button type="primary" @click.native="submit">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  import { datetime } from '@/utils/filters'
  export default {
    components:{JtOrgSelect},
    props:['dutyList','editor','sizeForm'],
    data() {
      return {
        roleList:"",
        loading: '',
        // sizeForms:"",
        // sizeForm: {
        //   orgId: '',
        //   userName: '',
        //   userPwd:"",
        //   dutyId:"",
        //   linkPhone:"",
        //   realName:"",
        //   roleId:"",
        //   status:"",
        // },
        carModelList: [], // 车型车款
        region: [], // 机构部门
        rules: {
          orgId: [
            {required: true, message: '请选择所属机构/部门', trigger: 'change'}
          ],
          userName: [
            {required: true, message: '请输入账号', trigger: 'blur'},
          ],
          userPwd: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          dutyId: [
            { required: true, message: '请选择职务', trigger: 'change'}
          ],
          linkPhone: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          realName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '请选择角色类别', trigger: 'change'}
          ],
          status: [
            {required: true, message: '请选择账号状态', trigger: 'change'}
          ],
        },
        oilTypeList:[]
      }
    },
    methods: {
      /**
       * 组织机构数据
       * @param data 选择的组织机构数据
       */
      orgCurrent2(data){
        this.sizeForm.orgId=data.id
      },
      close(){
        this.$emit('closeDialog');
        this.$refs.ruleForm.resetFields(); //重置表单
      },
      submit(){
        this.$refs.ruleForm.validate((valid) => {
          console.log(this.sizeForm);
          
          if (this.editor) {
            if (valid) {
              this.getData('/user/update','post',{
              id:this.sizeForm.id,
              userName:this.sizeForm.userName,
              realName:this.sizeForm.realName,
              linkPhone:this.sizeForm.linkPhone,
              roleId:this.sizeForm.roleId,
              dutyId:this.sizeForm.dutyId,
              status:this.sizeForm.status,
              orgId:this.sizeForm.orgId,
              resIds: this.sizeForm.resIds.length===0?[]:this.sizeForm.resIds
              },true).then(res=>{
                if (res.code==0) {
                  this.close()
                  this.$emit('RefreshPage')
                }
              }).catch(error=>{
                console.log(error)
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          }else{
              if (valid) {
              this.getData('/user/add','post',{
                userName:this.sizeForm.userName,
                userPwd:this.sizeForm.userPwd,
                realName:this.sizeForm.realName,
                linkPhone:this.sizeForm.linkPhone,
                roleId:this.sizeForm.roleId,
                dutyId:this.sizeForm.dutyId,
                status:this.sizeForm.status,
                orgId:this.sizeForm.orgId,
              },true).then(res=>{
                if (res.code==0) {
                  this.close()
                  this.$emit('RefreshPage')
                }
              }).catch(error=>{
                console.log(error)
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          }
        });
      },
    },
    created(){
      this.getData('/role/list','post').then(res=>{
            this.roleList = res.data
        }).catch(error=>{
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
