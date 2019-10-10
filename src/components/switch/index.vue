<template>
  <el-switch
    v-model="value"
    :inactive-text="Switchdata.label"
    :class="Switchdata.class"
    @change="changeSwitch"
  >
  </el-switch>
</template>

<script>
  export default {
    props: ['Switchdata'],
    data() {
      return {
        value: true
      }
    },
    mounted() {
    },
    methods: {
      changeSwitch(val) {
        this.$emit('changeSwitch', val,this.Switchdata.id)
      }
    }
  }
</script>
<style>

</style>
