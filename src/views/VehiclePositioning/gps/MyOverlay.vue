<template>
    <bm-overlay
    pane="markerPane"
    :class="{sample: true}"
    @draw="draw"
    >
    <div></div>
    </bm-overlay>
</template>

<script>
export default {
  props:['locationObj'],
  data() {
    return {
      opts:""
    }
  },
  methods: {
    draw ({el, BMap, map}) {
      this.opts = {el, BMap, map}
      const {lng, lat} = {lng: this.locationObj.longitude,lat: this.locationObj.latitude};
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x -55 + 'px'
      el.style.top = pixel.y -55 + 'px'
    },
  },
  watch: {
    locationObj() {
      if (this.opts) {
        this.draw(this.opts)
      }
    }
  }
}
</script>

<style scoped>
.sample {
  width: 110px;
  height: 110px;
  border-radius: 100%;
  background: #55a8fd;
  position: absolute;
  opacity: 0.3;
  z-index: -1;
}
</style>

