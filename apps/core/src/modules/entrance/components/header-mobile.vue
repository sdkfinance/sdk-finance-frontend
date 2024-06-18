<template>
  <div class="flex">
    <div class="header-entrance__top">
      <div class="md:hidden header-entrance__logo-mini">
        <router-link :to="{ name: 'entrance' }">
          <img
            src="@/assets/images/logo.svg"
            alt="sdk.finance" />
        </router-link>
      </div>

      <language-select class="header-entrance__language" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LanguageSelect from '@/components/language-select.vue';

export default defineComponent({
  components: {
    LanguageSelect,
  },
  props: {
    isTopLogoVisible: { type: Boolean, default: false },
  },
});
</script>
