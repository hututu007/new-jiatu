<template>
  <div class="orderOne">
    <div class="orderOne-form">
      <el-form :inline="true" :model="orderOneHeadForm" class="orderOneForm-inline">
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
    <div class="orderOneTable">
      <jt-table ref="carTable" :tableData="orderOneTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!--  派车弹框 -->
    <jt-dialog :dialog-show.sync="approveDialogShow" :title="dialogTwo.title" :width="dialogTwo.width">
      <div slot="dialog">
        <el-form label-position="right" ref="approveForm" :model="approveForm"
                 class="approveForm">
          <el-form-item label="任务车辆">
            <el-select v-model="approveForm.carId" placeholder="请选择">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="驾驶员">
            <el-select v-model="approveForm.driverId" placeholder="请选择">
              <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="派车意见" class="mark">
            <el-input type="textarea" v-model="approveForm.remark"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="approveDialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="approveDealFuc(approveForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
    <!--  拒绝弹框 -->
    <jt-dialog :dialog-show.sync="refuseDialogShow" :title="dialogThree.title" :width="dialogThree.width">
      <div slot="dialog">
        <el-form label-position="right" ref="refuseForm" :model="refuseForm"
                 class="refuseForm">
          <el-form-item label="拒绝原因" class="mark">
            <el-input type="textarea" v-model="refuseForm.remark"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="refuseDialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="refuseDealFuc(refuseForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
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
    name: "Four",
    data() {
      return{
        orderOneHeadForm:{
          usemanIds:'',
          useTypesStr: '',
          pageSize:10,
          pageNum:1
        },
        useManIds:[],
        useManList:[],
        options2:[],
        options3:[],
        orderOneTableData: {
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
              name: '派车',
              handleFunc: (obj) => {
                this.options3=[]
                this.options2=[]
                this.approveForm.remark=''
                this.approveForm.carId=''
                this.approveForm.driverId=''
                this.approveDialogShow=true
                this.approveForm.id=obj.row.id
                /** 任务车辆 **/
                this.getData('/apply/car/list', 'post',{id:obj.row.id}).then(res => {
                  for (var i = 0; i < res.data.length; i++) {
                    this.options2.push({
                      label: res.data[i].license,
                      value: res.data[i].id
                    })
                  }
                }).catch(error => {
                  console.log(error)
                })
                /** 驾驶员 **/
                this.getData('/apply/driver/list', 'post',{id:obj.row.id}).then(res => {
                  for (var i = 0; i < res.data.length; i++) {
                    this.options3.push({
                      label: res.data[i].realName,
                      value: res.data[i].id
                    })
                  }
                }).catch(error => {
                  console.log(error)
                })
              }
            },
            {
              name: '查看详情',
              handleFunc: (obj) => {
                this.$router.push({
                  name: 'Progress',
                  query: {
                    id: obj.row.id,
                    sign:8
                  }
                });
              }
            },
            {
              name: '拒绝',
              handleFunc: (obj) => {
                this.refuseForm.remark=''
                this.refuseForm.id=obj.row.id
                this.refuseDialogShow=true
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
        },
        approveDialogShow:false,
        dialogTwo: {
          title: '派车操作',
          width: '500px'
        },
        approveForm:{
          id:'',
          remark:'',
          carId:'',
          driverId:''
        },
        refuseDialogShow:false,
        dialogThree: {
          title: '填写拒绝原因',
          width: '500px'
        },
        refuseForm:{
          id:'',
          remark:'',
          status:5
        }
      }
    },
    methods: {
      /**
       * 只看自己
       */
      watchMe(){
        this.useManIds=[]
        this.orderOneHeadForm.usemanIds=getCookie('jiatu_userId').toString()
        this.getTruckingOneList()
      },
      /**
       * 用车类型点击选择
       * @param val id集合
       */
      checkedChange(val) {
        this.orderOneHeadForm.useTypesStr=val
        this.getTruckingOneList()
      },
      /**
       * 用车人点击选择
       * @param val 选中的id
       */
      useManchange(val){
        this.orderOneHeadForm.usemanIds=val.join(',')
        this.getTruckingOneList()
      },
      /**
       * 获取page数据
       */
      getTruckingOneList(){
        this.getData('/apply/send/wait/page ', 'post', this.orderOneHeadForm).then(res => {
          this.pager.total=res.data.total
          this.orderOneTableData.list = res.data.list
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].useTime = datetime(res.data.list[i].preStartTime,'yy:MM:dd hh:mm:ss') + '至' + datetime(res.data.list[i].preStopTime,'yy:MM:dd hh:mm:ss')
            res.data.list[i].urgencyName = status(res.data.list[i].urgency, {0: '否', 1: '是'})
            res.data.list[i].needName = status(res.data.list[i].needDriver, {0: '不需要', 1: '需要'})
            res.data.list[i].statusName = status(res.data.list[i].status, {
              0: '草稿', 1: '待审核', 2: '流转中', 3: '不通过',
              4: '待派车', 5: '待开始', 6: '任务中', 7: '任务结束', 8: '任务取消', 9: '删除', 10: '拒绝派车'
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 分页每页显示数量选择
       * @param val
       */
      handleSizeChange(val){
        this.orderOneHeadForm.pageSize=val
        this.getTruckingOneList()
      },
      /**
       * 分页当前页码选择
       * @param val 当前页码
       */
      changeCurrentPage(val){
        this.orderOneHeadForm.pageNum=val
        this.getTruckingOneList()
      },
      /**
       * 派车
       * @param form 当前表单数据
       */
      approveDealFuc(form){
        this.getData('/apply/send', 'post', this.approveForm).then(data => {
          if (data.code === 0) {
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'success'
            });
            this.$bus.$emit('agreeCarClick')
          }
          this.approveDialogShow = false
          this.getTruckingOneList()
        })
      },
      /**
       * 拒绝派车
       * @param form 当前表单数据
       */
      refuseDealFuc(form){
        this.getData('/apply/send', 'post', this.refuseForm).then(data => {
          if (data.code === 0) {
            this.$message({
              showClose: true,
              message:data.msg,
              type: 'success'
            });
            this.$bus.$emit('refuseCarClick')
          }
          this.refuseDialogShow = false
          this.getTruckingOneList()
        })
      }
    },
    mounted() {
      this.getTruckingOneList()
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
  .orderOne{
    .orderOne-form{
      .orderOneForm-inline{
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
      .orderOneTable {
        padding: 30px 20px 20px 20px;
      }
    }
    #orderOneForm{
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
    .agreeForm,.approveForm,.refuseForm{
      .el-form-item__label{
        width: 70px;
      }
      .el-select .el-input__inner{
        height: 28px;
      }
      .mark{
        .el-form-item__content {
          float: left;
        }
      }
    }
  }
</style>
