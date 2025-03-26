import { getVoidLogger } from "@backstage/backend-common";
import { UrlReaderService } from "@backstage/backend-plugin-api";
import { languageInfoJsReader } from "./LanguageInfoJsReader";

describe("languageInfoJsReader", () => {
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

  it("should extract Node version from package.json", async () => {
    const packageJson = JSON.stringify({
      name: "example/project",
      engines: {
        node: ">=18.0.0",
      },
      license: "Apache",
    });

    mockUrlReader.search.mockResolvedValueOnce({
      files: [
        {
          url: "package.json",
          content: async () => Buffer.from(packageJson),
        },
      ],
      etag: "etag",
    });

    mockUrlReader.readUrl.mockResolvedValueOnce({
      buffer: async () => Buffer.from(packageJson),
      stream: jest.fn(),
      etag: "etag",
    });

    const result = await languageInfoJsReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe(">=18.0.0");
  });

  it("should return dash when package.json does not exist", async () => {
    mockUrlReader.search.mockResolvedValueOnce({
      files: [],
      etag: "etag",
    });

    const result = await languageInfoJsReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });

  it("should return dash when Node version is not specified in package.json", async () => {
    const composerJson = JSON.stringify({
      name: "example/project",
      dependencies: {
        "another/package": "^1.0.0",
      },
    });

    mockUrlReader.search.mockResolvedValueOnce({
      files: [
        {
          url: "package.json",
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

    const result = await languageInfoJsReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });

  it("should return dash when package.json is invalid JSON", async () => {
    const invalidJson = "{invalid json";

    mockUrlReader.search.mockResolvedValueOnce({
      files: [
        { url: "package.json", content: async () => Buffer.from(invalidJson) },
      ],
      etag: "etag",
    });

    mockUrlReader.readUrl.mockResolvedValueOnce({
      buffer: async () => Buffer.from(invalidJson),
      stream: jest.fn(),
      etag: "etag",
    });

    const result = await languageInfoJsReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });

  it("should return dash when urlReader throws an error", async () => {
    mockUrlReader.search.mockRejectedValueOnce(new Error("Network error"));

    const result = await languageInfoJsReader(repoUrl, mockUrlReader, logger);

    expect(result).toBe("-");
  });
});
