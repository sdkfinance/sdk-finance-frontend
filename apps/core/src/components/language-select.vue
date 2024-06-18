<template>
  <app-dropdown
    v-model="currentLanguage"
    :options="languageList"
    option-label="label"
    option-value="value"
    title-classes="text-blue-600"
    @click="changeLanguage">
    <img
      class="language-select__icon"
      :src="`/images/flags/${currentLanguage}.svg`"
      alt="flag" />
    {{ currentLanguage.toUpperCase() }}
  </app-dropdown>
</template>

<script lang="ts">
import type { TLanguageCode } from '@sdk5/shared/constants';
import { AppDropdown } from '@sdk5/ui-kit-entrance';
import { Component, Vue } from 'vue-property-decorator';

import { LanguageService } from '@/services/Language';

@Component({
  components: {
    AppDropdown,
  },
})
export default class LanguageSelect extends Vue {
  protected languageList = LanguageService.getAllLanguages().map((local) => ({ value: local.value, label: local.label }));

  protected currentLanguage = this.languageList[0].value;

  protected async changeLanguage(language: string): Promise<void> {
    await LanguageService.setLanguage(language as TLanguageCode);
  }
}
</script>

<style lang="scss">
.language-select {
  &__icon {
    @apply mr-5;
  }
}
</style>
