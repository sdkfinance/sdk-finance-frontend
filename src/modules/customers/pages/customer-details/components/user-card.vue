<template>
  <div class="user-card">
    <img
      class="user-card__image"
      src="https://picsum.photos/140"
      alt="">

    <div class="user-card__content">
      <div class="user-card__info">
        <p>
          <span>{{ $t('pages.customer.status') }}: </span> <app-badge :status="status"/>
        </p>
        <p
          v-for="({ label, value }) in infoList"
          :key="label">
          <span>{{ label }}: </span> {{ value }}
        </p>
      </div>
      <div class="h-full flex flex-col justify-between">
        <app-button
          secondary
          size="small">
          {{ $t('pages.customer.action.contact_customer') }}
        </app-button>
        <app-social-links :links="socialLinks"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IInformationDetails } from '@/types/interfaces/InformationDetails.interface';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppBadge from '@/components/ui-kit/app-badge.vue';
import AppSocialLinks, { ISocialLinks } from '@/components/ui-kit/app-social-links.vue';

@Component({
  components: { AppSocialLinks, AppBadge, AppButton },
})
export default class UserCard extends Vue {

  @Prop({ type: Array, default: () => ([]) }) readonly infoList!: IInformationDetails[];

  @Prop({ type: String, default: '' }) readonly status!: string;

  protected socialLinks: ISocialLinks = {
    facebook: '/',
    instagram: '/',
    linkedin: '/',
    twitter: '/',
  }

}
</script>

<style lang="scss">
.user-card {
  @apply flex flex-wrap shadow-md rounded-7 p-16 mb-30;

  &__image {
    @apply rounded-7 md:mr-16 w-full sm:w-auto max-w-150 mx-auto mb-20 sm:mb-0;
  }

  &__content {
    @apply flex-grow flex flex-wrap justify-start;
  }

  &__info {
    @apply flex-grow flex flex-col w-full sm:w-auto mb-20 sm:mb-0;

    p:last-child {
      @apply mb-0;
    }

    p {
      @apply mb-10 text-sm text-gray-500;

      span {
        @apply font-medium mr-5 capitalize;
      }
    }
  }
}
</style>
