<template>
  <el-image
    ref="elImageRef"
    :class="appImageClassNames"
    :style="`max-width: ${maxWidth}px; max-height: ${maxHeight}px`"
    :src="imageUrl"
    :fit="fit"
    :alt="alt"
    :preview-src-list="previewSrcList" />
</template>

<script lang="ts">
import { Image } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

type TAppImageFitProp = 'fill' | 'cover' | 'contain' | 'none' | 'scale-down';

const IMAGE_INNER_SELECTOR = '.el-image__inner';
export default defineComponent({
  name: 'AppImage',
  components: {
    [Image.name]: Image,
  },
  props: {
    imageUrl: { default: '', type: String },
    maxWidth: { default: '410', type: String },
    maxHeight: { default: '312', type: String },
    alt: { type: String, default: undefined },
    fit: { type: String as PropType<TAppImageFitProp>, default: undefined },
    allowPreview: { type: Boolean, default: true },
    manualPreview: { type: Boolean, default: false },
  },
  computed: {
    previewSrcList() {
      if (!this.allowPreview) {
        return undefined;
      }

      return [this.imageUrl];
    },
    appImageClassNames() {
      return ['app-image', this.manualPreview && 'app-image--manual-preview'];
    },
    elImageRef: {
      cache: false,
      get() {
        return this.$refs.elImageRef as Image;
      },
      set() {},
    },
  },
  methods: {
    openPreview() {
      const imageElement = this.getElImageInnerElement();
      imageElement?.click();
    },
    getElImageInnerElement() {
      return this.elImageRef.$el?.querySelector(IMAGE_INNER_SELECTOR) as HTMLElement | null;
    },
  },
});
</script>

<style lang="scss">
.app-image {
  &--manual-preview {
    @apply pointer-events-none;
  }
}
</style>
