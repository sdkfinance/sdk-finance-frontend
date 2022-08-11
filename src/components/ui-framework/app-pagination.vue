<template>
  <el-pagination
    class="app-pagination"
    background
    :current-page="currentPage"
    :hide-on-single-page="true"
    :page-size="pageSize"
    layout="prev, pager, next"
    :total="total"
    @current-change="updatePateNumber"/>
</template>

<script lang="ts">
import {
  Component, Emit, Prop, Vue,
} from 'vue-property-decorator';
import { Pagination } from 'element-ui';

@Component({
  components: {
    [Pagination.name]: Pagination,
  },
})
export default class AppPagination extends Vue {

  @Prop({ default: 1, type: Number }) readonly currentPage!: number;

  @Prop({ default: 10, type: Number }) readonly pageSize!: number;

  @Prop({ default: 0, type: Number }) readonly total!: number;

  @Emit('update:current-page')
  @Emit('current-change')
  protected updatePateNumber(page: number): number {
    return page;
  }

}
</script>

<style lang="scss">
  .app-pagination {
    margin-top: 30px;
  }
</style>
