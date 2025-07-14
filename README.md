# Darden CMS - Frontend Only Version

This is a frontend-only version of the Darden Content Management System that runs entirely in your browser using the OpenRouter API.

## Key Changes from Backend Version

1. **No Backend Required**: All API calls are made directly to OpenRouter from your browser
2. **User-Provided API Keys**: Users must provide their own OpenRouter API key
3. **Removed Features**:
   - File uploads (marketing materials, SMS examples)
   - Backend API key validation
   - Geo-restrictions
   - WebSocket streaming
   - Rate limiting (managed by OpenRouter)

## Setup

1. Open `index.html` in a web browser
2. You'll be prompted to enter your OpenRouter API key
3. Get your API key from: https://openrouter.ai/keys
4. Your key is stored locally in your browser and never sent to any server

## Security Notes

- Your OpenRouter API key is stored in browser localStorage
- The key is only used for direct API calls to OpenRouter
- No data is sent to any backend server
- All processing happens in your browser

## Available Models

The app supports various AI models through OpenRouter:
- Google Gemini Flash (Free)
- Google Gemini Thinking (Free)
- OpenAI GPT-4o Mini
- OpenAI GPT-4o
- Anthropic Claude 3.5 Sonnet
- Anthropic Claude 3.5 Haiku
- Meta Llama 3.3 70B

## Features

### Core Features
- SMS content generation with character limit validation
- Email content generation with structured JSON output
- Multiple AI model support through OpenRouter
- Tone and style customization
- Project-specific content (Bahama Breeze, Cheddar's, Yard House)
- Content history and download
- Prompt enhancement

### Advanced Features (Backend Parity)
- **Sophisticated Prompt Templates**: Uses the same template system as the backend
- **SMS Validation**: 
  - 128 character limit for standard messages
  - 40 character limit with emojis
  - Exactly one emoji when requested
  - Automatic retry on validation failure (up to 2 retries)
- **Campaign Data Integration**: For Cheddar's, includes top-performing email campaign examples
- **Dynamic Guidelines**: Builds prompts based on topic, tone, date, and other settings
- **Advanced AI Parameters**: Temperature, top_p, frequency/presence penalties
- **Multi-Result Generation**: Generate multiple variations in one request
- **Real-time Validation Feedback**: Shows validation errors and retry attempts

## Browser Requirements

- Modern browser with JavaScript enabled
- Internet connection for OpenRouter API calls
- localStorage support for API key storage