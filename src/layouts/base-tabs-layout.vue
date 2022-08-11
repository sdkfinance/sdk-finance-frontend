<template>
  <section class="main-section">
    <main-head>
      <template #title>
        <slot name="title">
          {{ $t(title) }}
        </slot>
      </template>
      <template #actions>
        <slot name="actions"/>
      </template>
    </main-head>

    <tab-links :tabs="links"/>
    <slot>
      <router-view/>
    </slot>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MainHead from '@/components/main-head.vue';
import TabLinks from '@/components/ui-kit/app-tab-links.vue';
import { IRouteConfig } from '@/types/interfaces';

@Component({
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
