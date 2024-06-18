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
          v-bind="{ group, option }" />
      </el-option>
    </el-option-group>
  </div>
</template>

<script lang="ts">
import { Option, OptionGroup } from 'element-ui';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

type IPlainObject = Record<string, any>;

export default defineComponent({
  name: 'AppSelectGroup',
  components: {
    [Option.name]: Option,
    [OptionGroup.name]: OptionGroup,
  },
  props: {
    groupClasses: { type: String, default: '' },
    optionClasses: { type: String, default: '' },
    options: { type: Array as PropType<IPlainObject[]>, required: true },
  },
});
</script>
