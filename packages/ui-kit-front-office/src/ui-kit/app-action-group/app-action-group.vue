<template>
  <app-buttons-group>
    <app-action-button
      v-for="(button, i) in config"
      :key="i"
      :length="config.length"
      :icon="button.icon"
      :title="button.title"
      :disabled="button.disabled"
      @click="$emit(button.event)" />
  </app-buttons-group>
</template>

<script lang="ts">
import type { IActionButton } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { AppActionButton } from '../app-action-button';
import { AppButtonsGroup } from '../app-buttons-group';

export default defineComponent({
  name: 'AppActionGroup',
  components: {
    AppButtonsGroup,
    AppActionButton,
  },
  props: {
    config: { type: Array as PropType<IActionButton[]>, default: () => [] },
    rows: { type: Number, default: 1 },
  },
});
</script>
