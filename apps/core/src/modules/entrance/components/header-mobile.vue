<template>
  <div class="flex">
    <div class="header-entrance__top">
      <div
        v-if="ENV_VARIABLES.brandLogoMUrl"
        class="md:hidden header-entrance__logo-mini">
        <router-link :to="{ name: 'entrance' }">
          <img
            :src="ENV_VARIABLES.brandLogoMUrl"
            alt="sdk.finance" />
        </router-link>
      </div>

      <language-select class="header-entrance__language" />
    </div>
  </div>
</template>

<script lang="ts">
import { ENV_VARIABLES } from '@sdk5/shared';
import { defineComponent } from 'vue';

import LanguageSelect from '@/components/language-select.vue';

export default defineComponent({
  components: {
    LanguageSelect,
  },
  props: {
    isTopLogoVisible: { type: Boolean, default: false },
  },
  computed: {
    ENV_VARIABLES() {
      return ENV_VARIABLES;
    },
  },
});
</script>
