<template>
  <div class="app-container addServe">
      <div class="tit">
      <img @click="$router.go(-1)" style="cursor: pointer"
           src="../../../assets/images/return.png"/>
      <span style="font-size: 14px;color:#666;margin-left: 10px">新增平台微服务方案</span>
    </div>
    <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" class="ruleForm">
        <h4 style="margin:20px 0 40px 50px">填写微服务信息</h4>
        <el-form-item label="微服务名称：" >
            <el-input v-model="ruleForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="微服务图标：" >
            <cropper></cropper> 
        </el-form-item>
        <el-form-item label="微服务简介：" >
            <el-input type="textarea" v-model="ruleForm.synopsis"></el-input>
            <p class="tip">请确认介绍内容不含国家相关法律法规禁止内容,介绍字数为4~120个字</p>
        </el-form-item>
         <el-form-item label="微服务详情：">
            <el-input type="textarea" v-model="ruleForm.detail"></el-input>
        </el-form-item>
        <el-form-item label="类目：">
            <el-select v-model="value" placeholder="请选择" size="small">
                <el-option
                label="出行与交通"
                :value="1">
                </el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="标签：">
            <el-select v-model="value" placeholder="请选择" size="small">
                <el-option
                label="标签1"
                :value="1">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="更新记录：">
            <el-input type="textarea" v-model="ruleForm.record"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import cropper from "@/components/cropper";
export default {
    components: {
      cropper
    },
    name: "addServe",
    data() {
    return {
        ruleForm:{
        name:"",
        },
    }
    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.addServe {
    padding-bottom: 30px;
    .tit{
      width: 100%;
      height: 50px;
      padding-left: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
    }
    .ruleForm {
        width: 760px;
        padding: 30px 0;
    }
    .tip {
        font-size: 12px;
        color: #606266;
    }
}

</style>
