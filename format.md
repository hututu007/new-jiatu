
<!-- 封装公用请求接口 -->

this.getData(url,method,字段对象,'是否需要提示boolean').then(res=>{

}).catch(error=>{
    console.log(error)
})

<!-- 文字提示组件 -->  src\components\Tooltips

时间过滤器   datetime （全局）   参数:type:传入时间格式  'hh:mm:ss'  , 'yy:MM:dd hh:mm:ss'  默认为时间格式

v-model不支持调用过滤器
所以调用datetime（）方法进行过滤   import { datetime } from '@/utils/filters'


状态值转换方法 ：
import { status } from '@/utils/index'
status(statusNum, obj)
参数：statusNum:当前状态值
      obj: 状态对象 {0："开启", 1:"关闭"}


<!-- title组件 -->  src\components\JtTitle
 左边和右边均可以传类型，详情请细看-基本上每个页面都会用到，复杂的模块可以写在slot里面
 
 <!-- 弹窗组件 -->  src\components\JtDialog
 
 <!-- 机构组织选择下拉框 -->  src\components\JtOrgSelect
 
 <!-- 分页组件 -->  src\components\JtPager
 
 <!-- 表格组件 -->  src\components\JtTable

 
 <!-- 机构/部门，选项组件 -->
import JtOrgSelect from '@/components/JtOrgSelect'
<jt-org-select  @orgCurrent="orgCurrent"  width='193px' :treeValue=''></jt-org-select>
orgCurrent： 回调函数，返回选中项绑定值orgid (Array类型)
treeValue： 初始绑定值，orgid (Array类型)、
width： 宽度


