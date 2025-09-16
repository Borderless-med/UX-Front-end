import React from 'react';

const TestLogin: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('TestLogin handleSubmit called');
    alert('Form submitted!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 24, border: '1px solid #ccc', margin: 24 }}>
      <h2>Minimal Test Login Form</h2>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="test-email">Email:</label>
        <input id="test-email" type="email" name="email" required style={{ marginLeft: 8 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="test-password">Password:</label>
        <input id="test-password" type="password" name="password" required style={{ marginLeft: 8 }} />
      </div>
      <button type="submit" style={{ padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>
        Test Sign In
      </button>
    </form>
  );
};

export default TestLogin;
