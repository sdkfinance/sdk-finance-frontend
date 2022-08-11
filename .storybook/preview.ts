import '../src/plugins';
import '@/assets/styles/global/index.scss';
import '@/assets/styles/global/tailwind.css';
import { i18n } from '../src/i18n';
import store from  '../src/store';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: { inlineStories: true },
  options: {
    storySort: {
      method: '',
      order: ['icons', 'ui-kit',['charts', 'modals', 'selects'], 'ui-framework', 'others'],
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
