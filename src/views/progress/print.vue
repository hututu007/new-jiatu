<template>
  <div class="print-card">
    <div ref="printCard">
      <h1>公务用车审批单(市内)</h1>
      <p class="tit">{{time}}</p>
      <table>
        <tr>
          <th rowspan="7"><span style="width: 16px;display:inline-block">出行申请详细</span></th>
          <th>用车人</th>
          <td colspan="2">{{data.usemanName}}</td>
          <th>用车部门</th>
          <td colspan="2">{{data.orgName}}</td>
        </tr>
        <tr>
          <th>用车事由</th>
          <td colspan="5">{{data.useReason}}</td>
        </tr>
        <tr>
          <th>路线</th>
          <td colspan="5">{{data.startAddress+' 至 '+data.stopAddress}}</td>
        </tr>
        <tr>
          <th>人数</th>
          <td colspan="5">{{data.passengerNum?data.passengerNum+'人':'--'}}</td>
        </tr>
        <tr>
          <th>用车时间</th>
          <td colspan="5">{{data.preStartTime+' 至 '+data.preStopTime}}</td>
        </tr>
        <tr>
          <th>是否需要驾驶员</th>
          <td colspan="2">{{data.needDriver===0?'不需要':(data.needDriver===1?'需要':'--')}}</td>
          <th>是否紧急</th>
          <td colspan="2">{{data.urgency===0?'否':(data.urgency===1?'是':'--')}}</td>
        </tr>
        <tr>
          <th>车牌号</th>
          <td colspan="2">{{data.license?data.license:'--'}}</td>
          <th>驾驶员</th>
          <td colspan="2">{{data.driverName?data.driverName:'--'}}</td>
        </tr>
        <tr>
          <th rowspan="2">部门领导意见</th>
          <td colspan="3" rowspan="2"></td>
          <th rowspan="2">备注</th>
          <td colspan="3" rowspan="2">{{data.remark?data.remark:'--'}}</td>
        </tr>
      </table>
    </div>
    <p class="print">
      <el-button type="primary" size="small" @click.native="PrintCardFuc">打印</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    props: ['data'],
    name: "print",
    data() {
      return {
        time: ''
      }
    },
    created() {
      this.$bus.$on('changeTime',(now)=>{
        var year = now.getFullYear(); //获取年份
        var month = now.getMonth(); //获取月份 月份要+1
        var date = now.getDate(); //获取日期
        var hour = now.getHours(); //获取时
        var minu = now.getMinutes(); //获取分钟
        this.time=year+'年'+month+'月'+date+'日'+hour+'时'+minu+'分'
      })
    },
    methods: {
      PrintCardFuc() {
        this.$print(this.$refs.printCard)
      },
    }
  }
</script>

<style scoped>
  body{
    height: auto;
  }
  .print-card {
    width: 904px;
    font-size: 14px;
    color: #333;
  }

  h1 {
    width: 100%;
    height: 50px;
    text-align: center;
    font-weight: 500;
  }

  .tit {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    text-align: right;
  }

  table, table tr th, table tr td {
    border: 1px solid #666;
  }

  table {
    width: 100%;
    height: 450px;
    text-align: center;
    border-collapse: collapse;
  }

  table > tr > td {
    width: 120px;
    height: 50px;
  }

  table > tr > th {
    width: 120px;
    height: 50px;
  }

  .print {
    width: 100%;
    text-align: center;
    margin-top: 30px;
  }

</style>
