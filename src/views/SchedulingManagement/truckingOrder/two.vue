<template>
  <div class="orderTwo">
    <div class="orderTwo-form">
      <el-form :inline="true" :model="orderTwoHeadForm" class="orderTwoForm-inline">
        <car-type @checkedChange="checkedChange"></car-type>
        <el-form-item label="用车人" class="useMan">
          <el-select @change="useManchange" v-model="useManIds" multiple filterable placeholder="请选择" size="mini">
            <el-option
              v-for="item in useManList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span style="color: #409eff;font-size: 12px;margin-left: 20px;cursor: pointer" @click="watchMe">只看自己</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="orderTwoTable">
      <jt-table ref="carTable" :tableData="orderTwoTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
  </div>
</template>

<script>
  import JtOrgSelect from '@/components/Jtorgselect'
  import JtTable from '@/components/JtTable'
  import JtPager from '@/components/JtPager'
  import JtDialog from '@/components/JtDialog'
  import CarType from '@/components/Cartype'
  import {datetime} from '@/utils/filters'
  import {status} from '@/utils/index'
  import {getCookie} from '@/utils/auth'
  export default {
    components:{CarType, JtTable, JtPager, JtDialog, JtOrgSelect},
    name: "Two",
    data() {
      return{
        orderTwoHeadForm:{
          usemanIds:'',
          useTypesStr: '',
          pageSize:10,
          pageNum:1
        },
        useManIds:[],
        useManList:[],
        orderTwoTableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'usemanName', title: '用车人', width: '120px'},
            {name: 'createrName', title: '代理申请人', width: '120px'},
            {name: 'orgName', title: '所属机构/部门', width: '150px'},
            {name: 'stopAddress', title: '目的地'},
            {name: 'useReason', title: '用车事由'},
            {name: 'useTime', title: '用车时间'},
            {name: 'urgencyName', title: '紧急状态', width: '100px'},
            {name: 'needName', title: '是否需要驾驶员', width: '150px'},
            {name: 'statusName', title: '审核状态', width: '100px'}
          ],
          handleList: [
            {
              name: '查看详情',
              handleFunc: (obj) => {
                this.$router.push({
                  name: 'Progress',
                  query: {
                    id: obj.row.id,
                    sign:9
                  }
                });
              }
            }
          ],
          upload: false,
          downList: []
        },
        pager:{
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        }
      }
    },
    created(){
      this.$bus.$on('agreeCarClick',()=>{
        this.getTruckingTwoList()
      })
    },
    methods: {
      /**
       * 只看自己
       */
      watchMe(){
        this.useManIds=[]
        this.orderTwoHeadForm.usemanIds=getCookie('jiatu_userId').toString()
        this.getTruckingTwoList()
      },
      /**
       * 用车类型点击选择
       * @param val id集合
       */
      checkedChange(val) {
        this.orderTwoHeadForm.useTypesStr=val
        this.getTruckingTwoList()
      },
      /**
       * 用车人点击选择
       * @param val 选中的id
       */
      useManchange(val){
        this.orderTwoHeadForm.usemanIds=val.join(',')
        this.getTruckingTwoList()
      },
      /**
       * 获取page数据
       */
      getTruckingTwoList(){
        this.getData('/apply/send/his/page ', 'post', this.orderTwoHeadForm).then(res => {
          this.pager.total=res.data.total
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].useTime = datetime(res.data.list[i].preStartTime,'yy:MM:dd hh:mm:ss') + '至' + datetime(res.data.list[i].preStopTime,'yy:MM:dd hh:mm:ss')
            res.data.list[i].urgencyName = status(res.data.list[i].urgency, {0: '否', 1: '是'})
            res.data.list[i].needName = status(res.data.list[i].needDriver, {0: '不需要', 1: '需要'})
            res.data.list[i].statusName = status(res.data.list[i].status, {
              0: '草稿', 1: '待审核', 2: '流转中', 3: '不通过',
              4: '待派车', 5: '待开始', 6: '任务中', 7: '任务结束', 8: '任务取消', 9: '删除', 10: '拒绝派车'
            })
          }
          this.orderTwoTableData.list = res.data.list
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 分页每页显示数量选择
       * @param val
       */
      handleSizeChange(val){
        this.orderTwoHeadForm.pageSize=val
        this.getTruckingTwoList()
      },
      /**
       * 分页当前页码选择
       * @param val 当前页码
       */
      changeCurrentPage(val){
        this.orderTwoHeadForm.pageNum=val
        this.getTruckingTwoList()
      },
    },
    mounted() {
      this.getTruckingTwoList()
      /** 用车人数据 **/
      this.getData('/apply/useman/list', 'post').then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.useManList.push({
            label: res.data[i].realName,
            value: res.data[i].id
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .orderTwo{
    .orderTwo-form{
      .orderTwoForm-inline{
        &>div{
          width: 100%;
          float: left;
        }
        .useMan{
          .el-form-item__label{
            font-size: 12px;
            font-weight: normal;
            color: #999;
          }
        }
      }
      .orderTwoTable {
        padding: 30px 20px 20px 20px;
      }
    }
    #orderTwoForm{
      .el-form-item{
        margin-bottom: 10px;
        .el-input-number__increase,.el-input-number__decrease{
          width: 16px;
          line-height: 19px;
          height: 15px;
        }
        .el-input-number__increase{
          top: 6px;
        }
        .el-input-number__decrease{
          bottom: 6px;
        }
      }
      .el-form-item__label{
        width: 110px;
        font-size: 12px;
      }
      .el-input__inner{
        width: 193px;
        height: 28px;
      }
      .range {
        .el-range-editor {
          width: 256px;
          padding: 0px 0px 0px 10px;
          margin-top: 5px;
          .el-range-separator {
            width: 10%;
          }
        }
        .el-input__icon {
          line-height: 28px;
        }
      }
      .range > input {
        font-size: 12px;
      }
      .range > span {
        font-size: 12px;
        padding: 0px 14px 0px 5px;
      }
    }
  }
</style>
