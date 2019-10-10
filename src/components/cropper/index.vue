<template>
  <div class="cutting_box">
    <el-upload
      ref="upload"
      class="avatar-uploader"
      :with-credentials="true"
      action=" "
      :show-file-list="false"
      :on-preview = "qwe"
      :before-upload="beforeAvatarUpload">
      <el-button size="small" type="primary">选择图片</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，拖拽图片可进行图片的裁剪！</div>
    </el-upload>
    <vueCropper
      ref="cropper"
      :img="options.img"
      :autoCrop="options.autoCrop"
      :autoCropWidth="options.autoCropWidth"
      :autoCropHeight="options.autoCropHeight"
      :fixedBox="options.fixedBox"
      :canMoveBox="options.canMoveBox"
      :canMove="options.canMove"
      :outputType="options.outputType"
      :canScale="options.canScale"
      @realTime="realTime"
      :style="{'width': '150px','height':'150px','float':'left','margin-top':'47px'}"
    ></vueCropper>
    <div class="preview-box">
      <p>logo预览</p>
      
      <div class="show-preview"
           :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px','border-radius':'20px','margin-right':'20px'}">
        <div :style="previews.div">
          <img :src="previews.url" :style="previews.img">
        </div>
      </div>
      <div class="show-preview"
           :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px','border-radius':'100%'}">
        <div :style="previews.div">
          <img :src="previews.url" :style="previews.img">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropper'
  import axios from 'axios'
  import request from '@/utils/request'

  export default {
    name: 'cropper',
    props:['imgUrl'],
    components: {
      VueCropper
    },
    data() {
      return {
        options: {
          img:'',
          autoCrop: true,
          autoCropWidth: 150,
          autoCropHeight: 150,
          fixedBox: true,
          canMove: true,
          canMoveBox: false,
          outputType: 'png,jpg,jpeg,gif',
          canScale: true
        },
        previews: {}
      }
    },
    methods: {
      beforeAvatarUpload(file) {
        this.options.img = URL.createObjectURL(file)
      },
      // 实时预览函数
      realTime(data) {
        this.previews = data
      },
      qwe(file) {
        
      },
            /**
       * base64转换file
      */ 
      convertBase64UrlToFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
              while(n--){
                  u8arr[n] = bstr.charCodeAt(n);
              }
              return new File([u8arr], filename, {type:mime});
      },
      //   执行裁剪
      cutting(callback) {
        if (!this.options.img) {
          this.$message({
            message: '请选择图片！',
            type: 'warning'
          });
          return
        }
        this.$refs.cropper.getCropData((data) => {
          
            // 参数data为base64文件格式
            // window.URL.createObjectURL(data); 图片转换
            const file = this.convertBase64UrlToFile(data , 'logo.png')
            let formData = new FormData;
            formData.append('file', file);
               request({
                    url: '/upload/image/org/logo',
                    method: 'post',
                    data: formData,
                    ContentType: 'multipart/form-data'
                }).then((res) =>{
                  callback(res.data);
                })
        })
      },
    },
    watch: {
      imgUrl(url) {
        this.options.img = url;
      }
    }
  }
</script>

<style scoped>
  img {
    margin: 0;
    padding: 0;
  }

  .preview-box {
    width: 400px;
    height: 230px;
    display: inline-block;
    background: #f6f8f9;
    overflow: hidden;
    margin-left: 30px;
    color: #666666;
    padding: 0 0 0 15px;
  }

  .show-preview {
    display: inline-block;
  }
</style>


