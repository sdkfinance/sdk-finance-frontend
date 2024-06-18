<template>
  <div class="app-table-form">
    <app-table
      ref="table"
      is-secondary
      is-striped
      is-border-none
      is-small-font
      :data="mappedData"
      :is-loading="isLoading"
      :columns="columns">
      <template
        v-for="column in columns"
        #[column.prop]="{ scope }">
        <app-form-item
          v-if="$scopedSlots[column.prop]"
          :key="column.prop"
          :prop="`${dataProp}.${scope.$index}.${column.prop}`">
          <slot
            :name="column.prop"
            v-bind="{ scope }" />
        </app-form-item>
        <slot v-else />
      </template>

      <template
        v-if="isMultiple"
        #action="{ scope }">
        <button
          v-if="scope.row.isEditing"
          class="app-table-form__action icon-save"
          @click.prevent="onSave(scope.row)" />
        <button
          v-else
          :disabled="hasNotSaveChanges"
          class="app-table-form__action icon-edit"
          @click.prevent="setEditingState(scope.row, true)" />
        <button
          class="app-table-form__action icon-trash-loose"
          :disabled="hasNotSaveChanges && !scope.row.isEditing"
          @click.prevent="onDeleted(scope.row)" />
      </template>
    </app-table>

    <button
      v-if="isAddButtonVisible"
      :disabled="hasNotSaveChanges"
      class="app-table-form__add"
      @click.prevent="onAdd">
      {{ $t(addButtonLabel) }}
    </button>
  </div>
</template>

<script lang="ts">
import type { IPlainObject, ITableColumn } from '@sdk5/shared/types';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { AppFormItem, AppTable } from '../../ui-framework';

export default defineComponent({
  name: 'AppTableForm',
  components: { AppTable, AppFormItem },
  props: {
    isLoading: { type: Boolean, default: false },
    isMultiple: { type: Boolean, default: false },
    data: { type: Array, default: () => [] },
    columns: { type: Array as PropType<ITableColumn[]>, default: () => [] },
    addButtonLabel: { type: String, default: 'action.add_range' },
    dataProp: { type: String, required: true },
    hideAddButton: { type: Boolean, default: false },
  },
  data() {
    const mappedData: IPlainObject[] = [];

    return {
      mappedData,
    };
  },
  computed: {
    isAddButtonVisible() {
      return this.isMultiple && !this.hideAddButton;
    },
    hasNotSaveChanges(): boolean {
      return this.mappedData.some(({ isEditing }) => isEditing);
    },
    table: {
      cache: false,
      get() {
        return this.$refs.table as unknown as typeof AppTable;
      },
      set() {},
    },
  },
  watch: {
    data: [{ immediate: true, handler: 'setMappedData' }],
  },
  methods: {
    setEditingState(row: IPlainObject, state: boolean = false): void {
      this.mappedData = this.mappedData.map((item) => {
        if (item === row) {
          item.isEditing = state;
        }

        return item;
      });
    },
    setMappedData(data: IPlainObject[]): void {
      this.mappedData = data.map((item) => {
        item.isEditing = !item.id;
        return item;
      });
    },
    onEdit<T>(row: T) {
      this.$emit('edit', row);
    },
    onSave<T>(row: T) {
      this.$emit('save', row);
    },
    onDeleted<T>(row: T) {
      this.$emit('delete', row);
    },
    onAdd() {
      this.$emit('add', true);
    },
  },
});
</script>

<style lang="scss">
.app-table-form {
  @apply w-full;

  &__add {
    @apply mt-16 ml-10;
    @apply text-blue-500 text-base text-left inline border-b border-dashed border-current p-0 font-normal;
    @apply hover:text-blue-accent transition disabled:opacity-50 disabled:cursor-not-allowed;
  }

  &__action {
    @apply text-xs text-blue-500 hover:text-blue-accent transition mr-13;
    @apply disabled:opacity-50;

    &:last-of-type {
      @apply mr-0;
    }
  }

  .cell {
    @apply overflow-visible pt-7 pb-7;
  }

  .el-form-item {
    @apply mb-0;
  }

  .el-form-item__error {
    @apply text-11 pt-0 mt-0;
  }
}
</style>
