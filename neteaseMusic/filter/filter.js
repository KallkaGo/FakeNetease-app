const formatCount = (count) => {
  if (count >= 10000 && count <= 100000000) {
    count /= 1000;
    return count.toFixed(1) + '万';
  } else if (count > 100000000) {
    count /= 100000000
    return count.toFixed(1) + '亿';
  } else {
    return count;
  }
}
const formatTime = (time) => {
  var date = new Date(time)
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
}
export default {
  install: function(Vue) {
    Vue.filter('formatCount', formatCount)
    Vue.filter('formatTime', formatTime)
  }
}
