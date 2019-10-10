<template>
  <div class="travelApproval">
    <div class="travelApproval-main">
      <el-tabs v-model="activeName1">
        <el-tab-pane label="待我审批的" name="first">
          <one></one>
        </el-tab-pane>
        <el-tab-pane label="我流转的" name="second">
          <two></two>
        </el-tab-pane>
        <el-tab-pane label="我拒绝的" name="third">
          <three></three>
        </el-tab-pane>
        <el-tab-pane label="已同意的" name="four">
          <four></four>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import one from './one'
  import two from './two'
  import three from './three'
  import four from './four'

  export default {
    components: {JtTitle, one, two, three, four},
    data() {
      return {
        activeName1: 'first',
      }
    },
    mounted() {
      if(this.$route.query.name){
        this.activeName1=this.$route.query.name
      }
    },
    created() {

    },
    methods: {}
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .travelApproval {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .travelApproval-main{
      background-color: white;
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }
    .el-tabs__nav-scroll {
      padding-left: 20px;
    }
    .el-tab-pane {
      padding: 10px 25px 25px;
    }
  }
</style>

