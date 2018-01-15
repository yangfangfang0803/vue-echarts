<template>
  <div class="mainapp white">
    <ChartInfo :data="chartData" :type="chartType" :height="300"></ChartInfo>
    <button type="button" :class="{'active':chartType=='line'}" @click="changeType('line')">线图</button>
    <button type="button" :class="{'active':chartType=='area'}" @click="changeType('area')">区域图</button>
    <button type="button" :class="{'active':chartType=='column'}" @click="changeType('column')">柱图</button>
  </div>
</template>


<script>

  import ChartInfo from '@/components/common/ChartInfo'
  const chartdata = require('./data');

	export default {
      components:{ChartInfo},
      data: function(){
        return {
          chartData:chartdata,
          chartType:'line'
        };
      },
      methods: {
        changeType: function(type){
          this.chartType = type;
        }
      }
	}
</script>
<style lang="scss" scoped>
  button{
   border:1px solid #d8dadf;
    background-color: #fff;
    border-radius: 3px;
    color:#999;
    width:54px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    vertical-align: middle;
    outline: none;

    &.active{
      color:#fff;
      background-color: #35a7ff;
      border-color: #35a7ff;
    }
  }
</style>
