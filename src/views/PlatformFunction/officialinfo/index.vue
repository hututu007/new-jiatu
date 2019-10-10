<template>
  <div class="officialinfo">
    <div class="officialinfo-main">
      <el-tabs v-model="activeName2">
        <el-tab-pane label="官方公告" name="first">
          <notice></notice>
        </el-tab-pane>
        <el-tab-pane label="产品快报" name="second">
          <news></news>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import news from './news'
  import notice from './notice'
  export default {
    components: {JtTitle, news, notice},
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
  .officialinfo {
    width: 100%;
    padding: 20px 20px 0px 20px;
    .el-tabs__nav-scroll {
      padding-left: 20px;
    }
    .officialinfo-main {
      background-color: white;
    }
  }
</style>

