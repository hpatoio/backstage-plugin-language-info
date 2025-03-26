import {
  UrlReaderService,
  RootLoggerService,
} from "@backstage/backend-plugin-api";

export async function languageInfoJsReader(
  repoUrl: string,
  urlReader: UrlReaderService,
  logger: RootLoggerService,
): Promise<string> {
  const filePath = "package.json";
  const fileUrl = `${repoUrl}/${filePath}`;

  try {
    const searchResult = await urlReader.search(`${repoUrl}/${filePath}`);
    if (searchResult.files.length === 0) {
      logger.warn(
        `Component has 'js' tag, but file package.json does not exist: ${filePath}`,
      );
      return "-";
    }

    // Read the file content
    const response = await urlReader.readUrl(fileUrl);
    const content = await response.buffer();
    return extractNodeVersionFromPackageFile(content.toString("utf-8"));
  } catch (error) {
    logger.error(
      `Error checking or reading file ${filePath}: ${(error as Error).message}`,
    );
    return "-";
  }
}

function extractNodeVersionFromPackageFile(packageFileContent: string): string {
  const packageJson = JSON.parse(packageFileContent);
  const nodeVersion = packageJson?.engines?.node || "-";
  return nodeVersion;
}
