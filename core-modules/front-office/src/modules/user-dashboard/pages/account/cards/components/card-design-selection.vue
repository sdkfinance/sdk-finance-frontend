<template>
  <div class="card-design-selection">
    <div class="card-design-selection__preview">
      <app-card-product-preview :background-image="previewCardBackgroundCollection[selectedPreviewCardBackground].backgroundPath" />

      <app-radio
        v-model="selectedPreviewCardBackground"
        class="card-design-selection-background">
        <div class="card-design-selection-background__list">
          <template v-for="color of cardBackgroundKeys">
            <app-radio-button
              :key="color"
              :label="color">
              <div
                class="card-design-selection-background__color-preview"
                :style="{ backgroundColor: previewCardBackgroundCollection[color].color }" />
            </app-radio-button>
          </template>
        </div>
      </app-radio>
      <div
        v-if="isNameOnCardSectionVisible"
        class="card-design-selection-section">
        <div class="card-design-selection-section__title">
          {{ $t('pages.user_dashboard.cards.issue_card_modal.name_on_card') }}
        </div>
        <app-radio
          v-model="selectedNameOnCardPreset"
          class="card-design-selection__name-preset">
          <template v-for="preset of nameOnCardPresets">
            <app-radio-button
              :key="preset"
              :label="preset">
              <span class="card-design-selection__name-preset__label"> {{ preset }}</span>
            </app-radio-button>
          </template>
        </app-radio>
      </div>
      <div class="card-design-selection-section">
        <div class="card-design-selection-section__title">
          {{ $t('pages.user_dashboard.cards.issue_card_modal.card_nick_name') }}
        </div>
        <app-input
          v-model="cardNickname"
          class="card-design-selection__nickname" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppCardProductPreview, AppInput, AppRadio, AppRadioButton } from '@sdk5/ui-kit-front-office';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

const COMPONENTS = {
  AppInput,
  AppCardProductPreview,
  AppRadioButton,
  AppRadio,
} as const;

@Component({
  model: {
    prop: 'value',
    event: 'change',
  },
  components: COMPONENTS,
})
export default class CardDesignSelection extends Vue {
  static components: typeof COMPONENTS;

  @Prop({ type: String, required: true }) readonly value!: string;

  $props!: {
    value: string;
  };

  protected readonly previewCardBackgroundCollection = {
    blue: { backgroundPath: '/images/card-products/card-bg-blue.svg', color: '#1B55E9' },
    gold: { backgroundPath: '/images/card-products/card-bg-gold.svg', color: '#F7931A' },
    grey: { backgroundPath: '/images/card-products/card-bg-gray.svg', color: '#7288A3' },
  };

  protected selectedPreviewCardBackground: keyof typeof this.previewCardBackgroundCollection = 'blue';

  protected nameOnCardPresets = ['[firstName] [lastName]', '[first] [middle] [last]'];

  protected selectedNameOnCardPreset = this.nameOnCardPresets[0];

  protected get isNameOnCardSectionVisible() {
    // Temporary hidden
    return false;
  }

  protected get cardBackgroundKeys() {
    return Object.keys(this.previewCardBackgroundCollection) as (keyof typeof this.previewCardBackgroundCollection)[];
  }

  protected get cardNickname() {
    return this.value;
  }

  protected set cardNickname(value: string) {
    this.emitChangeEvent(value);
  }

  @Emit('change')
  protected emitChangeEvent(value: string): any {
    return value;
  }
}
</script>

<style lang="scss">
.card-design-selection {
  &-background,
  &__name-preset {
    .el-radio__input,
    .el-radio__inner,
    .el-radio__label {
      @apply m-0 #{!important};
    }
  }

  &-background {
    &__list {
      @apply flex items-center justify-between;
    }

    &__color-preview {
      @apply w-[1.5rem] h-[1.5rem] rounded-[0.1875rem];
    }
  }

  &__preview {
    @apply flex flex-col gap-y-16;
  }

  &__name-preset {
    @apply grid grid-flow-row gap-y-[1.125rem] mt-16;

    &__label {
      @apply text-gray-500 font-medium text-base;
    }
  }

  &-section {
    @apply mt-24;
  }

  &__nickname {
    @apply mt-8;
  }
}
</style>
