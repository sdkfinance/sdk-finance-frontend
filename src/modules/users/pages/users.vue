<template>
  <dashboard-content-layout is-secondary>
    <template #title>
      {{ $t('pages.users.title') }}
    </template>
    <template #actions>
      <app-button
        size="small"
        @click="openCreateModal">
        {{ $t('action.add_user') }}
      </app-button>
    </template>
    <app-tabs
      v-model="currentRole"
      secondary
      query-param="type"
      :tabs="tabs"/>
    <app-data-table
      ref="dataTable"
      v-model="users"
      :filters="filters"
      :on-load="fetchData">
      <user-table :data="users"/>
    </app-data-table>
    <modal
      v-model="isCreateModalShow"
      title="pages.users.view_modal_create_title"
      width="380px">
      <user-form
        :is-loading="isLoadingForm"
        :organizations="organizationsList"
        @submit="onCreate"/>
    </modal>
  </dashboard-content-layout>
</template>

<script lang="ts">
import {
  Component, Ref, Vue, Watch,
} from 'vue-property-decorator';

import AppDataTable from '@/components/data-table/app-data-table.vue';
import Modal from '@/components/modal.vue';
import AppButton from '@/components/ui-framework/app-button.vue';
import AppTabs, { ITab } from '@/components/ui-kit/app-tabs.vue';
import { ROLES } from '@/constants';
import DashboardContentLayout from '@/layouts/dashboard/dashboard-content-layout.vue';
import UserForm from '@/modules/users/components/user-form.vue';
import UserTable from '@/modules/users/components/user-table.vue';
import { usersFilters } from '@/modules/users/filters/users-filters';
import { OrganizationsRequests, UsersRequests } from '@/services/requests';
import { IOrganizationRecord } from '@/services/requests/organizations/Organizations.types';
import {
  IGetUsersApiResponse, IGetUsersOptions, IUserCreateBody,
  IUserRecord,
} from '@/services/requests/users/Users.types';
import { errorNotification, successNotification } from '@/utils';

@Component({
  components: {
    AppTabs,
    DashboardContentLayout,
    AppDataTable,
    UserTable,
    UserForm,
    AppButton,
    Modal,
  },
})
export default class Users extends Vue {

  @Ref('dataTable') readonly refDataTable!: AppDataTable;

  protected users: IUserRecord[] = [];

  protected filters = usersFilters;

  protected isLoadingForm: boolean = false;

  protected formData: IUserRecord = {} as IUserRecord;

  protected organizationsList: IOrganizationRecord[] = [];

  protected currentRole: string = 'individual';

  protected isCreateModalShow: boolean = false;

  protected tabs: ITab[] = [
    {
      value: 'individual',
      translation: 'pages.users.individual',
    },
    {
      value: 'merchant',
      translation: 'pages.users.corporate',
    },
    {
      value: 'system_roles',
      translation: 'pages.users.system_actors',
    },
  ]

  protected systemRoles = Object.keys(ROLES).filter((role) => !['individual', 'merchant'].includes(role));

  protected get roleFilter(): string[] {
    return this.currentRole === 'system_roles' ? this.systemRoles : [this.currentRole];
  }

  @Watch('currentRole')
  protected async onRoleChanged(): Promise<void> {
    await this.refDataTable.loadData();
  }

  protected created(): void {
    // Temporary hidden, because backend don't work with it
    // this.getOrganizations();
  }

  protected openCreateModal(): void {
    this.isCreateModalShow = true;
    this.formData = {} as IUserRecord;
  }

  protected async fetchData(options: IGetUsersOptions): Promise<IGetUsersApiResponse> {
    const request = await UsersRequests.getUsers({
      ...options,
      filter: {
        ...options.filter,
        roles: this.roleFilter,
      },
    });

    if (request.error) {
      errorNotification(request.error);
    }

    return request;
  }

  protected async getOrganizations(): Promise<void> {

    const options = {};
    const { response, error } = await OrganizationsRequests.getOrganizations(options);

    if (error) {
      errorNotification(error);
      return;
    }

    this.organizationsList = response?.records || [];
  }

  protected async onCreate(form: IUserCreateBody): Promise<void> {

    const { error } = await UsersRequests.create(form);

    if (error) {
      errorNotification(error);
      return;
    }

    this.isCreateModalShow = false;
    successNotification();
    await this.refDataTable.loadData();
  }

}
</script>
