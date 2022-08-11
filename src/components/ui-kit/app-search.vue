<template>
  <div class="app-search">
    <transition name="slide-fade">
      <app-input
        v-if="isSearchFocus"
        ref="appSearch"
        v-model="search"
        size="small"
        class="app-search__input inline"
        placeholder="placeholder.input.start_typing"
        @blur="$emit('blur')"/>
    </transition>

    <i
      :class="!isSearchFocus
        ? 'icon-search app-search__icon-magnifier'
        : 'el-icon-close app-search__icon-close'"
      @click="toggleSearch"/>
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Emit, Ref, Prop,
} from 'vue-property-decorator';
import AppInput from '@/components/ui-framework/app-input.vue';

type TInputValue = string | number;

@Component({
  components: { AppInput },
})
export default class AppSearch extends Vue {

  @Ref('appSearch') readonly searchInput!: AppInput;

  @Prop({ type: [String, Number] }) readonly value!: TInputValue;

  protected isSearchFocus: boolean = false;

  protected get search(): TInputValue {
    return this.value;
  }

  protected set search(value: TInputValue) {
    this.updateValue(value);
  }

  @Emit('input')
  protected updateValue(value: TInputValue): TInputValue {
    return value;
  }

  @Emit('blur')
  protected onBlur(): boolean {
    return true;
  }

  @Emit('clear')
  protected onClear(): boolean {
    this.search = '';
    return true;
  }

  protected async toggleSearch(): Promise<void> {
    this.isSearchFocus = !this.isSearchFocus;

    if (this.isSearchFocus) {
      await this.$nextTick();
      this.searchInput.focus();
    } else {
      this.onClear();
    }
  }

}
</script>

<style lang="scss">
.app-search {
  @apply flex items-center;

  &__input {
    @apply origin-right;

    .el-input__inner {
      @apply px-0 rounded-none border-l-0 border-r-0 border-t-0 border-blue-accent #{!important};
    }
  }

  i {
    @apply text-blue-600 cursor-pointer ml-10;
  }

  &__icon-magnifier {
    @apply text-sm leading-none;
  }

  &__icon-close {
    @apply text-xl;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  @apply transition duration-200 ease-linear;
}

.slide-fade-enter,
.slide-fade-leave-to {
  @apply transform scale-x-0 opacity-0;
}
</style>
