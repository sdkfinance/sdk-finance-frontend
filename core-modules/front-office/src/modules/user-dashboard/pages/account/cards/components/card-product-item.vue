<template>
  <div
    :class="['card-item', isSelected && 'card-item--selected']"
    role="button"
    @click="selectProductHandler">
    <div class="card-item-top">
      <div class="card-item__image-wrapper">
        <img
          :src="imagePath"
          :alt="productTitle"
          class="card-item__image" />
      </div>

      <span class="card-item__title">{{ productTitle }}</span>
    </div>
    <div class="card-item__description">
      {{ productDescription }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class CardProductItem extends Vue {
  @Prop({ type: String, required: true }) readonly imagePath!: string;

  @Prop({ type: String, required: true }) readonly productTitle!: string;

  @Prop({ type: String, required: true }) readonly productDescription!: string;

  @Prop({ type: Boolean, default: false }) readonly isSelected!: boolean;

  @Prop({ type: String, required: true }) readonly productId!: string;

  $props!: {
    imagePath: string;
    productTitle: string;
    productDescription: string;
    isSelected?: boolean;
    productId: string;
  };

  protected selectProductHandler() {
    this.emitSelectProduct(this.productId);
  }

  @Emit('select-product')
  protected emitSelectProduct(productId: string): any {
    return productId;
  }
}
</script>

<style lang="scss" scoped>
.card-item {
  @apply p-16 rounded-8 border border-solid border-blue-300 bg-white cursor-pointer;

  &--selected {
    @apply border-2 border-blue-accent;
  }

  &-top {
    @apply flex items-center gap-x-8 mb-8;
  }

  &__image-wrapper {
    @apply w-[36px] h-[22px] overflow-hidden rounded-4;
  }

  &__image {
    @apply w-full h-full;
  }

  &__title {
    @apply text-gray-500 font-semibold text-lg;
  }

  &__description {
    @apply text-black font-medium text-base text-left;
  }
}
</style>
