<template>
  <div class="recovery-success">
    {{ successText }}
    <div class="entrance__info entrance__info--center">
      <router-link
        :to="linkParams"
        class="entrance__link">
        {{ linkText }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    isConfirm: { type: Boolean, default: false },
    login: { type: String, default: '' },
  },
  computed: {
    successText() {
      return this.isConfirm ? this.$t('pages.entrance.recovery.confirm_success_msg') : this.$t('pages.entrance.recovery.send_success_msg');
    },
    linkText() {
      return this.isConfirm ? this.$t('pages.entrance.recovery.go_to_login') : this.$t('pages.entrance.recovery.confirm_password_recovering');
    },
    linkParams() {
      return this.isConfirm ? { name: 'sign-in' } : { name: 'recover-password', query: { login: this.login } };
    },
  },
});
</script>

<style lang="scss">
.recovery-success {
  line-height: 1.6;
}
</style>
