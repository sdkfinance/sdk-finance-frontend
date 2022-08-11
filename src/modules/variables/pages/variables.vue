<template>
  <section class="main-section">
    <main-head>
      <template #title>
        {{ $t('pages.variables.title') }}
      </template>
    </main-head>
    <app-input
      v-model="search"
      label="form.label.name_value"
      placeholder="placeholder.input.search"
      class="variables__search"
      clearable/>
    <data-grid-client :records="filteredData">
      <template #default="{ records }">
        <variables-table
          :data="records"
          :is-loading="isLoading"
          @updateValue="updateValue"/>
      </template>
    </data-grid-client>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppInput from '@/components/ui-framework/app-input.vue';
import DataGridClient from '@/components/data-grid-client.vue';
import MainHead from '@/components/main-head.vue';
import { VariablesRequests } from '@/services/requests';
import { errorNotification, successNotification } from '@/utils';
import { IVariable, IVariableResponse } from '@/services/requests/environment-variables/Variable.types';
import { IPlainObject } from '@/types/interfaces';
import VariablesTable from '../components/variables-table.vue';

@Component({
  components: {
    MainHead,
    AppInput,
    DataGridClient,
    VariablesTable,
  },
})
export default class VariablesPage extends Vue {

  public tableData: IVariable[] = [];

  public isLoading: boolean = false;

  public search: string = '';

  public page: number = 1;

  public pageSize: number = 10;

  get filteredData(): IVariable[] {
    const filterCondition = (item: IVariable): boolean => {
      const search = this.search.toLowerCase();
      const key = item.key.toLowerCase();
      const value = item.value.toLowerCase();

      return !search || key.indexOf(search) !== -1 || value.indexOf(search) !== -1;
    };

    return this.tableData.filter(filterCondition);
  }

  public async fetchData(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await VariablesRequests.getVariables();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    const data = response?.variables || [];

    this.tableData = data.map((el: IVariable) => ({
      key: el.key,
      value: this.getValue(el.value),
      type: this.getValueType(el.value),
    }));
  }

  public async updateValue(data: IPlainObject): Promise<void> {
    let value: object = {};

    try {
      value = JSON.parse(data.value);
    } catch (e) {
      errorNotification('entity.error');
      return;
    }

    const requestData: IVariableResponse = {
      variables: [
        {
          key: data.key,
          value,
        },
      ],
    };

    this.isLoading = true;
    const { error } = await VariablesRequests.update(requestData);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
    } else {
      successNotification('notification.variable_is_update');
    }
  }

  public getValue(value: any): string {
    return value ? JSON.stringify(value) : '';
  }

  public getValueType(value: any): string {
    return value ? typeof value : '';
  }

  created() {
    this.fetchData();
  }

}
</script>

<style lang="scss">
.variables {
  &__search {
    width: 175px;
    margin-bottom: 10px;
  }
}
</style>
