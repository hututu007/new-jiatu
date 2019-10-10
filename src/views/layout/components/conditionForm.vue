<template>
  <div>
    <el-form label-position="right" ref="cdtForm" :model="cdtForm"
             class="deal">

      <el-form-item label="所属机构/部门" class="orgBox">
        <jt-org-select ref="upOrgNameDevice"></jt-org-select>
      </el-form-item>
      <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button size="mini" type="primary" @click.native="cdtFuc(cdtForm)">统计</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect/index'

  export default {
    components:{JtOrgSelect},
    name: "conditionForm",
    data(){
      return{
        cdtForm:{}
      }
    },
    methods:{
      close(){
        this.$emit('closeDialog')
      },
      cdtFuc(form){
        this.$emit('opentDialog',form)
      }
    }
  }
</script>

<style scoped>

</style>
