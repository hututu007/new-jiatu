<template>
  <div class="title">
    <div class="tit-left">
      <!--普通文字-标题名称-->
      <p class="tit-name" v-if="titData.typeName===0">
        {{titData.name}}
      </p>
      <!--tab切换-标题名称-->
      <slot name="tabsLeft" v-else>

      </slot>

      <p class="tit-img" v-show="titData.img">
        <img :src="titData.img">
      </p>
    </div>
    <div class="tit-right">
      <!--普通文字-->
      <p class="tit-text" v-if="titData.fuc===0" @click="doing"><router-link :to="titData.path?titData.path:''">{{titData.fucName}}</router-link></p>
      <!--tabs标签-->
      <slot name="tabsRight" v-else-if="titData.fuc===1">

      </slot>
      <!--点击按钮-->
      <p class="tit-btn" v-else>
        <span @click="add">添加</span><span>|</span><span @click="edit">编辑</span>
      </p>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'JtTitle',
    props: ['titData'],
    data() {
      return {}
    },
    created() {
    },
    methods: {
      doing() {
        this.$emit('doing')
      },
      add() {
        this.$emit('add')
      },
      edit() {
        this.$emit('edit')
      }
    }
  }
</script>

<style scoped>

  .title {
    width: 100%;
    height: 50px;
    background-color: white;
    border-bottom: 1px solid #e4edf3;
  }

  .title .tit-left {
    height: 100%;
    float: left;
    padding-left: 20px;
  }

  .title .tit-left .tit-name {
    line-height: 50px;
    font-size: 14px;
    float: left;
    color: #333;
  }

  .title .tit-left .tit-img {
    line-height: 56px;
    width: 20px;
    height: 20px;
    float: left;
    margin-left: 10px;
  }

  .title .tit-right {
    height: 100%;
    float: right;
    padding-right: 10px;
  }

  .title .tit-right .tit-text {
    color: #55a8fd;
    height: 100%;
    font-size: 12px;
    line-height: 50px;
    cursor: pointer;
  }

  .title .tit-right .tit-btn {
    height: 100%;
    color: #55a8fd;
  }

  .title .tit-right .tit-btn span {
    line-height: 50px;
    color: #55a8fd;
    font-size: 12px;
    cursor: pointer;
  }

  .title .tit-right .tit-btn span:nth-child(2) {
    height: 12px;
    color: #e4edf3;
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
