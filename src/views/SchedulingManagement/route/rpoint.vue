<!-- 地图组件 -->
<template>
  <div class="rpoint">
    <div id="map_container"></div>
  </div>
</template>

<script>
  export default {
    name: "rpoint",
    props: [],
    data() {
      return {
        PointArr: '',
        map: "", //地图
        mapPoints: [], // 途经点集合
        mapPoints1: [],
        val: { // 前往点集合
          startPoint: {},
          duringPoints: [],
          stopPoint: {}
        },
        val1: { // 返回点集合
          startPoint: {},
          duringPoints: [],
          stopPoint: {}
        },
        tabIndex: '0',
        placeSort: 0, // 起点0，途径点1，终点2
        cnPlaceSort: 0,
        duringIndex: 0,
        deleteDuringIndex: 0,

        duringList: [], // 具体地点集合
        duringList1: [],
        p1: {lng: null, lat: null}, // 起点终点
        p2: {lng: null, lat: null},
        rp1: {lng: null, lat: null},
        rp2: {lng: null, lat: null},
        geoc: '',
        searchList: [],
        text:'',
        openRoute:false,
      }
    },
    created() {
      // 添加起点和终点focus
      this.$bus.$on('placeSort', (data, index) => {
        this.openRoute=false
        this.tabIndex = index
        this.placeSort = data
      })
      // 添加途径点
      this.$bus.$on('duringPlaceSort', (index, tabindex) => {
        this.openRoute=false
        this.tabIndex = tabindex
        this.duringIndex = index
        this.placeSort = 1
      })
      // 删除途径点index
      this.$bus.$on('deleteOne', (index, tabindex) => {
        console.log(this.mapPoints)
        this.tabIndex = tabindex
        this.deleteDuringIndex = index
        if (this.tabIndex === '0') { // 前往
          this.mapPoints.splice(index, 1)
          this.val.duringPoints = this.mapPoints
          this.map.clearOverlays();
          this.drawMapFuc(this.val.startPoint, this.val.stopPoint, this.val.duringPoints)
        } else if (this.tabIndex === '1') { // 返回
          this.mapPoints1.splice(index, 1)
          this.val1.duringPoints = this.mapPoints1
          this.map.clearOverlays();
          this.drawMapFuc(this.val1.startPoint, this.val1.stopPoint, this.val1.duringPoints)
        }
      })
      // 删除终点站标志
      this.$bus.$on('deleteStop', (data, index) => {
        this.tabIndex = index
        if (this.tabIndex === '0') {
          if (data === 1) {
            this.p2 = {lng: null, lat: null}
            this.val.stopPoint = this.p2
            this.map.clearOverlays();
            this.drawMapFuc(this.val.startPoint, this.val.stopPoint, this.val.duringPoints)
          }
        } else if (this.tabIndex === '1') {
          if (data === 1) {
            this.rp2 = {lng: null, lat: null}
            this.val1.stopPoint = this.rp2
            this.map.clearOverlays();
            this.drawMapFuc(this.val1.startPoint, this.val1.stopPoint, this.val1.duringPoints)
          }
        }
      })
      // 删除起点站标志
      this.$bus.$on('deleteStart', (data, index) => {
        this.tabIndex = index
        if (this.tabIndex === '0') {
          if (data === 1) {
            this.p1 = {lng: null, lat: null}
            this.val.startPoint = this.p1
            this.map.clearOverlays();
            this.drawMapFuc(this.val.startPoint, this.val.stopPoint, this.val.duringPoints)
          }
        } else if (this.tabIndex === '1') {
          if (data === 1) {
            this.rp1 = {lng: null, lat: null}
            this.val1.startPoint = this.rp1
            this.map.clearOverlays();
            this.drawMapFuc(this.val1.startPoint, this.val1.stopPoint, this.val1.duringPoints)
          }
        }
      })
      // 点击tabs地图切换渲染
      this.$bus.$on('tabClick', (index, data) => {
        if (index === '0') { // 前往
          this.val = data
          this.map.clearOverlays();
          this.drawMapFuc(this.val.startPoint, this.val.stopPoint, this.val.duringPoints)
        } else if (index === '1') { // 返回
          this.val1 = data
          this.map.clearOverlays();
          this.drawMapFuc(this.val1.startPoint, this.val1.stopPoint, this.val1.duringPoints)
        }
      })
      // 编辑路线传过来的数据 this.rPoints,this.rval,this.info
      this.$bus.$on('editRoute', (index, data) => {
        this.openRoute=true
        if (index === '0') { // 前往
          this.val = data
          this.mapPoints=this.val.duringPoints
          this.map.clearOverlays();
          this.drawMapFuc(this.val.startPoint, this.val.stopPoint, this.val.duringPoints)
        } else if (index === '1') { // 返回
          this.val1 = data
          this.mapPoints1=this.val1.duringPoints
          this.map.clearOverlays();
          this.drawMapFuc(this.val1.startPoint, this.val1.stopPoint, this.val1.duringPoints)
        }
      })
      this.$bus.$on('addRoute', (data) => {
        if (data.btn != '保存') {
          this.map.clearOverlays();
        }else{
          this.val={ // 前往点集合
            startPoint: {},
            duringPoints: [],
              stopPoint: {}
          }
          this.val1={ // 返回点集合
            startPoint: {},
            duringPoints: [],
              stopPoint: {}
          }
        }
        this.openRoute=true
      })
      // 点击列表渲染地图
      this.$bus.$on('openRoute', (index, data, state) => {
        this.openRoute=true
        this.map.centerAndZoom(new BMap.Point(this.val.startPoint.lng, this.val.startPoint.lat), 15);
        if (state === 1) {
          if (index === '0') { // 前往
            this.val = data
            this.map.clearOverlays();
            this.drawMapFuc(this.val.startPoint, this.val.stopPoint, this.val.duringPoints)
          } else if (index === '1') { // 返回
            this.val1 = data
            this.map.clearOverlays();
            this.drawMapFuc(this.val1.startPoint, this.val1.stopPoint, this.val1.duringPoints)
          }
        } else {
          this.map.clearOverlays();
        }
      })
      // 返回列表时清空地图
      this.$bus.$on('gobackList', (state) => {
        if (state === 1) {
          this.map.clearOverlays();
        }
      })
      // 关键字搜索位置
      this.$bus.$on('keySearch', (index, val) => {
        this.searchFuc(val,index)
        if(val&&this.searchList){
          this.text='收起'
        }else{
          this.text=''
        }
        this.$bus.$emit('keySearch1',this.searchList,this.text)
      })
      this.$bus.$on('placeClick', (index, data) => {

        if (index === '0') { // 前往
          this.val = data
          this.map.clearOverlays();
          this.drawMapFuc(this.val.startPoint, this.val.stopPoint, this.val.duringPoints)
        } else if (index === '1') { // 返回
          this.val1 = data
          this.map.clearOverlays();
          this.drawMapFuc(this.val1.startPoint, this.val1.stopPoint, this.val1.duringPoints)
        }
      })
    },
    mounted() {
      this.map = new BMap.Map("map_container");
      this.map.centerAndZoom(new BMap.Point(106.506447, 29.614564), 15); //默认重庆经纬度
      this.map.enableScrollWheelZoom(true);
      // this.map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
      // this.map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
      this.map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
      this.geoc = new BMap.Geocoder();
      this.clickMap()
      // this.dragMap()
    },
    methods: {
      searchFuc(val,index) {
        this.searchList=[]
        let _this = this
        var options = {
          onSearchComplete: function (res) {
            // 判断是否正确
            if (res && res.getCurrentNumPois() > 0) {
              _this.map.centerAndZoom(new BMap.Point(res.getPoi(0).point.lng, res.getPoi(0).point.lat), 15); // 中心点经纬度
              if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                for (var i = 0; i < res.getCurrentNumPois(); i++) {
                  _this.searchList.push({
                    name: res.getPoi(i).title + ',' + res.getPoi(i).address,
                    point: {
                      lng: res.getPoi(i).point.lng,
                      lat: res.getPoi(i).point.lat
                    },
                    index:index
                  })
                }
              }
            }
          }
        }
        if (options) {
          var local = new BMap.LocalSearch(_this.map, options);
          local.search(val)
        }
      },
      /**
       *  绘制轨迹
       */
      drawMapFuc(p1, p2, mapPoints) {
        var start = new BMap.Point(p1.lng, p1.lat);
        var stop = new BMap.Point(p2.lng, p2.lat);
        var driving = new BMap.DrivingRoute(this.map, {
          renderOptions: {
            map: this.map,
            autoViewport: true
            // panel: "r-result",
            // enableDragging : true //起终点可进行拖拽
          }
          // , onSearchComplete:function(res){
          //
          //   console.log(res.getStart())
          //   console.log(res.getEnd())
          // }
        });
        driving.search(start, stop, {waypoints: mapPoints});//waypoints表示途经点
      },
      /**
       *  拖拽线路添加路线点drawMapFuc
       */
      dragMap(){
        var geoc = new BMap.Geocoder();
        this.map.addEventListener('dragend', function(e){
          console.log(e)
          // var point2 = new BMap.Point(e.point.lng,e.point.lat); //用所定位的经纬度查找所在地省市街道等信息
          // // alert('当前坐标：' + e.point.lng + ", " + e.point.lat);
          // geoc.getLocation(point2, function(rs2){
          //   var addComp = rs2.addressComponents;
          //   console.log(rs2.address);//地址信息
          //   myKeys2 = rs2.address;
          //   alert(myKeys2);  //弹出所在地址
          // });
        });
      },
      /**
       *  点击路线添加途径点drawMapFuc
       */
      clickMap() {
        /**  点击地图获取点集合 **/
        var geoc = new BMap.Geocoder();
        let that = this
        this.map.addEventListener("click", function (e) {
          if(that.openRoute===true){
            return false
          }
          that.map.clearOverlays();
          //通过点击百度地图，可以获取到对应的point, 由point的lng、lat属性就可以获取对应的经度纬度
          var pt = e.point;
          // 判断是否为添加起点0和终点2
          if (that.tabIndex === '0') { // 前往
            if (that.placeSort === 0) { // 起点
              that.p1 = pt
              that.val.startPoint = pt
              that.geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                var place = addComp.city + addComp.district + addComp.street + addComp.streetNumber
                that.$bus.$emit('startPlaceVal', place, that.tabIndex, that.val)
              })
            } else if (that.placeSort === 2) { // 终点
              that.p2 = pt
              that.val.stopPoint = pt
              that.geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                var place = addComp.city + addComp.district + addComp.street + addComp.streetNumber
                that.$bus.$emit('stopPlaceVal', place, that.tabIndex, that.val)
              })
            } else if (that.placeSort === 1) { // 途径点
              that.mapPoints[that.duringIndex] = pt
              that.val.duringPoints = that.mapPoints
              that.geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                var place = addComp.city + addComp.district + addComp.street + addComp.streetNumber
                that.duringList[that.duringIndex] = {duringPlace: place}
                that.$bus.$emit('duringPlaceList', that.duringList, that.tabIndex, that.val)
              })
            }
            that.drawMapFuc(that.val.startPoint, that.val.stopPoint, that.val.duringPoints)
          } else if (that.tabIndex === '1') { // 返程
            if (that.placeSort === 0) { // 起点
              that.rp1 = pt
              that.val1.startPoint = pt
              that.geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                var place = addComp.city + addComp.district + addComp.street + addComp.streetNumber
                that.$bus.$emit('startPlaceVal', place, that.tabIndex, that.val1)
              })
            } else if (that.placeSort === 2) {// 终点
              that.rp2 = pt
              that.val1.stopPoint = pt
              that.geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                var place = addComp.city + addComp.district + addComp.street + addComp.streetNumber
                that.$bus.$emit('stopPlaceVal', place, that.tabIndex, that.val1)
              })
            } else if (that.placeSort === 1) {// 途径点
              that.mapPoints1[that.duringIndex] = pt
              that.val1.duringPoints = that.mapPoints1
              that.geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                var place = addComp.city + addComp.district + addComp.street + addComp.streetNumber
                that.duringList1[that.duringIndex] = {duringPlace: place}
                that.$bus.$emit('duringPlaceList', that.duringList1, that.tabIndex, that.val1)
              })
            }
            that.drawMapFuc(that.val1.startPoint, that.val1.stopPoint, that.val1.duringPoints)
          }

        })
      }
    }
  }
</script>

<style scoped>
  .rpoint {
    position: relative;
  }

  #map_container {
    width: 100%;
     height: calc(100vh - 60px);
  }
</style>
