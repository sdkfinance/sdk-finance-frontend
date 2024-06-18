<template>
  <entrance-layout class="api-list-layout">
    <template #headerLogo>
      <div class="api-list-layout__title">
        <router-link :to="{ name: 'entrance' }">
          <i class="icon icon-arrow-left" />
        </router-link>
        {{ $t('pages.api_list.title') }}
      </div>
    </template>
  </entrance-layout>
</template>

<script setup lang="ts">
import EntranceLayout from '../../../layouts/entrance-layout.vue';
</script>

<style lang="scss">
.api-list-layout {
  &__title {
    @apply text-gray-500 font-semibold text-[2.25rem] leading-[2.875rem] gap-x-[1rem];

    &,
    a {
      @apply flex items-center;
    }

    .icon {
      @apply text-blue-600 text-[1rem] leading-[normal];

      &::before {
        @apply text-[1em];
      }
    }
  }
}
</style>
