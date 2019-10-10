<template>
<div>
  <fence-map ref='fenceMap' :fence='fenceList' :selectedIndex='listIndex' :editState="editState"></fence-map>
  <div class="right-card">
    <div class="rc-top">
      <el-button type="primary" icon="el-icon-arrow-left" @click="cardShow=!cardShow" >展开围栏列表</el-button>
      <el-button type="primary" icon="el-icon-plus"  v-if="cardShow" @click="addfence()" :class="{active:rcListShow===false}">新增围栏</el-button>
    </div>
    <!-- 列表 -->
    <div id="card-container" class="fn-shadow" v-if="cardShow">
    <div class="rcList" v-show="rcListShow">
      <p>
        <el-input placeholder="围栏名称查询" v-model="fenceName" @keyup.enter.native="searchName">
          <i slot="suffix" class="el-input__icon el-icon-search"  @click="searchName"></i>
        </el-input>
      </p>
      <el-tabs v-model="activeName" class="fence-tabs" @tab-click="handleClick" >
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="禁入" name="1"></el-tab-pane>
        <el-tab-pane label="禁出" name="2"></el-tab-pane>
        <el-tab-pane label="停用" name="stop"></el-tab-pane>
      </el-tabs>
      <ul class="fence-list">
        <li v-for="(item,index) in fenceList" @mousemove="toolShowIndex=index" @mouseout="toolShowIndex=''" ref="fenceList" :key="index" :class="index===listIndex?'listActive':'listActive1'" @click="fenceListClick(index)">
          <p>{{index+1}}</p>
          <p><span>{{item.enclosureName}}</span><span>{{item.validStarttime + '-' + item.validEndtime}}</span></p>
          <p>
            <!--:style="{color:item.color}"-->
            <span v-show="index!==toolShowIndex?true:false" :class="{redSpan:item.enable==0}">{{item.enable==0?'停用':(item.enclosureType==1?'禁入':'禁出')}}</span>
            <span v-show="index===toolShowIndex?true:false">
              <i class="el-icon-edit btn_tool" title="编辑" @click="Edit(item,index)"></i>
              <i class="el-icon-close btn_tool" title="删除" @click="Delete(item.id)"></i>
            </span>
          </p>
        </li>
      </ul>
    </div>
    <!-- 新增编辑表单 -->
    <div class="rcForm " v-show="!rcListShow">
      <el-form ref="fenceForm" :rules="rules" :model="fenceForm" size="mini">
        <el-form-item label="形状">
          <el-radio-group v-model="fenceForm.enclosureShape" @change="shapeChange(fenceForm.enclosureShape)">
            <el-radio :label="1">圆形</el-radio>
            <el-radio :label="2">矩形</el-radio>
            <el-radio :label="3">多边形</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="围栏名称" prop="enclosureName">
          <el-input v-model="fenceForm.enclosureName" placeholder="填写围栏名称，不超过10个字符"></el-input>
        </el-form-item>
        <el-form-item label="类型"  prop="enclosureType">
          <el-select v-model="fenceForm.enclosureType" placeholder="请选择围栏类型">
            <el-option label="禁止驶入" :value="1"></el-option>
            <el-option label="禁止驶出" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周期"  prop="enclosureCycle">
          <el-select v-model="fenceForm.enclosureCycle" placeholder="请选择周期">
            <el-option label="每天" :value="1"></el-option>
            <el-option label="法定工作日" :value="2"></el-option>
            <el-option label="周一至周五" :value="3"></el-option>
            <el-option label="自定义" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="有效日期">
          <el-date-picker
            v-model="fenceDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="自定义周期" v-if="fenceForm.enclosureCycle==4" prop="validDate">
          <el-select v-model="fenceForm.validDate" multiple placeholder="请选择重复周期">
            <el-option label="周一" :value="1"></el-option>
            <el-option label="周二" :value="2"></el-option>
            <el-option label="周三" :value="3"></el-option>
            <el-option label="周四" :value="4"></el-option>
            <el-option label="周五" :value="5"></el-option>
            <el-option label="周六" :value="6"></el-option>
            <el-option label="周日" :value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效时间段" prop="validStarttime">
          <el-time-picker
            is-range
            v-model="fenceTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss"
            :default-value="defaultTime"
            >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="生效车辆"  prop="carIds" class="temps" >
          <el-select v-model="fenceForm.carIds" multiple  collapse-tags filterable placeholder="可输入关键字查询" >
            <el-option
           
              v-for="item in carList"
              :key="item.id"
              :label="item.license"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="fenceForm.enable">
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
  <bot-card></bot-card>
</div>
</template>

