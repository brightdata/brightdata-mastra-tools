import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { brightDataTools } from '../tools/web-tools';

const apiKey = process.env.BRIGHTDATA_API_KEY ?? '';
const brightTools = brightDataTools({ apiKey });

const {
  search: searchTool,
  scrape: scrapeTool,
  amazonProduct: amazonProductTool,
  linkedinCollectProfiles: linkedinCollectProfilesTool,
} = brightTools;

const missingTools = [
  ['search', searchTool],
  ['scrape', scrapeTool],
  ['amazonProduct', amazonProductTool],
  ['linkedinCollectProfiles', linkedinCollectProfilesTool],
].reduce<string[]>((acc, [name, tool]) => {
  if (!tool) acc.push(name as string);
  return acc;
}, []);

if (missingTools.length > 0) {
  throw new Error(
    `Bright Data tools failed to initialize (${missingTools.join(
      ', ',
    )}). Verify BRIGHTDATA_API_KEY.`,
  );
}

const toolset = {
  searchTool: searchTool!,
  scrapeTool: scrapeTool!,
  amazonProductTool: amazonProductTool!,
  linkedinCollectProfilesTool: linkedinCollectProfilesTool!,
};

export const webAgent = new Agent({
  name: 'Web Agent',
  instructions: `
      You are a general-purpose web research assistant with Bright Data capabilities.

      Goals:
      - Answer user questions by combining reasoning with fresh information gathered through the available tools.
      - Prefer the tools when facts may have changed or when evidence is required.
      - Clearly cite tool outputs in your responses so users can trace the source.

      Tool usage guidelines:
      - Start with the search tool to build context or surface credible sources.
      - Use the scrape tool to pull detailed content from specific pages when deeper inspection is needed.
      - Call the Amazon product tool for pricing, availability, or review summaries of specific products.
      - Fetch LinkedIn profile details when users need professional background information.
      - Respect user privacy requests and avoid collecting unnecessary personal data.

      Response style:
      - Summarize findings concisely.
      - Highlight key insights, citing which tool provided the evidence.
      - Offer next steps or additional angles to explore when useful.
`,
  model: 'openai/gpt-4o-mini',
  tools: toolset,
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
