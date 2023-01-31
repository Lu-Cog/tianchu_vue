<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  export default {
    mixins: [resize],
    props: {
      data:{
        type:Array,
        default:[],
      },
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions({
        expectedData,
        type
      } = {}) {
        this.chart.setOption({
          xAxis: {
            show: false,
            data: this.data,
            boundaryGap: false,
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: false, //不显示坐标轴线
            },
            axisLabel: {
              show: false, //不显示坐标轴上的文字
            },
          },
          // grid: {
          //   left: 50,
          //   right: 10,
          //   bottom: 20,
          //   top: 50,
          //   containLabel: true
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            show:false,
            splitLine: {
              show: false //不显示网格线
            },
            axisTick: {
              show: false
            }
          },
          series: [{
              name: '',
              itemStyle: {
                normal: {
                  color: type==1?'#FF8D1A':'#23BCCA',
                  lineStyle: {
                    color: type==1?'#FF8D1A':'#23BCCA',
                    width: 4
                  }
                }
              },
              smooth: true,
              type: 'line',
              data: expectedData,
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            }
          ]
        })
      }
    }
  }
</script>
