<template>
  <div class="warning">
    <div class="top">
      <div class="topDown">
        <span>更多内容</span>
        <span @click="closeSecLevelMenu" style="cursor: pointer;margin-left: 10px"><img :src=goTopUrl></span>
      </div>
      <el-tabs v-model="activeName" class="warmTabs" @tab-click="handleClick">
        <el-tab-pane label="任务车辆(12)" name="0"></el-tab-pane>
        <el-tab-pane label="告警消息(5)" name="1"></el-tab-pane>
      </el-tabs>
    </div>
    <transition name="el-zoom-in-top">
      <!--table数据-->
      <div class="wtbale" v-show="secLevelNavVisable">
        <jt-table  ref="carTableEq" :tableData="wtbaleData">
          <div slot="tablePage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange" @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </transition>
  </div>
</template>

<script>
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  export default {
    components: {JtTable, JtPager},
    name: "WarnTable",
    // props: ['wtbaleData'],
    data() {
      return {
        secLevelNavVisable:false,
        wtbaleData:{
          checkStyle: true,
          list: [],
          headList: [
            {name: 'din', title: '设备号'},
            {name: 'orgName', title: '所属机构/部门'},
            {name: 'isExpire', title: '是否到期'},
            {name: 'version', title: '设备版本号'},
            {name: 'model', title: '设备型号'},
          ],
          handleList: [
            {
              name: '绑定',
              handleFunc: (obj)=> {
                this.$emit('deviceBind',obj)
              }
            }
          ],
          downList: []
        },
        pager:{
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        activeName: '0',
        goTopUrl:'/static/mark/icon-map_13.png',
      }
    },
    mounted() {

    },
    methods: {
      handleSizeChange(){},
      changeCurrentPage(){},
      handleClick(){},
      closeSecLevelMenu(){
        this.secLevelNavVisable = !this.secLevelNavVisable
        if (this.secLevelNavVisable === true) {
          this.goTopUrl = '/static/mark/icon-map_12.png'
        } else {
          this.goTopUrl ='/static/mark/icon-map_13.png'
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .warning {
    width: 100%;
    background-color: white;
    .top{
      width: 100%;
      .el-tabs__item{
        height: 40px;
        font-size: 14px;
        width: 116px;
      }
    }
    .topDown {
      position: absolute;
      width: 85px;
      height: 15px;
      right: 20px;
      top: 12px;
      z-index: 998;
      span {
        font-size: 14px;
        color: #72b7fd;
      }
    }
    .warmTabs {
      height: 40px;
    }
    .wtbale {
      padding:20px;
      position: relative;
      .jt-table{
        padding: 0px 0px 30px 0;
        .el-table td, .el-table th{
          padding: 8px 0;
          font-size: 12px;
          color: #7595c5;
        }
      }
      .pagination {
        position: absolute;
        right: 40px;
        bottom: 20px;
      }
    }
  }

</style>
