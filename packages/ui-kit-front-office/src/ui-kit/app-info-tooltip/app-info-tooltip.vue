<template>
  <app-tooltip
    ref="infoTooltipRef"
    class="info-tooltip"
    :tooltip-visible="tooltipVisible"
    :manual="isMobileOrWebview">
    <template #content>
      {{ tooltipContent }}
    </template>
    <span
      class="info-tooltip__info-icon"
      @click.prevent="infoIconClickHandler">
      !
    </span>
  </app-tooltip>
</template>

<script setup lang="ts">
import { useIsUaWebview } from '@sdk5/shared/composables';
import { checkMobile } from '@sdk5/shared/utils';
import { onClickOutside, useToggle } from '@vueuse/core';
import type { Ref } from 'vue';
import { ref } from 'vue';

import { AppTooltip } from '../../ui-framework/app-tooltip';

defineProps<{
  tooltipContent: string;
}>();

const isMobile = checkMobile();
const { isWebview } = useIsUaWebview();
const isMobileOrWebview = isMobile || isWebview;

const [tooltipVisible, toggleTooltipVisibility] = useToggle(false);
const infoTooltipRef = ref(null) as unknown as Ref<InstanceType<typeof AppTooltip>>;

onClickOutside(infoTooltipRef, () => {
  if (isMobileOrWebview) {
    toggleTooltipVisibility(false);
  }
});

const infoIconClickHandler = (event: Event) => {
  if (isMobileOrWebview) {
    toggleTooltipVisibility();
  }
};
</script>

<style lang="scss" scoped>
.info-tooltip {
  &__info-icon {
    @apply w-18 h-18 rounded-full inline-flex justify-center items-center bg-orange-main text-white text-10 ml-8 cursor-pointer font-bold;
  }
}
</style>
