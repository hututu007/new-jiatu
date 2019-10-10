<template>
    <el-form  status-icon  ref="ruleForm" label-width="30%" class="demo-ruleForm" :model="Form" size="mini">

    <el-form-item label="费用预期值"  prop="typeId" >
        <el-input type="text"  style="width:193px" v-model="Form.fyExpectedvalue"></el-input>
    </el-form-item>
   <el-form-item label="驾驶安全预期值"  prop="typeId" >
        <el-input type="text"  style="width:193px" v-model="Form.jsaqExpectedvalue"></el-input>
    </el-form-item>
    <el-form-item label="车辆使用率预期值"  prop="typeId" >
        <el-input type="text"  style="width:193px" v-model="Form.clsylExpectedvalue"></el-input>
    </el-form-item>
    <el-form-item style="margin-top:50px">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit(Form)">确定</el-button>
    </el-form-item>
    </el-form>
</template>

<script>
export default {
  props:['Form'],
  data() {
      return {

      }
  },
  methods: {
    close() {
      this.$emit('closeDialog')
    },
    submit(Form) {
      this.getData('targetExpected/submit', 'post', Form, true).then((res) => {
        console.log(res)
        if(res.code===0){
          this.$emit('closeDialog')
          this.$emit('submitForm')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

