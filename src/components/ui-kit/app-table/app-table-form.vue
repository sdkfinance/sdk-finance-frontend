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
            v-bind="{ scope }"/>
        </app-form-item>
        <slot v-else/>
      </template>

      <template
        v-if="isMultiple"
        #action="{ scope }">
        <button
          v-if="scope.row.isEditing"
          class="app-table-form__action icon-save"
          @click.prevent="onSave(scope.row)"/>
        <button
          v-else
          :disabled="hasNotSaveChanges"
          class="app-table-form__action icon-edit"
          @click.prevent="setEditingState(scope.row, true)"/>
        <button
          class="app-table-form__action icon-trash-loose"
          :disabled="hasNotSaveChanges && !scope.row.isEditing"
          @click.prevent="onDeleted(scope.row)"/>
      </template>
    </app-table>

    <button
      v-if="isMultiple"
      :disabled="hasNotSaveChanges"
      class="app-table-form__add"
      @click.prevent="onAdd">
      {{ $t(addButtonLabel) }}
    </button>
  </div>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Ref, Vue, Watch,
} from 'vue-property-decorator';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

import AppTable from '@/components/ui-framework/app-table.vue';
import AppFormWrapper from '@/components/ui-kit/modals/app-form-wrapper.vue';
import AppFormItem from '@/components/ui-framework/app-form-item.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppSelect from '@/components/ui-framework/app-select/app-select.vue';

@Component({
  components: {
    AppTable,
    AppFormWrapper,
    AppFormItem,
    AppInput,
    AppSelect,
  },
})
export default class AppTableForm extends Vue {

  @Ref('table') readonly table!: AppTable;

  @Prop({ type: Boolean, default: false }) readonly isLoading!: boolean;

  @Prop({ type: Boolean, default: false }) readonly isMultiple!: boolean;

  @Prop({ type: Array, default: () => ([]) }) readonly data!: IPlainObject[];

  @Prop({ type: Array, default: () => [] }) readonly columns!: ITableColumn[];

  @Prop({ type: String, default: 'action.add_range' }) readonly addButtonLabel!: string;

  @Prop({ type: String, required: true }) readonly dataProp!: string;

  protected mappedData: IPlainObject[] = [];

  @Emit('edit')
  onEdit<T>(row: T): T {
    return row;
  }

  @Emit('save')
  onSave<T>(row: T): T {
    return row;
  }

  @Emit('delete')
  onDeleted<T>(row: T): T {
    return row;
  }

  @Emit('add')
  onAdd(): boolean {
    return true;
  }

  protected get hasNotSaveChanges(): boolean {
    return this.mappedData.some(({ isEditing }) => isEditing);
  }

  @Watch('data', { immediate: true })
  protected setMappedData(data: IPlainObject[]): void {
    this.mappedData = data.map((item) => {
      item.isEditing = !item.id;
      return item;
    });
  }

  protected setEditingState(row: IPlainObject, state: boolean = false): void {
    this.mappedData = this.mappedData.map((item) => {
      if (item === row) {
        item.isEditing = state;
      }
      return item;
    });

  }

}
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
