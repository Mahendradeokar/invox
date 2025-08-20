# Invox – AI Invoice Customizer

**Invox** is an AI-powered tool for customizing invoice templates. It supports project management, AI template customization, versioning, and real-time previews—all within a Turbo monorepo setup.

---

## Features

- **Predefined templates**
  - Ready-made invoice templates to get started quickly.

- **Multiple project management**
  - Organize and handle projects across different templates.

- **AI template customization**
  - Adapt content, layout, and formatting.
  - Powered by a multi-agent AI flow using different specialized models.

- **Downloadable with Handlebars support**
  - Export templates as a zip package containing:
    - Handlebars file
    - HTML preview file
    - JSON payload for templating

- **Robust version control**
  - Track multiple iterations of each template.
  - Share specific versions publicly.
  - Preview different versions before selection.
  - Revert to previous versions when needed.

- **Live preview of changes**
  - Instantly view template modifications during customization.

- **Anon user flow**
  - User history is preserved on page reload using an anonymous user mechanism.

- **Markdown message handling**
  - Render formatted content with a custom React Markdown component.

- **Graceful image loading**
  - Custom image component with error handling and fallback support.

- **Reusable components and hooks**
  - Located in `components/shared` – a collection of reusable UI components.
  - Located in `src/hooks` – custom hooks for specialized behaviors.

- **Error handling**
  - **Next.js** – Error boundaries are used to gracefully handle rendering errors.
  - **Express** – Centralized error handling middleware manages API errors consistently.

---

## Tech Stack

This project uses a **Turbo monorepo** that combines frontend, backend, and shared packages.

### AI Providers

- **OpenRouter** – Routes AI requests.
- **Vercel AI SDK** – Integrates AI functionality into the app.
- **Models used**:
  - `openai/gpt-4.1-mini` – For request understanding.
  - `google/gemini-2.5-flash` – For template modification.

### Frontend

- **Next.js** – React framework with SSR.
- **Tailwind CSS** – Utility-first CSS.
- **shadcn/ui components** – Prebuilt UI components.
- **tiptap editor** – Custom rich text editor.
- **Custom components** for:
  - Infinite scrolling with client-side pagination.
  - Graceful image error/fallback handling.
  - Ternary and conditional rendering.

- **React Markdown** – Markdown rendering.
- **Clipboard hooks** – Copy-to-clipboard support.
- **Iframe preview** – Live template preview.
- **Zustand** – State management.
- **Error boundaries** – To catch and display fallback UIs for runtime errors.

### Backend

- **Node.js (>=22)** with **Express** – REST API server.
- **MongoDB** – Database for templates, versions, and projects.
- **Handlebars** – Template data population.
- **Vercel AI SDK** – Handling backend AI requests.
- **Error handling middleware** – Centralized system for catching and responding to API errors.

### Shared Packages

- Shared **types** and **utilities** for consistency across frontend and backend.
- Common reusable components and hooks to maintain modularity.

---

## Project Pages & Approach

### Project Page

- **Next.js SSR** – Fetch project list.
- **Custom infinite scroll** – Client-side pagination.

### Templates Page

- **Next.js SSR** – Fetch template list.

### Main App Page

- **Custom Tiptap editor** – Template text editing.
- **React Markdown renderer** – Render formatted text.
- **Clipboard hook** – Copy messages.
- **Iframe preview** – Display real-time template updates.
- **Zustand** – Manage global state.

---

## Getting Started (Run Locally)

### Prerequisites

- [pnpm](https://pnpm.io/) (required).
- Node.js version **>=22**.

### Steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/Mahendradeokar/invox.git
   cd invox
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Run the project locally**
   - To start all services:

     ```bash
     pnpm run dev
     ```

   - To run a specific app only:

     ```bash
     pnpm run dev --filter=invox-client
     pnpm run dev --filter=invox-api
     ```

4. **Build for production**

   ```bash
   pnpm run build
   ```

---

## Monorepo Structure

```text
/
├── apps/
│   ├── invox-client     # Next.js frontend
│   └── invox-api        # Express + MongoDB backend
├── packages/
│   ├── shared-types     # Shared TypeScript types
│   └── lib              # Shared utilities
├── pnpm-workspace.yaml  # Workspace structure
├── turbo.json           # Turbo monorepo config
└── other config files   # ESLint, Prettier, etc.
```
