# AI MedSchool

An open-source multimodal MCAT study assistant built with Next.js and the AI SDK.

It supports text + image questions, streams responses in real time, labels each answer by MCAT subject, and formats explanations in a tutor-style structure.

## Why This Project

Preparing for the MCAT is often bottlenecked by feedback speed. This app is designed to give immediate, structured tutoring help for:

- Biology
- Biochemistry
- General Chemistry
- Organic Chemistry
- Physics
- CARS
- Psychology/Sociology

## Features

- Streaming AI responses (token-by-token)
- Multimodal input (attach or paste images)
- Drag-and-drop image upload support
- Subject detection shown as a colored badge
- Markdown rendering for clear, readable explanations
- Starter prompts for fast practice
- Copy-to-clipboard for assistant responses

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Vercel AI SDK (`ai`) + OpenRouter provider (`@ai-sdk/openai`)
- shadcn/ui primitives

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/<your-org>/ai-medschool.git
cd ai-medschool
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint

## How It Works

1. User submits text and/or image(s) from the chat UI.
2. The app sends conversation history to the API route at `src/app/api/chat/route.ts`.
3. The API converts image data URLs into model image parts.
4. Requests are sent to OpenRouter with a tutor system prompt.
5. Responses stream back to the UI and render live.
6. The first response line (`Subject: ...`) is parsed and shown as a badge.

## Image Support

- Accepted formats: PNG, JPEG, WebP, GIF
- Max images per message: 4
- Max file size per image: 20 MB
- Attach via file picker, drag-and-drop, or clipboard paste

## Project Structure

```text
src/
	app/
		api/chat/route.ts      # Streaming chat endpoint
		page.tsx               # App entry page
	components/
		ChatPage.tsx           # Main chat experience
		ChatInput.tsx          # Input + uploads
		MessageList.tsx        # Message rendering container
		MessageBubble.tsx      # User/assistant bubbles + markdown
		StarterPrompts.tsx     # Quick-start MCAT prompts
		SubjectBadge.tsx       # Subject color tags
	lib/
		system-prompt.ts       # Tutor behavior and formatting rules
		images.ts              # Image validation + processing
		types.ts               # Shared app types
```

## Deployment

This project can be deployed on Vercel or any Node-compatible host.

Before deployment:

- Set `OPENROUTER_API_KEY` in your hosting provider environment settings.
- Run `npm run build` to verify the production build succeeds.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint and verify local behavior
5. Open a pull request with a clear description

## Roadmap Ideas

- Conversation history persistence
- User auth and personalized study sessions
- Question set generation by subject/difficulty
- Progress analytics and weak-area tracking
- Citation mode with textbook-style references

## Disclaimer

This tool is for educational support and does not replace official prep resources or licensed medical advice.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
