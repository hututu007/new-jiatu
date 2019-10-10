<template>
  <div class="eqTable">
    <el-form :inline="true" :model="eqTableForm" class="eqTableForm-inline">
      <el-form-item label="设备号">
        <el-input @keyup.native="eqinputChange(eqTableForm)" v-model="eqTableForm.din"
                  placeholder="请输入设备号" ></el-input>
      </el-form-item>
      <el-form-item label="所属机构/部门" class="orgBox">
        <jt-org-select ref="upOrgNameEq" @orgNodeClick="orgNameChange" @orgCurrent="orgCurrenteq"></jt-org-select>
      </el-form-item>
    </el-form>
    <div class="eqTableBox">
      <jt-table ref="carTableEq" :tableData="eqTableData">
        <div slot="tablePage">
          <jt-pager :pager="pagerEq" @handleSizeChange="handleSizeChange" @changeCurrentPage="changeCurrentPage"></jt-pager>
        </div>
      </jt-table>
    </div>
  </div>
</template>

<script>
  import JtTable from '@/components/JtTable'
  import JtOrgSelect from '@/components/Jtorgselect'
  import JtPager from '@/components/JtPager'
  export default {
    name: "eqTable",
    components: {JtTable, JtOrgSelect, JtPager},
    props:['eqTableForm'],
    data() {
      return {
        eqTableData:{
          checkStyle: false,
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
        pagerEq:{
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
      this.$bus.$on('bindYes',()=>{
        this.eqTableGet()
      })
    },
    mounted() {
      this.eqTableGet()
      this.$refs.upOrgNameEq.val.orgValue=this.eqTableForm.orgName
    },
    methods: {
      /**
       *  获取设备表格数据
       */
      eqTableGet(){
        this.getData('/device/devicePage', 'post',{pageNum: this.pagerEq.currentPage,pageSize: this.pagerEq.pageSize}).then(res => {
          this.eqTableData.list=res.data.list
          this.pagerEq.total=res.data.total
        }).catch(error => {
          console.log(error)
        })
      },
      orgCurrenteq(val){
        this.eqTableForm.orgId=val.id
      },
      /**
       * 切换当前显示数量
       */
      handleSizeChange(val){
        this.pagerEq.pageSize=val
        this.eqTableGet()
      },
      /**
       * 切换当前页数
       */
      changeCurrentPage(val){
        this.pagerEq.currentPage=val
        this.eqTableGet()
      },
      /**
       * 监听设备号输入
       * @param form 表单数据
       */
      eqinputChange(form){
        this.getData('/device/devicePage', 'post',{pageNum: this.pagerEq.currentPage,pageSize: this.pagerEq.pageSize, din:form.din, suborgId:this.$refs.upOrgNameEq.val.id}).then(res => {
          this.eqTableData.list=res.data.list
          this.pagerEq.total=res.data.total
        }).catch(error => {
          console.log(error)
        })
      },
      orgNameChange(data){
        this.getData('/device/devicePage', 'post',{pageNum: this.pagerEq.currentPage,pageSize: this.pagerEq.pageSize, din:this.eqTableForm.din, suborgId:data.id}).then(res => {
          this.eqTableData.list=res.data.list
          this.pagerEq.total=res.data.total
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .eqTable {
    width: 100%;
    padding: 0px 20px 20px 20px;
    .eqTableForm-inline{
      .el-input__inner {
        width: 180px;
        height: 28px;
        line-height: 28px;
      }
    }
    .eqTableForm-inline>.orgBox>.el-form-item__content > .jt-org-select > .el-input > .el-input__inner {
      width: 193px;
    }
  }

</style>
