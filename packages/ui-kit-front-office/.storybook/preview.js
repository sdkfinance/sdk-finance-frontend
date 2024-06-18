import '../../../apps/core/src/plugins';
import '../../../apps/core/src/directives';
import '../../../apps/core/src/assets/styles/global/index.scss';
import '../../../apps/core/src/assets/styles/global/tailwind.css';
import { i18n } from '@sdk5/shared/i18n';
import store from '@sdk5/shared/store';

/** @type { import('@storybook/vue').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['icons', 'ui-kit', ['charts', 'modals', 'selects'], 'ui-framework', 'others'],
        method: '',
        locales: '',
      },
    },
  },
};
export const decorators = [
  () => ({
    template: '<story/>',
    i18n,
    store,
  }),
];

export default preview;
