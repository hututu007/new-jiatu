let datetime = (oldTime, type) => {
  let time = "";
  const oldDate = new Date(oldTime);

  let year = oldDate.getFullYear();
  let month = oldDate.getMonth() + 1;
  let day = oldDate.getDate();
  let hours = oldDate.getHours();
  let minutes = oldDate.getMinutes();
  let seconds = oldDate.getSeconds();

  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (type && type == 'hh:mm:ss') {
    time = hours + ":" + minutes + ":" + seconds
  } else if (type && type == 'yy:MM:dd hh:mm:ss') {
    time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  }
  else {

    time = year + "-" + month + "-" + day;
  }
  return time
}

const status = (oldNum, obj) => {
  /*
   * obj = { 0: '开启', 1: '关闭' }
   */
  if (oldNum===null) {
    oldNum = 'null'
  }
  for (var key in obj) {
    if (oldNum.toString() === key.toString()) {
      return obj[key]
    }
  }
}

export {datetime, status}
