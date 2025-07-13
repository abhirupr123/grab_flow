const { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } = require("@aws-sdk/client-bedrock-runtime");
const {buildPrompt} = require('./promptbuilder')

const client = new BedrockRuntimeClient({
  region: "YOUR_AWS_BEDROCK_REGION",
  credentials: {
    accessKeyId: "YOUR_AWS_BEDROCK_ACCESS_ID",
    secretAccessKey: "YOUR_AWS_BEDROCK_SECRET_KEY",
    sessionToken: "YOUR_AWS_BEDROCK_SESSION_TOKEN"
  }
});

async function sendPromptToBedrock(service, language, userTask, type) {
  const promptText = buildPrompt(service, language, userTask, type);

    const input = {
        modelId: "YOUR_MODEL_ID",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
        anthropic_version: "YOUR_ANTHROPIC_VERSION",
        messages: [
            {
              role: "user",
              content: promptText
            }
        ],
        max_tokens: 1024,
        temperature: 0.7
        })
    };

    const command = new InvokeModelWithResponseStreamCommand(input);

    try {
            const response = await client.send(command);
            const decoder = new TextDecoder("utf-8");
            let fullResponse = "";

            for await (const chunk of response.body) {
            const decoded = decoder.decode(chunk.chunk.bytes, { stream: true });
            const parsed = JSON.parse(decoded);
            if (parsed.delta && parsed.delta.text) {
                fullResponse += parsed.delta.text;
                process.stdout.write(parsed.delta.text); // Optional: stream to console
            }
        }
        return fullResponse;
    } catch (err) {
            console.error("Streaming error:", err);
            throw err;
        }
    }

    module.exports = {sendPromptToBedrock}