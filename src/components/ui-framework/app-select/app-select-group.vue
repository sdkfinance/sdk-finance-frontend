<template>
  <div>
    <el-option-group
      v-for="(group, i) in options"
      :key="`group_${i}`"
      :class="groupClasses"
      :label="group.label">
      <el-option
        v-for="(option, idx) in group.options"
        :key="`option_${idx}`"
        :class="optionClasses"
        :value="option">
        <slot
          name="option"
          v-bind="{group, option}"/>
      </el-option>
    </el-option-group>
  </div>
</template>

<script lang="ts">
import { Option, OptionGroup } from 'element-ui';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { IPlainObject } from '@/types/interfaces';

@Component({
  components: {
    [Option.name]: Option,
    [OptionGroup.name]: OptionGroup,
  },
})
export default class AppSelectGroup extends Vue {

  @Prop({ type: String, default: '' }) readonly groupClasses!: string;

  @Prop({ type: String, default: '' }) readonly optionClasses!: string;

  @Prop({ type: Array, required: true }) readonly options!: IPlainObject[];

}
</script>
