<template>
  <div class="header-entrance-links">
    <div class="header-entrance__group">
      <slot name="headerLogo">
        <router-link
          v-if="isTopLogoVisible"
          :to="{ name: 'entrance' }">
          <img
            src="@/assets/images/logo.svg"
            class="header-entrance__logo"
            alt="sdk.finance" />
        </router-link>
      </slot>
    </div>

    <div class="header-entrance__group">
      <router-link
        class="header-entrance__link"
        :to="{
          name: 'api-list',
        }">
        {{ $t('pages.api_list.title') }}
      </router-link>
      <a
        href="/swagger/"
        class="header-entrance__link"
        target="_blank">
        {{ $t('pages.entrance.full_api_reference') }}
      </a>
      <a
        href="/downloads/SDK5_manual_guide.pdf"
        class="header-entrance__link"
        target="_blank">
        {{ $t('pages.entrance.manual_guide') }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isTopLogoVisible?: boolean;
  }>(),
  {
    isTopLogoVisible: false,
  },
);
</script>

<style lang="scss">
.header-entrance__link {
  &.router-link-exact-active {
    @apply text-blue-500;
  }
}
</style>
