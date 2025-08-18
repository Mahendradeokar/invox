# Invox – AI Invoice Customizer

**Invox** is an AI-powered tool for customizing invoice templates. It supports project management, intelligent template customization, versioning, and real-time previews—all within a Turbo monorepo setup.

---

## Features

- **Predefined templates**  
  Ready-made invoice templates to get started quickly.

- **Multiple project management**  
  Handle and organize projects for different templates.

- **AI-assisted customization**  
  Use AI to customize templates—adapt content, layout, or formatting.

- **Downloadable with Handlebars support**  
  Export templates as a zip containing a Handlebars file, HTML preview file, and JSON payload, enabling advanced templating and customization.

- **Robust version control**
  - Versioning: Track multiple iterations of each template.
  - Public version sharing: Share specific versions publicly.
  - Version previews: Preview different versions before selection.
  - Version-specific checkout: Revert to previous versions.

- **Live preview of changes**  
  Instantly view modifications as you customize to ensure accuracy and design consistency.

---

## Tech Stack

This project uses a **Turbo monorepo** structure that houses both frontend and backend, alongside shared packages (e.g., common types and utilities) ([GitHub][1]).

### Frontend

- **Next.js** – Framework for React-based UI.
- **Tailwind CSS** – Utility-first styling framework.
- **shadcn components** – Component library for rapid UI building.

### Backend

- **Node.js** with **Express** – REST API server.
- **MongoDB** – Database for storing templates, versions, and project data.

### Shared Packages

- Shared **response types** and **utilities** to ensure consistency across frontend and backend.

---

## Getting Started (Run Locally)

### Prerequisites

- [pnpm](https://pnpm.io/) (or any package manager you prefer).

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

   - To run a specific app only (client or API):

     ```bash
     pnpm run dev --filter=invox-client
     pnpm run dev --filter=invox-api
     ```

4. **Build for production**

   ```bash
   pnpm run build
   ```

---

## Monorepo Structure Overview

```text
/
├── apps/
│   ├── invox-client     # Next.js frontend
│   └── invox-api        # Express + MongoDB backend
├── packages/
│   ├── shared-types     # Shared TypeScript types and definitions
│   └── lib              # Shared utilities across frontend and backend
├── pnpm-workspace.yaml  # Defines workspace structure
├── turbo.json           # Turbo monorepo configuration
└── other config files   # ESLint, Prettier, etc.
```
