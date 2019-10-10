<template>
  <div class="editor">
    <!-- 图片上传组件辅助-->
    <el-upload
      class="avatar-uploader"
      :action="serverUrl"
      name="img"
      :headers="header"
      style="display: none;"
      :show-file-list="false"
     >
    </el-upload>
    <!--富文本编辑器组件-->
    <el-row>
      <quill-editor
        v-model="Content"
        ref="myQuillEditor"
        :options="editorOption"
      >
        <!-- @change="onEditorChange($event)"
        @ready="onEditorReady($event)"-->
      </quill-editor>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        serverUrl: '', // 这里写你要上传的图片服务器地址
        header: { token: sessionStorage.token }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
        Content: '', // 富文本内容
        editorOption: {} // 富文本编辑器配置
      }
    },
    created(){
      this.$bus.$on('contentFuc',(val)=>{
        if(val){
          this.Content=val
        }else {
          this.Content=''
        }

      })
    },
    methods: {
      // onEditorChange(val) {
      //   this.$emit('onEditorChange',this.Content)
      // },
      // onEditorReady(val){
      //   console.log(val)
      // }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .editor{
    .ql-editor{
      height: 182px;
      overflow: auto;
    }
  }

</style>
