<template>
  <router-view />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'base-page-layout',
})
export default class BasePageLayout extends Vue {}
</script>
