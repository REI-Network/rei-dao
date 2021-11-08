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
  }
};
