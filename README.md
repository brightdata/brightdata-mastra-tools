<div align="center">

## A powerful AI-powered web agent built with [Mastra](https://mastra.ai) that can search, scrape, and extract data from the open web with ease.

<img width="656" height="203" alt="Screenshot 2025-10-16 at 10 33 20" src="https://github.com/user-attachments/assets/05bedc40-29be-4519-843d-c1f5012af9ad" />
</div>

## Overview

This agent combines OpenAI's GPT-4o-mini model with Bright Data's powerful SDK to create an intelligent web research assistant that can:

- Search the web using Google, Bing, or Yandex with anti-bot protection
- Scrape website content in clean markdown format
- Extract detailed Amazon product information (pricing, reviews, specifications)
- Collect LinkedIn profile data (experience, education, skills)
- Maintain conversation context with persistent memory
- Provide accurate, well-sourced responses with citations

**The easiest way to start building Mastra agents with web access** - simply add your API keys and start exploring the web!

## Features

- **AI-Powered Intelligence**: Uses OpenAI GPT-4o-mini for intelligent reasoning and responses
- **Bright Data SDK Integration**: Direct integration with Bright Data's powerful web data tools
- **Multiple Data Sources**: Search engines, web scraping, Amazon products, LinkedIn profiles
- **Anti-Bot Protection**: Automatic CAPTCHA and bot detection bypass
- **Persistent Memory**: Maintains conversation history using LibSQL database
- **Source Citations**: Always provides URLs and source attribution
- **Structured Logging**: Built-in logging with Pino for monitoring and debugging
- **TypeScript Support**: Fully typed for better development experience

## Architecture

### Core Components

- **Web Agent** ([src/mastra/agents/web-agent.ts](src/mastra/agents/web-agent.ts)): Main AI agent with web research capabilities
- **Bright Data Tools** ([src/mastra/tools/web-tools.ts](src/mastra/tools/web-tools.ts)): SDK integration for web scraping, search, and data extraction
- **Mastra Core** ([src/mastra/index.ts](src/mastra/index.ts)): Central configuration and orchestration

### Key Dependencies

- `@mastra/core` - Main framework for agents and workflows
- `@brightdata/sdk` - Bright Data SDK for web scraping and data collection
- `@mastra/memory` - Persistent memory management
- `@mastra/libsql` - LibSQL database adapter
- `@mastra/loggers` - Logging utilities
- `zod` - Schema validation for tool inputs

## Requirements

### System Requirements

- **Node.js**: >= 20.9.0
- **npm**: Latest version

### API Keys Required

1. **Bright Data API Key**: For web scraping and data collection capabilities
2. **OpenAI API Key**: For GPT-4o-mini model access

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/brightdata/brightdata-mastra-tools
cd brightdata-tools-test
npm install
```

### 2. Environment Configuration

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
BRIGHTDATA_API_KEY=your_brightdata_api_key_here
```

#### Getting API Keys

