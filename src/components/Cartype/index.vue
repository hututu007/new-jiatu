<template>
  <div class="carType">
    <p style="color: #999">用车类型</p>
    <p>
      <el-checkbox-group v-model="checkboxGroup1" ref="carTypeBox" @change="handleCheckedChange">
        <el-checkbox-button v-for="item in types" :label="item.id" :key="item.id">{{item.name}}</el-checkbox-button>
      </el-checkbox-group>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        checkboxGroup1: [],
        types: [{ name: '全部', id: 888 }],
        useTypeIds:''
      }
    },
    methods: {
      handleCheckedChange(val) {
        this.useTypeIds = val.join(',')
        this.$emit('checkedChange', this.useTypeIds)
      }
    },
    mounted() {
      this.getData('/apply/usetype/getAll', 'post').then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.types.push({
            name: res.data[i].name,
            id: res.data[i].id
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .carType {
    width: 100%;
    float: left;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    & > p {
      float: left;
      font-size: 12px;
      margin-right: 20px;
      .el-checkbox-button {
        border: none;
        .el-checkbox-button__inner {
          padding: 0px 10px;
          height: 24px;
          border-radius: 2px;
          font-size: 12px;
          color: #666666;
          border: none;
          line-height: 24px;
          margin-right: 20px;
        }
      }
      .el-checkbox-button.is-checked .el-checkbox-button__inner {
        border: 1px solid #409EFF;
        background-color: #ddeeff;
        color: #409EFF;
        box-shadow: initial;
      }
    }
  }
</style>
