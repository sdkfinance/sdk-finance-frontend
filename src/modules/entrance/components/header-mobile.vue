<template>
  <div class="flex">
    <div class="header-entrance__top">
      <div class="md:hidden header-entrance__logo-mini">
        <router-link :to="{ name: 'entrance' }">
          <img
            src="@/assets/images/logo.svg"
            alt="sdk.finance">
        </router-link>
      </div>

      <language-select class="header-entrance__language"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import LanguageSelect from '@/components/language-select.vue';
import HeaderLinks from '@/modules/entrance/components/header-links.vue';

@Component({
  components: {
    HeaderLinks,
    LanguageSelect,
  },
})
export default class HeaderMobile extends Vue {

  @Prop({ type: Boolean, default: false }) readonly isTopLogoVisible!: boolean;

}
</script>
