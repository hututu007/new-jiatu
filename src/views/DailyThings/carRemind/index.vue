<template>
  <div class="carRemind">
    <div class="carRemind-main">
      <el-tabs v-model="activeName1">
        <el-tab-pane label="交强险到期提醒" name="first">
          <insurance></insurance>
        </el-tab-pane>
        <el-tab-pane label="商业险到期提醒" name="second">
          <insurance1></insurance1>
        </el-tab-pane>
        <el-tab-pane label="保养到期提醒" name="third">
          <maintain></maintain>
        </el-tab-pane>
        <el-tab-pane label="年检到期提醒" name="four">
          <year></year>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import insurance from './insurance'
  import insurance1 from './insurance1'
  import maintain from './maintain'
  import year from './year'

  export default {
    components: {JtTitle, insurance, insurance1, maintain, year },
    data() {
      return {
        activeName1: 'first',
      }
    },
    mounted() {

    },
    created() {

    },
    methods: {}
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .carRemind {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .carRemind-main{
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

