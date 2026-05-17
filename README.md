# Volga AI — Frontend

Next.js 14 (App Router) frontend for Volga AI data analysis platform.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
`.env.local` file mein ye set karo:

```env
# Python Backend (Render/Railway pe deploy karo)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com

# Razorpay PUBLIC key (Key ID — secret nahi)
# Razorpay Dashboard → Settings → API Keys → Key ID
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXXXX

# Firebase Auth
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Claude Proxy (optional)
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run
```bash
npm run dev       # development
npm run build     # production build
npm start         # production server
```

## Architecture

```
User → Next.js Frontend → Python FastAPI Backend → MongoDB Atlas
                       ↘ Firebase Auth (token verify)
                       ↘ Razorpay (subscription)
                       ↘ Claude/Gemini/GPT (AI analysis)
```

**Key rules:**
- Firebase sirf **Auth** ke liye — Firestore/Storage use nahi hota
- Sab user data **MongoDB** mein (backend pe)
- **Razorpay Subscription** model — order nahi
- Frontend har backend call mein `Authorization: Bearer <firebase_token>` bhejta hai

## Files changed vs original

| File | Change |
|------|--------|
| `lib/firebase.ts` | Firestore/Storage remove |
| `lib/auth.ts` | createUserDocument() remove |
| `lib/token.ts` | Naya — Firebase token helper |
| `context/AuthContext.tsx` | Backend sync built-in, backendUser expose |
| `hooks/useAuth.ts` | backendUser, isPro, refreshBackendUser |
| `hooks/useUpload.ts` | Firebase Storage → backend multipart |
| `services/razorpay.service.ts` | Order → Subscription flow |
| `services/upload.service.ts` | Firebase Storage → /api/files/upload |
| `services/analysis.service.ts` | Claude direct → /api/analyse/run |
| `services/history.service.ts` | Firestore → /api/files/ |
| `types/payment.ts` | order_id → subscription_id |
| `types/user.ts` | BackendUser type add |
| `components/payment/PricingCard.tsx` | Cancel support, halted warning |
| `app/pricing/page.tsx` | Public + logged-in views |
| `app/dashboard/page.tsx` | backendUser se real limits |

## Deleted files (do not add back)
- `app/api/razorpay/` — Python backend duplicate tha
- `app/api/plans/` — Python backend duplicate tha  
- `services/payment.service.ts` — Stripe ka purana code tha

## Razorpay setup
1. Dashboard → Plans → Create Plan (Monthly, ₹499, 49900 paise)
2. Copy Plan ID → backend `.env` mein `RAZORPAY_PLAN_ID`
3. Dashboard → Webhooks → Add URL: `https://your-backend.onrender.com/api/plans/webhook`
4. Copy Webhook Secret → backend `.env` mein `RAZORPAY_WEBHOOK_SECRET`
5. Dashboard → Settings → API Keys → Key ID → frontend `.env.local` mein `NEXT_PUBLIC_RAZORPAY_KEY_ID`
