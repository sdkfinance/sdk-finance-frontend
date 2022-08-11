<template>
  <div class="data-grid-client">
    <slot :records="viewRecords"/>
    <app-pagination
      class="data-grid-client__pagination"
      :current-page.sync="page"
      :page-size="pageSize"
      :total="records.length"
      @current-change="scrollTop"/>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Watch, Vue,
} from 'vue-property-decorator';
import AppPagination from '@/components/ui-framework/app-pagination.vue';

@Component({
  components: {
    AppPagination,
  },
})
export default class DataGridPage extends Vue {

  @Prop({ type: Array, default: (): [] => [] }) readonly records!: [];

  @Prop({ type: Number, default: 10 }) readonly pageSize!: number;

  public page: number = 1;

  @Watch('records')
  resetPagination() {
    this.page = 1;
  }

  get viewRecords(): object[] {
    const start: number = this.page === 1 ? 0 : (this.pageSize * this.page) - this.pageSize;
    const end: number = start + this.pageSize;
    return this.records.slice(start, end);
  }

  public scrollTop(): void {
    window.scroll({ top: 0, left: 0 });
  }

}
</script>
