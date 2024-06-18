<template>
  <section class="main-section main-section--maintenance">
    <div class="container-image">
      <img
        src="@/assets/images/baby-yoda.svg"
        alt="baby yoda" />
      <div class="background-green" />
    </div>
    <p class="maintenance-title">
      {{ $t('pages.maintenance.patient') }}
      <br />
      {{ $t('pages.maintenance.baby_yoda_is') }}
      <span class="text-green">{{ $t('pages.maintenance.maintaining') }}</span>
      <br />
      {{ $t('pages.maintenance.our_system') }}
    </p>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Maintenance extends Vue {}
</script>

<style lang="scss">
.main-section--maintenance {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  .container-image {
    position: relative;
    width: 580px;
    height: 580px;
    max-width: 100%;
    max-height: 100%;
    margin-right: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      position: relative;
      z-index: 1;
    }

    .background-green {
      filter: blur(124px);
      background: rgb(1 189 143 / 20%);
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  }

  .maintenance-title {
    font-size: 32px;
    color: #10233a;
    font-weight: bold;
  }

  .text-green {
    color: #01bd8f;
  }
}
</style>
