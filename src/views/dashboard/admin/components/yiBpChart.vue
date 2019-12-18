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
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '50%'
      },
      height: {
        type: String,
        default: '180px'
      }
    },
    data() {
      return {
        chart: null
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
        this.chart.setOption({
          backgroundColor: "#ffffff",
          color: ["#37A2DA", "#32C5E9", "#67E0E3"],
          series: [{
            name: '业务指标',
            type: 'gauge',
            detail: {
              formatter: '{value}%'
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 30,
                shadowBlur: 0,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d']
                ]
              }
            },
            data: [{
              value: 50,
              name: '完成率',
            }]

          }]
        })
      }
    }
  }
</script>
