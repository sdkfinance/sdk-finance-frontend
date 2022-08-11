<template>
  <transition :name="isFullWidth ? 'modal-fade': 'modal-slide'">
    <div
      v-show="isVisible"
      class="app-modal__overlay">
      <div
        ref="modal"
        role="dialog"
        :style="`width: ${modalWidth}`"
        class="app-modal"
        :class="modalClasses">
        <div
          v-if="isVisible"
          class="app-modal__body"
          :class="modalBodyClass">
          <i
            class="icon-close-circle app-modal__close"
            @click="close"/>
          <header
            v-if="$slots.header"
            class="app-modal__header">
            <slot name="header"/>
          </header>
          <main class="app-modal__main">
            <slot v-bind="{ onSubmit, onClose }"/>
          </main>
          <footer
            v-if="$slots.footer"
            class="app-modal__footer">
            <slot name="footer"/>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  Component, Prop, Watch, Emit, Vue,
} from 'vue-property-decorator';
import { IPlainObject } from '@/types/interfaces';

function preventDefault(e: Event) {
  const evt = e || window.event;

  if (evt.preventDefault) {
    evt.preventDefault();
  }

  evt.returnValue = false;
}
@Component
export default class AppModal extends Vue {

  @Prop({
    default: '400px',
    type: String,
    validator(value: any): boolean {
      return value.indexOf('px') !== -1;
    },
  }) readonly width!: string;

  @Prop({
    default: null,
    type: String,
  }) readonly modalBodyClass!: null | string;

  @Prop({ default: false, type: Boolean }) readonly isFixedHeader!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isFixedFooter!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isFullWidth!: boolean;

  @Prop({ default: false, type: Boolean }) readonly isCentred!: boolean;

  protected isVisible: boolean = false;

  public onSubmit: Function = () => true;

  public onClose: Function = () => false;

  protected get scrollWidth(): number {
    return window.innerWidth - document.body.clientWidth;
  }

  protected get modalWidth(): string {
    return this.isFullWidth ? '100%' : this.width;
  }

  protected get modalClasses(): IPlainObject {
    return {
      'is-fixed-header': this.isFixedHeader,
      'is-fixed-footer': this.isFixedFooter,
      'app-modal--full-width': this.isFullWidth,
      'app-modal--centered': this.isCentred,
    };
  }

  @Emit('submitted')
  protected submitted<T, K>(data: K, payload: T): { data: K; payload: T } {
    return { data, payload };
  }

  @Emit('closed')
  protected closed(): boolean {
    return false;
  }

  protected created(): void {
    window.addEventListener('keyup', this.onKeyUpHandler);
  }

  protected beforeDestroy(): void {
    window.removeEventListener('keyup', this.onKeyUpHandler);
  }

  @Watch('isVisible')
  protected onVisibleChange(value: boolean): void {
    const element: HTMLElement = document.body;

    if (value) {
      element.style.paddingRight = `${this.scrollWidth}px`;
      element.classList.add('scroll-hidden');
      document.addEventListener('touchmove', preventDefault, { passive: true });
      window.addEventListener('touchmove', preventDefault, { passive: true });
    } else {
      element.classList.remove('scroll-hidden');
      document.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      element.style.paddingRight = '0px';
    }

  }

  public open<T>(payload: T|boolean = true): Promise<any> {
    this.isVisible = true;
    return new Promise((resolve) => {
      this.onSubmit = (data: any) => {
        this.submitted(data, payload);
        this.isVisible = false;
        resolve({ data, payload });
      };
      this.onClose = () => {
        this.closed();
        this.isVisible = false;
        resolve(false);
      };
    });
  }

  public close(): void {
    this.onClose();
    this.isVisible = false;
  }

  protected onKeyUpHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.close();
      this.onClose();
    }
  }

}

</script>

<style lang="scss">

.app-modal {
  @apply absolute overflow-y-visible inset-y-0 right-0 m-0 bg-white z-20 md:w-400 transform duration-500;

  @media (max-width: theme('screens.sm')) {
    @apply w-full #{!important};
  }

  &__overlay {
    @apply fixed inset-0 z-40 bg-blue-700 bg-opacity-85 overflow-hidden transition duration-200 ;
  }

  &__body {
    @apply h-screen flex flex-col;
  }

  &__close {
    @apply
      absolute
      top-22
      right-24
      transform
      md:-left-16
      md:top-16
      md:right-initial
      md:-translate-x-full
      text-20
      z-10
      text-white
      cursor-pointer;
  }

  &--full-width {
    @apply overflow-y-auto overflow-x-hidden;

    .app-modal__close {
      @apply left-initial top-25 right-25 sm:top-40 sm:right-40 text-blue-600;
    }

    .app-modal__body {
      @apply mx-auto px-10;
    }

    .app-modal__header {
      @apply border-none text-center mt-30 mb-50 sm:mt-50 sm:mb-60;
    }
  }

  &--centered {
    .app-modal__main {
      @apply flex items-center justify-center;
    }
  }

  &__header {
    @apply flex-shrink-0 border-b border-blue-300;
  }

  &__main {
    @apply flex-grow;
  }

  &__footer {
    @apply flex-shrink-0 border-t border-blue-300 py-15 px-25;
  }

  &.is-fixed-header .app-modal__header {
    @apply fixed top-0 inset-x-0;
  }

  &.is-fixed-footer .app-modal__footer {
    @apply fixed bottom-0 inset-x-0;
  }
}

.modal-slide-enter,
.modal-slide-leave-to {
  @apply opacity-0;

  .app-modal {
    @apply transform translate-x-full;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  @apply transition duration-300;
}

.modal-fade-enter {
  @apply opacity-0;
}

.modal-fade-leave-to {
  @apply opacity-0;
}
</style>
