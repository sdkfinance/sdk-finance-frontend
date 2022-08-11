<template>
  <div class="dashboards-view">
    <router-link
      :to="{ name: 'dashboards-list' }"
      class="dashboards-view__title">
      <i class="el-icon-back"/> {{ $t(currentDashboard.name) }}
    </router-link>
    <div class="dashboards-view__iframe">
      <iframe
        width="100%"
        height="100%"
        :src="`https://app.powerbi.com/view?r=${currentDashboard.id}`"
        frameborder="0"
        allowFullScreen="true"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IDashboardsList } from '@/modules/dashboards-power-bi/types/dashboards.types';
import { DASHBOARDS_LIST } from '../constants/dashboardsList';

@Component
export default class DashboardsView extends Vue {

  protected get currentDashboard(): IDashboardsList | undefined {
    return DASHBOARDS_LIST.find(({ id }) => id === this.$route.params.id);
  }

}
</script>

<style lang="scss">
  .dashboards-view {
    flex-grow: 1;
    margin-left: 20px;
    margin-right: 20px;
    padding-top: 110px;
    padding-bottom: 30px;

    &__title {
      display: block;
      color: #1f2d3d;
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 60px;
    }

    &__iframe {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding-top: 56.25%;
      border: 1px solid #ebeef5;
      box-sizing: border-box;
      border-radius: 4px;

      iframe {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
      }
    }
  }
</style>
