let dayCut = (index, data) => {
  var oneIndex = 0
  for (var i = 0; i < data.length; i++) {
    if (data[i] === 1) {
      oneIndex = i
    }
  }
  if (oneIndex > index) {
    return false
  } else {
    return true
  }
}
/** 地址转化为坐标点 **/
let realPoint = (val, map) => {
  var pointReal
  var localSearch = new BMap.LocalSearch(map);
  localSearch.enableAutoViewport();
  localSearch.setSearchCompleteCallback(function (searchResult) {
    var poi = searchResult.getPoi(0);
    pointReal = poi.point //获取经度和纬度
  });
  localSearch.search(val);
  return pointReal
}
/** 途径点坐标与内容集合 **/
let pointsFuc = (points, places) => {
  var arr = []
  for (var i = 0; i < points.length; i++) {
    arr.push({
      siteName: places[i].duringPlace,
      longitude: points[i].lng,
      latitude: points[i].lat
    })
  }
  return arr
}
/** 数组根据属性大小排序 **/
let compare = (property) => {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}
/** 途径站点集合方法 **/
let pathFuc = (start, end, list) => {
  list.sort(compare('pathpointNum'))
  let arr = []
  arr.push({
    path: start
  })
  for (var i = 0; i < list.length; i++) {
    arr.push({
      path: list[i]
    })
  }
  arr.push({
    path: end
  })
  return arr
}
/** 根据key循环添加数组 **/
let arrayList = (list,type) => {
  let brr = []
  if(type===0){
    for (var i = 0; i < list.length; i++) {
      brr.push({
        duringPlace: list[i].siteName
      })
    }
  }else{
    for (var i = 0; i < list.length; i++) {
      brr.push(new BMap.Point(list[i].longitude,list[i].latitude))
    }
  }
  return brr
}

/** 循环添加时间数组 **/
let timeList = (list) => {
  let crr = []
  for (var i = 0; i < list.length; i++) {
    crr.push(
      list[i].classlineTime
    )
  }
  return crr
}

export {dayCut, realPoint, pointsFuc, compare, pathFuc, arrayList, timeList}
