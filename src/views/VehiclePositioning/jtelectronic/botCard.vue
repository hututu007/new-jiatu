<template>
  <div class="bot-card">
    <div class="top">
      <div class="topDown">
        <span>更多内容</span>
        <span @click="closeSecLevelMenu" style="cursor: pointer;margin-left: 10px"><img :src=goTopUrl></span>
      </div>
      <el-tabs v-model="activeName" class="warmTabs" >
        <el-tab-pane :label="'告警消息('+total+')'" name="1"></el-tab-pane>
      </el-tabs>
    </div>
    <transition name="el-zoom-in-top">
      <!--table数据-->
      <div class="wtbale" v-show="secLevelNavVisable">
        <jt-table ref="carTableEq" :tableData="wtbaleData" @tableSelectionChange="tableSelectionChange" :class="{active:canPage===false}">
          <div slot="tablePage" v-if="canPage">
            <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                      @changeCurrentPage="changeCurrentPage"></jt-pager>
          </div>
        </jt-table>
      </div>
    </transition>
    <!-- <&#45;&#45; 处理 弹窗&ndash;&gt;-->
    <jt-dialog :dialog-show.sync="dealdialogShow" :title="dialog.title" :width="dialog.width">
      <div slot="dialog">
        <el-form label-position="right" ref="dealForm" :model="dealForm"
                 class="deal">
          <el-form-item label="处理方式" prop="license">
            <!--<el-input v-model="insurance1AddForm.license" placeholder="请输入车牌号" style="width: 193px;"></el-input>-->
            <el-select style="width: 193px;" v-model="dealForm.type" placeholder="请选择">
              <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理意见" prop="remark">
            <el-input type="textarea" v-model="dealForm.remark" placeholder="请输入处理意见" style="width: 193px;"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="dealdialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="dealFuc(dealForm.id)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
  </div>
</template>

<script>
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import {datetime} from '@/utils/filters'
  export default {
    components: {JtTable, JtPager, JtDialog},
    name: "WarnTable",
    // props: ['wtbaleData'],
    data() {
      return {
        total: 0,
        typeList:[
          {name:'忽略告警',id:1}
        ],
        dealdialogShow: false,
        dialog: {
          title: '告警处理',
          width: '500px'
        },

        dealForm: {
          remark:'',
          type:1
        },
        canPage: false,
        secLevelNavVisable: false,
        wtbaleData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'license', title: '车牌号'},
            {name: 'orgName', title: '所属机构'},
            {name: 'enclosureName', title: '围栏名称'},
            {name: 'enclosureTypeInfo', title: '告警信息'},
            {name: 'position', title: '当前定位'},
          ],
          handleList: [
            {
              name: '处理',
              show: false,
              handleFunc: (obj) => {
                this.dealdialogShow=true
                this.dealForm.id = obj.row.id
              }
            }
          ],
          downList: [
            {
              name: '批量处理',
              show: false,
              handleFunc: () => {
                this.allDeal=true
                this.dealdialogShow=true
              }
            },
            {
              name: '全部忽略',
              show: false,
              handleFunc: () => {
                this.$confirm('此操作将全部忽略已选消息?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.getData('/enclosure/warn/batchHandle', 'post',{ids:this.ids},true).then(res => {
                    if(res.code===0){
                      this.getPage()
                    }
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            }
          ]
        },
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 5
        },
        ids:'',
        activeName: '1',
        runCarData: [],
        warnData: [],
        goTopUrl: '/static/mark/icon-map_13.png',
        allDeal:false
      }
    },
    created() {
    },
    mounted() {
      this.getPage()
    },
    methods: {
      /**
       * 获取车辆告警数据
       */
      getPage() {
        this.getData('/enclosure/warn/page', 'post', {
          pageSize: this.pager.pageSize,
          pageNum: this.pager.currentPage
        }).then(res => {
          this.wtbaleData.list = res.data.list
          for (const key in res.data.list) {
              let enclosureType = this.wtbaleData.list[key].enclosureType
              if (enclosureType===1) {
                this.wtbaleData.list[key].enclosureTypeInfo = '驶入告警区域'
              }
              if (enclosureType===2) {
                this.wtbaleData.list[key].enclosureTypeInfo = '驶出告警区域'
                
              }
          }
         
          this.total = res.data.total
        })
      },
      /**
       * 表格多选
       * @param val  多选的id集合
       */
      tableSelectionChange(val){
        var arr = []
        if (val.length) {
          for (var i = 0; i < val.length; i++) {
            arr.push(val[i].id)
          }
        }
        this.ids = arr.join(',')
      },
      /**
       * 分页-切换显示数量
       * @param val  值
       */
      handleSizeChange(val) {
        this.pager.pageSize = val
        this.getPage()
      },
      /**
       * 分页-切换当前页码
       * @param val  值
       */
      changeCurrentPage(val) {
        this.pager.currentPage = val
        this.getPage()
      },
      /**
       * 处理确定操作
       * @param form 提交的表单数据
       */
      dealFuc(id) {
        if(this.allDeal){
          this.getData('/enclosure/warn/batchHandle', 'post',{ids:this.ids},true).then(res => {
            if(res.code===0){
              this.dealdialogShow=false
              this.getPage()
            }
          })
        }else{
          this.getData('/enclosure/warn/handle', 'post',{id:id},true).then(res => {
            if(res.code===0){
              this.dealdialogShow=false
              this.getPage()
            }
          })
        }

      },
      /**
       * 开关底部警告信息列表
       */
      closeSecLevelMenu() {
        this.secLevelNavVisable = !this.secLevelNavVisable
        if (this.secLevelNavVisable === true) {
          this.goTopUrl = '/static/mark/icon-map_12.png'
        } else {
          this.goTopUrl = '/static/mark/icon-map_13.png'
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .bot-card {
    .el-input__inner{
      height: 28px;
    }
    width: 100%;
    background-color: white;
    position: absolute;
    bottom: 0px;
    .top {
      width: 100%;
      .warmTabs {
        height: 40px;
        font-size: 12px;
      }
      .el-tabs__item {
        height: 40px;
        font-size: 12px;
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
    .wtbale {
      padding: 20px;
      position: relative;
      .active {
        max-height: 300px;
        overflow-y: auto;
      }
      .jt-table {
        padding: 0px 0px 30px 0;
        .el-table td, .el-table th {
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
      .el-pager{
        .active {
          overflow: inherit!important;
        }
      }
    }
  }

</style>
