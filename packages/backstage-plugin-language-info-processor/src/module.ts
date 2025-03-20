import {
  coreServices,
  createBackendModule,
} from "@backstage/backend-plugin-api";

import { catalogProcessingExtensionPoint } from "@backstage/plugin-catalog-node/alpha";
import { LanguageInfoProcessor } from "./libs/LanguageInfoProcessor";

export const catalogModuleLanguageInfo = createBackendModule({
  pluginId: "catalog",
  moduleId: "language-info",
  register(reg) {
    reg.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
        urlReader: coreServices.urlReader,
      },
      async init({ catalog, logger, urlReader }) {
        catalog.addProcessor(new LanguageInfoProcessor(logger, urlReader));
      },
    });
  },
});
