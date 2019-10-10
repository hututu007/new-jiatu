<template>
  <div class="travelApplication">
    <div class="travelApplication-main">
      <el-tabs v-model="activeName1">
        <el-tab-pane label="我发起的" name="first">
          <one></one>
        </el-tab-pane>
        <el-tab-pane label="代人发起的" name="second">
          <two></two>
        </el-tab-pane>
        <!--<el-tab-pane label="已补录的" name="third">-->
          <!--<three></three>-->
        <!--</el-tab-pane>-->
        <el-tab-pane label="已完成的" name="third">
          <four></four>
        </el-tab-pane>
        <!--<el-tab-pane label="已取消的" name="five">-->
          <!--<five></five>-->
        <!--</el-tab-pane>-->
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import one from './one'
  import two from './two'
  import four from './four'
  export default {
    components: {JtTitle, one, two, four,},
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
  .travelApplication {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .travelApplication-main{
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

