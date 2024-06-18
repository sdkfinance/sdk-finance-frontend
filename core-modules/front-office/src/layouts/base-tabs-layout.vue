<template>
  <section class="main-section">
    <main-head>
      <template #title>
        <slot name="title">
          {{ $t(title) }}
        </slot>
      </template>
      <template #actions>
        <slot name="actions" />
      </template>
    </main-head>

    <tab-links :tabs="links" />
    <slot>
      <router-view />
    </slot>
  </section>
</template>

<script lang="ts">
import type { IRouteConfig } from '@sdk5/shared/types';
import { AppTabLinks as TabLinks, MainHead } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'base-tabs-layout',
  components: {
    MainHead,
    TabLinks,
  },
})
export default class BaseTabsLayout extends Vue {
  @Prop({ type: Array, required: true }) readonly links!: IRouteConfig[];

  @Prop({ type: String, default: '' }) readonly title!: string;
}
</script>
