<template>
  <div v-loading="isLoading">
    <details-list
      v-for="(details, i) in dataList"
      :key="`details_${i}`"
      :title="i === 0 ? 'pages.actions_of_users.additional_details': '' "
      :details="getDetails(details)"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  IActionsRecord,
} from '@/services/requests/actions-of-users/ActionsOfUsers.types';
import { ActionsOfUsersRequests } from '@/services/requests';
import DetailsList from '@/components/details-list.vue';
import { IDetailsValue } from '@/types/interfaces';
import { errorNotification } from '@/utils';

@Component({
  components: {
    DetailsList,
  },
})
export default class ActionsOfUsersForm extends Vue {

  @Prop({ type: String, required: true }) readonly actionId!: string;

  protected isLoading: boolean = false;

  protected dataList: IActionsRecord[] = [];

  created() {
    this.fetchData();
  }

  protected async fetchData(): Promise<void> {
    this.isLoading = true;
    const { response, error } = await ActionsOfUsersRequests.getRecord(this.actionId);
    this.isLoading = false;

    if (error) {
      errorNotification(error);
      return;
    }

    this.dataList = response?.records || [];

  }

  protected getDetails(data: IActionsRecord): IDetailsValue[] {
    return [
      {
        label: 'form.label.user_on_entity_id',
        param: 'entityId',
        value: data?.objectsOfAction[0]?.entityId,
      },
      {
        label: 'form.label.role',
        param: 'role',
        value: data?.objectsOfAction[0]?.role,
      },
      {
        label: 'form.label.type',
        param: 'type',
        value: data?.objectsOfAction[0]?.type,
      },
      {
        label: 'form.label.action',
        param: 'action',
        value: data?.objectsOfAction[0]?.actionType,
      },
      {
        label: 'form.label.name',
        param: 'name',
        value: data?.objectsOfAction[0]?.entityName,
      },

    ];
  }

}
</script>
