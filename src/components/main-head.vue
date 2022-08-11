<template>
  <div
    class="main-head"
    :class="{ 'main-head--secondary': secondary }">
    <h1 class="main-head__title">
      <slot name="title"/>
    </h1>
    <slot name="actions"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class MainHead extends Vue {

  @Prop({ type: Boolean, default: false }) secondary!: boolean;

}
</script>

<style lang="scss">
.main-head {
  display: flex;
  align-items: center;
  margin-bottom: 34px;

  @media only screen and (max-width: 767px) {
    margin-bottom: 24px;
  }

  &__title {
    font-weight: 700;
    font-size: 32px;
    margin: 0;
  }

  .el-button {
    margin-left: auto;
  }

  .main-head-btn {
    margin: 0 auto 0 23px;

    &--right {
      margin: 0 0 0 auto;
    }
  }

  &--inline {
    .el-button {
      margin: 0;
    }

    .el-button + .el-button {
      margin-left: 5px;
    }

    h1,
    h2 {
      margin-right: 23px;
    }
  }

  &--grouped {
    .btn-group {
      margin-left: auto;
    }
  }
}

</style>
