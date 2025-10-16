import { createTool } from '@mastra/core/tools';
import { bdclient } from '@brightdata/sdk';
import { z } from 'zod';

type BrightDataToolId =
  | 'scrape'
  | 'search'
  | 'amazonProduct'
  | 'linkedinCollectProfiles';

interface BrightDataToolsConfig {
  apiKey: string;
  excludeTools?: BrightDataToolId[];
}

type ToolInstance = ReturnType<typeof createTool>;
type BrightDataToolRegistry = Record<BrightDataToolId, ToolInstance>;

const scrapeInputSchema = z.object({
  url: z
    .string()
    .url('A valid URL is required')
    .describe('The URL of the website to scrape'),
  country: z
    .string()
    .length(2, 'Country code must be two letters')
    .optional()
    .describe('Two-letter country code for proxy location (e.g., "us", "gb", "de")'),
});

const searchInputSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .describe('The search query'),
  searchEngine: z
    .enum(['google', 'bing', 'yandex'])
    .optional()
    .default('google')
    .describe('Search engine to use'),
  country: z
    .string()
    .length(2)
    .optional()
    .describe('Two-letter country code for localized results'),
  dataFormat: z
    .enum(['html', 'markdown'])
    .optional()
    .default('markdown')
    .describe('Format of returned search results'),
});

const amazonProductInputSchema = z.object({
  url: z
    .string()
    .url()
    .refine(
      (value) => /\/(dp|gp\/product)\//.test(value),
      'URL must contain /dp/ or /gp/product/',
    )
    .describe('Amazon product URL (must contain /dp/ or /gp/product/)'),
  zipcode: z
    .string()
    .optional()
    .describe('ZIP code for location-specific pricing and availability'),
});

const linkedinCollectProfilesInputSchema = z.object({
  urls: z
    .array(z.string().url())
    .min(1, 'Provide at least one LinkedIn profile URL')
    .describe(
      'Array of LinkedIn profile URLs to collect data from (e.g., ["https://www.linkedin.com/in/example"])',
    ),
  format: z
    .enum(['json', 'jsonl'])
    .optional()
    .default('json')
    .describe('Output format for the results'),
});

const createBrightDataClient = (apiKey: string) =>
  new bdclient({
    apiKey,
    autoCreateZones: true,
  });

const normalizeDatasetResult = (result: unknown) =>
  typeof result === 'string' ? result : JSON.stringify(result, null, 2);

export const createScrapeTool = (client: InstanceType<typeof bdclient>) =>
  createTool({
    id: 'scrape',
    description:
      'Scrape website content and return it in clean markdown format. Bypasses anti-bot protection and CAPTCHAs.',
    inputSchema: scrapeInputSchema,
    execute: async ({ context }) => {
      const { url, country } = context;

      try {
        const result = await client.scrape(url, {
          dataFormat: 'markdown',
          format: 'raw',
          country: country?.toLowerCase(),
        });

        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        throw new Error(`Bright Data scrape failed for "${url}": ${message}`);
      }
    },
  });

export const createSearchTool = (client: InstanceType<typeof bdclient>) =>
  createTool({
    id: 'search',
    description:
      'Search the web using Google, Bing, or Yandex. Returns search results with anti-bot protection bypass.',
    inputSchema: searchInputSchema,
    execute: async ({ context }) => {
      const {
        query,
        searchEngine = 'google',
        country,
        dataFormat = 'markdown',
      } = context;
      try {
        const result = await client.search(query, {
          searchEngine,
          dataFormat,
          format: 'raw',
          country: country?.toLowerCase(),
        });

        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Bright Data search failed for "${query}": ${message}`,
        );
      }
    },
  });

export const createAmazonProductTool = (client: InstanceType<typeof bdclient>) =>
  createTool({
    id: 'amazonProduct',
    description:
      'Get detailed Amazon product information including price, ratings, reviews, and specifications. Requires a valid Amazon product URL.',
    inputSchema: amazonProductInputSchema,
    execute: async ({ context }) => {
      const { url, zipcode } = context;

      const dataset = client.datasets?.amazon;
      if (!dataset) {
        throw new Error('Bright Data Amazon dataset client is not available.');
      }

      const request = [
        zipcode?.trim()
          ? { url, zipcode: zipcode.trim() }
          : { url },
      ];

      try {
        const result = await dataset.collectProducts(request, {
          format: 'json',
          async: false,
        });

        return normalizeDatasetResult(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Bright Data Amazon product lookup failed for "${url}": ${message}`,
        );
      }
    },
  });

export const createLinkedinCollectProfilesTool = (
  client: InstanceType<typeof bdclient>,
) =>
  createTool({
    id: 'linkedinCollectProfiles',
    description:
      'Fetch LinkedIn profile data for one or more profile URLs. Returns work experience, education, skills, and more.',
    inputSchema: linkedinCollectProfilesInputSchema,
    execute: async ({ context }) => {
      const { urls, format = 'json' } = context;

      const dataset = client.datasets?.linkedin;
      if (!dataset) {
        throw new Error(
          'Bright Data LinkedIn dataset client is not available.',
        );
      }

      try {
        const result = await dataset.collectProfiles(urls, {
          format,
          async: false,
        });

        return normalizeDatasetResult(result);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Bright Data LinkedIn profile collection failed: ${message}`,
        );
      }
    },
  });

export const brightDataTools = (
  config: BrightDataToolsConfig,
): Partial<BrightDataToolRegistry> => {
  if (!config.apiKey?.trim()) {
    throw new Error('Bright Data API key is required to initialize tools.');
  }

  const excludedTools = new Set(config.excludeTools);
  const client = createBrightDataClient(config.apiKey.trim());
  const tools: Partial<BrightDataToolRegistry> = {};

  if (!excludedTools.has('scrape')) {
    tools.scrape = createScrapeTool(client);
  }

  if (!excludedTools.has('search')) {
    tools.search = createSearchTool(client);
  }

  if (!excludedTools.has('amazonProduct')) {
    tools.amazonProduct = createAmazonProductTool(client);
  }

  if (!excludedTools.has('linkedinCollectProfiles')) {
    tools.linkedinCollectProfiles = createLinkedinCollectProfilesTool(client);
  }

  return tools;
};

export type BrightDataToolSet = Partial<BrightDataToolRegistry>;
export type SearchTool = ReturnType<typeof createSearchTool>;
export type ScrapeTool = ReturnType<typeof createScrapeTool>;
export type AmazonProductTool = ReturnType<typeof createAmazonProductTool>;
export type LinkedinCollectProfilesTool = ReturnType<
  typeof createLinkedinCollectProfilesTool
>;
