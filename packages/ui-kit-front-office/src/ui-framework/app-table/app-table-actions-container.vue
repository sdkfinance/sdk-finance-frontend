<template>
  <div class="table-actions-container">
    <template v-if="tableActionsVisible.length > 0">
      <template v-for="(action, index) of tableActionsVisible">
        <app-table-action-button
          :key="index"
          :label="action.label"
          :row-scope="rowScope"
          :icon="action.icon"
          :is-disabled="action.isDisabled"
          :action-fn="action.actionFn"
          :button-options="action.buttonOptions" />
      </template>
    </template>
    <template v-if="foldedTableActionsWithoutIcons.length > 0">
      <app-dropdown
        ref="appDropdownRef"
        :options="foldedTableActionsWithoutIcons"
        placement="bottom-end"
        secondary>
        <template #trigger>
          <app-button
            size="small"
            icon="icon-more"
            outlined
            only-icon />
        </template>
        <template #option="{ option }">
          <div
            role="button"
            @click="actionClickHandler(option)">
            {{ $t(option.label) }}
          </div>
        </template>
      </app-dropdown>
    </template>
  </div>
</template>

<script lang="ts">
import type { IOption, TTableColumnAction } from '@sdk5/shared/types';
import type { PropType, Ref } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import { AppButton } from '../app-button';
import { AppDropdown } from '../app-dropdown';
import AppTableActionButton from './app-table-action-button.vue';

const MAXIMUM_VISIBLE_BUTTONS = 2;

export default defineComponent({
  name: 'AppTableActionsContainer',
  components: { AppDropdown, AppButton, AppTableActionButton },
  props: {
    rowScope: {
      type: Object,
      default: () => ({}),
    },
    tableActions: {
      type: Array as PropType<TTableColumnAction[]>,
      required: true,
    },
    actionsAlwaysVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const appDropdownRef = ref(null) as unknown as Ref<InstanceType<typeof AppDropdown>>;

    const tableActionsAvailable = computed(() => {
      return props.tableActions.filter((action) => {
        if (typeof action.visible === 'function') {
          return action.visible(props.rowScope);
        }

        return action.visible !== false;
      });
    });

    const tableActionsVisible = computed(() => {
      return props.actionsAlwaysVisible ? tableActionsAvailable.value : tableActionsAvailable.value.slice(0, MAXIMUM_VISIBLE_BUTTONS);
    });

    const tableActionsFolded = computed(() => {
      return props.actionsAlwaysVisible ? [] : tableActionsAvailable.value.slice(MAXIMUM_VISIBLE_BUTTONS, tableActionsAvailable.value.length);
    });

    const foldedTableActionsWithoutIcons = computed(
      () =>
        tableActionsFolded.value.map((action) => ({
          ...action,
          icon: undefined,
        })) as unknown as IOption[],
    );

    const actionClickHandler = (option: IOption & { actionFn: (...args: any) => void }) => {
      if (!option.actionFn) {
        return;
      }

      appDropdownRef.value.hideDropdown();

      option.actionFn(props.rowScope);
    };

    return {
      tableActionsVisible,
      foldedTableActionsWithoutIcons,
      appDropdownRef,
      actionClickHandler,
    };
  },
});
</script>

<style lang="scss">
.table-actions-container {
  @apply flex items-center justify-end gap-x-[0.5rem];

  .app-button + .app-button {
    @apply ml-0;
  }
}
</style>
