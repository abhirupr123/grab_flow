const { MOCK_CONTEXT } = require('./model')

function buildPrompt(service, language, userTask, type) {
    if (type == 'chat') {
        const ctx = MOCK_CONTEXT[service];
        if (!ctx) throw new Error(`Unknown service: ${service}`);

        const corePrompt = `
        You are a senior developer assistant helping integrate ${service} using mock APIs.

        Context:
        Mock API
        ${ctx.api_spec.method} ${ctx.api_spec.endpoint}
        Body: ${JSON.stringify(ctx.api_spec.body, null, 2)}

        SDK Link for ${language}:
        ${ctx.sdk_links[language.toLowerCase()] || 'No SDK link available'}

        Config:
        merchant_id: ${ctx.config.merchant_id}
        api_key: ${ctx.config.api_key}

        Task:
        ${userTask}

        Generate:
        Step-by-step instructions for integrating ${service} in ${language}
        Code snippet
        SDK reference
        Potential pitfalls (e.g. CORS, auth errors)
        How to test using the MCP server

        Format in clearly labeled sections.
        `;

        // Wrap it in Claude's expected format
        return `Human:${corePrompt}\n\nAssistant:`;
    }
    else if (type == 'code'&& language.toLowerCase() === 'react') {
        const corePrompt = `
        You are an expert software assistant.

        Your task:
        Generate a complete Node.js automation script that:
        - Creates a React file (GrabPayIntegration.js) that defines a button labeled "Pay with GrabPay"
        - The button should send a POST request using the browser-native fetch API (not axios) to:
        http://localhost:4000/mock-grabpay/initiate
        with payload:
        {
        "amount": 1000,
        "currency": "INR",
        "merchant_id": "demo-merchant-123"
        }
        - The script should modify src/App.js to:
        - Add the import for GrabPayIntegration at the top
        - Insert <GrabPayIntegration /> into the JSX
        - Try inserting after </header> if it exists, else after </div>, else append at end

        The script must:
        - Use Node.js fs and path modules
        - Contain the integration button code inline as a string
        - Write the file to src/GrabPayIntegration.js (assume script is run from project root)
        - Be runnable as node integrate-grabpay.js
        - Write the file and modify App.js safely

        Output:
        - Provide only the complete Node.js script code
        - No explanations, no extra text, no code fences`;

        return `Human:${corePrompt}\n\nAssistant:`
    }
    else if (type === 'code' && language.toLowerCase() === 'python') {
        const corePrompt = `
        You are an expert Python automation assistant.

        Your task is to generate a complete Python script named integrate_grabpay.py that automates the following tasks for a Django project:

        File Creation
        Create a file named grabpay_integration.py inside a specified Django app directory (e.g. myapp/).

        In that file, define a Django view function called grabpay_initiate that:

        Handles both GET and POST requests to /mock-grabpay/initiate/

        On GET: returns a JSON response like { "message": "Use POST to initiate GrabPay" }

        On POST:

        Parses the JSON body for:

        json
        {
        "amount": 1000,
        "currency": "INR",
        "merchant_id": "demo-merchant-123"
        }
        Logs or prints the parsed payload

        Returns a JSON response: { "success": true }

        File Modification
        Modify myapp/views.py:

        Import grabpay_initiate from grabpay_integration.py only if not already imported

        Modify myapp/urls.py:

        Add a URL pattern for /mock-grabpay/initiate/ mapped to views.grabpay_initiate

        Locate the urlpatterns = [...] list in myapp/urls.py

        Insert the new route path('mock-grabpay/initiate/', views.grabpay_initiate, name='grabpay_initiate') inside the list, before the closing bracket

        Ensure the route is not duplicated if it already exists

        Do not append the route outside the list or after the file ends

        Ensure the import and route are added only if not already present

        Script Requirements
        Use Python’s built-in file handling (open, read, write, append)

        Perform all file modifications safely (avoid duplicate imports or routes)

        The script must be runnable as python integrate_grabpay.py

        Assume the script is run from the Django project root

        Output only the complete Python script code — no explanations, no extra text, no markdown formatting`

        return `Human:${corePrompt}\n\nAssistant:`;
    }
}

module.exports = { buildPrompt };
