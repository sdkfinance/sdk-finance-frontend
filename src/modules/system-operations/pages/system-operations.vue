<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.system_operations.title') }}
      </template>
    </main-head>
    <operation-form/>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainHead from '@/components/main-head.vue';
import OperationForm from '../components/operation-form.vue';

@Component({
  components: {
    MainHead,
    OperationForm,
  },
})
export default class SystemOperationsPage extends Vue {
}
</script>
