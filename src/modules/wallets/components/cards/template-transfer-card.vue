<template>
  <div class="template-card">
    <div class="template-card__aside">
      <div :class="['template-card__icon', iconClass]">
        <slot name="icon"/>
      </div>
    </div>
    <div class="template-card__body">
      <div class="template-card__title">
        <slot name="title">
          {{ $t(title) }}
        </slot>
      </div>
      <div class="template-card__content">
        <slot/>
      </div>
      <div class="template-card__footer">
        <div class="template-card__content">
          <slot name="footer-content"/>
        </div>
        <div class="template-card__actions">
          <slot name="actions"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TemplateTransferCard extends Vue {

  @Prop({ type: String, default: '' }) readonly icon!: string;

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: Number, required: true }) readonly index!: number;

  protected get iconClass(): string {
    const icons = ['icon-blue', 'icon-green', 'icon-orange', 'icon-red'];
    const idx = this.index % 4;
    return icons[idx];
  }

}
</script>

<style lang="scss">
@mixin iconStyle($name, $color) {
  &.icon-#{$name} {
    background: rgba($color, 0.2);

    i {
      color: $color;
      font-size: 10px;
    }
  }
}

.template-card {
  display: flex;
  align-items: flex-start;
  background: $white;
  width: 368px;
  border: 1px solid #e9edf2;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 16px 20px;
  transition: box-shadow 0.5s;
  color: #2d2d2d;
  cursor: pointer;

  &__aside {
    padding-right: 20px;
  }

  &__icon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;

    @include iconStyle("blue", $primary-color);
    @include iconStyle("green", $green-color);
    @include iconStyle("orange", $orange-color);
    @include iconStyle("red", $red-color);

    img {
      width: 24px;
      height: 24px;
      object-fit: contain;
      object-position: center;
    }
  }

  &__title {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 16px;
  }

  &__content {
    font-weight: 600;
    font-size: 18px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__actions {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.5s;
  }

  &:hover {
    box-shadow: 0 4px 16px #f0f7fd;

    .template-card__actions {
      visibility: visible;
      opacity: 1;
    }
  }

  &__button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border: none;
    background-color: initial;
    padding: 4px;
    height: 25px;
    font-weight: 600;
    color: $white;
    font-size: 14px;
    box-sizing: border-box;
    transition: color 0.3s, background-color 0.3s;

    &--primary {
      color: $primary-color;

      &:hover {
        color: $white;
        background-color: $primary-color;
      }
    }

    &--danger {
      color: $red;

      &:hover {
        color: $white;
        background-color: $red;
      }
    }
  }
}
</style>
