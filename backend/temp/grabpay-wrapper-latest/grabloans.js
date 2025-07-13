export function createGrabLoanHandler(config) {
  return async () => {
    const response = await fetch('http://localhost:4000/mock-grabloans/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.json();
  };
}