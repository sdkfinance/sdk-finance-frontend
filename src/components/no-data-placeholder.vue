<template>
  <div class="no-data-placeholder">
    <div class="no-data-placeholder__title">
      <slot><i class="no-data-placeholder__icon icon-info-circle"/> {{ $t(title) }}</slot>
    </div>
    <div
      v-if="showAction"
      class="no-data-placeholder__action">
      <slot name="action">
        <app-button
          @click="$emit('click')">
          {{ $t(actionText) }}
        </app-button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppButton from '@/components/ui-framework/app-button.vue';

@Component({
  components: {
    AppButton,
  },
})
export default class NoDataPlaceholder extends Vue {

  @Prop({ type: String, default: '' }) readonly title!: string;

  @Prop({ type: String, default: '' }) readonly actionText!: string;

  @Prop({ type: Boolean, default: true }) readonly showAction!: string;

}
</script>

<style lang="scss">
.no-data-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  min-height: 175px;
  box-sizing: border-box;
  background: #f3f7fd;
  border-radius: 8px;

  &__title {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 18px;

    .no-data-placeholder__icon {
      color: $primary-color;
      margin-right: 12px;
      font-size: 16px;
    }
  }

  &__action {
    margin-top: 20px;
  }
}
</style>
