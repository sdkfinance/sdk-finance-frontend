<template>
  <base-tabs-layout
    title="pages.contacts.unregistered_contacts"
    :links="links">
    <contacts-table
      :data="tableData"
      :is-action-hidden="true"
      :is-loading="isLoading" />
  </base-tabs-layout>
</template>

<script lang="ts">
import { errorNotification } from '@sdk5/shared/utils';
import { Component, Vue } from 'vue-property-decorator';

import BaseTabsLayout from '../../../layouts/base-tabs-layout.vue';
import type { IContactRecord } from '../../../requests';
import { ContactsRequests } from '../../../requests';
import ContactsTable from '../components/contacts-table.vue';
import { CONTACTS_CHILDREN } from '../routes';

@Component({
  name: 'unregistered-contacts',
  components: {
    BaseTabsLayout,
    ContactsTable,
  },
})
export default class InvoicesTemplates extends Vue {
  protected tableData: IContactRecord[] = [];

  protected readonly links = CONTACTS_CHILDREN;

  protected isLoading: boolean = false;

  protected created(): void {
    this.fetchData();
  }

  protected async fetchData(): Promise<any> {
    this.isLoading = true;
    const { response, error } = await ContactsRequests.getUnregisteredRecords();
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.tableData = response?.contacts || [];
  }
}
</script>
