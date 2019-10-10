<template>
  <div class="travelOrder">
    <div class="travelOrder-main">
      <el-tabs v-model="activeName1">
        <el-tab-pane label="待派车单" name="first">
          <one></one>
        </el-tab-pane>
        <el-tab-pane label="已派车单" name="second">
          <two></two>
        </el-tab-pane>
        <el-tab-pane label="我拒绝的" name="third">
          <three></three>
        </el-tab-pane>
        <!--<el-tab-pane label="已补录的" name="four">-->
          <!--<four></four>-->
        <!--</el-tab-pane>-->
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
    components: {JtTitle, one, two, three},
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
  .travelOrder {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .travelOrder-main{
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

