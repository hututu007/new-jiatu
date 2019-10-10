<template>
  <div class="app-container customer">
    <el-tabs v-model="activeName">
      <el-tab-pane label="客户信息" name="first">
          <customer-info></customer-info>
      </el-tab-pane>
      <el-tab-pane label="客户列表" name="third" >
          <customer-list></customer-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import customerInfo from './info'
import customerList from './list'
export default {
  components: {
    customerInfo,
    customerList,
  },
  name:"company",
  data() {
    return {
      activeName: 'first'
    }
  },
  created(){
    this.$bus.$on('editCustomer', (data) => {
      this.activeName= 'first'
    })
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.customer {
  .el-tabs__nav-scroll {
      padding-left: 20px;
    }
  .el-tab-pane{
    padding: 10px 25px 25px;
  }
}

</style>

