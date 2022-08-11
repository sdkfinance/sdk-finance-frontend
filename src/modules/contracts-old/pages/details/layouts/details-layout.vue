<template>
  <contracts-layout
    :links="[]"
    :is-back-visible="true"
    :default-title="title"
    :is-details="true">
    <div class="table-head">
      <h3>{{ $t('pages.contracts.details.commission') }}</h3>
      <slot name="commission-action"/>
    </div>
    <slot name="commission-table"/>
    <div class="table-head">
      <h3>{{ $t('pages.contracts.details.limits') }}</h3>
      <slot name="limits-action"/>
    </div>
    <slot name="limits-table"/>
    <slot/>
  </contracts-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ContractsLayout from '@/modules/contracts-old/layouts/contacts-layout.vue';

@Component({
  components: {
    ContractsLayout,
  },
})
export default class DetailsLayout extends Vue {

  @Prop({ type: String, default: '' }) readonly title!: string;

}
</script>

<style lang="scss">
.details-table {
  flex: initial;
  margin-bottom: 56px;
}
</style>
