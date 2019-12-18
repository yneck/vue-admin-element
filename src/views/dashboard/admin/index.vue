<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
      <!--<line-chart :chart-data="lineChartData" />-->
    <!--</el-row>-->
    <el-row :gutter="32">
      <el-col :xs="12" :sm="12" :lg="12">
        <div class="chart-wrapper">
          <h4>实时AQI</h4>
          <div style="padding: 0;margin:0;display: flex;border-right: 1px solid #ddd">
            <gauge-chart />
            <div class="chart-wrapper" style="padding: 0;margin:0;margin-top: 20px;">
              <p> <span>90</span>实时发布</p>

              <p>轻度污染</p>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12">
        <div class="chart-wrapper">
          <line-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <!--<div class="chart-wrapper">-->
          <!--<div>-->
            <el-col :xs="8" :sm="8" :lg="8" style="padding: 0;margin:0">
              <div class="chart-wrapper">
                <h4>PM2.5达标情况</h4>
                  <div style="padding: 0;margin:0;display: flex;border-right: 1px solid #ddd">
                    <pie-chart />
                    <div class="chart-wrapper" style="padding: 0;margin:0;margin-top: 20px;">
                      <p>今日目标 <span>90</span>微克立方米</p>
                      <p>累计浓度<span>40</span>微克立方米</p>
                      <p>剩余量<span>90</span>微克立方米</p>
                    </div>
                  </div>
              </div>
            </el-col>

        <el-col :xs="8" :sm="8" :lg="8" style="padding: 0;margin:0">
          <div class="chart-wrapper">
            <h4>优良天数</h4>
            <div style="padding: 0;margin:0;display: flex;border-right: 1px solid #ddd">
              <pie-chart />
              <div class="chart-wrapper" style="padding: 0;margin:0;margin-top: 20px;">
                <p>今日目标 <span>90</span>微克立方米</p>
                <p>优良天数<span>40</span>微克立方米</p>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="8" :sm="8" :lg="8" style="padding: 0;margin:0;">
          <div class="chart-wrapper">
            <h4>综合指数</h4>
            <div style="padding: 0;margin:0;display: flex">
              <pie-chart />
              <div class="chart-wrapper" style="padding: 0;margin:0;margin-top: 20px;">
                <p>今日目标 <span>90</span>微克立方米</p>
                <p>综合指数<span>40</span>微克立方米</p>
              </div>
            </div>
          </div>
        </el-col>

      </el-col>

    </el-row>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
  </div>
</template>

<script>
//import api from './@api/user'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import BoxCard from './components/BoxCard'
import yiBChart from './components/yiBChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    echarts,
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    BoxCard,
    yiBChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}

//let yibpChart = echarts.init(document.getElementById('yibp'));
//
//// 绘制图表
//yibpChart.setOption({
//  backgroundColor: "#ffffff",
//  color: ["#37A2DA", "#32C5E9", "#67E0E3"],
//  series: [{
//    name: '业务指标',
//    type: 'gauge',
//    detail: {
//      formatter: '{value}%'
//    },
//    axisLine: {
//      show: true,
//      lineStyle: {
//        width: 30,
//        shadowBlur: 0,
//        color: [
//          [0.3, '#67e0e3'],
//          [0.7, '#37a2da'],
//          [1, '#fd666d']
//        ]
//      }
//    },
//    data: [{
//      value: 50,
//      name: '完成率',
//    }]
//
//  }]
//});
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  h4{
    /*margin: 0;*/
    /*padding:0;*/
    font-size: 22px;
    font-weight: normal;
    color: #555;
    margin-left:20px;
  }
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
