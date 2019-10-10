<template>
  <div class="select-dialog-wrapper">
    <el-button :type="type" :size="size" class="select-btn fn-out-select" @click="handleChooseShow">
      {{btnText}}
      <i :class="isChooseShow ? 'el-icon-caret-top':'el-icon-caret-bottom'" class="el-icon--right"></i>
    </el-button>
    <div class="choose-box a-fadein" v-show="isChooseShow">
      <div class="bg-top-icon"></div>
      <el-tree
        class="select-tree"
        :data="schoolListData"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        show-checkbox
        :expand-on-click-node="false"
        ref="tree">
      </el-tree>
      <el-button type="primary" size="small" class="choose-btn" @click="handleSure">确定</el-button>
    </div>
    <div class="select-mask" v-show="isChooseShow" @click="isChooseShow=false"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * 弹窗选择组件
   * @author jt-lixiaoying-2018/7/13
   */
  // import jt from '../utils/common'

  export default {
    props: {
      btnText: {
        type: String,
        default: '学校选择',
        required: false
      },
      type: {
        type: String,
        default: 'text',
        required: false
      },
      size: {
        type: String,
        default: 'large',
        required: false
      },
      // 支持直接传tree数据
      checkDataList: {
        type: Array,
        default: function() {
          return []
        },
        required: false
      },
      // 支持直接传tree数据的请求url
      treeDataUrl: {
        type: String,
        default: '',
        required: false
      }
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        schoolListData: [],
        dataList: [
          {
            id: 1,
            label: '幼儿园',
            children: [
              {
                id: 4,
                label: '渝北区第一小学',
                children: []
              }
            ]
          },
          {
            id: 2,
            label: '小学',
            children: [
              {
                id: 5,
                label: '巴南区第一小学'
              },
              {
                id: 6,
                label: '巴南区第二小学'
              },
              {
                id: 7,
                label: '巴南区第三小学'
              },
              {
                id: 8,
                label: '巴南区第四小学'
              }
            ]
          },
          {
            id: 3,
            label: '初中',
            children: [
              {
                id: 9,
                label: '巴南区第一中学'
              },
              {
                id: 10,
                label: '巴南区第二中学'
              },
              {
                id: 11,
                label: '巴南区第三中学'
              },
              {
                id: 12,
                label: '巴南区第四中学'
              }
            ]
          },
          {
            id: 4,
            label: '高中',
            children: [
              {
                id: 15,
                label: '沙坪坝区第一中学'
              },
              {
                id: 16,
                label: '沙坪坝区第二中学'
              },
              {
                id: 17,
                label: '沙坪坝区第三中学'
              },
              {
                id: 18,
                label: '沙坪坝区第四中学'
              }
            ]
          }
        ],
        checkedData: [],
        isChooseShow: false
      }
    },
    created() {
      // 请求tree数据
      // 初始化获取学校列表
      this.getSchoolList()
    },
    mounted() {
      if (this.checkDataList.length) {
        this.dataList = this.checkDataList
      }
    },
    methods: {
      /**
       * 请求学校数据接口数据
       *
       */
      getSchoolList() {
        this.schoolListData
      },
      handleChooseShow() {
        this.isChooseShow = !this.isChooseShow
      },
      // 点击确定 关闭弹窗 传值给父组件
      handleSure() {
        this.isChooseShow = false
        this.checkedData = this.$refs.tree.getCheckedKeys()
        this.$emit('clickSure', this.checkedData)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .select-dialog-wrapper {
    position: relative;
    margin-bottom: 10px;
    .select-btn {
      font-size: 14px;
    }
    .el-button--text {
      color: #212123;
    }
    .el-button:focus, .el-button:hover {
      color: #409EFF;
    }
    .choose-box {
      position: absolute;
      width: 748px;
      top: 54px;
      padding: 25px;
      box-sizing: border-box;
      background: #fff;
      z-index: 2000;
      box-shadow: 0 2px 8px rgba(64, 158, 255, .2);
      .bg-top-icon {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        top: -13px;
        left: 50px;
        margin-right: 3px;
        border: 13px solid transparent;
        border-top-width: 0;
        border-bottom-color: rgba(231, 241, 255, .2);
        &:after {
          content: " ";
          position: absolute;
          top: 2px;
          margin-left: -13px;
          border: 13px solid transparent;
          border-top-width: 0;
          border-bottom-color: #fff;
        }
      }
    }
    .select-tree {
      .el-icon-caret-right {
        display: none;
      }
      .el-icon-caret-right:before {
        content: '';
      }
      .el-tree-node {
        font-weight: bold;
      }
      .el-tree-node__content {
        float: left;
      }
      .el-tree-node__children > .el-tree-node {
        float: left;
        font-weight: normal;
      }
      & > .el-tree-node {
        // margin-top: 22px;
        margin-bottom: 22px;
      }
    }
    .select-checkbox {
      background: #fff;
    }
    button.choose-btn.el-button--primary.el-button--small {
      margin-top: 22px;
      color: #fff !important;
      margin-left: 36.5%;
      /*margin-left: 257px;*/
      font-size: 14px;
      background: #409EFF !important;
    }
    .select-mask {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      // background: rgba(0,0,0,.3);
      background: transparent;
      z-index: 31;
    }
  }
</style>
