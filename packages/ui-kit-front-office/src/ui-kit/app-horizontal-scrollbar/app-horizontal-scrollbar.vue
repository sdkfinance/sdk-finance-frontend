<template>
  <div
    ref="horizontalScrollbarRef"
    class="horizontal-scrollbar">
    <app-button
      v-if="showButtons"
      :disabled="isLeftButtonDisabled"
      class="horizontal-scrollbar__button"
      size="small"
      icon="icon-back-arrow"
      rounded
      outlined
      only-icon
      @click="leftButtonClickHandler" />
    <div
      ref="horizontalScrollbarTrackRef"
      class="horizontal-scrollbar__track">
      <div
        ref="horizontalScrollbarThumbRef"
        :style="thumbTemplateStyle"
        class="horizontal-scrollbar__thumb"
        @touchstart="startThumbDragging"
        @mousedown="startThumbDragging" />
    </div>
    <app-button
      v-if="showButtons"
      :disabled="isRightButtonDisabled"
      class="horizontal-scrollbar__button horizontal-scrollbar__button--right"
      size="small"
      icon="icon-back-arrow"
      rounded
      outlined
      only-icon
      @click="rightButtonClickHandler" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { AppButton } from '../../ui-framework/app-button';

const SCROLL_DELTA = 50;
const SCROLLBAR_TRACK_PADDING = 2;

