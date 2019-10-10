<template>
  <div class="carThing">
    <div class="carThing-main">
      <el-tabs v-model="activeName2">
        <el-tab-pane label="交强险" name="first">
          <insurance></insurance>
        </el-tab-pane>
        <el-tab-pane label="车辆商业保险" name="second">
          <insurance1></insurance1>
        </el-tab-pane>
        <el-tab-pane label="车辆保养" name="third">
          <maintain></maintain>
        </el-tab-pane>
        <el-tab-pane label="车辆年检" name="four">
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
    components: {JtTitle, insurance, insurance1, maintain, year},
    data() {
      return {
        activeName2: 'first',
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
  .carThing {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .carThing-main {
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

