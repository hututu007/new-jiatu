<template>
    <el-tooltip class="item" effect="dark" :content="content" placement="top">
        <i class="el-icon-info iconcolor"></i>
    </el-tooltip>  
</template>
<script>
export default {
  props: {
    content: {
      type: String
    }
  },
  data() {
    return {}
  }
}
</script>
<style >
.iconcolor {
  color: #55a8fd;
  margin-left: 8px;
  font-size: 16px;
}
</style>


