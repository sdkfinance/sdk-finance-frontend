import '../src/plugins';
import '../src/directives';
import '@/assets/styles/global/index.scss';
import '@/assets/styles/global/tailwind.css';
import { i18n } from '@/i18n';
import store from  '@/store';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: { inlineStories: true },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['icons', 'ui-kit',['charts', 'modals', 'selects'], 'ui-framework', 'others'],
      method: '',
      locales: '',
    },
  },
}


export const decorators = [
  () => ({
    template: '<story/>',
    i18n,
    store,
  })
];
