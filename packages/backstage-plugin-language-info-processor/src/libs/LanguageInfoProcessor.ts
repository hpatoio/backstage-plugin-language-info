import { CatalogProcessor } from "@backstage/plugin-catalog-node";
import { Entity, getEntitySourceLocation } from "@backstage/catalog-model";
import {
  RootLoggerService,
  UrlReaderService,
} from "@backstage/backend-plugin-api";
import { languageInfoPhpReader } from "./LanguageInfoPhpReader";

export class LanguageInfoProcessor implements CatalogProcessor {
  logger: RootLoggerService;

  urlReader: UrlReaderService;

  constructor(logger: RootLoggerService, urlReader: UrlReaderService) {
    this.logger = logger;
    this.urlReader = urlReader;
  }

  getProcessorName() {
    return "LanguageInfoProcessor";
  }

  async preProcessEntity(entity: Entity): Promise<Entity> {
    this.logger.info("LanguageInfoProcessor started.");

    const location = getEntitySourceLocation(entity);

    if (entity.metadata.tags?.includes("php") && location.type === "url") {
      this.logger.info("LanguageInfoProcessor PHP tag found.");

      const phpVersion = await languageInfoPhpReader(
        location.target,
        this.urlReader,
        this.logger,
      );

      entity.metadata.annotations = {
        ...(entity.metadata.annotations || {}),
        "language-info/name": "PHP",
        "language-info/version": phpVersion,
      };
    }

    return entity;
  }
}
