<template>
  <div class="route"  style="width: 100%;height: 100%">
    <!-- 地图组件 -->
    <map-view></map-view>
    <left-card></left-card>
  </div>
</template>

<script>
  import leftCard from './leftCard'
  import mapView from './rpoint'
  import {realPlace} from './filters'
  export default {
    name: "route",
    components: {mapView, leftCard},
    data() {
      return {}
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style scoped>
  .route{
    position: relative;
  }
</style>
