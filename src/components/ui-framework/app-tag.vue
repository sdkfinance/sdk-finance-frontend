<template>
  <el-tag
    class="app-tag"
    :disable-transitions="true"
    size="small"
    closable
    @close="emitDelete">
    <span
      v-if="label"
      class="app-tag__label">{{ $t(label) }}:</span>
    <span class="app-tag__value">
      <slot/>
    </span>
  </el-tag>
</template>

<script lang="ts">
import { Tag } from 'element-ui';
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

@Component({
  components: {
    [Tag.name]: Tag,
  },
})
export default class AppTag extends Vue {

  @Prop({
    type: String,
    default: null,
  }) readonly label!: string;

  @Emit('delete')
  protected emitDelete(): void {}

}
</script>

<style lang="scss">
  .app-tag {
    background: $grey-color;
    border-radius: 3px;
    font-size: 12px;
    height: 35px;
    line-height: 35px;
    border: none;
    padding: 0 14px;
    font-weight: 500;

    &__label {
      color: #8ea1ba;
    }

    &__value {
      color: #000;
      font-weight: 600;
    }

    .el-tag__close {
      color: #000;
      font-size: 14px;
    }
  }
</style>
