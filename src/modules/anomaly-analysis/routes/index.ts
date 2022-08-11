import { AsyncComponent } from 'vue';
import { IRouteConfig } from '@/types/interfaces';
import { ROLES } from '@/constants';

const AnomalyAnalysis: AsyncComponent = () => import(
  /* webpackChunkName: 'anomaly-analysis' */ '@/modules/anomaly-analysis/pages/anomaly-analysis.vue'
);

export const ANOMALY_ANALYSIS: IRouteConfig = {
  path: '/dashboard/anomaly-analysis',
  name: 'Anomaly-analysis',
  component: AnomalyAnalysis,
  meta: {
    permission: [
      ROLES.administrator,
    ],
    translation: 'navigation.link.anomaly_analysis',
    root: true,
    icon: 'icon-stats-dots',
  },
};
