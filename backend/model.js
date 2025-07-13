const MOCK_CONTEXT = {
    grabpay: {
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
      api_spec: {
        endpoint: 'http://localhost:4000/mock-grabpay/initiate',
        method: 'POST',
        body: {
          amount: '1000',
          currency: 'INR',
          merchant_id: 'demo-merchant-123'
        }
      }
    },
    grabloans: {
        sdk_links: {
          react: 'https://mock-grab.com/sdk/react/v1.0.0',
          kotlin: 'https://mock-grab.com/sdk/kotlin/v1.0.0',
          swift: 'https://mock-grab.com/sdk/swift/v1.0.0',
          python: 'https://mock-grab.com/sdk/python/v1.0.0',
          java: 'https://mock-grab.com/sdk/java/v1.0.0',
        },
        config: {
          merchant_id: 'demo-merchant-123',
          api_key: 'mock-api-key-456',
          secret: 'mock-secret-789'
        },
        api_spec: {
          endpoint: 'http://localhost:4000/mock-grabpay/initiate',
          method: 'POST',
          body: {
            amount: '1000',
            currency: 'INR',
            merchant_id: 'demo-merchant-123'
          }
        }
      }
    // Add GrabLoans etc as needed
  };

  module.exports = {MOCK_CONTEXT}