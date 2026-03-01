# Multi-Tenant Mail Login Cloner

This project is a high-fidelity frontend application designed to dynamically clone and display various enterprise mail login pages based on user context provided via URL parameters.

## 🚀 Local Development Setup

To run this project on your own computer, follow these steps:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### 2. Project Initialization
Create a new folder for your project and navigate into it:
```bash
mkdir mail-cloner
cd mail-cloner
```

### 3. Install Dependencies
Initialize a `package.json` and install **Vite** and **React**:
```bash
npm init -y
npm install vite @vitejs/plugin-react react react-dom
```

### 4. Create Configuration
Create a file named `vite.config.js` in your root directory to handle the TypeScript/JSX files:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 5. File Placement
Copy the files from this project into your folder, maintaining the following structure:
```text
mail-cloner/
├── index.html
├── index.tsx
├── App.tsx
├── vite.config.js
├── package.json
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── LoginForm.tsx
└── themes/
    ├── AlibabaTheme.tsx
    ├── BossmailTheme.tsx
    ├── Theme263.tsx
    ├── QQMailTheme.tsx
    ├── SinaTheme.tsx
    ├── SohuTheme.tsx
    ├── NetEaseTheme.tsx
    ├── GlobalMailTheme.tsx
    └── CoremailTheme.tsx
```

### 6. Start the Server
Run the development server:
```bash
npx vite
```
The terminal will provide a URL (usually `http://localhost:5173`).

---

## 💡 Usage & Theme Switching

The application detects the "clone" based on the `email` query parameter. Once the server is running, open these links in your browser:

- **Alibaba Mail (Default):**
  `http://localhost:5173/?email=user@company.com`
- **Bossmail Clone:**
  `http://localhost:5173/?email=test@bossmail.com`
- **263 Cloud Mail Clone:**
  `http://localhost:5173/?email=admin@263.net`
- **QQ Mail Clone:**
  `http://localhost:5173/?email=user@qq.com`
- **Sina Mail Clone:**
  `http://localhost:5173/?email=vip@sina.com`
- **Sohu Mail Clone:**
  `http://localhost:5173/?email=support@sohu.com`
- **NetEase Mail Clone:**
  `http://localhost:5173/?email=test@163.com`
- **GlobalMail Clone:**
  `http://localhost:5173/?email=info@globalmail.cn`
- **Coremail Clone:**
  `http://localhost:5173/?email=admin@coremail.cn`

---

## 🏗️ Project Structure

- `App.tsx`: The logic hub. Parses URL parameters and selects the theme.
- `/themes`: Full-page layouts for specific brands.
- `/components`: Reusable UI modules used across different themes.

---

## 🎨 Adding a New Clone

1.  **Create a Theme:** Add a new file in `themes/` (e.g., `NewBrandTheme.tsx`).
2.  **Design:** Use Tailwind CSS to match the target's look.
3.  **Route:** Update the detection logic in `App.tsx`:
    ```tsx
    if (domain.includes('newbrand')) {
      currentTheme = 'newbrand';
    }
    ```

---

## 🛠️ Tech Stack
- **React 19**: Modern UI library.
- **Vite**: Ultra-fast development server and bundler.
- **Tailwind CSS**: Utility-first CSS framework (via CDN for ease of cloning).
- **TypeScript**: For type-safe development.
