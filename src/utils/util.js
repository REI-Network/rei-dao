/* eslint-disable */
export default {
  isNumber(val) {
    return /^\d+(\.\d{0,18})?$/.test(val);
  },
  isInteger(val){
    return /^[1-9]\d*$/.test(val);
  },
  numberPrecision(value, precision) {
    value = value + '';
    if (isNaN(Number(value))) {
      return value;
    }
    precision = precision >= 0 && precision <= 20 ? precision : 2;
    let _pre = 10 ** precision;
    value =Math.floor(parseFloat((value + '').replace(/[^\d.-]/g, '')) * _pre) / _pre;
    return value;
  },
  compareAssetId(assetA, assetB) {
    let asset1 = assetA.split('.');
    let asset2 = assetB.split('.');
    return asset1[2] < asset2[2];
  },
  dateFormat(val, fmt) {
    let date = new Date(val);
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    };
    if (/(Y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
    }
    return fmt;
  },
  numFormat(num){
    num=num.toString().split(".");  // 分隔小数点
    var arr=num[0].split("").reverse();  // 转换成字符数组并且倒序排列
    var res=[];
    for(var i=0,len=arr.length;i<len;i++){
      if(i%3===0&&i!==0){
         res.push(",");   // 添加分隔符
      }
      res.push(arr[i]);
    }
    res.reverse(); // 再次倒序成为正确的顺序
    if(num[1]){  // 如果有小数的话添加小数部分
      res=res.join("").concat("."+num[1]);
    }else{
      res=res.join("");
    }
    return res;
},

  accMult(arg1, arg2) {
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try {
      m += s1.split('.')[1].length;
    } catch (e) {
    }
    try {
      m += s2.split('.')[1].length;
    } catch (e) {
    }
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    );
  },
  addr(str) {
    var first = str.substr(0, 6);
    var last = str.substr(str.length - 4);
    return first + '...' + last;
  },
  asset(value, precision = 2) {
    if (isNaN(Number(value))) {
      return value || '0';
    }
    if (!value) {
      value = '0';
    }
    value = value + '';
    // precision = (value.indexOf('.') > -1 && value.split('.')[1].length) || precision;
    // if (precision > 5) {
    //   precision = 5;
    // }
    value = parseFloat(value.replace(/[^\d.-]/g, '')).toFixed(precision) + '';
    var l = value
      .split('.')[0]
      .split('')
      .reverse();
    var r = value.split('.')[1];
    var t = '';
    for (var i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
    }
    if (precision == 0) {
      return t
        .split('')
        .reverse()
        .join('');
    }
    return (
      t
        .split('')
        .reverse()
        .join('') +
      '.' +
      r
    );
  },
  isUrl(val){
    return /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/.test(val);
  },
  sleep(timestamp) {
    return new Promise((resolve) => {
      setTimeout(resolve, timestamp);
    });
  }
};
