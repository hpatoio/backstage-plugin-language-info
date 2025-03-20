import { getVoidLogger } from "@backstage/backend-common";
import { UrlReaderService } from "@backstage/backend-plugin-api";
import { languageInfoPhpReader } from "./LanguageInfoPhpReader";

describe("languageInfoPhpReader", () => {
  const mockUrlReader: jest.Mocked<UrlReaderService> = {
    read: jest.fn(),
    readUrl: jest.fn(),
    readTree: jest.fn(),
    search: jest.fn(),
  } as any;

  const logger = getVoidLogger();
  const repoUrl = "https://github.com/example/repo";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should extract PHP version from composer.json", async () => {
    const composerJson = JSON.stringify({
      name: "example/project",
      require: {
        php: ">=7.4",
        "another/package": "^1.0.0",
      },
    });

    mockUrlReader.search.mockResolvedValueOnce({
      files: [
        {
          url: "composer.json",
          content: async () => Buffer.from(composerJson),
        },
      ],
      etag: "etag",
    });

    mockUrlReader.readUrl.mockResolvedValueOnce({
      buffer: async () => Buffer.from(composerJson),
      stream: jest.fn(),
      etag: "etag",
    });

    const result = await languageInfoPhpReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe(">=7.4");
  });

  it("should return dash when composer.json does not exist", async () => {
    mockUrlReader.search.mockResolvedValueOnce({
      files: [],
      etag: "etag",
    });

    const result = await languageInfoPhpReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });

  it("should return dash when PHP version is not specified in composer.json", async () => {
    const composerJson = JSON.stringify({
      name: "example/project",
      require: {
        "another/package": "^1.0.0",
      },
    });

    mockUrlReader.search.mockResolvedValueOnce({
      files: [
        {
          url: "composer.json",
          content: async () => Buffer.from(composerJson),
        },
      ],
      etag: "etag",
    });

    mockUrlReader.readUrl.mockResolvedValueOnce({
      buffer: async () => Buffer.from(composerJson),
      stream: jest.fn(),
      etag: "etag",
    });

    const result = await languageInfoPhpReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });

  it("should return dash when composer.json is invalid JSON", async () => {
    const invalidJson = "{invalid json";

    mockUrlReader.search.mockResolvedValueOnce({
      files: [
        { url: "composer.json", content: async () => Buffer.from(invalidJson) },
      ],
      etag: "etag",
    });

    mockUrlReader.readUrl.mockResolvedValueOnce({
      buffer: async () => Buffer.from(invalidJson),
      stream: jest.fn(),
      etag: "etag",
    });

    const result = await languageInfoPhpReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });

  it("should return dash when urlReader throws an error", async () => {
    mockUrlReader.search.mockRejectedValueOnce(new Error("Network error"));

    const result = await languageInfoPhpReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });
});
