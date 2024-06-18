<template>
  <div class="footer-entrance-links">
    <a
      href="/downloads/PrivacyPolicy_TechFin_[sdkfinance.app].pdf"
      target="_blank">
      {{ $t('pages.entrance.privacy_policy') }}
    </a>
    <a
      href="/downloads/Terms_and_Conditions_TechFin_[sdkfinance.app].pdf"
      target="_blank">
      {{ $t('pages.entrance.terms_of_service') }}
    </a>
    <a
      href="/downloads/Cookie Policy_TechFin_[sdkfinance.app].pdf"
      target="_blank">
      {{ $t('pages.entrance.cookie_policy') }}
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
</script>
