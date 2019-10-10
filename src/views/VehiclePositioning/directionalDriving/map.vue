<template>
    <div id="map_container"></div>
</template>

<script>

export default {
  mounted() {
    this.map = new BMap.Map("map_container");
    this.map.centerAndZoom(new BMap.Point(106.506447, 29.614564), 16); //默认重庆经纬度
    this.map.enableScrollWheelZoom(true);
    this.map.addControl(new BMap.OverviewMapControl());    //添加缩略地图控件
  }
}
</script>

<style>
#map_container {
  width: 100%;
  height: calc(100vh - 60px);
}
</style>
