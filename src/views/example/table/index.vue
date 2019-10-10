<template>
  <div class="app-container">
    <!--弹框demo-->
    <p> 111--弹框demo</p>
    <button @click="dialogClick">点击</button>
    <jt-dialog :dialog-show.sync="dialogShow" :title="title">
      <div slot="dialog">
        11111
      </div>
    </jt-dialog>
     <!--分页demo-->
    <p>222-分页demo</p>
    <el-table v-loading="loadingShow" :data="pageCourseList" style=""
              class="course-table-list">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column align="center" prop="courseId" label="1"></el-table-column>
      <el-table-column align="center" prop="schoolName" label="2"></el-table-column>
      <el-table-column align="center" prop="courseName" label="3"></el-table-column>
      <el-table-column align="center" prop="courseLevel" label="4"></el-table-column>
      <el-table-column align="center" prop="courseDescription" label="5"></el-table-column>
      <el-table-column align="center" prop="totalPeriod" label="6"></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="success" size="mini"
                     @click="viewSingleCourseInfo(scope.$index, scope.row)"
                     class="local-btn-success">查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <jt-pager :pager="pager" @changeCurrentPage="changeCurrentPage"></jt-pager>
    <!--搜索框demo-->
    <p>333-搜索框demo</p>
    <jt-search-data :searchData="searchData" @clickSearch="searchList"
                    @clickReset="resetList" style="margin: 30px auto 0; line-height: 50px;">
      <div slot="search">
        <el-input v-model="searchData.schoolName" placeholder="输入学校名称"></el-input>
        <el-input v-model="searchData.courseName" placeholder="输入课程名称"></el-input>
      </div>
    </jt-search-data>
    <!--搜索弹框demo-->
    <p>444-搜索弹框</p>
    <jt-select-dialog @click-sure="handleSchoolId"></jt-select-dialog>
  </div>
</template>

<script>
  import JtDialog from '@/components/JtDialog'
  import JtPager from '@/components/JtPager'
  import JtSearchData from '@/components/JtSearchData'
  import JtSelectDialog from '@/components/JtSelectDialog'
  export default {
    components: {JtDialog, JtPager, JtSearchData, JtSelectDialog},
    data() {
      return {
        list: null,
        title:'弹框1',
        loadingShow:true,
        pageCourseList:[
          {
            "courseId": "101",
            "schoolName": "第一小学",
            "courseName": "数学",
            "courseLevel": "国家课程",
            "courseDescription": "本课程学习",
            "totalPeriod": "160"
          },
          {
            "courseId": "102",
            "schoolName": "第一小学",
            "courseName": "美术",
            "courseLevel": "国家课程",
            "courseDescription": "本课程学辑思维",
            "totalPeriod": "160"
          },
          {
            "courseId": "103",
            "schoolName": "第二小学",
            "courseName": "自然",
            "courseLevel": "国家课程",
            "courseDescription": "的义在于：培养学生的数学逻辑思维",
            "totalPeriod": "30"
          },
          {
            "courseId": "104",
            "schoolName": "第一小学",
            "courseName": "张三",
            "courseLevel": "国家课程",
            "courseDescription": "的数学逻辑思维",
            "totalPeriod": "120"
          },
          {
            "courseId": "104",
            "schoolName": "第一小学",
            "courseName": "张三",
            "courseLevel": "国家课程",
            "courseDescription": "习的重要意义在于：培",
            "totalPeriod": "120"
          }
        ],
        pager: {
          // 总数据条数
          total: 0,
          // 当前页
          currentPage: 1,
          // 每页数据size
          pageSize: 5
        },
        // 搜索数据
        searchData: {
          // 学生姓名
          studentName: '',
          // 学生id
          studentId: '',
          currentPage: 1,
          pageSize: 5
        },
        schoolId: [],
      dialogShow: false
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    methods: {
      // 获取数据以及加载显示
      getCourseList () {
        this.loadingShow = true
        setTimeout(()=>{
          if(this.pageCourseList){
            this.loadingShow = false
          }
        },2000)

      },
      // 点击出现弹框
      dialogClick() {
        this.dialogShow = true
      },
      // 分页切换
      changeCurrentPage(val){
        this.getCourseList()
      },
      // 搜索查询
      searchList(){

      },
      // 重置查询
      resetList(){

      },
      // 列表单个查看
      viewSingleCourseInfo(){

      },
      handleSchoolId (data) {
        this.schoolId = data
      }
    },
    mounted(){
      this.getCourseList()
      this.pager={
        total: 10,
        // 当前页
        currentPage: 1,
        // 每页数据size
        pageSize: 5
      }
    }
  }
</script>
