<template>
  <div class="parameter">
    <div class="parameter-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="职务类型" name="first">
          <duty></duty>
        </el-tab-pane>
        <el-tab-pane label="规费类型" name="second">
          <fees></fees>
        </el-tab-pane>
        <el-tab-pane label="用车类型" name="third">
          <usecar></usecar>
        </el-tab-pane>
        <el-tab-pane label="油品型号" name="four">
          <oil></oil>
        </el-tab-pane>
        <el-tab-pane label="车辆标签" name="fifth">
          <car-label></car-label>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import duty from './duty'
  import fees from './fees'
  import usecar from './usecar'
  import CarLabel from './carLabel'
  import oil from './oil'

  export default {
    components: {JtTitle, duty, fees, usecar, oil, CarLabel},
    data() {
      return {
        activeName: 'first',
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
  .parameter {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .parameter-main{
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
