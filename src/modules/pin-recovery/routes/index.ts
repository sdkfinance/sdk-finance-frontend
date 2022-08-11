import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const PinRecovery: AsyncComponent = () => import(
  /* webpackChunkName: 'pin-recovery' */
  '@/modules/pin-recovery/pages/pin-recovery.vue'
);

export const PIN_RECOVERY: IRouteConfig = {
  path: '/dashboard/pin-recovery',
  name: 'PinRecovery',
  component: PinRecovery,
  meta: {
    permission: [ROLES.administrator],
    translation: 'navigation.link.system_operations',
    icon: 'icon-system-operations',
    root: true,
  },
};
