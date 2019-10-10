<template>
  <div class="flow">
    <div class="flow-main">
      <jt-title :titData="flowTitData">
        <div slot="tabsLeft">
          <img style="float: left;margin-top: 7px;cursor: pointer" @click="returnApproval"
               src="../../../assets/images/return.png"/>
          <span style="font-size: 14px;color:#999;float: left;margin-top: 18px;margin-left: 10px">返回</span>
        </div>
      </jt-title>
      <div class="flow-list">
        <el-row>
          <el-col :span="24">
            <div style="background-color: white;padding: 20px 0px;">
              <el-alert
                title="提示：您可以在此页面设置的审批流程将全机构生效，并且每个企业只允许设置唯一审批流程"
                type="info"
                style="background-color: #fffae7;color: #feb57f"
                :closable="false"
                show-icon>
              </el-alert>
            </div>
          </el-col>
        </el-row>
        <ul>
          <li>
            <span>审批流程设置</span>
            <span>审批自定义表单设置</span>
          </li>
          <li>
            <span>默认审批人</span>
            <div class="flow-right">
              <el-tag
                v-for="(tag,index) in tags"
                :key="tag.name"
                closable
                @close="closeOne(index)"
                :type="tag.id">
                {{tag.name}}
              </el-tag>
              <el-button icon="el-icon-plus" size="small" @click="defultClick"></el-button>
            </div>
          </li>

          <li>
            <span>条件审批流程</span>
            <div class="flow-right">
              <el-button icon="el-icon-plus" size="small" @click="conditionClick"></el-button>
            </div>
          </li>
          <li>
            <p>
              <span>修改权限</span>
              <span>撤销权限</span>
            </p>
            <div class="flow-right">
              <el-checkbox v-model="val.editPrameter">提交申请时，员工不可修改审批人</el-checkbox>
              <el-checkbox v-model="val.deletePrameter">审批以及派车通过后允许撤销申请</el-checkbox>
            </div>
          </li>

        </ul>
        <div style="padding: 20px 20px 40px 20px;width: 100%">
          <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
        </div>
      </div>
      <!-- 审批人弹窗 -->
      <jt-dialog :dialog-show.sync="approverDialogShow" :title="approverDialog.title" :width="approverDialog.width">
        <div slot="dialog">
          <el-form label-position="right" class="approverForm" :model="approverForm">
            <el-form-item style="border-bottom:1px dashed rgb(220, 231, 238);padding-bottom: 30px ">
              <el-radio-group v-model="approverForm.defaultAuditmanType" @change="typechange">
                <el-radio value="2" label="2">上级（ 自动设置通讯录中的上级领导为审批人 ）</el-radio>
                <el-radio value="1" label="1">单个成员</el-radio>
              </el-radio-group>
            </el-form-item>
            <person-choose v-if="approverForm.defaultAuditmanType==='1'" ref="person1"></person-choose>
            <el-form-item v-if="approverForm.defaultAuditmanType==='2'">
              <span style="color:#333;font-size:14px;float:left;width: 100%;">请选择上级审批方式：</span>
              <el-radio-group v-model="approverForm.defaultAuditmode">
                <el-radio value="1" label="1">会签（ 须所有上级同意 ）</el-radio>
                <el-radio value="2" label="2">或签（ 一名上级同意即可 ）</el-radio>
              </el-radio-group>
            </el-form-item>
            <div style="text-align: center;width: 100%;margin-top: 20px">
              <el-button size="mini" @click="approverDialogShow=false">取 消</el-button>
              <el-button size="mini" type="primary" @click="approverFuc(approverForm)">确 定</el-button>
            </div>
          </el-form>

        </div>
      </jt-dialog>
      <!-- 审批流程弹窗 -->
      <jt-dialog :dialog-show.sync="flowDialogShow" :title="flowDialog.title" :width="flowDialog.width">
        <div slot="dialog">
          <el-form label-position="right" class="flowForm" ref="flowForm" :model="flowForm">
            <el-form-item style="border-bottom:1px dashed rgb(220, 231, 238);padding-bottom: 30px ">
              <span style="color:#333;font-size:14px;margin-bottom: 20px">条件流程设置：</span>
              <div class="flow-item">
                <span>字段</span>
                <el-select @change="wordChange" v-model="flowForm.word" placeholder="请选择">
                  <el-option
                    v-for="item in wordsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="flow-item" v-if="flowForm.word===0">
                <span>申请人</span>
                <el-tag
                  v-for="(tag) in tags1"
                  :key="tag.name"
                  :type="tag.id">
                  {{tag.name}}
                </el-tag>
                <el-button size="small" @click="applayChoose">{{changePerson}}</el-button>
              </div>
              <div class="flow-item" v-if="flowForm.word===1">
                <span>用车类别</span>
                <el-checkbox-group v-model="flowForm.carusetypeIds">
                  <el-checkbox v-for="item in useTypeList" :label="item.id" :key="item.id">
                    {{item.name}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item>
              <span style="color:#333;font-size:14px;margin-bottom: 20px">对应审批流程：</span>
              <div class="flow-item">
                <span>审批人</span>
                <el-tag
                  v-for="(tag,index) in tags2"
                  :key="tag.name"
                  closable
                  @close="closeThree(index)"
                  :type="tag.id">
                  {{tag.name}}
                </el-tag>
                <el-button icon="el-icon-plus" size="small" @click="conditionPerson"></el-button>
              </div>

            </el-form-item>

          </el-form>


          <div style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="flowDialogShow=false">取 消</el-button>
            <el-button size="mini" type="primary" @click="conditionFuc">确 定</el-button>
          </div>
        </div>
      </jt-dialog>
      <!-- 选择人员弹窗 -->
      <jt-dialog :dialog-show.sync="personDialogShow" :title="personDialog.title" :width="personDialog.width">
        <div slot="dialog">
          <m-person-choose ref="mPerson"></m-person-choose>
          <div style="text-align: center;width: 100%;margin-top: 20px">
            <el-button size="mini" @click="personDialogShow=false">取 消</el-button>
            <el-button size="mini" type="primary" @click="personFuc">确 定</el-button>
          </div>
        </div>
      </jt-dialog>
    </div>
  </div>
</template>

<script>
  import JtTitle from '@/components/JtTitle'
  import JtDialog from '@/components/JtDialog'
  import PersonChoose from './personChoose'
  import MPersonChoose from './mPersonChoose'

  export default {
    name: "flow",
    components: {JtTitle, JtDialog, PersonChoose, MPersonChoose},
    data() {
      return {
        tags: [],
        changePerson:'选择',
        flowTitData: {
          typeName: 1,
          name: '内部审批流程',
          img: '',
          fucName: '',
          fuc: 0
        },
        val: {
          deletePrameter: '',
          editPrameter: ''
        },
        approverDialogShow: false,
        approverDialog: {
          title: '选择审批人',
          width: '800px'
        },
        flowDialogShow: false,
        flowDialog: {
          title: '按条件设定流程',
          width: '800px'
        },
        personDialogShow: false,
        personDialog: {
          title: '选择人员',
          width: '800px'
        },
        botShow: false,
        tags1: [],
        tags2: [],
        wordsList: [
          {value: 0, label: '申请人'},
          {value: 1, label: '用车类别'}
        ],
        useTypeList: [],
        approverForm: {  // 默认审批表单
          defaultAuditmanType: '2',
          defaultAuditmode: '1'
        },
        flowForm: { //条件审批表单
          word: 0,
          carusetypeIds: [],
          applicantIds: '',
          auditJson:'', // 条件审批人数组
        },
        submitForm: {
          cannotUpdateauditman: '',
          canRevoke: '',
          id: ''
        },
        approverForm1: {
          defaultAuditJson: '', // 默认审批人数组
        },
        num:0,
        num1:0,
        data: {},
        isCondition: false,
      }
    },
    methods: {
      /**
       *  返回页面
       */
      returnApproval() {
        this.$router.back(-1)
      },
      /**
       *  审批人type切换
       */
      typechange(val) {
        if (val === '2') { // 上级
          setTimeout(() => {
            if (this.$refs.person1) {
              this.$refs.person1.personForm = {}
              this.$refs.person1.dynamicTags1 = []
            }
          })
        } else {
          this.approverForm.defaultAuditmode = ''
        }
      },
      /**
       *  字段方式切换
       */
      wordChange(val) {
        console.log(val)
        if (val === 0) { // 申请人
          this.flowForm.carusetypeIds = []
        } else if (val === 1) { // 用车类别
          this.flowForm.applicantIds = ''
        }
      },
      /**
       *  删除默认审批人标签
       */
      closeOne(val) {
        this.tags.splice(val,1)
        var a=0
        this.num=0
        for(var i=0;i<this.tags.length;i++){
          if(this.tags[i].leavel){
            this.num++
            a++
            this.tags[i].leavel=a

            if(a===1){
              this.tags[i].name='直接上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }else{
              this.tags[i].name=(a)+'级上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }

          }
        }
      },
      closeThree(val) {
        this.tags2.splice(val,1)
        this.num1=0
        var a=0
        for(var i=0;i<this.tags2.length;i++){
          if(this.tags2[i].leavel){
            this.num1++
            a++
            this.tags2[i].leavel=a
            if(a===1){
              this.tags2[i].name='直接上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }else{
              this.tags2[i].name=(a)+'级上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }

          }
        }
      },
      /**
       * 提交表单
       */
      onSubmit() {
        /* 修改权限 */
        console.log(this.val.editPrameter)
        if (this.val.editPrameter) {
          this.submitForm.cannotUpdateauditman = 1
        } else {
          this.submitForm.cannotUpdateauditman = 0
        }
        /* 撤销权限 */
        if (this.val.deletePrameter) {
          this.submitForm.canRevoke = 1
        } else {
          this.submitForm.canRevoke = 0
        }
        var arr=[]
        for(var i=0;i<this.tags2.length;i++){   //绑定在提交的数据上
          arr.push({
            order:i,
            id:this.tags2[i].id,
            mode:this.tags2[i].mode, // 会签，或签
            type:this.tags2[i].type, // 上级
            leavel:this.tags2[i].leavel
          })
        }
        this.flowForm.auditJson= JSON.stringify(arr)
        var brr=[]
        for(var i=0;i<this.tags.length;i++){   //绑定在提交的数据上
          brr.push({
            order:i,
            id:this.tags[i].id,
            mode:this.tags[i].mode, // 会签，或签
            type:this.tags[i].type, // 上级
            leavel:this.tags[i].leavel
          })
        }
        this.approverForm1.defaultAuditJson=JSON.stringify(brr)

        for (var key in this.flowForm) {
          this.submitForm[key] = this.flowForm[key]
        }
        for (var key in this.approverForm1) {
          this.submitForm[key] = this.approverForm1[key]
        }
        console.log(this.submitForm)
        this.getData('/auditflow/submit', 'post', this.submitForm, true).then(res => {
          if(res.code===0){
             /* 获取初始信息 */
            this.getApproverInfo()
          }

        }).catch(error => {
          console.log(error)
        })
      },
      /**
       *  条件审批里面的选择审批人
       */
      conditionPerson() {
        this.isCondition = true
        this.approverDialogShow = true
        this.approverForm = {
          defaultAuditmanType: '2',
          defaultAuditmode: '1'
        }
        setTimeout(() => {
          this.$bus.$emit('personSure1')
        })
      },
      /**
       * 三个弹窗的确定事件
       */
      approverFuc() {
        if (this.isCondition) { // 条件审批打开的\ auditmanType auditMode
          if (this.$refs.person1 && this.approverForm.defaultAuditmanType === '1') {
            this.tags2.push({
              name:this.$refs.person1.dynamicTags1[0].name,
              id:this.$refs.person1.dynamicTags1[0].id.toString(),
              type:this.approverForm.defaultAuditmanType,  // 单个
              mode:'',
              leavel:'',
            })
          } else {
            this.num1++
            let name=''
            if(this.num1===1){
              name='直接上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }else{
              name=(this.num1)+'级上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }
            this.tags2.push({
              name:name,
              id:'',
              mode:this.approverForm.defaultAuditmode, // 会签，或签
              type:this.approverForm.defaultAuditmanType, // 上级
              leavel:this.num1
            })

          }
        } else { // 默认审批打开的
          if (this.$refs.person1 && this.approverForm.defaultAuditmanType === '1') {
            this.tags.push({
              name:this.$refs.person1.dynamicTags1[0].name,
              id:this.$refs.person1.dynamicTags1[0].id.toString(),
              type:this.approverForm.defaultAuditmanType,  // 单个
              mode:'',
              leavel:'',
            })
          } else {
            console.log(this.num)
            this.num++
            console.log(this.num)
            let name=''
            if(this.num===1){
              name='直接上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }else{
              name=(this.num)+'级上级'+'('+(this.approverForm.defaultAuditmode==='1'?'会签':'或签')+')'
            }
            this.tags.push({
              name:name,
              id:'',
              mode  :this.approverForm.defaultAuditmode, // 会签，或签
              type :this.approverForm.defaultAuditmanType, // 上级
              leavel:this.num
            })
          }
        }
        this.approverDialogShow = false
      },
      /**
       * 审批流程确定
       */
      conditionFuc() {
        this.flowDialogShow = false
      },
      /**
       * 选择人员确定
       */
      personFuc() {
        this.tags1 = []
        if (this.$refs.mPerson.dynamicTags2) {
          let list = this.$refs.mPerson.dynamicTags2
          var str = "";
          var names = ''
          for (var i = 0; i < list.length; i++) {
            this.tags1.push({
              name: list[i].name, id: list[i].id.toString()
            })
            str += list[i].id + ",";
            names += list[i].name + ",";
          }
          if (str.length) {
            str = str.substring(0, str.length - 1)
            names = names.substring(0, names.length - 1)
          }
          console.log(str)
          this.flowForm.applicantIds = str
          this.flowForm.name3 = names
          this.changePerson='修改'


        } else {
          this.changePerson='选择'
          this.tags1 = []
          this.flowForm.applicantIds = ''
        }
        this.personDialogShow = false
      },
      /**
       * 默认审批人点击
       */
      defultClick() {
        this.isCondition = false
        this.approverDialogShow = true
        this.approverForm = {
          defaultAuditmanType: '2',
          defaultAuditmode: '1'
        }
        setTimeout(() => {
          this.$bus.$emit('personSure')
        })
      },
      /**
       * 条件审批人点击
       */
      conditionClick() {
        this.flowDialogShow = true




      },
      /**
       * 申请人点击
       */
      applayChoose() {
        this.personDialogShow = true
        if(this.flowForm.applicantIds){
          setTimeout(() => {
            this.$bus.$emit('sureMperson', this.flowForm.applicantIds, this.flowForm.name3)
          }, 100)
        }

      },
      /**
       *  请求页面初始数据
       */
      getApproverInfo() {
        /* 审批设置查询 */
        this.getData('/auditflow/getAuditFlow', 'post').then(res => {
          console.log(res)
          if (res.data) {
            this.data = res.data
            this.submitForm.id = res.data.id  // 修改id绑定
            // 默认审批人回显邦定
            if(res.data.defaultAuditJson){
              let json=JSON.parse(res.data.defaultAuditJson)
              for(var i=0;i<json.length;i++){
                if(!json[i].id&&json[i].type===2){ //判断是否为上级审批
                  if(json[i].leavel===1){ // 直属上级
                    json[i].name='直接上级'+'('+(json[i].mode==='1'?'会签':'或签')+')'
                  }else{
                    json[i].name=json[i].leavel+'级上级'+'('+(json[i].mode==='1'?'会签':'或签')+')'
                  }
                }else{
                  json[i].id=json[i].id.toString()
                }
              }
              this.tags=json
            }
            // 条件审批人回显邦定
            if(res.data.auditJson){
              let json1=JSON.parse(res.data.auditJson)
              for(var i=0;i<json1.length;i++){
                if(!json1[i].id&&json1[i].type===2){ //判断是否为上级审批
                  if(json1[i].leavel===1){ // 直属上级
                    json1[i].name='直接上级'+'('+(json1[i].mode==='1'?'会签':'或签')+')'
                  }else{
                    json1[i].name=json1[i].leavel+'级上级'+'('+(json1[i].mode==='1'?'会签':'或签')+')'
                  }
                }else{
                  json1[i].id=json1[i].id.toString()
                }
              }
              this.tags2=json1
            }
            console.log(this.tags2)
               // 申请人回显绑定
            if (res.data.applicantIds) {
              this.flowForm.word=0
              this.changePerson='修改'
              this.tags1=[]
              this.flowForm.applicantIds = res.data.applicantIds
              this.flowForm.name3 = res.data.applicantName
              let list = res.data.applicantIds.split(',')
              let list1 = res.data.applicantName.split(',')
              for (var i = 0; i < list.length; i++) {
                this.tags1.push({
                  name: list1[i], id: list[i]
                })
              }
            }
            if (res.data.carusetypeIds) { // 用车类型回显绑定
                this.flowForm.word=1
              var arr = res.data.carusetypeIds.split(',')
              var brr = []
              for (var i = 0; i < arr.length; i++) {
                brr.push(parseInt(arr[i]))
              }
              this.flowForm.carusetypeIds = brr
            }
            // 修改权限，撤销权限 回显绑定
            this.val.editPrameter = res.data.cannotUpdateauditman ? true : false
            this.val.deletePrameter = res.data.canRevoke ? true : false
            /* 初始化num,上级等级数 */
            if(this.tags){
              for(var i=0;i<this.tags.length;i++) {
                if (this.tags[i].leavel) {
                  this.num++
                }
              }
            }
            if(this.tags2){
              for(var i=0;i<this.tags2.length;i++) {
                if (this.tags2[i].leavel) {
                  this.num1++
                }
              }
            }

          } else {
            this.submitForm.id = ''
          }

        }).catch(error => {
          console.log(error)
        })
      }
    },
    mounted() {
      /* 获取初始信息 */
      this.getApproverInfo()
      /* 用车类别 */
      this.getData('/apply/usetype/getAll', 'post').then(res => {
        for (var i = 0; i < res.data.length; i++) {
          this.useTypeList.push({
            name: res.data[i].name,
            id: res.data[i].id
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .flow {
    width: 100%;
    padding: 20px;
    .el-tag {
      margin-top: 4px;
    }
    .flow-main {
      background-color: white;
      .approverForm {
        .el-radio {
          display: block;
          margin-left: 0px;
          line-height: 34px;
        }
      }
      .personForm {
        .choosePeople {
          width: 100%;
          overflow: hidden;
          padding-bottom: 20px;
          .el-tag {
            margin-right: 10px;
          }
          & > div {
            float: left;
          }
          & > div:nth-child(1) {
            width: 250px;
            padding-right: 30px;
            border-right: 1px solid rgb(220, 231, 238);
          }
          & > div:nth-child(2) {
            padding-left: 30px;
            width: 350px;
          }
        }
      }
      .flow-item {
        padding-bottom: 20px;
        .el-input__inner {
          height: 28px;
        }
        & > span {
          width: 56px;
          display: inline-block;
          font-size: 12px;
          float: left;
          margin-right: 20px;
        }
        & > .el-checkbox-group {
          float: left;
        }
        .el-tag {
          width: inherit;
        }
      }
      .flow-list {
        padding: 10px 20px;
        & > ul > li {
          padding: 20px;
          width: 100%;
          border-bottom: 1px dashed rgb(220, 231, 238);
          & > span {
            font-size: 14px;
          }
          & > span:nth-child(1) {
            margin-right: 50px;
            text-align: left;
            width: 90px;
            color: #333;
            display: inline-block;
          }
          & > p:nth-child(1) {
            margin-right: 50px;
            text-align: left;
            width: 90px;
            display: inline-block;
            span {
              display: block;
              color: #333;
              font-size: 14px;
              margin-top: 15px;
            }
          }
          .flow-right {
            display: inline-block;
            & > span {
              font-size: 12px;
              color: #666;
              margin-right: 5px;
            }
            .el-checkbox {
              display: block;
              margin-left: 0px;
              line-height: 30px;
            }
            .el-checkbox__label, .el-radio__label {
              font-size: 12px;
              color: #666;
            }
            .el-radio {
              display: block;
              margin-left: 0px;
              line-height: 34px;
            }
          }
        }
        & > ul > li:nth-child(1) {
          & > span {
            cursor: pointer;
          }
          & > span:nth-child(1) {
            color: #409eff;
          }
        }
        & > ul > li:nth-child(5) {
          & > p {
            width: 90px;
            display: inline-block;
            margin-right: 50px;
          }
          & > p > span {
            font-size: 14px;
            width: 58px;
            line-height: 60px;
            display: block;
            margin-right: 50px;
            text-align: right;
          }
        }
        & > ul > li:nth-child(6) {
          & > span {
            position: relative;
            top: -52px;
          }
        }
      }
    }
  }

</style>
