<template>
  <div class="carTable">
    <el-form :inline="true" :model="carTableForm" class="carTableForm-inline">
      <el-form-item label="车牌号">
        <el-input @keyup.native="carinputChange(carTableForm)" v-model="carTableForm.license"
                  placeholder="请输入车牌号" ></el-input>
      </el-form-item>
      <el-form-item label="所属机构/部门" class="orgBox">
        <jt-org-select ref="upOrgNameCar" @orgNodeClick="orgNameChange" @orgCurrent="orgCurrentcar"></jt-org-select>
      </el-form-item>
    </el-form>
    <div class="carTableBox">
      <jt-table ref="carTablecar" :tableData="carTableData">
        <div slot="tablePage">
          <jt-pager :pager="pagerCar" @handleSizeChange="handleSizeChange" @changeCurrentPage="changeCurrentPage"></jt-pager>
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
    name: "carTable",
    components: {JtTable, JtOrgSelect, JtPager},
    props:['carTableForm'],
    data() {
      return {
        carTableData:{
          checkStyle: false,
          list: [],
          headList: [
            {name: 'license', title: '车牌号',width:'120px'},
            {name: 'orgName', title: '所属机构/部门',width:'150px'},
            {name: 'modelName', title: '车型车款'},
          ],
          handleList: [
            {
              name: '绑定',
              handleFunc: (obj)=> {
                this.$emit('carBindFuc',obj)
              }
            }
          ],
          downList: []
        },
        pagerCar:{
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        }
      }
    },
    mounted() {
      this.carTableGet()
      this.$refs.upOrgNameCar.val.orgValue=this.carTableForm.orgName
    },
    methods: {
      /**
       *  获取设备表格数据
       */
      carTableGet(){
        this.getData('/car/page', 'post',{pageNum: this.pagerCar.currentPage,pageSize: this.pagerCar.pageSize, bindStatus:0}).then(res => {
          this.carTableData.list=res.data.pv.list
          this.pagerCar.total=res.data.pv.total
        }).catch(error => {
          console.log(error)
        })
      },
      orgCurrentcar(val){
        this.carTableForm.orgId=val.id
      },
      /**
       * 切换当前显示数量
       */
      handleSizeChange(val){
        this.pagerCar.pageSize=val
        this.carTableGet()
      },
      /**
       * 切换当前页数
       */
      changeCurrentPage(val){
        this.pagerCar.currentPage=val
        this.carTableGet()
      },
      /**
       * 监听车牌号输入
       * @param form 表单数据
       */
      carinputChange(form){
        this.getData('/car/page', 'post',{pageNum: this.pagerCar.currentPage,pageSize: this.pagerCar.pageSize, license:form.license, suborgId:this.$refs.upOrgNameCar.val.id, bindStatus:0}).then(res => {
          this.carTableData.list=res.data.pv.list
          this.pagerCar.total=res.data.pv.total
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 监听机构组织输入
       * @param data 机构节点数据
       */
      orgNameChange(data){
        this.getData('/car/page', 'post',{pageNum: this.pagerCar.currentPage,pageSize: this.pagerCar.pageSize, license:this.carTableForm.license, suborgId:data.id,bindStatus:0}).then(res => {
          this.carTableData.list=res.data.pv.list
          this.pagerCar.total=res.data.pv.total
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .carTable {
    width: 100%;
    padding: 0px 20px 20px 20px;
    .carTableForm-inline{
      .el-input__inner {
        width: 180px;
        height: 28px;
        line-height: 28px;
      }
    }
    .carTableForm-inline>.orgBox>.el-form-item__content > .jt-org-select > .el-input > .el-input__inner {
      width: 193px;
    }
  }

</style>
