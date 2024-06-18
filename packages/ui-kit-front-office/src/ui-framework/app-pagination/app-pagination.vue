<template>
  <div class="app-pagination">
    <el-pagination
      ref="pagination"
      :current-page="currentPage"
      :hide-on-single-page="true"
      :page-size="pageSize"
      layout="pager"
      :total="total"
      @current-change="updatePateNumber" />
    <button
      v-if="!isNextButtonHidden"
      class="app-pagination__button"
      @click="paginationNext">
      <img
        :src="paginationArrow"
        alt="Next" />
    </button>
  </div>
</template>

<script lang="ts">
import { Pagination } from 'element-ui';
import { defineComponent } from 'vue';

import paginationArrow from '../../assets/icons/pagination-arrow.svg';

export default defineComponent({
  name: 'AppPagination',
  components: {
    'el-pagination': Pagination,
  },
  props: {
    currentPage: { default: 1, type: Number },
    pageSize: { default: 10, type: Number },
    total: { default: 0, type: Number },
  },
  data() {
    return {
      paginationArrow,
    };
  },
  computed: {
    pageCount(): number {
      const pageCount = Math.max(1, Math.ceil(this.total / this.pageSize));
      return Number.isNaN(pageCount) ? 1 : pageCount;
    },
    isNextButtonHidden() {
      return this.pageCount === 1 || this.currentPage === this.pageCount;
    },
    pagination: {
      cache: false,
      get() {
        return this.$refs.pagination as Pagination & { next: () => void; prev: () => void };
      },
      set() {},
    },
  },
  methods: {
    paginationNext() {
      this.pagination.next();
    },
    updatePateNumber(page: number) {
      this.$emit('update:current-page', page);
      this.$emit('current-change', page);
    },
  },
});
</script>

<style lang="scss">
.app-pagination {
  @apply flex items-center;

  &__button,
  .el-pagination .el-pager li {
    @apply items-center justify-center;
  }

  &__button,
  .el-pagination .el-pager li,
  .el-pagination .el-pager li.btn-quicknext,
  .el-pagination .el-pager li.btn-quickprev {
    @apply bg-transparent;
  }

  &__button {
    @apply flex w-[2rem] h-[2rem] hover:bg-blue-200;
  }

  .el-pagination {
    .el-pager {
      li {
        @apply p-[10px] w-auto inline-flex m-0 text-[0.875rem] font-medium;

        &.active {
          @apply text-blue-700;
        }
      }

      li,
      li.btn-quicknext,
      li.btn-quickprev {
        @apply text-blue-600 hover:text-gray-500;
      }
    }
  }
}
</style>
