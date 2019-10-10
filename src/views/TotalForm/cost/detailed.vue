<template>
<div class="app-container detailed">
    <div class="header">
      <i class="el-returnicon el-icon-arrow-left" @click="$router.back(-1)" ></i>
      <span>返回</span>
    </div>
    <div class="title"  >
        <h3 class="text" >公务用车车辆费用汇总表{{deliverDate[0]+'年'+deliverDate[1]+'月'}}</h3>
        <el-button type="primary" class="el-icon--right" size="mini" @click="exportExcel">导出</el-button>
    </div>
     <div style="overflow-y: auto;max-height: 700px;width:100%;padding: 20px; text-align: center;">
      <el-table
        :data="detailedData.list"
        id="out-table"
        >
        <el-table-column
          header-align="center"
          v-for="item in detailedData.thead"
          :key="item.id"
          :prop="item.prop"
          :label="item.label"
          width="150">
            <el-table-column
             header-align="center"
            v-for="child in item.childList"
            :key="child.id"
            :prop="child.prop"
            :label="child.label"
            width="150">
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作"  fixed="right" width="150"  header-align="center">
          <template slot-scope="scope">
              <el-button
              size="mini" @click="Detailed(scope.row.license)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</div>
</template>
<script>
import { export2Excel } from '@/vendor/index'

export default {
  components: {
  },
  data () {
    return {
      detailedData:{
        thead:[],
        list:[]
      },
      deliverDate:"",
    }
  },
  methods: {
    exportExcel() {
      let tabledata = this.detailedData;
      tabledata = JSON.stringify(tabledata)
      tabledata = tabledata.replace(/datalist/g, 'list')
      tabledata = tabledata.replace(/thead/g, 'headList')
      tabledata = tabledata.replace(/label/g, 'title')
      tabledata = tabledata.replace(/prop/g, 'name')
      tabledata = tabledata.replace(/childList/g, 'children')
      tabledata = JSON.parse(tabledata)
      
      export2Excel(tabledata, '导出列表')
       /* generate workbook object from table */
        //  var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
        //  /* get binary string as output */
        //  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        //  try {
        //      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
        //  } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
        //  return wbout
    },
    Detailed(license){
      this.$router.push({
        path:'carDetailed',
        query: {
          license: license,
          date:this.$route.query.date
        }
      })
    },
  },
  created(){
    
    if (this.$route.query.carIds.length==0) {
      alert('请选择车辆！')
    }
    this.deliverDate = this.$route.query.date.split('-');
      this.getData('/report/costreportformonth', 'post', {month:this.$route.query.date,carIds:this.$route.query.carIds}).then((res) => {
        this.detailedData.thead = res.data[0].column;
        this.detailedData.list = res.data[1].row;
      })
  }
}
</script>

<style lang="scss">
.detailed {
.el-returnicon {
  content: '';
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: inline-block;
  margin-right: 5px;
  position:relative;
  background-position-x: 149px;
  box-shadow: 0 0 10px 1px rgba(90, 90, 90, 0.18);
  border-radius: 30px;
  transform:translateY(4%);
}
.header {
  border-bottom: 1px solid #ebeef5;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  color: rgb(131, 149, 171);
  span {
    font-size: 12px;
  }
}
.title {
  height: 50px;
  line-height:50px;
  margin:20px 0;
  text-align: center;
  .text {
    font-size: 16px;
    font-weight: bold;
    color: rgb(144, 147, 153);
  }
  .el-icon--right {
    position: relative;
    top: -38px;
    right: 20px;
  }
}
.out-table {
  width: 100%;
}
}
</style>
