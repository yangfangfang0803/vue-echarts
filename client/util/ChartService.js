import echarts from 'echarts'

const types = {
			"line":1,
			"column":2,
			"columnstack":3,
			"columnline":4,
			"bar":5,
			"area":6,
			"areastack":7,
			"arealiner":8,
			"pie":9
		}

const styles = {
  fontcolor : "#575e74",
  linecolor : "#f2f2f7",
  family : "SimHei,Arial",
  legendcolor : "#575e74",
  fontsize : 12
}

const defaultConfig = {
  ispercent:false, //是否为百分比数据，显示%
  title:'',//显示标题
  legend:true, //是否显示图例
	lastprecent:false, //最后一条数据为百分比数据
  color:['#ff8c40','#1cd2d6', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#2f4554','#006000','#642100','#6c3365','#484891','#844200','#006030','#003e3e','#584b00','#336666']
};

function ChartService (){
  this.init = function ({data,config,type}) {
    this.data = data.val;
  	this.name = data.name
  	this.key = data.key;
    this.linetype = types[type];
    this.config = Object.assign({},defaultConfig,config);
		if(this.linetype == types.columnline){
			this.config.lastprecent = true;
		}
  }

   this.getOptions = function () {
		 if(this.linetype == types.pie){
			 return this.pieChart();
		 }

     let options = this.commonOptions(),seriesData = [];
     switch (this.linetype){
       case types.line://普通线图
         seriesData = this.lineChart();
         break;
      case types.area://普通区域图
        seriesData = this.areaChart();
        break;
		  case types.areastack://普通区域堆积图
        seriesData = this.areaChart(true,false);
        break;
			case types.arealiner://渐变区域图
        seriesData = this.areaChart(false,true);
        break;
			case types.column://普通线图
				seriesData = this.columnChart(false);
				break;
		 	case types.columnstack://柱图堆积图
		 		seriesData = this.columnChart(true);
				break;
			case types.columnline://柱图，最后一条线为百分比的线图
 		 		seriesData = this.columnLineChart();
				options.yAxis.push(this.getYaxis(true));
 				break;
			case types.bar://横向柱图
		 		seriesData = this.barChart();
				options.grid.right = 20;
				break;
       default:
          break;
     }

		 if(this.linetype == types.column || this.linetype == types.columnstack || this.linetype == types.columnline){
			 options.yAxis[0].axisTick = options.xAxis[0].axisTick;
			 options.yAxis[0].axisLine = options.xAxis[0].axisLine;
		 }
     options.series = seriesData;
     return options;
   }
    /*
		*折线图
		*/
		this.lineChart = function(){
			var seriesData = [];
			for (var i = 0; i < this.name.length; i++) {
				var temp = {};
				temp.name = this.name[i];
				temp.type = "line";
				temp.lineStyle = {
					normal:{
						width:1.2
					}
				}
				temp.smooth = true;
				temp.data = this.data[i];
				seriesData[i] = temp;
			}
			return seriesData;
		};
		/*
		*区域图
		*/
		this.areaChart = function(isstack,isLiner){
			var seriesData = [];
			var opac = this.config.opacity ? this.config.opacity : 0.25;

			for (var i = 0; i < this.name.length; i++) {
				var temp = {};
				temp.name = this.name[i];
				temp.type = "line";
				temp.data = this.data[i];
				if(isstack){
					temp.stack = "总量";
				}
				temp.smooth = true;
				temp.areaStyle = {
					normal:{
						opacity:opac
					}
				}
				if (isLiner) {
					temp.areaStyle.normal.color =
					new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: this.config.color[i]
          },{
              offset: 1,
              color: '#fff'
          }])
				}
				temp.lineStyle = {
					normal:{
						width:1.2
					}
				}
				seriesData[i] = temp;
			}
			return seriesData;
		};
		/*柱图*/
		this.columnChart = function(istack){
			var seriesData = [],names = [];
			for (var i = 0; i < this.name.length; i++) {
				var temp = {};
				temp.name = this.name[i];
				temp.type = "bar";
				temp.barMaxWidth = 18;
				temp.barGap = 0;
				temp.data = this.data[i];
				if(istack){
					temp.stack = "总量";
				}
				var color = "";
				if(names.indexOf(temp.name)>-1){
					color = seriesData[i-1].itemStyle.normal.color;
				}else{
					color = this.config.color[i];
				}
				temp.itemStyle = {
					normal : {
						color : color
					},
					emphasis: {
						color : this.config.color[i]
					}
				}
				names.push(temp.name);
				seriesData[i] = temp;
			}
			return seriesData;
		}
		/*横向柱图*/
		this.barChart = function(ismoreY){ //ismoreY  多个Y轴
			var seriesData = [];
			for (var i = 0; i < this.name.length; i++) {
				var temp = {};
				temp.name = this.name[i];
				temp.type = "bar"
				if(this.config.barwidth){
					temp.barMaxWidth = this.config.barwidth;
				}else{
					temp.barMaxWidth = 18;
					temp.barGap = 0;
				}
				if(ismoreY){
					temp.xAxisIndex = i;
				}
				temp.data = this.data[i];
				if(this.config.isbartext && this.config.isbartext==true){
					temp.label = {
              normal: {
                  show: true,
                  // position: 'insideRight',
                  position: 'right',
                  formatter:function(params){
                  	var c = params.data;
                  	if(c>0){
                  		return toFixedValue(c);
                  	}else{
                  		return "";
                  	}
                  }
              }
          };
				}
				seriesData[i] = temp;
			}
			return seriesData;
		}
		/*柱图 最后一条为线条*/
		this.columnLineChart = function(){
			var seriesData = [],len = this.name.length;
			for (var i = 0; i < len; i++) {
				var temp = {};
				temp.name = this.name[i];

				temp.barMaxWidth = 18;
				temp.barGap = 0;
				temp.data = this.data[i];

		 		if(i == len-1){
		 			temp.type = "line";
		 			temp.yAxisIndex = 1;
		 		}
		 		else{
		 			temp.type = "bar";
		 		}
				temp.itemStyle = {
					normal : {
						color : this.config.color[i]
					},
					emphasis : { //鼠标放上颜色
						color : this.config.color[i]
					}
				}
				seriesData[i] = temp;
			}
			return seriesData;
		}
		/*饼图*/
		this.pieChart = function(d){
			var name = this.name,values = this.data, arr = [];

			name.filter(function(n,i){
				arr.push({value:values[i].sum(),name:n});
			});
			var option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: "{b}: {c} ({d}%)"
			    },
			    legend: {
			        show:false
			    },
			    color:this.config.color,
			    series: {
	            type:'pie',
	            clockwise:false,
	            label: {
                  normal: {
                    show: (name.length>20?false:true)
                  }
              },
	            radius : [0, 120],
      				center : ['50%', '50%'],
	            selectedOffset:5,
	            data:arr
					}
			};
			return option;
		}

	  this.commonOptions = function(){
			let perfix = this.config.ispercent ? "%" : '';
      let title = this.config.title,datas = this.name,that = this;
      let top = this.config.legend ? 30 : 0,names = [];
			this.name.filter((name)=>{
				names.push({name:name,icon:"roundRect"});
			})
			var options = {
				title:{
					text : title,
					textStyle:{
						color:styles.legendcolor,
						fontSize:styles.fontsize,
						fontFamily:styles.family
					},
					left:"center"
				},
				backgroundColor:'#fff',
				legend: {
					data: names,
					top:top,
					show: this.config.legend,
					textStyle:{
						color:styles.legendcolor,
						fontSize:styles.fontsize,
						fontFamily:styles.family
					},
					itemWidth:20,
					itemHeight:3,
					formatter: function (name) {
						if(datas.length>2){
							return echarts.format.truncateText(name, 80, '14px Microsoft Yahei', '…');
						}
            else{
							return name;
						}

			    },
			    tooltip: {
			        show: true
			    }
				},
				grid : {
					left:10,
					top:top+40,
					bottom:10,
					right:0,
					containLabel:true
				},
				tooltip: {
					trigger: 'axis',
					formatter: function(objs) {
            let len = objs.length,str = "",obj;
						for(var i=0;i<len;i++){
							obj = objs[i];
							var name = obj.seriesName;
							if(obj.value!=null && obj.value!='-'){
								str += '<span style="color:'+obj.color+'">\u25CF</span>' + name + ' : ' + SysTool.numFixed(obj.value,2) + perfix;
								if(that.config.lastprecent && i == len-1){
									str += "%";
								}
								str += '<br/>';
							}
						}
						str = obj.name + '<br/>' + str;
						return str;
					},
					axisPointer:{
						type:"line",
						lineStyle:{
							color:styles.linecolor
						}
					}
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: false
						},
						dataView: {
							show: false,
							readOnly: false
						},
						saveAsImage: {
							show: false
						}
					}
				},
				calculable: false,
				color : this.config.color
			}

			if(this.linetype == types.bar){
				options.yAxis = [this.getXaxis()];
				options.xAxis = [this.getYaxis()];
			}
			else{
				options.xAxis = [this.getXaxis()];
				options.yAxis = [this.getYaxis()];
			}
			return options;
		}

		this.getXaxis = function(){
			let that = this;
			var axis = {
				type: 'category',
				data: this.key,
				splitLine : {
            show : false
        },
        axisLabel : {
					textStyle:{
						color:styles.fontcolor,
						fontSize:styles.fontsize,
						fontFamily:styles.family
					},
					formatter:function(value){
						if(value){
							var objstr = SysTool.splitString(value,12);
							if(that.config.issmart && objstr.len>12){
								return objstr.str + "...";
							}
							else{
								return value;
							}
						}
					}
				},
	      axisTick:{
					lineStyle:{
						color:styles.linecolor
					}
				},
        axisLine : {
            lineStyle:{
            	color:styles.linecolor
            }
        }
			};
      if(this.linetype == types.bar){
        axis.inverse = true;
      }
			return axis;
		}

    this.getYaxis = function(ispercent){
			var perfix = (this.config.ispercent || ispercent) ? "%" : "";
			var axis = {
				type: 'value',
				axisLabel : {
					textStyle:{
						color:styles.fontcolor,
						fontSize:styles.fontsize,
						fontFamily:styles.family
					},
					formatter : function(value) {
						return SysTool.toFixedValue(value) + perfix;
					}
				}
      },
			axis1 = {
        axisTick:{
					show:false,
					lineStyle:{
						opacity:0
					}
				},
				axisLine:{
					show:false
				},
				splitLine : {
            show : true,
            lineStyle:{
							// type:'dashed',
            	color:styles.linecolor
            }
        },
        min:0,
        splitNumber:4
			},
      axis2 = {
        axisTick:{
					lineStyle:{
						color:styles.linecolor
					}
				},
				axisLine : {
            lineStyle:{
            	color:styles.linecolor
            }
        },
				splitLine : {
            show : false
        },
        min:0,
        splitNumber:3
			}

      if(this.linetype == types.bar){
        return Object.assign({},axis,axis2);
      }
      else{
        return Object.assign({},axis,axis1);
      }
		};
}

module.exports = ChartService;
