<template>
  <div class="approvalOne">
    <div class="approvalOne-form">
      <el-form :inline="true" :model="approvalOneHeadForm" class="approvalOneForm-inline">
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
    <div class="approvalOneTable">
      <jt-table ref="carTable" :tableData="approvalOneTableData">
        <div slot="tablePage">
          <jt-pager :pager="pager" @handleSizeChange="handleSizeChange"
                    @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
    <!--  同意弹框 -->
    <jt-dialog :dialog-show.sync="agreeDialogShow" :title="dialogOne.title" :width="dialogOne.width">
      <div slot="dialog">
        <el-form label-position="right" ref="agreeForm" :model="agreeForm"
                 class="agreeForm">
          <el-form-item label="处理意见" class="mark">
            <el-input type="textarea" v-model="agreeForm.remark"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="agreeDialogShow = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="agreeDealFuc(agreeForm)">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </jt-dialog>
    <!--  流转弹框 -->

    <!--<jt-dialog :dialog-show.sync="approveDialogShow" :title="dialogTwo.title" :width="dialogTwo.width">-->
      <!--<div slot="dialog">-->
        <!--<el-form label-position="right" ref="approveForm" :model="approveForm"-->
                 <!--class="approveForm">-->
          <!--<el-form-item label="审批人">-->
            <!--<el-select v-model="approveForm.approveMan" placeholder="请选择">-->
              <!--<el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="审批意见" class="mark">-->
            <!--<el-input type="textarea" v-model="approveForm.remark"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item style="text-align: center;width: 100%;margin-top: 20px">-->
            <!--<el-button size="mini" @click="approveDialogShow = false">取 消</el-button>-->
            <!--<el-button size="mini" type="primary" @click.native="approveDealFuc(approveForm)">确 定</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</div>-->
    <!--</jt-dialog>-->

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
        approvalOneHeadForm:{
          usemanIds:'',
          useTypesStr: '',
          pageSize:10,
          pageNum:1
        },
        options2:[],
        useManList:[],
        approvalOneTableData: {
          checkStyle: true,
          list:[],
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
              name: '同意',
              handleFunc: (obj) => {
                this.agreeForm.remark=''
                this.agreeDialogShow=true
                this.agreeForm.id=obj.row.id
                this.agreeForm.applyId=obj.row.id
              }
            },
            // {
            //   name: '流转',
            //   handleFunc: (obj) => {
            //     this.approveForm.remark=''
            //     this.approveForm.userId=''
            //     this.approveDialogShow=true
            //     this.approveForm.id=obj.row.id
            //     this.approveForm.applyId=obj.row.id
            //     this.approveForm.userId=getCookie('jiatu_userId')
            //   }
            // },
            {
              name: '拒绝',
              handleFunc: (obj) => {
                this.refuseForm.remark=''
                this.refuseDialogShow=true
                this.refuseForm.id=obj.row.id
                this.refuseForm.applyId=obj.row.id
              }
            },
            {
              name: '查看详情',
              handleFunc: (obj) => {
                this.$router.push({
                  name: 'Progress',
                  query: {
                    id: obj.row.id,
                    sign:4
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
        },
        agreeDialogShow:false,
        dialogOne: {
          title: '填写审批意见',
          width: '500px'
        },
        agreeForm:{
          remark:'',
          type :1,
          id :'',
          applyId:'',
          status:1
        },
        // approveDialogShow:false,
        // dialogTwo: {
        //   title: '填写流转意见',
        //   width: '500px'
        // },
        // approveForm:{
        //   remark:'',
        //   id: '',
        //   applyId: '',
        //   type: 2,
        //   status: 1,
        //   userId:''
        // },
        refuseDialogShow:false,
        dialogThree: {
          title: '填写拒绝原因',
          width: '500px'
        },
        refuseForm:{
          remark:'',
          type :1,
          id :'',
          applyId:'',
          status:2
        },
        useManIds:[]
      }
    },
    methods: {
      /**
       * 只看自己
       */
      watchMe(){
        this.useManIds=[]
        this.approvalOneHeadForm.usemanIds=getCookie('jiatu_userId').toString()
        this.getApprpvalOneList()
      },
      /**
       * 用车类型点击选择
       * @param val id集合
       */
      checkedChange(val) {
        this.approvalOneHeadForm.useTypesStr=val
        this.getApprpvalOneList()
      },
      /**
       * 用车人点击选择
       * @param val 选中的id
       */
      useManchange(val){
        this.approvalOneHeadForm.usemanIds=val.join(',')
        this.getApprpvalOneList()
      },
      /**
       * 获取page数据 approvalOneTableData
       */
      getApprpvalOneList(){
        this.getData('/apply/audit/wait/page ', 'post', this.approvalOneHeadForm).then(res => {
          this.pager.total=res.data.total
          this.approvalOneTableData.list = res.data.list
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
        this.approvalOneHeadForm.pageSize=val
        this.getApprpvalOneList()
      },
      /**
       * 分页当前页码选择
       * @param val 当前页码
       */
      changeCurrentPage(val){
        this.approvalOneHeadForm.pageNum=val
        this.getApprpvalOneList()
      },
      /**
       * 审批同意操作
       * @param form 提交的表单数据
       */
      agreeDealFuc(form){
        this.getData('/apply/audit', 'post', this.agreeForm, true).then(data => {
          if (data.code === 0) {
            this.$bus.$emit('agreeClick')
          }
          this.agreeDialogShow = false
          this.getApprpvalOneList()
        })
      },
      /**
       * 审批流转操作
       * @param form 提交的表单数据
       */
      // approveDealFuc(form){
      //   this.getData('/apply/audit', 'post', this.approveForm, true).then(data => {
      //     if (data.code === 0) {
      //       this.$bus.$emit('approveClick')
      //     }
      //     this.approveDialogShow = false
      //     this.getApprpvalOneList()
      //   })
      // },
      /**
       * 审批拒绝操作
       * @param form 提交的表单数据
       */
      refuseDealFuc(form){
        this.getData('/apply/audit', 'post', this.refuseForm, true).then(data => {
          if (data.code === 0) {
            this.$bus.$emit('refuseClick')
          }
          this.refuseDialogShow = false
          this.getApprpvalOneList()
        })
      }
    },
    mounted() {
      this.getApprpvalOneList()
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
      /** 审批人数据 **/
      this.getData('/apply/auditman/list', 'post').then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.options2.push({
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
  .approvalOne{
    .approvalOne-form{
      .approvalOneForm-inline{
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
      .approvalOneTable {
        padding: 30px 20px 20px 20px;
      }
    }
    #approvalOneForm{
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
