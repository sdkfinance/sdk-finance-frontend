<template>
  <aside class="dashboard-menu">
    <div class="dashboard-menu__box">
      <dashboard-menu-header/>
      <dashboard-nav :routes="routes"/>
    </div>
  </aside>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IRouteConfig } from '@/types/interfaces';
import DashboardNav from '@/layouts/dashboard/components/dashboard-nav.vue';
import DashboardMenuHeader from '@/layouts/dashboard/components/dashboard-menu-header.vue';

@Component({
  components: {
    DashboardMenuHeader,
    DashboardNav,
  },
})

export default class DashboardMenu extends Vue {

  @Prop({ required: true }) readonly routes!: IRouteConfig[];

}
</script>

<style lang="scss">
.dashboard-menu {
  @apply w-310 flex-shrink-0 relative;

  box-shadow: 0 4px 12px rgba(161, 182, 198, 0.2);

  &__box {
    @apply flex flex-col fixed top-0 bottom-0 left-0 w-310 h-screen bg-white ;
  }

  .el-loading-mask {
    @apply bg-white;
  }
}
</style>
