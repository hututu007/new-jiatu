<template>
  <div class="drag-form">
    <el-main class="main-bg">
      <div class="wf-header">
        <div class="head-title">
          <span class="head-title-span">审批表单管理</span>
          <div class="navbar-head">设计器</div>
        </div>
        <div class="head-actions">
          <el-button type="primary" size="mini">预览</el-button>
          <el-button type="primary" size="mini">保存并启用</el-button>
        </div>
      </div>
      <div class="wf-main">
        <el-row :gutter="40">
          <el-col :span="7" style="padding-top: 60px">
            <div class="grid-content forms">
              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <div class="wf-widgetsitem">
                      <label>单行输入框</label>
                      <i class="widgeticon iconfont textfield"></i>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                    <div class="wf-widgetsitem">
                      <label>多行输入框</label>
                      <i class="widgeticon iconfont textfield"></i>
                    </div>
                  </div>
                </el-col>
              </el-row>

            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content phone">
              <p>出行申请单</p>
              <div class="phoneBox">
                <p class="p-tit">
                  <span>部门</span>

                </p>
                <div class="p-form">

                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="7" style="padding-top: 60px">
            <div class="grid-content readyForm">
              <el-form>

              </el-form>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-main>
  </div>
</template>

<script>
  export default {
    name: "dragForm",
    data() {
      return {
        checked1: '',
        checked2: ''
      }
    },
    created() {
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .drag-form {
    min-width: 1200px;
    background-image: linear-gradient(245deg, #ae8b9c 0%, #8baaaa 100%);
    .main-bg {
      width: 1200px;
      margin: 0 auto;

      height: 100%;
      .wf-header {
        height: 80px;
        width: 100%;
        margin: 0 auto 20px auto;
        position: relative;
        z-index: 10;
        .head-title {
          width: 300px;
          color: #fff;
          font-size: 18px;
          line-height: 70px;
          display: flex;
          align-items: center;
          .head-title-span {
            font-size: 24px;
            float: left;
            color: #fff
          }
          .navbar-head {
            float: left;
            padding-left: 30px;
            margin-left: 30px;
            line-height: 26px;
            height: 26px;
            border-left: 1px solid #ccc;
            color: #fff;
          }
        }

        .head-actions {
          position: absolute;
          right: 56px;
          line-height: 45px;
          height: 45px;
          top: 15px;
          padding: 0 5px;
          text-align: center;
          z-index: 100
        }
      }
      /*background: url("//gw.alicdn.com/tps/TB17MD0LFXXXXXFXFXXXXXXXXXX-24-300.png") no-repeat;*/
      .wf-main {
        width: 100%;
        position: relative;
        height: 800px;
        .forms {
          .wf-widgetsitem {
            background: rgba(255, 255, 255, 0.0);
            height: 44px;
            border: 1px dashed white;
            cursor: move;
            padding: 0px 20px;
            label {
              font-size: 12px;
              color: white;
              float: left;
              line-height: 44px;
            }
            i {
              float: right;
              line-height: 44px;
              margin-top: 10px;
              height: 24px;
              width: 24px;
              background: url("//gw.alicdn.com/tps/TB17MD0LFXXXXXFXFXXXXXXXXXX-24-300.png") 0 -24px no-repeat;
            }
          }
          .wf-widgetsitem:hover {
            background: rgba(255, 255, 255, 0.2)
          }

        }
        .phone {
          & > p {
            width: 100%;
            height: 50px;
            font-size: 20px;
            color: #fff;
            text-align: center;
            margin-bottom: 0px;
          }
          .phoneBox {
            height: 766px;
            margin: 0 auto;
            width: 420px;
            padding-top: 50px;
            background: url(https://img.alicdn.com/tfs/TB1nlugQFXXXXbuXpXXXXXXXXXX-910-1642.png) no-repeat top;
            background-size: 100% 100%;
            .p-tit{
              width: 345px;
              height: 50px;
              margin: 0px auto;
              background-color: white;
              border-bottom: 1px solid #c8c8ca;
              border-top: 1px solid #c8c8ca;
            }
          }
        }
        .readyForm {
          border: 1px solid white;
        }
      }

    }
  }

</style>
