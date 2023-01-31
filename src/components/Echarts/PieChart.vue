<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import {
    debounce
  } from '@/utils'

  export default {
    props: {
      data:{
        type:Array,
        default: []
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
        default: '332px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          color:['#23BCCA','#FF8D1A'],
          tooltip: {
            trigger: 'item',
            // formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 0,
            top: 20,
            data: [this.data[0].name, this.data[1].name]
          },
          calculable: true,
          series: [{
            // name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            // roseType: 'radius',
            startAngle:190,
            radius: [50, 95],
            center: ['50%', '50%'],
            data: this.data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 4
            },
            label: {
              alignTo: 'edge',
              formatter: '{name|{b}}\n{value|{c} 人}',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 20,
              rich: {
                value: {
                  fontSize: 15,
                  color: '#999'
                }
              }
            },
            labelLine: {
              length: 20,
              length2: 200,
              maxSurfaceAngle: 80
            },
          }]
        })
      }
    }
  }
</script>
