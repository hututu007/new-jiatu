let secondTime = (time1, time2) => {
  var d1 = getdate(time1).replace(/\-/g, "/");
  var date1 = new Date(d1);
  var d2 = getdate(time2).replace(/\-/g, "/");
  var date2 = new Date(d2);
  var dateNew = cnTime(Math.abs(parseInt(date2 - date1) / 1000))
  return dateNew
}
/**
 *
 * @param timestamp 传入的时间戳
 * @returns {string}
 */
let getdate = (timestamp) => {  // 处理时间戳
  var now = new Date(timestamp),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
}

/**
 * 时间戳转化为中文时间
 * @param value 传入的时间戳
 * @returns {string} 时间格式 3小时2分20秒
 */
let cnTime = (value) => {
  var theTime = parseInt(value);// 秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  var theTime3 = 0;// 天
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
      if (theTime2 > 60) {
        theTime3 = parseInt(theTime2 / 60);
        theTime2 = parseInt(theTime2 % 60);
      }
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + "分" + result;
  }
  if (theTime2 > 0) {
    result = "" + parseInt(theTime2) + "小时" + result;
  }
  if (theTime3 > 0) {
    result = "" + parseInt(theTime3) + "天" + result;
  }
  return result;
}


let rightTime = (mss) => {
  var days = parseInt(mss / (1000 * 60 * 60 * 24));
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = (mss % (1000 * 60)) / 1000;
  return days + " 天 " + hours + " 小时 " + minutes + " 分 ";
}


let totalTime = (data) => {
  var totalTi = null
  for (var j = 0; j < data.length; j++) {
    totalTi = totalTi + parseInt(data[j].preStopTime - data[j].preStartTime)
  }
  totalTi = rightTime(Math.abs(parseInt(totalTi)))
  return totalTi
}

export {cnTime, secondTime, totalTime, getdate, rightTime}
