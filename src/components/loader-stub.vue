<template>
  <div class="loader-stub flex-container">
    <slot>
      <span
        v-loading="true"
        :style="{ height }"
        class="loader"/>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

type THeight = string|number;

@Component
export default class LoaderStub extends Vue {

  @Prop({ default: '200px', type: [String, Number] }) readonly height!: THeight;

}
</script>

<style lang="scss">
.loader-stub {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.loader {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 0 0 -21px;
}
</style>
