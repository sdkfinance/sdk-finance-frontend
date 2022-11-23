<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      <router-link
        v-if="isBackVisible"
        class="text-blue-600"
        :to="{ path: routePath }">
        <i class="el-icon-back mr-18"/>
      </router-link>
      {{ $t(title || defaultTitle) }}
    </template>
    <template #actions>
      <slot name="action"/>
    </template>

    <tab-links
      v-if="links.length"
      :tabs="links"
      secondary/>
    <slot/>
  </dashboard-content-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import TabLinks from '@/components/ui-kit/app-tab-links.vue';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import { LocalStorageService } from '@/services/LocalStorageService';
import { IRouteConfig } from '@/types/interfaces';

@Component({
  components: {
    TabLinks,
    DashboardContentLayout,
  },
})
export default class ContractsLayout extends Vue {

  @Prop({ default: () => ([]), type: Array }) readonly links!: IRouteConfig[];

  @Prop({ default: false, type: Boolean }) readonly isBackVisible!: boolean;

  @Prop({ default: '', type: [String, Object] }) readonly backLink!: string;

  @Prop({ default: false, type: Boolean }) readonly isContract!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isDetails!: boolean;

  @Prop({ default: '', type: String }) readonly defaultTitle!: boolean;

  protected title: string = 'pages.contracts.title';

  protected routePath: string = '/dashboard/contracts-old';

  created() {
    const { path, params: { contractId, profileId } } = this.$route;

    if (this.isContract) {
      this.title = this.getParam('contractName', 'contractId');
      [this.routePath] = path.split(contractId);
    } else if (this.isDetails) {
      this.title = this.getParam('profileName', 'profileId');
      [this.routePath] = path.split(profileId);
    }

  }

  protected getParam(param: string, key: string, defaultValue: string = ''): string {
    let result: string = '';

    const keyValue: string = this.$route.params[key] || '';
    const paramValue: string = this.$route.params[param] || '';

    if (paramValue) {
      result = paramValue;
      LocalStorageService.set(param, JSON.stringify({ [keyValue]: paramValue }));

    } else {
      const storage = LocalStorageService.get(param) || '""';
      const localParam = JSON.parse(storage) || {};
      result = localParam[keyValue];
      this.$route.params[param] = result;
    }

    return result || defaultValue;
  }

}
</script>
