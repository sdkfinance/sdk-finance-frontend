<template>
  <div class="dashboards-catalog">
    <router-link
      :to="{ name: 'entrance' }"
      class="dashboards-catalog__title">
      <i class="el-icon-back"/> {{ $t('pages.dashboards.title') }}
    </router-link>
    <ul class="dashboards-catalog__list">
      <li
        v-for="({ name, id }, i) in dashboardList"
        :key="`dashboard_${i}`"
        class="dashboards-catalog__list__item">
        <router-link :to="{ name: 'dashboards-view', params: { id } }">
          <h3 class="dashboards-catalog__list__item__title">
            {{ $t(name) }}
          </h3>
          <span class="dashboards-catalog__list__item__icon">
            <i class="el-icon-right"/>
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { IDashboardsList } from '@/modules/dashboards-power-bi/types/dashboards.types';

import { DASHBOARDS_LIST } from '../constants/dashboardsList';

@Component
export default class DashboardList extends Vue {

  protected dashboardList: IDashboardsList[] = DASHBOARDS_LIST;

}

</script>

<style lang="scss">
  .dashboards-catalog {
    flex-grow: 1;
    margin-left: 20px;
    margin-right: 20px;
    padding-top: 110px;
    padding-bottom: 30px;
    color: #1f2d3d;

    &__title {
      display: block;
      color: #1f2d3d;
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 60px;
    }

    &__list {
      padding-left: 0;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: minmax(120px, auto);
      grid-row-gap: 30px;
      grid-column-gap: 30px;

      @media screen and (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 15px;
        grid-column-gap: 15px;
      }

      @media screen and (max-width: 600px) {
        grid-template-columns: 1fr;
      }

      &__item {
        background: #fff;
        border: 1px solid #ebeef5;
        box-sizing: border-box;
        border-radius: 4px;
        padding: 20px;

        a {
          display: block;
        }

        &__title {
          font-weight: bold;
          font-size: 24px;
          color: #1f2d3d;
          margin-top: 0;
          margin-bottom: 4px;
          min-height: 56px;
        }

        &__icon {
          display: flex;
          margin-left: auto;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          background: #ecf5ff;
          border: 1px solid #d9ecff;
          box-sizing: border-box;
          border-radius: 50%;
        }
      }
    }
  }
</style>
