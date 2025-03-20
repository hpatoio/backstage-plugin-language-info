import {
  UrlReaderService,
  RootLoggerService,
} from "@backstage/backend-plugin-api";

export async function languageInfoPhpReader(
  repoUrl: string,
  urlReader: UrlReaderService,
  logger: RootLoggerService,
): Promise<string> {
  const filePath = "composer.json";
  const fileUrl = `${repoUrl}/${filePath}`;

  try {
    const searchResult = await urlReader.search(`${repoUrl}/${filePath}`);
    if (searchResult.files.length === 0) {
      logger.warn(
        `Component has 'php' tag, but file composer.json does not exist: ${filePath}`,
      );
      return "-";
    }

    // Read the file content
    const response = await urlReader.readUrl(fileUrl);
    const content = await response.buffer();
    return extractPhpVersionFromComposerFile(content.toString("utf-8"));
  } catch (error) {
    logger.error(
      `Error checking or reading file ${filePath}: ${(error as Error).message}`,
    );
    return "-";
  }
}

function extractPhpVersionFromComposerFile(
  composerFileContent: string,
): string {
  const composerJson = JSON.parse(composerFileContent);
  const phpVersion = composerJson?.require?.php || "-";
  return phpVersion;
}
