<template>
  <app-buttons-group>
    <app-action-button
      v-for="(button, i) in config"
      :key="i"
      :length="config.length"
      :icon="button.icon"
      :title="button.title"
      :disabled="button.disabled"
      @click="$emit(button.event)"/>
  </app-buttons-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import AppActionButton from '@/components/ui-kit/app-action-button.vue';
import AppButtonsGroup from '@/components/ui-kit/app-buttons-group.vue';
import { IActionButton } from '@/types/interfaces';

@Component({
  components: {
    AppButtonsGroup,
    AppActionButton,
  },
})
export default class AppActionGroup extends Vue {

  @Prop({ type: Array, default: () => [] }) readonly config!: IActionButton[];

  @Prop({ type: Number, default: 1 }) readonly rows!: number;

}
</script>
