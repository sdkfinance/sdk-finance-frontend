<template>
  <div class="entrance-container">
    <header-back-link/>
    <div class="entrance">
      <header class="entrance__header">
        <header-links
          class="hidden md:flex header-entrance"
          :is-top-logo-visible="isTopLogoVisible"/>

        <header-mobile
          class="flex-grow md:flex-grow-0"
          :is-top-logo-visible="isTopLogoVisible"/>
        <p class="md:hidden text-blue-600 ml-30">
          <i
            class="icon-dropdown"
            @click="openModal"/>
        </p>

        <app-modal
          ref="entranceModal"
          is-full-width>
          <template #default>
            <div class="entrance-modal">
              <header-mobile
                :is-top-logo-visible="isTopLogoVisible"
                class="max-w-310 mt-5 -ml-5"/>
              <header-links :is-top-logo-visible="isTopLogoVisible"/>
              <footer-links/>
            </div>
          </template>
        </app-modal>
      </header>

      <slot>
        <router-view/>
      </slot>

      <footer class="footer-entrance">
        <footer-links class="hidden md:flex"/>
        <p class="footer-entrance__copyright">
          {{ $t('pages.entrance.copyright', { date: currentYear }) }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Ref, Vue,
} from 'vue-property-decorator';
import LanguageSelect from '@/components/language-select.vue';
import AppModal from '@/components/ui-kit/modals/app-modal.vue';
import HeaderLinks from '@/modules/entrance/components/header-links.vue';
import HeaderMobile from '@/modules/entrance/components/header-mobile.vue';
import FooterLinks from '@/modules/entrance/components/footer-links.vue';
import HeaderBackLink from '@/layouts/components/header-back-link.vue';

@Component({
  components: {
    HeaderBackLink,
    HeaderLinks,
    HeaderMobile,
    FooterLinks,
    AppModal,
    LanguageSelect,
  },
})
export default class EntranceLayout extends Vue {

  @Ref('entranceModal') readonly entranceModal!: AppModal;

  @Prop({ type: Boolean, default: false }) readonly isTopLogoVisible!: boolean;

  protected currentYear: number = new Date().getFullYear();

  protected openModal(): void {
    this.entranceModal.open();
  }

}
</script>

<style lang="scss">
@mixin entrance-info {
  @apply inline-block text-left text-base mb-16;
}

.entrance-container {
  @apply h-screen bg-gray-200;
}

.entrance {
  @apply flex flex-col py-30 px-25 md:px-40 h-full;

  height: calc(100% - 44px);

  &__header {
    @apply flex;
  }

  &__info {
    @include entrance-info;

    &--center {
      @apply text-center;
    }
  }

  &__link {
    @apply text-blue-600 inline-block text-left text-base;
  }

  &-modal {
    @apply flex flex-col px-20 pt-25;

    .header-entrance-links {
      @apply flex flex-col mb-30;

      .header-entrance__group {
        @apply flex-col items-start;

        a {
          @apply m-0 mb-25;
        }
      }
    }

    .footer-entrance-links {
      @apply flex flex-col p-0 m-0;

      a {
        @apply mb-25;
      }
    }
  }
}

.header-entrance,
.footer-entrance {
  @apply items-center justify-between text-base;

  &__language {
    @apply ml-15 inline-block;
  }

  &__logo {
    @apply h-auto;

    max-width: 118px;
  }

  &__group {
    @apply flex items-center;
  }

  &__link {
    @apply text-blue-600 ml-15;

    &__label {
      @apply inline-block cursor-pointer ml-8 font-medium px-4 py-0;
      @apply rounded-2 text-11 text-red-light border-red-light leading-snug;
    }
  }
}

.entrance-form-container {
  @apply flex flex-grow flex-col md:justify-center items-center w-full mx-auto md:max-w-350;

  .entrance-form__footer {
    @apply text-base mb-20;

    a {
      @apply underline text-blue-600;
    }

    &--confirm {
      @apply mt-15;
    }
  }
}

.form-entrance {
  @apply flex flex-col justify-center text-center bg-white p-32 w-full mb-40 rounded-7 border border-blue-400;

  &__logo {
    @apply mb-40;

    img {
      @apply inline-block w-220;
    }
  }
}

.header-entrance {
  @apply flex-grow;

  &__top {
    @apply flex flex-grow md:flex-grow-0 mb-50 md:mb-0;
  }

  &__logo-mini {
    @apply max-w-100 mr-auto;
  }
}

.footer-entrance {
  @apply flex flex-col p-0 m-auto;

  max-width: 360px;

  &-links {
    @apply px-10 mb-15 w-full justify-between;

    a {
      @apply text-blue-600;
    }
  }

  &__copyright {
    @apply text-center max-w-220 md:max-w-full;
  }
}

.back-pointer {
  @apply text-blue-600 flex items-center mb-25 text-base;

  i {
    @apply mr-10 font-thin;

    font-size: 5px;
  }
}

</style>