<script>
  import JtDialog from '@/components/JtDialog'
  import fenceMap from './fenceMap'
  import botCard from './botCard'
  
  export default {
    name: "rightCard",
    components:{JtDialog, fenceMap, botCard},
    data() {
      return {
        fenceName:'',
        rcListShow:true,
        cardShow: true,
        toolShowIndex:"",
        listIndex:null,
        editState: false,
        activeName:'all',
        shape:"rectangle", // 形状
        fenceDate: [],
        fenceTime: '',
        defaultTime: [new Date(2016, 9, 10, 9, 0), new Date(2016, 9, 10, 18, 0)],
        fenceForm:{
          enable:1, //默认开启
          carIds:[],
          validDate: [],
          coordinateJson: [],
        },
        carList:[], //车辆列表
        fenceList:[], //围栏列表
         rules: {
          enclosureName: [
            { required: true, message: '请填写围栏名称', trigger: 'blur' },
          ],
          enclosureType: [
            { required: true, message: '请选择围栏类型', trigger: 'change' }
          ],
          enclosureCycle: [
            { required: true, message: '请选择周期', trigger: 'change' }
          ],
          validStarttime: [
            { required: true, message: '请选择有效时间段', trigger: 'change' }
          ],
          carIds: [
            { required: true, message: '请选择有效车辆', trigger: 'change' }
          ],
          validDate: [
            { required: true, message: '请自定义周期', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.getData('report/carList','POST').then(res => {
        this.carList=res.data
      });
     this.getfenceList();
    },
    methods: {
      shapeChange(val){
       this.$bus.$emit('shapeChange',val)
      },
      /**
       * 获取围栏列表数据
       */
      getfenceList(params) {
        this.getData('/enclosure/findList', 'post' ,params).then(res => {
          this.fenceList = res.data;
          this.$bus.$emit('drawInit', res.data)
        })
      },
      // 新增围栏
      addfence(){
        this.rcListShow=false
        this.emptyData() //清数据
      },
      // dakai列表
      openList(){
        this.rcListShow=true
      },
      // 围栏列表点击
      fenceListClick(index){
        if (this.$refs.fenceList[index].className === 'listActive') {
          this.listIndex = null;
        } else {
          this.listIndex = index;
        }
      },
      // tabs点击
      handleClick(){
        let param = {}
        if (this.activeName==='1') {
          param = {enclosureType: 1}
        }else if (this.activeName==='2') {
          param = {enclosureType: 2}
        }else if(this.activeName=='stop') {
          param = {enable: 0}
        }else {
           param = {};
        }
        this.getfenceList(param)
      },
      searchName() {
        let param = {enclosureName: this.fenceName}
        this.getfenceList(param)
      },
      // 新增编辑的提交按钮
      onSubmit(){
        var fenceData = JSON.parse(JSON.stringify(this.fenceForm));
        var Overlays = this.$refs.fenceMap.dataOverlays; //绘制的图形
        
        if (!Overlays||Overlays.length<=0) {
          Overlays = fenceData.coordinateJson // 初始值
        }else {
          Overlays = JSON.stringify(Overlays);
        }
        if (Overlays==='[]'||Overlays==='undefined'||Overlays===undefined) {
          this.$message({
          message: '请绘制围栏区域',
          type: 'warning',
          });
          return;
        }
        fenceData.coordinateJson = Overlays; //坐标点json字符串
        fenceData.carIds = fenceData.carIds.join();
        if (fenceData.enclosureCycle==4) {  // 自定义周期情况
          fenceData.validDate = fenceData.validDate.join();
        }else {
          fenceData.validDate = ""
        }
        
        this.$refs['fenceForm'].validate((valid) => {
          // 清理杂数据
           for (let key in fenceData) {
            if (fenceData[key]===null) {
              delete fenceData[key]
            }
          }
         
          if (valid) {
            // 判断是否是编辑状态
            let entry = 'add'
            if (this.editState) {
              entry = 'update'
            }else {
              entry = 'add'
            }
            this.getData('/enclosure/'+ entry, 'post', fenceData, true).then((res)=>{
              if (res.code==0) {
                this.getfenceList();
                this.cancel();

              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 取消
       */
      cancel() {
        this.rcListShow=true;
        this.fenceForm.carIds = this.fenceForm.carIds.join(',');
         if (this.fenceForm.enclosureCycle==4) {  // 自定义周期情况
        this.fenceForm.validDate = this.fenceForm.validDate.join(',');
        }
        this.$refs['fenceMap'].clearAll();
        this.$refs['fenceMap'].dataOverlays = [];
        // 关闭围栏编辑状态
        this.editState = false;
      },
      // 编辑
      Edit(item,index) {
        // 阻止冒泡事件
        event.stopPropagation();

        this.emptyData() //清数据

        this.fenceForm =JSON.parse(JSON.stringify(item));
        this.rcListShow = false;
        this.fenceTime = []
        this.fenceTime[0] = item.validStarttime;
        this.fenceTime[1] = item.validEndtime;

        // 字符串数组转换数组
        var carIdsArr = item.carIds.split(',');
        var newCarIds = [];
        carIdsArr.forEach((item,index) => {
          newCarIds.push(parseInt(item))
        });
        this.fenceForm.carIds = newCarIds;

        if (item.enclosureCycle==4&&item.validDate.length>0) { // 自定义周期情况
          // 字符串数组转换数组
          var validDateArr = item.validDate.split(',');
          var newValidDate = [];
          validDateArr.forEach((item,index) => {
            newValidDate.push(parseInt(item))
          });
          this.fenceForm.validDate = newValidDate;
        }else {
          this.fenceForm.validDate = [];
        }
        // 开启围栏编辑状态
        this.editState = true;
    
        // 执行列表click事件(只有在未被选中或切换围栏时才调用此方法，避免点击同一围栏重复操作)
        if ((!this.listIndex&&this.listIndex!=0)||index!==this.listIndex) {
          this.fenceListClick(index);
        }
      },
      // 删除
      Delete(id){
        // 阻止冒泡事件
        event.stopPropagation();
         this.$confirm('确定删除该条围栏数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.getData('/enclosure/delete', 'post',{id:id}, true).then((res)=>{
              if (res.code==0) {
                this.$message({
                message: '删除成功！',
                type: 'success'
                });
                this.getfenceList();
              }
            })
          })
      },
      /**
       * 清空表单数据
       */
      emptyData() {
        this.$refs['fenceForm'].clearValidate();
        this.fenceForm = {enable:1,carIds:[],validDate:[]};
        this.fenceTime = '';
      }
    },
    watch: {
      // fenceDate(val) {
      //   if (val) {
      //     this.fenceForm.validStartdate = val[0];
      //     this.fenceForm.validEnddate = val[1];
      //   }
      // },
      fenceTime(val) {
        if (val) {
          this.fenceForm.validStarttime = val[0];
          this.fenceForm.validEndtime = val[1];        
        }
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
