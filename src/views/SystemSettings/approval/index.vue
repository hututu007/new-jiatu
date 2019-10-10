<template>
  <div class="approval">
    <div class="approval-main">
      <jt-title :titData="approvalTitData"></jt-title>
      <div class="approval-list">
        <ul>
          <li>
            <div class="approval-left">
              <div><img src="../../../assets/images/icon-fy.png"/> </div>
              <div>
                <p>用车申请</p>
                <p>适用于因公使用车辆的申请</p>
              </div>
            </div>
            <div class="approval-right">
              <ul>
                <li>
                  <p>更新时间</p>
                  <p>{{updateTime}}</p>
                </li>
                <li>
                  <p>状态</p>
                  <p>{{status}}</p>
                </li>
                <li>
                  <span @click="dragForm">编辑表单</span><span @click="carApproval">审批流程</span><span @click="enableFuc">{{status==='启用'?'停用':'启用'}}</span>
                </li>
              </ul>
            </div>
          </li>
          <li style="display: none">
            <div class="approval-left">
              <div><img src="../../../assets/images/icon-yc.png"/></div>
              <div>
                <p>费用申请</p>
                <p>适用于因公使用车辆的产生的费用申请</p>
              </div>
            </div>
            <div class="approval-right">
              <ul>
                <li>
                  <p>更新时间</p>
                  <p>2011-12-12 12:20:00</p>
                </li>
                <li>
                  <p>状态</p>
                  <p >{{status}}</p>
                </li>
                <li>
                  <span @click="dragForm">编辑表单</span><span @click="feesApproval">审批流程</span><span @click="">{{status}}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import {datetime} from '@/utils/filters'
  export default {
    components: {JtTitle},
    data() {
      return {
        status:'',
        updateTime:'',
        approvalTitData: {
          typeName: 0,
          name: '内部审批流程',
          img: '',
          fucName: '',
          fuc: 0
        }
      }
    },
    mounted(){
      this.getData('/auditflow/getAuditFlow', 'post').then(res => {
        if(res.data.updateTime){
          this.updateTime=datetime(res.data.updateTime,'yy:MM:dd hh:mm:ss')
        }else if(res.data.createTime){
          this.updateTime=datetime(res.data.createTime,'yy:MM:dd hh:mm:ss')
        }else{
          this.updateTime='--'
        }
        if(res.data.enable===0){
          this.status='停用'
        }else{
          this.status='启用'
        }
      }).catch(error => {
        console.log(error)
      })
    },
    methods: {
      /**
       *
       */
      enableFuc(){
        console.log(111)
          if(this.status==='停用'){
            this.getData('/auditflow/updateEnable', 'post',{enable:1}, true).then(res => {
              if(res.code===0){
                this.status='启用'
                if(res.data.updateTime){
                  this.updateTime=datetime(res.data.updateTime,'yy:MM:dd hh:mm:ss')
                }
              }
            }).catch(error => {
              console.log(error)
            })
          }else {
            this.getData('/auditflow/updateEnable', 'post',{enable:0}, true).then(res => {
              if(res.code===0){
                this.status='停用'
                if(res.data.updateTime){
                  this.updateTime=datetime(res.data.updateTime,'yy:MM:dd hh:mm:ss')
                }
              }
            }).catch(error => {
              console.log(error)
            })
          }
      },
      /**
       * 用车申请审批流程
       */
      carApproval(){
        this.$router.push({
          name: 'flow'
          // query: {
          //   dutyId: obj.row.id,
          //   dutyName: obj.row.name,
          //   name:'duty'
          // }
        });
      },
      /**
       * 费用申请审批流程
       */
      feesApproval(){

      },
      /**
       * 编辑拖拽表单
       */
      dragForm(){
        this.$router.push({
          name: 'DragForm'
          // query: {
          //   dutyId: obj.row.id,
          //   dutyName: obj.row.name,
          //   name:'duty',
          //   resIds:obj.row.resIds
          // }
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .approval {
    width: 100%;
    padding: 20px;
    .approval-main {
      background-color: white;
      .approval-list{
        width: 100%;
        padding:0px 20px 50px 20px;
        &>ul>li:nth-child(1){
          border-bottom: 1px dashed rgb(220, 231, 238);
        }
        &>ul>li{
          width: 100%;
          height: 96px;
          padding-top: 20px;
          .approval-left{
            float: left;
            height: 96px;
            div{
              float: left;
              height: 96px;
            }
            &>div:nth-child(1){
              width:45px ;
              height: 45px;
              border-radius: 5px;
              overflow: hidden;
              img{
                width: 100%;
                height: 100%;
              }
            }
            &>div:nth-child(2){
              margin-left: 10px;
              font-size: 14px;
              p:nth-child(1){
                font-weight: bold;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.65);
                line-height:28px ;
              }
              p:nth-child(2){
                color: #999999;
              }
            }
          }
          .approval-right{
            float: right;
            height: 96px;
            &>ul{
              height: 96px;
              li{
                float: left;
                margin-right: 30px;
                font-size: 14px;
                p{
                  line-height:28px ;
                  color: #999999;
                }
                &>span{
                  line-height:28px ;
                  font-size: 14px;
                  color: #409eff;
                  cursor: pointer;
                  margin-left: 15px;
                }
              }
              &>li>p:nth-child(1){
                font-weight: bold;
                color: rgba(0, 0, 0, 0.65);
              }
            }
          }
        }
      }
    }
  }
</style>
