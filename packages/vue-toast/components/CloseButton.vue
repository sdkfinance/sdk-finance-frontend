<template>
  <component
    :is="buttonComponent"
    :aria-label="ariaLabel"
    :class="classes"
    v-on="$listeners">
    &times;
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { CLOSE_BUTTON_PROPS, VT_NAMESPACE } from '../constants';
import { RenderableToastContent } from '../types';
import { getVueComponentFromObj } from '../utils';

export default defineComponent({
  props: CLOSE_BUTTON_PROPS,
  computed: {
    buttonComponent(): RenderableToastContent {
      if (this.component !== false) {
        return getVueComponentFromObj(this.component);
      }

      return 'button';
    },
    classes(): string[] {
      const classes = [`${VT_NAMESPACE}__close-button`];

      if (this.showOnHover) {
        classes.push('show-on-hover');
      }

      return classes.concat(this.classNames);
    },
  },
});
</script>
