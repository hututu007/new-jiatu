<template>
<div class="directionalDriving">
  <d-map></d-map>
  <div class="right-card">
    <div class="rc-top">
      <el-button type="primary" icon="el-icon-arrow-left" @click="cardShow=!cardShow" >展开列表</el-button>
      <el-button type="primary" icon="el-icon-plus"  v-if="cardShow" @click="addfence()" :class="{active:rcListShow===false}">新增规则</el-button>
    </div>
    <!-- 列表 -->
    <div id="card-container" class="fn-shadow" v-if="cardShow">
    <div class="rcList" v-show="rcListShow">
      <p>
        <el-input placeholder="规则名称查询" v-model="searchText" @keyup.enter.native="searchName">
          <i slot="suffix" class="el-input__icon el-icon-search"  @click="searchName"></i>
        </el-input>
      </p>
      <ul class="fence-list">
        <li >
        132
        </li>
      </ul>
    </div>
    <!-- 新增编辑表单 -->
    <div class="rcForm " v-show="!rcListShow">
      <el-form ref="Form" :model="Form" size="mini">
       
        <el-form-item label="规则名称" prop="enclosureName">
          <el-input v-model="Form.enclosureName" placeholder="请定义规则名称，不超过10个字符" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="绑定轨迹"  prop="enclosureType">
          <el-select v-model="Form.enclosureType" placeholder="请选择一段轨迹">
            <el-option label="轨迹1" :value="1"></el-option>
            <el-option label="轨迹2" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生效车辆" prop="enclosureName">
          <el-input v-model="Form.enclosureName" placeholder=""  ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="Form.enable">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
          <el-button size="mini" @click="cancel" >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    </div>
  </div>
</div>
</template>

<script>
import DMap from './map'

export default {
  name: 'directionalDriving',
  components: { DMap },
  data (){
      return {
        cardShow: true,
        rcListShow:true,
        searchText: '',
        Form:{}
      }
  },
  methods:{
    /**
     *  新增围栏
     */
    addfence(){
    this.rcListShow=false
    // this.emptyData() //清数据
    },
    /**
     * 搜索
     */
    searchName() {
      
    },
    /**
     * 提交
     */
    onSubmit() {

    },
    /**
     * 取消
     */
    cancel() {
      this.rcListShow=true;
    }
  }


}
</script>

<style rel="stylesheet/scss" lang="scss">
  $primary: #55a8fd;
  .right-card {
    position: absolute;
    right: 30px;
    top: 40px;
    width: 280px;
    z-index: 10;
    .useCars{
      .el-form-item{
        float: left;
        margin-right: 30px;
      }
      .el-form-item__content{
        float: left;
      }
      .el-tab-pane {
      padding: 0px;
    }
      .el-tabs__header {
        margin: 0px;
      }
      .el-tabs__nav {
        transform: translateX(32px) !important;
        .el-tabs__item {
          font-size: 12px;
        }

      }

      .useCars-table{
        .el-table_1_column_4{
          border-right: none;
        }
      }
      .dialog-footer{
        margin: 20px 0px;
        width: 100%;
        text-align: center;
      }
    }
    .rc-top{
      width: 100%;
      height:38px ;
      margin-bottom: 20px;
      .el-button{
        box-shadow: 0 0 10px 1px rgba(90, 90, 90, 0.1);
        border: none;
      }
      .el-button:nth-child(1){
       float: right;
       padding: 12px 16px;
      }
      .el-button:nth-child(2){
        float: left;
       padding: 12px 16px;

      }
    }
    .rcList{
      width: 100%;
      max-height: 700px;
      overflow: auto;
      border-radius: 4px;
      background-color: white;
      &>p{
        width: 240px;
        height: 28px;
        margin: 20px 20px 0 20px ;
        .el-input__inner{
          height: 28px;
          font-size: 12px;
        }
        .el-input__suffix{
          top:-5px;
        }
      }
      .el-icon-search{
        cursor: pointer;
      }
      .fence-tabs{
        .el-tabs__header{
          margin: 0px;
        }
        .el-tabs__item{
          width: 68px;
          font-size: 12px;
        }
        .el-tab-pane{
          padding: 0px;
        }
      }
      .fence-list{
        width: 100%;
        height: 310px;
        overflow-y: auto;
        /*滚动条样式*/
          &::-webkit-scrollbar {/*滚动条整体样式*/
            width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
          }
          &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
          }
          &::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(0,0,0,0.1);
          }
        .btn_tool {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          margin-right: 5px;
          background: #fff;
          border: 1px solid #c4d4dd;
          z-index: 55555;
        }
        .btn_tool:hover {
          background: $primary;
          color: #fff;
          border: 1px solid $primary;
        }
        li{
          width: 100%;
          height: 62px;
          cursor: pointer;
          border-bottom: 1px dashed #d5e2eb;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #666;
          p:first-child{
            float: left;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 12px;
            font-weight: bold;
            background-color: #f56767;
            color: white;
            display: block;
            text-align: center;
            line-height: 24px;
            margin:0 10px;
          }
          p:nth-child(2){
            width: 153px;
            height: 34px;
            float: left;
            span{
              display: block;
              width: 100%;
              line-height: 20px;
              color: #333;
            }
            span:nth-child(1){
              font-weight: 600;
            }
            span:nth-child(2){
              color: #999;
            }

          }
          p:last-child{
            height: 22px;
            line-height: 22px;
            float: right;
            margin-left: 20px;
            span:nth-child(1){
              width: 42px;
              height: 20px;
              border-radius: 10px;
              display: block;
              text-align: center;
              line-height: 20px;
              color: #71d189;
              border: 1px solid #71d189;
            }
          }

        }
      }
    }
    .rcForm{
      width: 100%;
      padding: 20px;
      overflow: hidden;
      background: white;
      .temps{
        .el-form-item__content{
          height: inherit;
        }

      }
      .el-form-item{
        margin-bottom: 8px;
        .el-input__icon{
          height: auto;
        }
        .el-range-separator{
          padding: 0px;
          line-height: 28px;
          width: 8%;
          font-size: 12px;
        }
        .el-form-item__label{
          width: 240px;
          text-align: left;
          line-height: 20px;
          font-size: 12px;
          font-weight: normal;
        }
        .el-range-separator{
          line-height: 24px;
        }
        .el-form-item__content{
          .el-input__inner{
            width: 240px;
            height: 28px;
          }
        }
      }

    }
    .active{
      background-color: #2ccbcc;
    }
    .listActive{
      background-color: #dfefff;
      p:first-child{
        background-color: #55a8fd!important;
      }
    }
    .listActive1{
      background-color: white;
      p:first-child{
        background-color: #f56767!important;
      }
    }
    .redSpan{
      color: #f56767!important;
      border: 1px solid #f56767!important;
    }
  }
</style>