**Bright Data API Key:**
1. Sign up at [Bright Data](https://brightdata.com)
2. Navigate to your dashboard
3. Generate an API key for SDK access
4. Enable the zones you need (automatically created if `autoCreateZones: true`)

**OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to API keys section
3. Create a new API key
4. Ensure you have access to GPT-4o-mini model

### 3. Database Setup

The agent uses LibSQL for persistent memory:
- **Development**: Uses in-memory database (`:memory:`) in [src/mastra/index.ts](src/mastra/index.ts)
- **Agent Memory**: Uses file-based storage (`file:../mastra.db`) for conversation history

No additional setup required - the database will be created automatically.

## Usage

### Development Mode

Start the development server with hot reloading:

```bash
npm run dev
```

### Production Build

Build the application:

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Agent Capabilities

The Web Agent is designed to provide comprehensive web research capabilities:

### Search Operations
- **Web Search**: Search across Google, Bing, or Yandex
- **Localized Results**: Specify country codes for region-specific results
- **Multiple Formats**: Get results in HTML or clean markdown format
- **Anti-Bot Protection**: Automatic bypass of CAPTCHAs and bot detection

### Web Scraping
- **Clean Markdown**: Extract website content in readable markdown format
- **Proxy Support**: Use country-specific proxies for geo-restricted content
- **CAPTCHA Bypass**: Automatically handle anti-bot protection
- **Raw Content**: Access unprocessed website data

### Amazon Product Data
- **Product Details**: Get pricing, ratings, reviews, and specifications
- **Location-Specific**: Provide ZIP codes for regional pricing and availability
- **Comprehensive Data**: Access detailed product information and reviews
- **Structured Output**: Receive data in clean JSON format

### LinkedIn Profile Collection
- **Professional Data**: Collect work experience, education, and skills
- **Batch Processing**: Fetch multiple profiles in a single request
- **Multiple Formats**: Get results in JSON or JSONL format
- **Detailed Profiles**: Access comprehensive professional information

### Memory & Context
- **Conversation History**: Remember previous interactions
- **Context Awareness**: Build on prior research results
- **Session Persistence**: Maintain context across sessions
- **Research Tracking**: Store search and scraping history for reference

## Available Tools

The agent has access to four powerful Bright Data tools:

### 1. Search Tool
```typescript
searchTool({
  query: "your search query",
  searchEngine: "google" | "bing" | "yandex",
  country: "us",  // optional 2-letter country code
  dataFormat: "markdown" | "html"
})
```

### 2. Scrape Tool
```typescript
scrapeTool({
  url: "https://example.com",
  country: "us"  // optional 2-letter country code
})
```

### 3. Amazon Product Tool
```typescript
amazonProductTool({
  url: "https://amazon.com/dp/PRODUCTID",
  zipcode: "10001"  // optional for location-specific data
})
```

### 4. LinkedIn Collect Profiles Tool
```typescript
linkedinCollectProfilesTool({
  urls: ["https://www.linkedin.com/in/profile1", "https://www.linkedin.com/in/profile2"],
  format: "json" | "jsonl"
})
```

## Project Structure

```
brightdata-tools-test/
├── src/
│   └── mastra/
│       ├── agents/
│       │   └── web-agent.ts           # Main AI agent
│       ├── tools/
│       │   └── web-tools.ts           # Bright Data SDK tools
│       └── index.ts                   # Mastra configuration
├── .env.example                       # Environment template
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

## Configuration

### Agent Settings

The agent is configured in [src/mastra/agents/web-agent.ts](src/mastra/agents/web-agent.ts):

- **Model**: OpenAI GPT-4o-mini
- **Memory**: Persistent LibSQL file storage (`file:../mastra.db`)
- **Tools**: Four Bright Data tools (search, scrape, Amazon, LinkedIn)
- **Instructions**: General-purpose web research with clear citation guidelines

### Tool Configuration

Tools are configured in [src/mastra/tools/web-tools.ts](src/mastra/tools/web-tools.ts):

- **API Key**: Required for all tools
- **Auto Create Zones**: Automatically creates Bright Data zones when needed
- **Input Validation**: Zod schemas ensure correct input format
- **Error Handling**: Comprehensive error messages for debugging

### Database Configuration

Storage settings in [src/mastra/index.ts](src/mastra/index.ts):

- **Observability**: In-memory database for observability data
- **Agent Memory**: File-based storage for conversation history (relative to `.mastra/output` directory)

## Troubleshooting

### Common Issues

**"Bright Data API key is required to initialize tools"**
- Ensure `.env` file exists with valid `BRIGHTDATA_API_KEY`
- Check that the API key is not expired
- Verify the API key has permissions for SDK access

**"OpenAI API key not found"**
- Verify `OPENAI_API_KEY` in `.env`
- Ensure the API key has access to GPT-4o-mini model
- Check your OpenAI account has available credits

**Tool initialization failures**
- Check which specific tools failed (error message will list them)
- Verify your Bright Data account has access to required datasets
- Ensure zones are properly configured (or `autoCreateZones: true` is set)

**Search or scrape timeouts**
- Check internet connectivity
- Verify Bright Data service status
- Consider network latency and proxy location

**Amazon or LinkedIn tool errors**
- Ensure URLs are in correct format (Amazon: must contain `/dp/` or `/gp/product/`)
- Verify LinkedIn URLs are valid profile URLs
- Check that your Bright Data plan includes dataset access

### Logging

The application uses Pino for structured logging. Logs include:
- Agent responses and reasoning
- Tool calls and responses
- Error details and stack traces
- Performance metrics
- API interactions

Check logs in development mode for detailed debugging information.

## Development

### Adding New Features

1. **New Tools**: Add to [src/mastra/tools/](src/mastra/tools/) directory
2. **Agent Modifications**: Update [src/mastra/agents/web-agent.ts](src/mastra/agents/web-agent.ts)
3. **Configuration Changes**: Modify [src/mastra/index.ts](src/mastra/index.ts)

### Extending Bright Data Tools

The `brightDataTools` function in [web-tools.ts](src/mastra/tools/web-tools.ts) supports:
- **Selective Tool Loading**: Use `excludeTools` to disable specific tools
- **Custom Clients**: Modify `createBrightDataClient` for custom configuration
- **Additional Tools**: Add new tool creators following existing patterns

Example:
```typescript
const tools = brightDataTools({
  apiKey: process.env.BRIGHTDATA_API_KEY!,
  excludeTools: ['linkedinCollectProfiles']  // Disable LinkedIn tool
});
```

### Testing

Currently no tests are configured. To add testing:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Create a `jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

## Example Use Cases

### Web Research
Ask the agent to research any topic and it will use search and scrape tools to gather current information:
```
"What are the latest developments in quantum computing?"
```

### Product Research
Get detailed Amazon product information:
```
"Compare the features and reviews of the top 3 noise-cancelling headphones"
```

### Competitive Analysis
Scrape competitor websites and analyze their offerings:
```
"Analyze the pricing structure on example.com and compare it to industry standards"
```

### Professional Research
Collect LinkedIn profiles for research:
```
"Get the professional background of executives at [company name]"
```

## Security & Privacy

- **API Keys**: Never commit `.env` file to version control
- **Data Privacy**: Use tools responsibly and respect privacy regulations
- **Rate Limiting**: Bright Data handles rate limiting automatically
- **Personal Data**: Avoid collecting unnecessary personal information

## License

ISC

## Support

For issues with:
- **Mastra**: Visit [Mastra Documentation](https://mastra.ai)
- **Bright Data SDK**: Check [Bright Data Documentation](https://docs.brightdata.com)
- **This Project**: Open an issue in the repository

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built with [Mastra](https://mastra.ai) and [Bright Data](https://brightdata.com)**