export default defineComponent({
  name: 'AppHorizontalScrollbar',
  components: { AppButton },
  props: {
    scrollElement: { type: [Element, String], required: true },
    parentElement: { type: [Element, String], default: undefined },
    showButtons: { type: Boolean, default: true },
  },
  data() {
    return {
      thumbWith: 0,
      thumbPosition: 0,
      isThumbDragging: false,
      isLeftButtonDisabled: false,
      isRightButtonDisabled: false,
      thumbDragStartPositionX: null as number | null,
      scrollHtmlElement: null as Element | null,
      elementRefMutationObserver: null as MutationObserver | null,
      scrollBarRefMutationObserver: null as MutationObserver | null,
    };
  },
  computed: {
    thumbWithSting(): string {
      return `${this.thumbWith}px`;
    },
    thumbTransformString(): string {
      return `translateX(${Math.abs(this.thumbPosition)}px)`;
    },
    thumbTemplateStyle() {
      return {
        width: this.thumbWithSting,
        transform: this.thumbTransformString,
      };
    },
    horizontalScrollbarRef: {
      cache: false,
      get() {
        return this.$refs.horizontalScrollbarRef as HTMLDivElement;
      },
      set() {},
    },
    horizontalScrollbarTrackRef: {
      cache: false,
      get() {
        return this.$refs.horizontalScrollbarTrackRef as HTMLDivElement;
      },
      set() {},
    },
    horizontalScrollbarThumbRef: {
      cache: false,
      get() {
        return this.$refs.horizontalScrollbarThumbRef as HTMLDivElement;
      },
      set() {},
    },
  },
  watch: {
    thumbPosition: [{ immediate: true, handler: 'thumbPositionChangeHandler' }],
    showButtons: [{ immediate: true, handler: 'showButtonsPropChangeHandler' }],
  },
  created() {
    this.elementRefMutationObserver = new MutationObserver(this.refMutationObserverCallBack);
    this.scrollBarRefMutationObserver = new MutationObserver(this.refMutationObserverCallBack);
  },
  mounted() {
    if (!this.scrollElement || !this.horizontalScrollbarRef) {
      return;
    }

    this.getScrollHtmlElement();

    if (!this.scrollHtmlElement) {
      return;
    }

    this.scrollHtmlElement.scrollLeft = 0;

    this.elementRefMutationObserver?.observe(this.scrollHtmlElement, { subtree: true, childList: true, attributes: true });
    this.scrollBarRefMutationObserver?.observe(this.horizontalScrollbarRef, { subtree: true, childList: true, attributes: true });

    document.addEventListener('mousemove', this.onThumbDrag);
    document.addEventListener('mouseup', this.endThumbDragging);
    document.addEventListener('touchmove', this.onThumbDrag);
    document.addEventListener('touchend', this.endThumbDragging);

    this.calculateThumbWith(this.scrollHtmlElement);
    this.calculateScrollbarThumbPosition(this.scrollHtmlElement);
    this.checkIsButtonsAreDisabled(this.thumbPosition);
  },
  methods: {
    getScrollHtmlElement(): void {
      if (typeof this.scrollElement === 'string') {
        this.scrollHtmlElement = this.getScrollParentElement().querySelector(this.scrollElement);
      } else {
        this.scrollHtmlElement = this.scrollElement;
      }
    },
    refMutationObserverCallBack(): void {
      if (!this.scrollHtmlElement) {
        return;
      }

      this.calculateThumbWith(this.scrollHtmlElement);
      this.calculateScrollbarThumbPosition(this.scrollHtmlElement);
    },
    getScrollParentElement(): Element {
      if (!this.parentElement) {
        return document as unknown as Element;
      }

      if (typeof this.parentElement === 'string') {
        return document.querySelector(this.parentElement) ?? (document as unknown as Element);
      }

      return this.parentElement;
    },
    getClientXPosition(event: MouseEvent | TouchEvent): number {
      const isTouchEvent = (value: unknown): value is TouchEvent => (value as TouchEvent).type.startsWith('touch');

      if (isTouchEvent(event)) {
        return event.touches[0].clientX;
      }

      return event.clientX;
    },
    getScrollbarTrackWith(): number {
      if (!this.horizontalScrollbarTrackRef) {
        return 0;
      }

      return this.horizontalScrollbarTrackRef.offsetWidth - SCROLLBAR_TRACK_PADDING;
    },
    getMaxThumbPosition(): number {
      return this.getScrollbarTrackWith() - this.thumbWith;
    },
    calculateThumbWith(element: Element): void {
      this.thumbWith = parseFloat(((element.clientWidth / element.scrollWidth) * this.getScrollbarTrackWith()).toFixed(4));
    },
    calculateScrollbarThumbPosition(option: Element | number): number {
      let thumbPosition: number;

      if (typeof option !== 'number') {
        const { scrollLeft, scrollWidth, clientWidth } = option;
        thumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * (this.getScrollbarTrackWith() - this.thumbWith);
      } else {
        thumbPosition = Math.max(0, Math.min(this.getMaxThumbPosition(), this.thumbPosition + option));
      }

      if (Number.isNaN(thumbPosition)) {
        thumbPosition = 0;
      }

      this.thumbPosition = thumbPosition;
      return thumbPosition;
    },
    calculateElementRefScrollLeft(thumbPosition: number): void {
      if (!this.scrollHtmlElement) {
        return;
      }

      const { scrollWidth, clientWidth } = this.scrollHtmlElement;
      const maxScrollLeft = scrollWidth - clientWidth;
      const maxThumbPosition = this.getMaxThumbPosition();
      this.scrollHtmlElement.scrollLeft = (thumbPosition / maxThumbPosition) * maxScrollLeft;
    },
    leftButtonClickHandler(): void {
      this.calculateScrollbarThumbPosition(-SCROLL_DELTA);
    },
    rightButtonClickHandler(): void {
      this.calculateScrollbarThumbPosition(SCROLL_DELTA);
    },
    startThumbDragging(event: MouseEvent | TouchEvent): void {
      if (!this.scrollElement) {
        return;
      }

      this.isThumbDragging = true;
      this.thumbDragStartPositionX = this.getClientXPosition(event);
    },
    endThumbDragging(): void {
      this.isThumbDragging = false;
    },
    onThumbDrag(event: MouseEvent | TouchEvent): void {
      if (!this.isThumbDragging || typeof this.thumbDragStartPositionX !== 'number') {
        return;
      }

      const eventClientXPosition = this.getClientXPosition(event);
      const delta = eventClientXPosition - this.thumbDragStartPositionX;
      this.calculateScrollbarThumbPosition(delta);
      this.thumbDragStartPositionX = eventClientXPosition;
      event.preventDefault();
    },
    checkIsButtonsAreDisabled(thumbPosition: number) {
      this.isLeftButtonDisabled = thumbPosition <= 0;
      this.isRightButtonDisabled = thumbPosition >= this.getMaxThumbPosition();
    },
    beforeDestroy() {
      this.elementRefMutationObserver?.disconnect();
      this.scrollBarRefMutationObserver?.disconnect();
      document.removeEventListener('mousemove', this.onThumbDrag);
      document.removeEventListener('mouseup', this.endThumbDragging);
      document.removeEventListener('touchmove', this.onThumbDrag);
      document.removeEventListener('touchend', this.endThumbDragging);
    },
    thumbPositionChangeHandler(thumbPosition: number): void {
      this.calculateElementRefScrollLeft(thumbPosition);
      this.checkIsButtonsAreDisabled(thumbPosition);
    },
    showButtonsPropChangeHandler(showButtons: boolean) {
      if (showButtons) {
        this.checkIsButtonsAreDisabled(this.thumbPosition);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.horizontal-scrollbar {
  @apply w-full overflow-hidden rounded-[1.25rem] flex items-center gap-x-[0.5rem];

  &__thumb,
  &__track {
    @apply h-full rounded-[inherit] overflow-hidden;
  }

  &__thumb {
    @apply bg-blue-300 max-w-full will-change-transform;
  }

  &__track {
    @apply w-full h-[0.5rem] relative bg-blue-400 p-[0.0625rem] flex items-center;
  }

  &__button {
    @apply w-[1.25rem] h-[1.25rem];

    &--right {
      @apply rotate-180;
    }
  }
}
</style>

<style lang="scss">
.horizontal-scrollbar {
  &__button {
    .icon,
    .icon::before {
      @apply flex items-center justify-center flex-col;
    }

    .icon {
      @apply w-[1rem] h-[1rem] leading-[normal];

      &::before {
        @apply relative left-[1px] text-[0.6rem];
      }
    }
  }
}
</style>
