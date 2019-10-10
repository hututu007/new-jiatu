<template>
  <div class="app-container company">
    <el-tabs v-model="activeName"> 
      <el-tab-pane label="企业信息" name="first">
          <company-updata></company-updata>
      </el-tab-pane>
      <el-tab-pane label="机构组织" name="second" >
        <institution></institution>
      </el-tab-pane>
      
      <!-- <el-tab-pane label="临时授权" name="third" >
          <authorization></authorization>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import CompanyUpdata from './companyUpdata'
import authorization from './authorization'
import institution from './institution'
export default {
  components: {
    CompanyUpdata,
    authorization,
    institution
  },
  name:"company",
  data() {
    return {
      activeName: 'first'
    }
  },
  created() {
    if (this.$route.query.type) {
      this.activeName = 'second'
    }
  },
  methods: {
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.company {
  .el-tabs__nav-scroll {
      padding-left: 20px;
  }
  .el-tab-pane{
    padding: 10px 25px 25px;
  }
}


</style>

