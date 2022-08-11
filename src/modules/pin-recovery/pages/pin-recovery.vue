<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.pin_recovery.title') }}
      </template>
    </main-head>
    <recovery-form class="recovery-pin"/>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainHead from '@/components/main-head.vue';
import RecoveryForm from '../components/recovery-form.vue';

@Component({
  components: {
    MainHead,
    RecoveryForm,
  },
})
export default class PinRecoveryPage extends Vue {
}
</script>

<style lang="scss">
  .recovery-pin {
    max-width: 330px;
  }
</style>
