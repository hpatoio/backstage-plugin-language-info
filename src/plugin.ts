import {
  createPlugin,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const languageInfoPlugin = createPlugin({
  id: 'language-info'
});

export const EntityLanguageInfoCard = languageInfoPlugin.provide(
  createComponentExtension({
    name: 'EntityLanguageInfoCard',
    component: {
      lazy: () =>
        import('./components/EntityLanguageInfoCard').then(m => m.EntityLanguageInfoCard),
    },
  }),
);
