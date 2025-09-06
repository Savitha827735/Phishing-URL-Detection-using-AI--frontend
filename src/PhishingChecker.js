import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";;
console.log(API_URL);

const PhishingChecker = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setError('');
    setResult(null);

    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Error connecting to backend.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>🔍 Phishing URL Checker</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a URL"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button onClick={handleCheck}>Check URL</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem' }}>
          <h3>🔍 Result for: {result.url}</h3>
          <p><strong>Status:</strong> {result.is_phishing ? ' Phishing' : ' Safe'}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
          <p><strong>Phishing Probability:</strong> {(result.phishing_probability * 100).toFixed(2)}%</p>
          <p><strong>Legitimate Probability:</strong> {(result.legitimate_probability * 100).toFixed(2)}%</p>

          {result.risk_factors.length > 0 && (
            <div>
              <h4> Risk Factors:</h4>
              <ul>
                {result.risk_factors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhishingChecker;
