# 🤖 GrabFlow - AI Integration Assistant

This project demonstrates an AI-powered solution for dynamic payment integration using the GrabPay Mock APIs. The goal was to streamline developer experience by reducing integration overhead through intelligent prompting and automation. Built for the **GrabHack 2025**, this project combines large language models, script generation, and runtime code packaging into a seamless developer flow.

---

## 🧠 1. AI-Powered Prompting Engine

A conversational UI allows developers to interact with Claude (via Bedrock) to:

- Generate code for integrating GrabPay, GrabLoans, and other APIs.
- Get runnable scripts for automating file creation and integration.
- Request multi-language (React, Kotlin, Swift, Django) support.
- Ask architectural, code flow, or error-handling questions.

### Stack:
- **Claude 3 Sonnet via AWS Bedrock**
- **Streaming support with SSE**
- **Custom prompt generation logic**
- **Task-based dynamic prompting (chat vs script)**
- **MCP Server: Node.js (Express) — handles mock GrabPay endpoints.**
- **Chat UI built using React**

---

## ⚙️ 2. Script Generator via Claude

The chatbot can generate scripts that:

- Create integration files (like `GrabPayIntegration.js`)
- Modify entry points (e.g., `App.js`, `MainActivity.kt`)
- Add import statements and insert JSX/components
- Use the browser-native `fetch` API for API calls

### How it works:
1. User enters a prompt to integrate any Grab service in their preferred language.
2. Backend builds a Claude prompt for code + script generation.
3. Claude returns the integration component + automation script.
4. User clicks **Download Script**, and the file is streamed from `/api/download`.

### Example (React):
```bash
node integrate-grabpay.js
```

Creates:
- `src/GrabPayIntegration.js`
- Edits `src/App.js` to:
  - Add `import GrabPayIntegration from './GrabPayIntegration'`
  - Insert `<GrabPayIntegration />` in the JSX

---

## 📦 3. Grab Wrapper Library Generator

In addition to individual scripts, the platform can auto-generate a reusable **NPM package** that wraps Grab services.

### Features:
- Built dynamically with `grabpay.js`, `grabloans.js`, etc.
- Generates:
  - `index.js` for exports
  - `README.md` with usage
  - `package.json`
- Packaged with `npm pack` and served as `.tgz`

### API:
```http
GET /api/generate-wrapper
```

### Installation in App:
```bash
npm install ./grabpay-wrapper-1.0.0.tgz
```

### Usage in Code:
```js
import { useGrabPay, useGrabLoans } from 'grabpay-wrapper';

const handlePay = async () => {
  const pay = useGrabPay({ amount: 1000, currency: 'INR', merchant_id: 'demo-merchant-123' });
  const response = await pay();
  console.log(response);
};
```

---

## 💻 4. Third-Party App Integration

Two modes of using generated code:

### A. Direct Script Automation
- Users download a script (e.g., `integrate-grabpay.js`)
- Runs with `node` to inject files into the third-party app
- Fully offline-compatible
- Supports multi-language frameworks

### B. Wrapper Consumption
- Users install `.tgz` NPM package
- Use exported methods like `useGrabPay()` inside buttons

---

## 🌐 API Routes

| Endpoint                         | Method | Description                                   |
|----------------------------------|--------|-----------------------------------------------|
| `/api/invoke-bedrock`           | POST   | Invoke Claude with prompt + stream response   |
| `/api/download`                 | GET    | Download generated script file                |
| `/api/generate-wrapper`         | GET    | Package & download Grab wrapper as `.tgz`     |

---

## 📁 Project Structure

```
/server
├── prompts/
│   └── scriptPromptBuilder.js
├── scripts/
│   └── generateWrapperPackage.js
├── routes/
│   └── api.js
├── temp/
│   └── grabpay-wrapper-1.0.0/...
├── app.js

/frontend
├── src/
│   ├── components/
│   │   └── GrabPayIntegration.js (auto-generated)
│   ├── App.js (auto-modified)
```

---

## ✅ Key Benefits

- 🧠 AI-generated, real-time, language-specific integration code
- ⚡ Instant file generation and insertion scripts
- 📦 Self-contained, reusable NPM packages
- 💬 Extendable to other payment features (loans, rewards, etc.)
- 🔌 Ideal for rapid prototyping and scalable integration

---

## ✨ Why This Matters

 Copy-pasting code isn't enough. This system:

- Reduces integration friction for developers

- Uses AI context to generate smart, customized code

- Embraces best practices via reusable modules and packages

- Adapts to frameworks like React, Django, or Kotlin

---

## 🙏 Acknowledgements

Built during **GrabHack 2025** 🏁  
Grateful to the **GrabHack organizing team** for the opportunity.  
Special thanks to our mentors for guiding through the development and ideation of the entire prohect.

---

## 🚀 Future Improvements

- Support for auto-installing dependencies
- Authentication flow integrations
- CI-ready SDK bundling for broader deployments
