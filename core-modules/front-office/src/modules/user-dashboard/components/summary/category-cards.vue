<template>
  <div class="category-cards">
    <app-table-info
      v-for="record in data"
      :key="record.id"
      class="category-cards__item"
      :image="record.category.imageLink"
      :title="record.category.name || record.categoryId"
      :background-color="record.color"
      is-summary>
      <template #description> {{ record.numberOfOperations }} {{ $tc('other.transactions', record.numberOfOperations) }} </template>

      <template #mobile-info>
        <div class="category-cards__footer">
          <app-progress-bar
            class="category-cards__progress-bar"
            :bar-color="record.color"
            :value="record.percentage" />
          <app-table-amount
            is-bold
            :amount="`-${record.currencySymbol}${record.sum}`" />
        </div>
      </template>
    </app-table-info>
  </div>
</template>

<script lang="ts">
import { AppProgressBar, AppTable, AppTableAmount, AppTableInfo } from '@sdk5/ui-kit-front-office';
import { Component, Prop, Vue } from 'vue-property-decorator';

type IPlainObject = Record<string, any>;

@Component({
  name: 'category-cards',
  components: {
    AppTable,
    AppTableInfo,
    AppProgressBar,
    AppTableAmount,
  },
})
export default class CategoryCards extends Vue {
  @Prop({ type: Array, default: () => ({}) }) readonly data!: IPlainObject[];
}
</script>

<style lang="scss">
.category-cards {
  &__progress-bar {
    @apply max-w-3/6;
  }

  &__item {
    @apply mb-24;
  }

  &__footer {
    @apply flex items-center justify-between mt-12;
  }
}
</style>
