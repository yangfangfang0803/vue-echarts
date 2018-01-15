<template>
<div class="chartWrap" :style="myStyle">
  <div class="chartBox" ref="mybox"></div>
</div>
</template>

<script>
import echarts from 'echarts'
import ChartService from '@/util/ChartService'

export default {
  props:{
    data:{ //图表数据
      type:Object,
      default: function() {
        return {};
      }
    },
    type:{ //默认图表类型
      type:String,
      default:'line'
    },
    config:{//相关配置
      type:Object,
      default: function() {
        return {};
      }
    },
    height:{//图表高度
      type:Number,
      default: 300
    },
    loading:{//是否显示加载
      type: Boolean,
      default: false
    }
  },
  data: function () {
    let chartInstance = new ChartService();
    return {
      chartInstance: chartInstance,
      chartDOM: null,
      resizeFn:null
    }
  },
  mounted() {
    this.$nextTick(()=>{
      let myDOM = this.$refs.mybox;
      this.chartDOM = echarts.init(myDOM);
      this.doChart();
    });
  },
  computed: {
    chartinfo: function () {
      return {
        data:this.data,
        config:this.config,
        type:this.type
      }
    },
    myStyle: function () {
      return {
        height: this.height + "px"
      }
    }
  },
  watch: {
    chartinfo: {
      handler(){
        if(this.chartDOM!=null){
          this.doChart();
        }
      },
      deep: true
    }
  },
  destroyed() {
    window.removeEventListener('resize',this.resizeFn,false);
  },
  methods: {
    doChart: function () {
      if(!this.data.name){return false;}

      this.chartInstance.init(this.chartinfo);

      this.chartDOM.clear();
      this.chartDOM.setOption(this.chartInstance.getOptions());

      this.resizeFn = () => {
          var res;
          if (res){clearTimeout(res)}
          res = setTimeout(()=>{
            this.chartDOM.resize();
          },50);
      };
      window.addEventListener('resize',this.resizeFn,false);
    }
  }
}
</script>

<style lang="scss" scoped>
.chartWrap{
  width: 100%;
  position: relative;
  .alpSmallLoad{
    width:100%;
  }
}
.chartBox{
  width: 100%;
  height: 100%;
}
</style>
