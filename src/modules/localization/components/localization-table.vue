<template>
  <app-table
    :data="transformRecords"
    :is-loading="isLoading"
    cell-class-name="v-align-top"
    :columns="columns">
    <template
      #action="{scope}">
      <div class="table-actions">
        <app-button
          size="small"
          @click="editRecord(scope.row)">
          {{ $t('action.edit') }}
        </app-button>
        <app-button
          size="small"
          @click="deleteRecord(scope.row)">
          {{ $t('action.delete') }}
        </app-button>
      </div>
    </template>
  </app-table>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';

import AppButton from '@/components/ui-framework/app-button.vue';
import AppInput from '@/components/ui-framework/app-input.vue';
import AppTable from '@/components/ui-framework/app-table.vue';
import {
  ILocalization,
  ILocalizationRecord,
  ILocalizationValue,
} from '@/services/requests/i18n-records/Localization.interface';
import { IPlainObject, ITableColumn } from '@/types/interfaces';

@Component({
  components: {
    AppTable,
    AppButton,
    AppInput,
  },
})
export default class LocalizationTable extends Vue {

  @Prop({ required: true, type: Array }) readonly data!: ILocalizationRecord[];

  @Prop({ default: false, type: Boolean }) readonly isLoading!: boolean;

  @Prop({ required: true, type: Array }) readonly locales!: [];

  private get localeColumns(): ITableColumn[] {
    return this.locales.reduce(
      (acc: ITableColumn[], locale: string) => [...acc, { prop: locale, label: `table.label.${locale}` }], [],
    );
  }

  private get columns(): ITableColumn[] {
    const key: ITableColumn = {
      prop: 'key',
      label: 'table.label.key',
      width: '200',
    };
    const action: ITableColumn = {
      prop: 'action',
      label: 'table.label.actions',
      width: '130',
    };
    return [key, ...this.localeColumns, action];
  }

  private get transformRecords(): ILocalization[] {
    return this.data.map(({ id, key, values }: ILocalizationRecord) => ({ id, key, ...this.getValues(values) }));
  }

  private getValues(values: ILocalizationValue[]): IPlainObject {
    return values.reduce((acc: object, { value, locale }: ILocalizationValue) => ({ ...acc, [locale]: value }), {});
  }

  @Emit('edit-record')
  private editRecord(record: ILocalization): ILocalization {
    return record;
  }

  @Emit('delete-record')
  private deleteRecord(record: ILocalization): ILocalization {
    return record;
  }

}
</script>
