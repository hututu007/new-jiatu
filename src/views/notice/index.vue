<template>
  <div class="notice">
    <div class="notice-main">
      <el-tabs v-model="activeName1">
        <el-tab-pane label="官方公告" name="first">
          <one></one>
        </el-tab-pane>
        <el-tab-pane label="产品快报" name="second">
          <two></two>
        </el-tab-pane>
        <el-tab-pane label="内部公告" name="third">
          <three></three>
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

  export default {
    components: {JtTitle, one, two, three },
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
  .notice {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .notice-main{
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

