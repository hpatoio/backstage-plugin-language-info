import { getVoidLogger } from "@backstage/backend-common";
import { Entity } from "@backstage/catalog-model";
import { UrlReaderService } from "@backstage/backend-plugin-api";
import { LanguageInfoProcessor } from "./LanguageInfoProcessor";
import { languageInfoPhpReader } from "./LanguageInfoPhpReader";

jest.mock("./LanguageInfoPhpReader");

describe("LanguageInfoProcessor", () => {
  const mockUrlReader: jest.Mocked<UrlReaderService> = {
    read: jest.fn(),
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  } as any;

  const logger = getVoidLogger();

  const processor = new LanguageInfoProcessor(logger, mockUrlReader);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return the processor name", () => {
    expect(processor.getProcessorName()).toBe("LanguageInfoProcessor");
  });

  it("should process entities tagged with php and add language annotations", async () => {
    const mockPhpVersion = ">=7.4";
    (languageInfoPhpReader as jest.Mock).mockResolvedValueOnce(mockPhpVersion);

    const entity: Entity = {
      apiVersion: "backstage.io/v1alpha1",
      kind: "Component",
      metadata: {
        name: "test-component",
        tags: ["php"],
        annotations: {
          "backstage.io/source-location": "url:https://github.com/example/repo",
        },
      },
      spec: {},
    };

    const result = await processor.preProcessEntity(entity);

    expect(result.metadata.annotations).toEqual({
      "backstage.io/source-location": "url:https://github.com/example/repo",
      "language-info/name": "PHP",
      "language-info/version": mockPhpVersion,
    });
  });

  it("should not process entities without php tag", async () => {
    const entity: Entity = {
      apiVersion: "backstage.io/v1alpha1",
      kind: "Component",
      metadata: {
        name: "test-component",
        tags: ["javascript"],
        annotations: {
          "backstage.io/source-location": "url:https://github.com/example/repo",
        },
      },
      spec: {},
    };

    const result = await processor.preProcessEntity(entity);

    expect(languageInfoPhpReader).not.toHaveBeenCalled();
    expect(result).toEqual(entity);
  });

  it("should not process entities with php tag that are not on a repo", async () => {
    const entity: Entity = {
      apiVersion: "backstage.io/v1alpha1",
      kind: "Component",
      metadata: {
        name: "test-component",
        tags: ["php"],
        annotations: {
          "backstage.io/source-location": "file:/path/to/repo",
        },
      },
      spec: {},
    };

    const result = await processor.preProcessEntity(entity);

    expect(languageInfoPhpReader).not.toHaveBeenCalled();
    expect(result).toEqual(entity);
  });

  it("should preserve existing annotations when adding language info", async () => {
    const mockPhpVersion = ">=8.0";
    (languageInfoPhpReader as jest.Mock).mockResolvedValueOnce(mockPhpVersion);

    const entity: Entity = {
      apiVersion: "backstage.io/v1alpha1",
      kind: "Component",
      metadata: {
        name: "test-component",
        tags: ["php"],
        annotations: {
          "backstage.io/source-location": "url:https://github.com/example/repo",
          "example.com/custom-annotation": "custom-value",
        },
      },
      spec: {},
    };

    const result = await processor.preProcessEntity(entity);

    expect(result.metadata.annotations).toEqual({
      "backstage.io/source-location": "url:https://github.com/example/repo",
      "example.com/custom-annotation": "custom-value",
      "language-info/name": "PHP",
      "language-info/version": mockPhpVersion,
    });
  });
});
