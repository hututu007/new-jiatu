<template>
  <div class="jt-dialog-wrapper">
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :before-close="handleClose" :visible.sync="dialogShow" :title="title"
               style="margin-top: 5vh;"
               :width="width"
               :modal="modal"
               :fullscreen ="fullscreen">

        <slot name="dialog">

        </slot>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  /**
   * '弹框'组件.
   * @author jt-lixiaoying-2018/7/18
   */
  export default {
    data() {
      return {
        propShow: false
      }
    },
    props: {
      // 弹框的显示
      dialogShow: {
        type: Boolean,
        required: true,
        default: false
      },
      title: {
        type: String
      },
      width: {
        type: String
      },

      // 是否需要遮罩层
      modal: {
        type: Boolean,
        default: true
      },
      // 是否使用 footer
      useFooter: {
        ype: Boolean,
        default: false
      },
      // 是否需要全屏显示
      fullscreen: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleClose() {
        this.propShow = !this.dialogShow
        this.$emit('update:dialogShow', this.propShow)
        this.$emit('closeDialog')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .jt-dialog-wrapper {
    border-radius: 5px;
    .el-dialog {
      border-radius: 5px;
      /*box-shadow: 0 0 30px rgb(203, 216, 250);*/
    }
    .el-dialog__headerbtn .el-dialog__close {
      font-size: 30px;
      color: #4595ff;
    }
    .el-dialog__header {
      border-radius: 5px;
      padding: 16px 20px 10px;
      background-color: #eef7ff;
      .el-dialog__title {
        font-size: 14px;
        color: #333;
      }
      .el-dialog__close {
        font-size: 20px;
      }
    }
    .el-dialog__body {
      padding: 30px 48px;
      .el-form-item__label{
        font-size: 12px;
        font-weight: normal;
        color: #666;
      }
      .el-input__inner,.el-range-input,.el-radio__label{
        font-size: 12px!important;
      }
      .jt-dialog-line {
        border-bottom: 1px solid #f6f7f9;
        height: 42px;
        p {
          width: 50%;
          box-sizing: border-box;
          line-height: 1;
          text-align: center;
          padding-top: 20px;
          padding-bottom: 8px;
        }
        .jt-dialog-key {
          border-right: 1px solid #f6f7f9;
        }
      }
      .jt-dialog-btn {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
</style>
