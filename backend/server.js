const express = require('express');
const {sendPromptToBedrock} = require('./prompt')
const {generateWrapperPackage} = require('./wrapper')
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(require('cors')());

app.get('/api/generate-wrapper', async (req, res) => {
    try {
      const tgzPath = await generateWrapperPackage();
  
      res.download(tgzPath, `grabpay-wrapper-latest.tgz`);
    } catch (err) {
      console.error("Wrapper generation error:", err);
      res.status(500).send("Error generating wrapper package");
    }
  });

app.post('/api/invoke-bedrock', async (req, res) => {
    try {
      const { service, language, userTask, type } = req.body;
      const output = await sendPromptToBedrock(service, language, userTask, type);
        if(type === 'code' && language.toLowerCase() === 'react') {
        res.set({
            'Content-Type': 'application/javascript',
            'Content-Disposition': `attachment; filename="${service}-${language}-integration.js"`
        });
        return res.send(output);
        
      }
      if (type === 'code' && language.toLowerCase() === 'python') {
      res.set({
        'Content-Type': 'text/x-python',
        'Content-Disposition': `attachment; filename="${service}_integration.py"`
      });
      return res.send(output);
    }
      
        
      
      res.json({ success: true, data: output });
    } catch (err) {
      console.error("Bedrock API error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

// Mock GrabPay initiate payment
app.post('/mock-grabpay/initiate', (req, res) => {
  console.log("GrabPay API called:", req.body);
  res.json({
    status: 'success',
    redirect_url: 'https://example.com/payment-success',
    transaction_id: 'mock-tx-12345'
  });
});

// Mock GrabLoans initiate payment
app.post('/mock-grabloans/initiate', (req, res) => {
    console.log("GrabPay API called:", req.body);
    res.json({
      status: 'success',
      redirect_url: 'https://example.com/payment-success',
      transaction_id: 'mock-tx-12345'
    });
  });

// Mock GrabLoans apply
app.post('/mock-grabloans/apply', (req, res) => {
  console.log("GrabLoans API called:", req.body);
  res.json({
    status: 'approved',
    loan_id: 'loan-12345',
    approved_amount: req.body.requested_amount || 5000,
    terms_url: 'https://mock-grab.com/loans/terms'
  });
});

// Mock endpoint for SDK config info (for prompt injection or UI display)
app.get('/mock-config/grabpay', (req, res) => {
  res.json({
    sdk_links: {
      react: 'https://mock-grab.com/sdk/react/v1.0.0',
      kotlin: 'https://mock-grab.com/sdk/kotlin/v1.0.0',
      swift: 'https://mock-grab.com/sdk/swift/v1.0.0',
      python: 'https://mock-grab.com/sdk/python/v1.0.0',
        java: 'https://mock-grab.com/sdk/java/v1.0.0'
    },
    config: {
      merchant_id: 'demo-merchant-123',
      api_key: 'mock-api-key-456',
      secret: 'mock-secret-789'
    },
    mock_api: {
      endpoint: '/mock-grabpay/initiate',
      method: 'POST',
      body: {
        amount: 'Number',
        currency: 'String',
        merchant_id: 'String'
      }
    }
  });
});

// Mock endpoint for future GrabExpress, Farefeed etc. (extend as needed)

app.listen(PORT, () => {
  console.log(`Mock MCP Server running at http://localhost:${PORT}`);
});
