<template>
  <div class="addCarDialog">
    <el-form  status-icon  ref="ruleForm" label-width="30%" class="demo-ruleForm" :model="sizeForm" size="mini"  :rules="rules">
      
        <el-form-item label="选择类型"  prop="typeId" v-if="sizeForm.child">
            <el-radio v-model="sizeForm.typeId" :label="2">机构</el-radio>
            <el-radio v-model="sizeForm.typeId" :label="3">部门</el-radio>
        </el-form-item>
        <el-form-item label="机构/部门名称" prop="label">
            <el-input type="text"  style="width:193px" v-model="sizeForm.label"></el-input>
        </el-form-item>
        <el-form-item label="所属机构/部门" prop="parentId">
            <jt-org-select ref="upOrgName" :nodeId="sizeForm.editor?sizeForm.parentId:sizeForm.id"  @orgCurrent="orgCurrent2"></jt-org-select>
        </el-form-item>
        <el-form-item style="margin-top:50px">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  export default {
    components:{JtOrgSelect},
    props:['sizeForm'],
    data() {
      return {
        radio:'1',
        editor:"",
        rules: {
          typeId: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],
          label: [
            {required: true, message: '请填写机构/部门名称', trigger: 'blur'},
          ],
          parentId: [
            {required: true, message: '请选择所属机构/部门',trigger: 'change'},
          ],
        },
      }
    },
    methods: {
      /**
       * 组织机构数据
       * @param data 选择的组织机构数据
       */
      orgCurrent2(data){
        this.sizeForm.parentId=data.id
      },
      close(){
        this.$emit('closeDialog');
        this.$refs.ruleForm.resetFields(); //重置表单
      },
      submit(){
        this.$refs.ruleForm.validate((valid) => {
          if (this.sizeForm.editor) {
            if (valid) {
              this.getData('/org/update','post',{
                id:this.sizeForm.id,
                typeId:this.sizeForm.typeId,
                name:this.sizeForm.label,
                parentId:this.sizeForm.parentId,
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
              this.getData('/org/add','post',{
                typeId:this.sizeForm.typeId,
                name:this.sizeForm.label,
                parentId:this.sizeForm.id,
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
      }
    },


  }
</script>

<style scoped>

</style>
