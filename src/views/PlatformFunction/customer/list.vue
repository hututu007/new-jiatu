<template>
  <div class="publicTable">
    <div class="publicTable-form">
      <el-form :inline="true" :model="searchForm" class="searchForm-inline">
        <el-form-item label="企业名称">
          <el-input placeholder="请输入名称" v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建日期">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="开始日期" style="width: 100%;" value-format="yyyy-MM-dd" v-model="searchForm.startTime" ></el-date-picker>
            </el-col>
            <div class="line" :span="2" style="float: left;margin-left: 15px;margin-right: 9px">-</div>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="结束日期" style="width: 100%;" value-format="yyyy-MM-dd" v-model="searchForm.stopTime"></el-date-picker>
            </el-col>
            </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="getTableData">查询</el-button>
          <el-button class="fn-btn-reset" size="mini" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="Table">
      <jt-table ref="Table" @tableSelectionChange="tableSelectionChange" :tableData="TableData" width="100px">
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
  import { datetime } from '@/utils/filters'
  import { status } from '@/utils/index'

  export default {
    components:{JtOrgSelect, JtTable, JtPager},
    data() {
      return {
        value:"",
        searchForm: {
          pageNum:1,
          pageSize:10,
        },
        TableData: {
          checkStyle: true,
          list: [],
          headList: [
            {name: 'code', title: '企业序号',width:"180px"},
            {name: 'name', title: '企业名称',width:"180px"},
            {name: 'groupName', title: '平台名称',width:"180px"},
            {name: 'expireDate', title: '到期时间',width:"180px"},
            {name: 'linkMan', title: '联系人',width:"180px"},
            {name: 'linkPhone', title: '联系电话',width:"180px"},
            {name: 'address', title: '企业地址',width:"180px"},
            {name: 'statusName', title: '状态',width:"180px"},
          ],
          handleList: [
            {
              name: '编辑',
              handleFunc: (obj) => {
                console.log(obj.row);

                this.$bus.$emit('editCustomer',obj.row)
                // this.$router.push({
                //   path: '/platform-function/customer',
                //   query: {
                //     id: obj.row.id
                //   }
                // })
                // // 跳转到客户信息
                // this.$emit('goFirst')
              }
            },
          ],
          upload: true,
        },
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 10
        },
        yearAddForm:{
          mark:'',
          license:'',
          price:'',
          mile:'',
          buyDate:'',
          id:''
        },
        nodeId: ''
      }
    },
    methods: {
      // 请求表格数据
      getTableData(){
      this.getData('/org/group/page', 'post',this.searchForm).then(res => {
          if (res.code === 0) {
            let list = res.data.list;
            for (let i = 0; i < list.length; i++) {
              list[i].statusName =  list[i].status?status( list[i].status,{1:"启用",2:'停用',3:'冻结'}):""
              list[i].expireDate = datetime(list[i].expireDate)
            }
            this.TableData.list = res.data.list
          }
          }).catch(error => {
            console.log(error)
      })
      },
            // 页码切换
      changeCurrentPage(nowPage){
          this.searchForm.pageNum = nowPage;
          this.getTableData();
      },
      // 单页查询条数选择
      handleSizeChange(pageSize){
          this.searchForm.pageSize = pageSize;
          this.getTableData();
      },
      inputChange() {},
      carYearSearch() {},
      resetForm() {
        this.searchForm = {
          pageNum:1,
          pageSize:10,
        }
        this.getTableData()
      },
      tableSelectionChange(){},
    },
    created(){
      this.getTableData()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .publicTable {
    .publicTable-form {
      .searchForm-inline {
        .el-form-item__label {
          font-size: 12px;
        }
        .el-input__inner {
          width: 193px;
          height: 28px;
          font-size: 12px;
          line-height: 28px;
        }
        .range {
          padding: 0px 10px;
        }
        .range > .el-input__icon {
          line-height: 28px;
        }
        .range > input {
          font-size: 12px;
        }
        .range > span {
          font-size: 12px;
          padding: 0px 14px 0px 5px;
        }
      }
      .orgBox > .el-form-item__content > .jt-org-select > .el-select > .el-input > .el-input__inner {
        width: 193px;
      }
    }
    #yearAddForm{
      .el-form-item__label{
        width: 110px;
        font-size: 12px;
      }
      .el-input__inner{
        height: 28px;
      }
    }
  }

</style>
