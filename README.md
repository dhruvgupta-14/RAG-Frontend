# RAG Chatbot — Frontend

A modern, responsive React frontend for the **RAG (Retrieval-Augmented Generation) Chatbot**. Upload documents and have intelligent conversations about their content, powered by Google Gemini and Pinecone.

---

## 🚀 Live Demo

- **Frontend**: [Coming Soon — deploy on Vercel]
- **Backend API**: https://rag-backend-n2rm.onrender.com

---

## ✨ Features

- 🔐 **Google Authentication** — secure login via Firebase
- 📄 **Multi-format Upload** — supports PDF, DOCX, and TXT files
- 🖱️ **Drag & Drop** — intuitive file upload experience
- 💬 **Intelligent Chat** — ask questions about your document
- 🧠 **Persistent Memory** — chat history saved across sessions
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop
- 🔔 **Toast Notifications** — real-time feedback on actions
- 🎨 **Modern UI** — clean purple/blue gradient design

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool + dev server |
| **Tailwind CSS** | Utility-first styling |
| **Firebase** | Google Authentication (client SDK) |
| **Axios** | HTTP requests to backend |
| **React Router v6** | Client-side routing |
| **React Hot Toast** | Toast notifications |
| **React Firebase Hooks** | Firebase auth state management |
| **React Icons** | Icon library |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── favicon.jpg
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Sticky header with user info + logout
│   │   ├── Footer.jsx            # Footer with social links
│   │   ├── FileUploadSection.jsx # Drag & drop file upload panel
│   │   └── InputChatSection.jsx  # Chat input + send button
│   ├── App.jsx                   # Route config + auth protection
│   ├── firebase.js               # Firebase client SDK setup
│   ├── Login.jsx                 # Google login page
│   ├── RAGChatbot.jsx            # Main chatbot page
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind
├── .env                          # Environment variables (not committed)
├── .env.example                  # Environment variables template
├── index.html                    # HTML entry point
├── vite.config.js                # Vite configuration
└── package.json
```

---

## 🔌 Pages & Components

### Pages
| Page | Route | Description |
|---|---|---|
| `Login.jsx` | `/login` | Google OAuth login |
| `RAGChatbot.jsx` | `/` | Main chat interface |

### Components
| Component | Description |
|---|---|
| `Header.jsx` | Logo + user avatar/name + logout button |
| `Footer.jsx` | Copyright + social media links |
| `FileUploadSection.jsx` | Drag & drop zone, file info, delete button |
| `InputChatSection.jsx` | Textarea input + send button, Enter key support |

---

## 🔒 Auth Flow

```
User visits "/"
    ↓
Firebase checks auth state (useAuthState)
    ↓
Not logged in → redirect to "/login"
Logged in    → show RAGChatbot
    ↓
User clicks "Continue with Google"
    ↓
signInWithPopup → Google OAuth popup
    ↓
Firebase returns user object
    ↓
Toast: "Welcome, [name]!"
    ↓
Navigate to "/"
```

---

## 💬 Chat Flow

```
User uploads document
    ↓
POST /file/upload (multipart/form-data)
    ↓
File info saved to localStorage (persist on refresh)
    ↓
User types question + hits Enter or Send
    ↓
Message appears in UI immediately
    ↓
POST /ask/ai { query, namespace }
    ↓
AI response appears
    ↓
Messages saved to Firestore via backend
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Firebase project with Google Auth enabled
- Backend running (local or deployed)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/rag-frontend.git
cd rag-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
VITE_API_URL=https://rag-backend-n2rm.onrender.com
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 🔑 Environment Variables

| Variable | Description | Where to get |
|---|---|---|
| `VITE_API_URL` | Backend API URL | Your Render deployment URL |
| `VITE_FIREBASE_API_KEY` | Firebase API key | Firebase Console → Project Settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Firebase Console → Project Settings |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Firebase Console → Project Settings |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Firebase Console → Project Settings |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID | Firebase Console → Project Settings |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Firebase Console → Project Settings |

> **Note:** All frontend env variables must start with `VITE_` — Vite only exposes variables with this prefix to the browser.

---

## 🚀 Deployment on Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "RAG frontend complete"
git remote add origin YOUR_GITHUB_URL
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **New Project** → Import your GitHub repo
3. Framework: **Vite** (auto-detected)
4. Add all environment variables from `.env`
5. Click **Deploy**

### 3. Add Vercel URL to Firebase
```
Firebase Console
→ Authentication
→ Settings
→ Authorized Domains
→ Add your Vercel URL
```

---

## 🧠 Key Design Decisions

### Why Firebase for Auth?
Google OAuth out of the box — no custom auth server needed. Same Firebase project used for backend Firestore — single ecosystem. `react-firebase-hooks` makes auth state management trivial with one line.

### Why localStorage for File State?
User uploads a file → refreshes page → React state resets to null. localStorage persists file metadata across refreshes so the user doesn't lose context. Only metadata (name, size, type) is stored — not the actual file content.

### Why Axios over Fetch?
Axios automatically handles JSON serialization, provides better error objects, and has cleaner syntax for setting headers — particularly useful for consistently adding the Firebase auth token to every request.

### Why sanitizeNamespace on Frontend?
The backend sanitizes the namespace when storing (replacing special chars with `_`). The frontend must send the same sanitized namespace when querying and deleting, otherwise there's a mismatch and Pinecone can't find the vectors.

```javascript
const sanitizeNamespace = (name) => name.replace(/[^a-zA-Z0-9_-]/g, "_");
```

### Why referrerPolicy on Avatar Image?
Google profile photo URLs require `no-referrer` policy to load correctly in external applications. Without it, the image request gets blocked by Google's servers.

### Protected Routes
```jsx
// Logged in  → show chatbot
// Logged out → redirect to login
<Route path="/" element={user ? <RAGChatbot /> : <Navigate to="/login" />} />
```

---

## 📱 Responsive Design

| Screen | Behavior |
|---|---|
| Mobile | Single column, icon-only logout, name hidden |
| Tablet | Two column layout begins |
| Desktop | Full 3-column grid, all text visible |

---

## 🐛 Known Issues & Tech Debt

- [ ] Chat history not isolated per document — all history clears on file delete
- [ ] No loading skeleton for history fetch on mount
- [ ] File upload does not show progress percentage
- [ ] No support for multiple simultaneous documents

---

## 🔮 Planned Improvements

- [ ] Streaming responses (word by word like ChatGPT)
- [ ] Chat history per document namespace
- [ ] Upload progress bar
- [ ] Multi-document support
- [ ] Dark mode
- [ ] Mobile-first redesign

---

## 👨‍💻 Author

**Dhruv Gupta**
- 3rd Year Economics (BS), IIT Kharagpur
- GitHub: [@dhruvgupta-14](https://github.com/dhruvgupta-14)
- LinkedIn: [dhruv-gupta](https://www.linkedin.com/in/dhruv-gupta-9285692a2/)
- Portfolio: [dhruv14.vercel.app](https://dhruv14.vercel.app)

---

