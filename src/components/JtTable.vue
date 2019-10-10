<template>
  <div class="jt-table">
    <el-table
      :data="tableData.list"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!--选择栏-->
      <el-table-column type="selection" width="55"
                       v-if="tableData.checkStyle"></el-table-column>

      <!--数据栏-->
      <el-table-column :prop="item.name" class="table-head" v-for="item in tableData.headList" :key="item.name"
                       title="123131" :label="item.title" :width="item.width?item.width:''"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div v-if="tableData.signStyle&&(item.title==='标题'||item.title==='车牌号')">
            <p v-if="scope.row.sign" style="width:6px;height: 6px;margin-left:4px;border-radius: 3px;background-color: #a5b6c9;display: inline-block"></p>
            <p v-if="!scope.row.sign" style="width:6px;height: 6px;margin-left:4px;border-radius: 3px;background-color: #409EFF;display: inline-block"></p>
            <span style="margin-left: 10px">{{scope.row[item.name]}}</span>
          </div>
          <span v-else>{{scope.row[item.name]}}</span>
        </template>
      </el-table-column>

      <!--操作-->
      <el-table-column v-if="tableData.handleList" fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <!--{{scope.row}}-->
          <el-button
            v-for="(item,index) in tableData.handleList"
            :key="item.name"
            v-if="!item.show"
            @click.native.prevent="item.handleFunc(scope,tableData.list)"
            type="text"
            size="small">
            {{((item.name==='车辆绑定'||item.name==='设备绑定')&&(scope.row.bindStatus==='绑定'||scope.row.bindStatus===1)&&index===1)?'解绑':
            ((((item.name==='停运')&&(scope.row.status!='正常')&&index===2)?'恢复运营':
            (((item.name==='启用')&&(scope.row.enable==='启用')&&index===1)?'停用':
            ((item.name==='标记已读')&&(scope.row.sign===1)&&(index===0||index===1))?'': item.name)))}}
            <!--{{item.name}}-->
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-bottom">
      <el-upload
        class="fn-btn-xlsx"
        v-if="tableData.upUrl"
        style="display:inline-block;border:none"
        :action="'/fms-web/'+tableData.upUrl"
        :on-success="onSuccess"
        :show-file-list="false"
      >
        <el-button class="fn-btn-xlsx">批量导入</el-button>
      </el-upload>
      <el-button class="fn-btn-xlsx" @click="fileExport" v-if="tableData.upload">批量导出</el-button>
      <el-button class="fn-btn-xlsx" @click="getTemplate" v-if="tableData.templateUrl">下载模板</el-button>
      <div class="table-btn" v-if="tableData.downList">
        <el-button class="fn-btn-xlsx" v-for="item in tableData.downList"  v-if="!item.show"
                   @click="item.handleFunc" :key="item.name">
          {{item.name}}
        </el-button>
      </div>
      <div class="table-page">
        <slot name="tablePage"></slot>
      </div>
    </div>
  </div>
</template>
<script>
  import { export2Excel, fileDownload } from '@/vendor/index'
  import axios from 'axios'

  export default {
    name: 'JtTable',
    props: ['tableData'],
    data() {
      return {
        selection: ''
      }
    },
    methods: {
      /*
      *导出
      **/
      fileExport() {
        export2Excel(this.tableData, '导出列表')
      },
      /*
      *导入
      **/
      onSuccess(data) {
        if (data.msg === '成功') {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          setTimeout(() => {
            location.reload()
          }, 0.5)
        } else {
          this.$message.error('导入失败')
        }
      },
      /**
       * 下载模板
       */
      getTemplate() {
        const url = '/fms-web' + this.tableData.templateUrl
        axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
          const name = Math.random().toString(36).substr(2)
          const filename = name + '.xlsx'
          fileDownload(res.data, filename)
        })
      },
      handleSelectionChange(val) {
        this.$emit('tableSelectionChange', val)
      }
    }
  }
</script>

<style scoped>
  .table-bottom {
    margin-top: 20px;
  }

  .jt-table {
    background-color: white;
    padding: 0px 0px 80px 0;
  }

  .table-page {
    float: right;
  }

  .table-btn {
    float: left;
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  .jt-table {
    .el-table tr:nth-child(2n) {
      background-color: #f2f7ff;
    }
  }

  .el-table th {
    padding: 8px 0;
    background: #eef7ff;
    color: #7595c5;
    font-size: 12px;
  }

  .el-table td {
    padding: 8px 0;
    font-size: 12px;
  }
</style>
