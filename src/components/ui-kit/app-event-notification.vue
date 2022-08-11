<template>
  <div class="event-notification">
    <div class="event-notification__content">
      <slot name="icon">
        <i
          class="event-notification__icon"
          :class="['event-notification__icon', icon, iconBackgroundColor]"/>
      </slot>

      <slot name="title">
        {{ $t(title) }}
      </slot>
    </div>

    <slot name="controls">
      <app-button
        outlined
        size="small"
        :to="route">
        {{ $t(buttonText) }}
      </app-button>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import AppButton from '@/components/ui-framework/app-button.vue';
import { RawLocation } from 'vue-router';

@Component({
  components: {
    AppButton,
  },
})
export default class appEventNotification extends Vue {

  @Prop({ type: [Object, String], default: '' }) readonly route!: RawLocation;

  @Prop({ type: String, default: 'icon-info' }) readonly icon!: string;

  @Prop({ type: String, default: 'event_notification.you_have_unpaid_invoices' }) readonly title!: string;

  @Prop({ type: String, default: 'bg-orange-main' }) readonly iconBackgroundColor!: string;

  @Prop({ type: String, default: 'action.view_unpaid_invoices' }) readonly buttonText!: string;

}
</script>

<style lang="scss">
.event-notification {
  transform: translateY(0);

  @apply flex justify-between absolute rounded-lg items-center my-0 mx-auto left-0 right-0 top-26;
  @apply py-16 px-20 border border-solid border-orange-main h-61 w-852 bg-white z-50;

  &__icon {
    @apply mr-8 w-20 h-20 text-base rounded-round text-white;
  }

  &__content {
    @apply flex flex-row;
  }
}

</style>
