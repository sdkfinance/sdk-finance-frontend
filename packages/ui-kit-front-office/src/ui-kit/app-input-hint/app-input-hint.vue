<template>
  <div class="app-input-hint text-sm">
    <div class="app-input-hint__text">
      {{ $t('pages.profile_password.one_uppercase_letter') }}
    </div>
    <div class="app-input-hint__text">
      {{ $t('pages.profile_password.one_digit') }}
    </div>
    <div class="app-input-hint__text">
      {{ $t('pages.profile_password.one_lowercase_letter') }}
    </div>
    <div class="app-input-hint__text">
      {{ $t('pages.profile_password.at_least_nine_characters') }}
    </div>
    <div class="app-input-hint__text">
      {{ $t('pages.profile_password.one_special_character') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppInputHint',
});
</script>

<style lang="scss">
.app-input-hint {
  @apply grid grid-cols-2 gap-x-15 gap-y-8;

  &__text {
    @apply flex items-center whitespace-nowrap ml-10 relative;

    &::before {
      content: '';
      left: -9px;

      @apply rounded-full bg-primary w-4 h-4 mr-4 absolute;
    }
  }
}
</style>
