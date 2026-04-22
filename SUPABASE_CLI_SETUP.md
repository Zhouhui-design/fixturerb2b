# Supabase CLI Installation Guide

This guide explains how to install the Supabase CLI for managing your Supabase project.

## Why Install Supabase CLI?

The Supabase CLI allows you to:
- Manage database migrations locally
- Test changes before deploying to production
- Manage authentication and storage settings
- Seed test data
- Link to your remote Supabase project

## Installation Methods

### Method 1: Using Homebrew (macOS/Linux) - RECOMMENDED

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Supabase CLI
brew install supabase/tap/supabase

# Verify installation
supabase --version
```

### Method 2: Using npm (with npx)

```bash
# Use directly without installing
npx supabase@latest --help

# Or install globally (not recommended by Supabase)
npm install -g supabase
```

### Method 3: Download Binary Manually (Linux)

```bash
# Create bin directory in project
mkdir -p bin

# Download the latest release
wget https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz -O /tmp/supabase.tar.gz

# Extract to project bin directory
tar -xzf /tmp/supabase.tar.gz -C bin/

# Make executable
chmod +x bin/supabase

# Verify installation
./bin/supabase --version

# Add to PATH (add this line to ~/.bashrc or ~/.zshrc)
echo 'export PATH="$PATH:/home/sardenesy/fixturerb2b/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Method 4: Using Go

```bash
# Install using Go
go install github.com/supabase/cli@latest

# The binary will be in ~/go/bin/supabase
# Add to PATH
echo 'export PATH="$PATH:$HOME/go/bin"' >> ~/.bashrc
source ~/.bashrc

# Verify
supabase --version
```

### Method 5: Using Docker (if available)

```bash
# Run Supabase CLI via Docker
docker run --rm supabase/cli --help

# Create an alias for convenience
echo 'alias supabase="docker run --rm -v $(pwd):/workdir supabase/cli"' >> ~/.bashrc
source ~/.bashrc
```

## After Installation

Once the Supabase CLI is installed, you can:

### 1. Initialize Supabase in Your Project

```bash
cd /home/sardenesy/fixturerb2b
supabase init
```

This creates a `supabase` directory with configuration files.

### 2. Link to Your Remote Project

```bash
# Get your project reference from Supabase dashboard
supabase link --project-ref your-project-id
```

### 3. Apply Database Migrations

```bash
# Push local migrations to remote database
supabase db push

# Or reset and reapply all migrations
supabase db reset
```

### 4. Manage Database Schema

```bash
# Create a new migration
supabase migration new add_users_table

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_users_table.sql
```

## Current Project Setup

Your project already has:
- ✅ Supabase client library installed (`@supabase/supabase-js`)
- ✅ Database schema SQL file: `supabase/migrations/001_initial_schema.sql`
- ✅ TypeScript types configured in `src/lib/supabase.ts`
- ✅ Environment variables structure in `.env.example`

## Next Steps After CLI Installation

1. **Initialize Supabase project**:
   ```bash
   supabase init
   ```

2. **Move existing migration**:
   ```bash
   # The migration file is already in the correct location
   # supabase/migrations/001_initial_schema.sql
   ```

3. **Link to your Supabase project**:
   ```bash
   supabase link --project-ref <your-project-id>
   ```

4. **Apply migrations**:
   ```bash
   supabase db push
   ```

5. **Test locally** (optional):
   ```bash
   supabase start  # Starts local Supabase stack
   ```

## Troubleshooting

### "Command not found" after installation
Make sure the installation directory is in your PATH:
```bash
echo $PATH
which supabase
```

### Permission denied
```bash
chmod +x /path/to/supabase
```

### Network issues downloading
Try using a different network or download method. The binary is ~30MB.

### Version mismatch
Always use the latest version:
```bash
supabase --version
# If outdated, reinstall using your chosen method
```

## Quick Reference

Common commands you'll use:

```bash
# Check version
supabase --version

# Initialize project
supabase init

# Link to remote project
supabase link --project-ref <ref>

# Push migrations
supabase db push

# Create new migration
supabase migration new migration_name

# Start local development
supabase start

# Stop local development
supabase stop

# View status
supabase status
```

## For This Project

Since we're having network issues downloading the CLI binary, here's what you should do:

1. **On a machine with better connectivity**, download the CLI using one of the methods above
2. **Transfer the binary** to this project's `bin/` directory
3. **Make it executable**: `chmod +x bin/supabase`
4. **Follow the "After Installation" steps** above

Alternatively, you can:
- Use the **Supabase web dashboard** to manually run the SQL migration
- Use **any PostgreSQL client** to connect to your Supabase database and execute the migration SQL

The application code is already complete and ready to use once the database schema is set up!
