<template>
  <div class="dashboard-container">
    <div class="dashboard-text">风险列表</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'list',
    computed: {
      ...mapGetters([
        'name'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
  &-container {
     margin: 30px;
   }
  &-text {
     font-size: 30px;
     line-height: 46px;
   }
  }
</style>
