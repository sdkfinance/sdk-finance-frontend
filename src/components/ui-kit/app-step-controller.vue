<template>
  <div class="app-step-controller">
    <button
      class="app-step-controller__back"
      @click="prevStep">
      <span class="icon-back-arrow"/>
      {{ $t('action.back') }}
    </button>
    <button
      v-if="isCloseVisible"
      class="icon-close-circle app-step-controller__close"
      @click="goToBackPage"/>
    <main class="app-step-controller__main app-step-controller__container">
      <transition name="page">
        <div>
          <slot v-bind="{ currentStep, nextStep, prevStep, goToBackPage }"/>
        </div>
      </transition>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AppStepController extends Vue {

  @Prop({ type: Number, default: 1 }) readonly totalSteps!: number;

  @Prop({ type: String, required: true }) readonly backName!: string;

  @Prop({ type: Boolean, default: false }) readonly isCloseVisible!: boolean;

  public currentStep: number = 1;

  public nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep += 1;
    }
  }

  public prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
      return;
    }
    this.goToBackPage();
  }

  public goToBackPage(): void {
    this.$router.push({ name: this.backName, params: this.$route.params });
  }

}
</script>

<style lang="scss">
.app-step-controller {
  @apply p-24 sm:p-45 overflow-x-hidden h-screen;

  &__back {
    @apply flex items-center text-blue-600 static md:absolute;

    span {
      @apply text-xs mr-8 leading-none;
    }
  }

  &__main {
    @apply h-auto;
  }

  &__container {
    @apply general-container;
  }

  &__close {
    @apply
      absolute
      top-40
      right-40
      transform
      text-20
      z-10
      text-blue-600
      cursor-pointer;
  }
}
</style>
