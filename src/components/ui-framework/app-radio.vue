<template>
  <el-radio-group
    v-model="radioGroup"
    class="app-radio-group">
    <el-radio
      v-for="option in options"
      :key="option.value"
      :label="option.value">
      {{ $t(option.label) }}
    </el-radio>
  </el-radio-group>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Vue,
} from 'vue-property-decorator';
import { RadioGroup, Radio } from 'element-ui';
import { IOption } from '@/types/interfaces/Options.interface';

@Component({
  components: {
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
  },
})
export default class AppRadio extends Vue {

  @Prop({ required: true, type: String }) readonly value!: string;

  @Prop({ default: () => ([]), type: Array }) readonly options!: IOption[];

  protected get radioGroup(): string | number {
    return this.value;
  }

  protected set radioGroup(value: string | number) {
    this.updateValue(value);
  }

  @Emit('input')
  protected updateValue(value: string | number) {
    return value;
  }

}
</script>

<style lang="scss">
.app-radio-group {
  span {
    margin: 5px 0 !important;
  }
}
</style>
