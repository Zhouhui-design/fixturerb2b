# Supabase Integration Guide

This project uses Supabase for backend services including database storage and authentication.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the project to be provisioned

### 2. Get Your Credentials

1. Go to Project Settings > API
2. Copy the following values:
   - Project URL
   - anon/public key

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor and run it

This will create:
- `translations` table for dynamic content
- `contact_submissions` table for form data
- Appropriate indexes and security policies

## Features

### Lazy Loading Translations

The application now supports lazy loading of translations to optimize performance:

- **Bundled translations**: English, Chinese, Japanese, Spanish, and Arabic are bundled with the app for instant loading
- **Dynamic translations**: Other languages can be loaded from Supabase on-demand
- **Caching**: Loaded translations are cached to avoid repeated network requests
- **Fallback**: If Supabase is unavailable, the app falls back to English

### Contact Form Storage

Contact form submissions are now stored in Supabase:

- All form data is saved to the `contact_submissions` table
- Submissions include status tracking (new, contacted, converted, etc.)
- Admin users can query and manage submissions through Supabase

## Database Schema

### translations table

Stores dynamic translation content:

```sql
- id: UUID (primary key)
- language: VARCHAR(10) (e.g., 'en', 'zh', 'fr')
- key: TEXT (dot-notation path, e.g., 'hero.title')
- value: TEXT (translated text)
- namespace: VARCHAR(50) (grouping, default 'common')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### contact_submissions table

Stores contact form submissions:

```sql
- id: UUID (primary key)
- name: TEXT
- email: TEXT
- company: TEXT (optional)
- phone: TEXT (optional)
- store_area: INTEGER (optional)
- requirement_type: TEXT (optional)
- need_oem: BOOLEAN
- message: TEXT
- status: TEXT (default 'new')
- created_at: TIMESTAMP
```

## Security

Row Level Security (RLS) is enabled on all tables:

- **translations**: Public read access, authenticated write access
- **contact_submissions**: Public insert access, authenticated read access

## Development

### Testing Locally

1. Make sure your `.env` file is configured
2. Run the development server:
   ```bash
   npm run dev
   ```

### Adding New Translations to Supabase

You can add translations dynamically via SQL:

```sql
INSERT INTO translations (language, key, value, namespace)
VALUES 
  ('fr', 'hero.title', 'Titre en français', 'common'),
  ('fr', 'hero.subtitle', 'Sous-titre en français', 'common');
```

Or use the Supabase dashboard Table Editor.

## Troubleshooting

### "Supabase environment variables are not set"

Make sure you have created a `.env` file with the correct variables and restarted your dev server.

### Translation loading fails

- Check browser console for error messages
- Verify your Supabase project is active
- Ensure RLS policies allow public read access to the translations table

### Contact form submission fails

- Verify RLS policies allow public insert access to contact_submissions
- Check that all required fields are provided
- Review browser console for detailed error messages

## Next Steps

Consider implementing:

1. **Admin Dashboard**: Build an admin interface to manage translations and view contact submissions
2. **Authentication**: Add Supabase Auth for admin access control
3. **Storage**: Use Supabase Storage for file uploads (drawings, images)
4. **Edge Functions**: Add serverless functions for email notifications on form submissions
