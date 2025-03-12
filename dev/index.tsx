import { createDevApp } from '@backstage/dev-utils';
import { languageInfoPlugin} from '../src/plugin';

createDevApp()
  .registerPlugin(languageInfoPlugin)
  .render();
