**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Setup for forks / local development

This repo does **not** ship with API keys. To run it against your own backend:

1. **Copy the env template**
   ```sh
   cp .env.example .env
   ```
2. **Create a Supabase project** and paste its URL, publishable/anon key and project ID into `.env`. These `VITE_*` values are publishable — they are safe to ship in the browser bundle because Row Level Security protects the database.
3. **Deploy the edge functions** from `supabase/functions/` to your Supabase project.
4. **Set the server-side secrets** in the Supabase dashboard (Settings → Edge Functions → Secrets). See `.env.example` for the full list (Finnhub, Alpha Vantage, Twelve Data, FRED, etc.). These are **never** stored in the repo.

### Security notes

- `.env` is gitignored — never commit it.
- All third-party API keys used by this project live exclusively as Supabase Edge Function secrets and are read server-side via `Deno.env.get()`. They never reach the browser and are not present in the repository.
- The only credentials in the client bundle are the Supabase publishable URL + anon key, which are designed to be public.


**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Open vercel.com and everything else will be self-explanatory.
