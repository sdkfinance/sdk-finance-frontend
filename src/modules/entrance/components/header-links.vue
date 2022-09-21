<template>
  <div class="header-entrance-links">
    <div class="header-entrance__group">
      <router-link
        v-if="isTopLogoVisible"
        :to="{ name: 'entrance' }">
        <img
          src="@/assets/images/logo.svg"
          class="header-entrance__logo"
          alt="sdk.finance">
      </router-link>
      <a
        href="https://sdk.finance/?utm_source=sdkapp&utm_medium=sdkapp&utm_campaign=header-logo"
        class="header-entrance__link"
        target="_blank">
        {{ $t('pages.entrance.learn_more_about_sdk') }}
      </a>
    </div>

    <div class="header-entrance__group">
      <a
        href="/swagger/"
        class="header-entrance__link"
        target="_blank">
        {{ $t('pages.entrance.api') }}
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HeaderLinks extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isTopLogoVisible!: boolean;

}
</script>
