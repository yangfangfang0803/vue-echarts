import styles from '@/styles/style.scss'

window.SysTool = {
  setData: function (key,value){
    if(typeof value === 'object'){
      value = JSON.stringify(value);
    }
    window.localStorage.setItem(key,value);
  },
  getData: function (key){
    return window.localStorage.getItem(key);
  },
  removeData: function (key) {
    window.localStorage.removeItem(key);
  },
  arrayToObject: function (data) {
    return data.map(function(item){
      return {id:item,name:item};
    });
  },
  arrayToOrder: function (array,ordercolumn,orderby='asc'){
      if (orderby == "desc") {
          return array.sort(function(x, y) {
              return x[ordercolumn] == y[ordercolumn] ? 0 : (x[ordercolumn] > y[ordercolumn] ? -1 : 1);
          });
      } else {
          return array.sort(function(x, y) {
              return x[ordercolumn] == y[ordercolumn] ? 0 : (x[ordercolumn] > y[ordercolumn] ? 1 : -1);
          });
      }
  },
  mergeArray : function(){
      return Array.prototype.concat.apply([], arguments);
  },
  numFixed: function (num,fix=2){
    return Number(Number(num).toFixed(fix));
  },
  splitString: function(str, olength){
      var resString = '',
          len = 0,
          reg = new RegExp(/[^\x00-\xff]/);
      for(var i = 0; i < str.length; i++){
          var char = str.charAt(i);
          len += (reg.test(char) ? 2 : 1);
          if(len <= olength){
              resString += char;
          }
      }
      return {
          str: resString,
          len: len
      };
  },
  toFixedValue: function(value){
		if (value > 999 & value < 10000) {
			return (value / 1000).toFixed(1).toString() + "k";
		}
		else if (value >= 10000 && value < 1000000) {
			return (value / 10000).toFixed(1).toString() + "w";
		}
		else if (value >= 1000000 && value < 1000000000) {
			return (value / 1000000).toFixed(1).toString() + "m";
		}
		else if (value >= 1000000000) {
			return (value / 1000000000).toFixed(1).toString() + "b";
		}
		return value;
	}
}

Array.prototype.sum = function(){
  if(!this || this.length==0){return 0;}

  return this.reduce((pre,next) => pre+next);
}
