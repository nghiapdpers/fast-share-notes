# Fast Share Notes 🚀

A web application for lightning-fast text sharing, secured with maximum End-to-End Encryption (E2EE) and auto-deletion after 5 minutes.

## ✨ Key Features

- **🔐 Ultimate Security (E2EE):** Notes are encrypted using the AES-256 algorithm directly in the browser. The decryption key is never sent to the server.
- **⏳ 5-Minute Auto-Destruction:** All data automatically disappears after 5 minutes to ensure privacy.
- **🔑 Access by Code:** Besides links, you can share a short code (e.g., `A1B2C3-XXXX`) for manual entry.
- **📱 Smart QR Code:** Automatically generate QR codes for quick sharing across devices.
- **🔗 Self-Decrypting Links:** The decryption key is attached to the URL fragment (#), allowing recipients to view content with a single click while staying secure.
- **🎨 Modern Interface:** Glassmorphism design, default Dark Mode, and smooth micro-animations.

## 🛡️ Security Mechanism (E2EE)

The application uses a client-side encryption model:
1. **Encryption:** When you click "Create Note", a random key is generated. The content is encrypted using `Crypto-JS (AES-256)`.
2. **Storage:** Only the ciphertext is sent to Supabase.
3. **Sharing:** The decryption key is placed after the `#` in the URL (e.g., `?id=abc#KEY`). Browsers never send the part after `#` to the server.
4. **Decryption:** The recipient's browser retrieves the key from the URL fragment to decrypt the content on the spot.

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Vanilla CSS (Modern CSS variables, Flexbox/Grid)
- **Backend:** Supabase (Database & RLS)
- **Security:** Crypto-JS
- **Icons:** Lucide React

## 🚀 Detailed Installation Guide

### 1. Prepare Backend (Supabase)

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to the **SQL Editor**, create a new query, and paste the content from the `supabase_schema.sql` file located in the root of this project.
3. Click **Run** to initialize the `notes` table and Row Level Security (RLS) policies.
4. (Optional) Enable the `pg_cron` extension in **Database -> Extensions** if you want to automatically delete expired data on the server side.

### 2. Source Code Installation

```bash
# Clone the project
git clone https://github.com/your-username/fast-share-notes.git

# Install dependencies
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and fill in the information from your Supabase project (**Project Settings -> API**):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Project

```bash
npm run dev
```

The application will be running at: `http://localhost:5173`

## 📦 Deployment

The project is pre-configured with **GitHub Actions** for automatic deployment to **GitHub Pages**.

1. Push the code to your GitHub repository.
2. Go to **Settings -> Secrets and variables -> Actions**.
3. Add the following 2 secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Go to the **Actions** tab, select the workflow, and click run (or it will auto-deploy when you push to the `main` branch).

## 🤝 Contributing

Any contributions to improve security or user experience are welcome. Please open an Issue or a Pull Request!

---
This project is licensed under the MIT License.
