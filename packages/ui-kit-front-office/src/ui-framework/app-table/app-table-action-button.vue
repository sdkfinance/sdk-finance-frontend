<template>
  <app-button
    :outlined="buttonProps.outlined"
    :size="buttonProps.size"
    :type="buttonProps.type"
    :disabled="disabled"
    :icon="icon"
    :only-icon="isOnlyIcon"
    @click="buttonClickHandler">
    {{ $t(label) }}
  </app-button>
</template>

<script lang="ts">
import type { TTableColumnAction } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { APP_BUTTON_SIZE, APP_BUTTON_TYPES, AppButton } from '../app-button';

export default defineComponent({
  name: 'AppTableActionButton',
  components: { AppButton },
  props: {
    icon: { type: String, default: undefined },
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    rowScope: { type: Object, required: true },
    actionFn: { type: Function as PropType<(...args: any[]) => void>, required: true },
    buttonOptions: {
      type: Object as PropType<TTableColumnAction['buttonOptions']>,
      default: () => ({}),
    },
  },
  computed: {
    buttonProps() {
      return {
        outlined: this.buttonOptions?.outlined ?? true,
        size: this.buttonOptions?.size ?? APP_BUTTON_SIZE.small,
        type: this.buttonOptions?.type ?? APP_BUTTON_TYPES.secondary,
      };
    },
    isOnlyIcon() {
      return typeof this.icon === 'string';
    },
  },
  methods: {
    buttonClickHandler() {
      this.actionFn(this.rowScope);
    },
  },
});
</script>
