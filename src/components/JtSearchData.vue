<template>
  <div class="search-data fn-clear">
    <div class="search-list fn-left">
      <slot name="search"></slot>
    </div>
    <div class="search-button fn-right fn-clear">
      <el-button @click="searchReset" class="fn-right">重置</el-button>
      <el-button type="primary" @click="searchListData" class="fn-right">搜索</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * '搜索组件'组件.
   * @author jt-lixiaoying-2018/7/17
   */
  export default {
    data() {
      return {
        searchList: []
      }
    },
    methods: {
      // 传递给父组件标识点击了搜索
      searchListData() {
        this.$emit('clickSearch')
      },
      // 传递给父组件标识重置了搜索
      searchReset() {
        this.$emit('clickReset')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .search-data {
    .search-list {
      .el-input {
        width: 200px;
        margin-right: 45px;
      }
      .el-select {
        width: 200px;
        margin-right: 45px;
      }
      & > div > div:last-child {
        margin-right: 0;
      }
      @media screen and (min-width: 1300px) and (max-width: 1600px) {
        /* CSS 代码 */
        .el-input {
          width: 150px;
          margin-right: 25px;
        }

        .el-select {
          width: 150px;
          margin-right: 25px;
        }

        & > div > div:last-child {
          margin-right: 0;
        }
      }
    }
    .search-button {
      .el-button + .el-button {
        margin-right: 20px;
      }
    }
  }
</style>
