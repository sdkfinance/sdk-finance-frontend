<template>
  <loader-stub>
    <div class="user-profile user-profile--two-column">
      <form-block
        title="placeholder.input.password">
        <password-form/>
      </form-block>
    </div>
  </loader-stub>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import FormBlock from '@/components/form-block.vue';
import LoaderStub from '@/components/loader-stub.vue';

import PasswordForm from './components/password-form.vue';

@Component({
  components: {
    LoaderStub,
    FormBlock,
    PasswordForm,
  },
})
export default class ProfilePassword extends Vue {
}

</script>
