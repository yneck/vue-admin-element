<template>
  <el-row :gutter="24" class="panel-group">
    <el-col :xs="24" :sm="24" :lg="24">
      <div class="chart-wrapper" style="padding: 0;margin: 0;;">
        <el-col :xs="12" :sm="24" :lg="4" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-description">
              <div class="card-panel-text icon-1">
                PM2.5
              </div>
              <div class="card-panel-num"><count-to :start-val="0" :end-val="50" :duration="3600" class="card-panel-num-lg" /><span>/ 微克立方米</span></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="24" :lg="4" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <div class="card-panel-description">
              <div class="card-panel-text icon-2">
                PM210
              </div>
              <div class="card-panel-num"><count-to :start-val="0" :end-val="50" :duration="3600" class="card-panel-num-lg" /><span>/ 微克立方米</span></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="24" :lg="4" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('shoppings')">
            <div class="card-panel-description">
              <div class="card-panel-text icon-3">
                SOS
              </div>
              <div class="card-panel-num"><count-to :start-val="0" :end-val="50" :duration="3600" class="card-panel-num-lg" /><span>/ 微克立方米</span></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="24" :lg="4" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-description">
              <div class="card-panel-text icon-4">
                NO2
              </div>
              <div class="card-panel-num"><count-to :start-val="0" :end-val="50" :duration="3600" class="card-panel-num-lg" /><span>/ 微克立方米</span></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="24" :lg="4" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <div class="card-panel-description">
              <div class="card-panel-text icon-1">
                CO
              </div>
              <div class="card-panel-num"><count-to :start-val="0" :end-val="50" :duration="3600" class="card-panel-num-lg" /><span>/ 微克立方米</span></div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="24" :lg="4" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('shoppings')" style="border:none">
            <div class="card-panel-description">
              <div class="card-panel-text icon-2">
                O3
              </div>
              <div ><p class="card-panel-num"><count-to :start-val="0" :end-val="50" :duration="3600" class="card-panel-num-lg" /><span>/ 微克立方米</span></p></div>
            </div>
          </div>
        </el-col>


      </div>
    </el-col>


  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss"   scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    padding:0!important;
    border-right: 1px dashed #eee;
  }

  .card-panel {
    display: flex;
    height: 200px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
    }

    .icon-1 {
      color: #009bff;
    }

    .icon-2 {
      color: #ff9566;
    }

    .icon-3 {
      color: #f4516c;
    }

    .icon-4 {
      color: #02cb9d
    }

    .card-panel-icon-wrapper {
      text-align: center;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }


    .card-panel-description {
      font-weight: bold;
      text-align: center;
      margin: auto;
      width: 100%;

      .card-panel-text {
        margin-bottom: 20px;
        font-size: 26px;
      }
      .card-panel-num-lg{
        font-size: 22px;
      }
      .card-panel-num {
        width: 80%;
        margin:0 auto;
        text-align: center;
        font-size: 18px;
        background: #f2f7fd;
        padding: 10px 5px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
