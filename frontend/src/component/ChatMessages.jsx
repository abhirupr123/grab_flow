import React from 'react';

function CodeBlock({ code }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="gfa-code-block" style={{ position: 'relative' }}>
      <pre style={{ margin: 0 }}>{code}</pre>
      <button
        className="gfa-copy-btn"
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'black',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '2px 5px',
          fontSize: '0.9em',
          cursor: 'pointer'
        }}
        aria-label="Copy code"
        title="Copy code"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <rect
            x="7"
            y="7"
            width="9"
            height="9"
            rx="2"
            fill="#fff"
            fillOpacity="0.15"
            stroke="#fff"
            strokeWidth="1.2"
          />
          <rect
            x="4"
            y="4"
            width="9"
            height="9"
            rx="2"
            fill="none"
            stroke="#fff"
            strokeWidth="1.2"
          />
        </svg>
      </button>
    </div>
  );
}

export default function ChatMessages({ messages, botTyping, messagesEndRef }) {
  return (
    <div className="gfa-messages">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`gfa-message ${msg.sender === 'user' ? 'gfa-user' : 'gfa-bot'}`}
          aria-label={msg.sender === 'user' ? 'You' : 'Assistant'}
        >
          {Array.isArray(msg.text)
            ? msg.text.map((part, i) =>
                typeof part === 'object' && part.type === 'code' ? (
                  <CodeBlock key={i} code={part.text || ''} />
                ) : (
                  <pre
                    key={i}
                    style={{
                      margin: 0,
                      fontFamily: 'inherit',
                      background: 'none',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      fontSize: '1rem',
                      color: msg.sender === 'user' ? '#22223b' : '#166534',
                      padding: 0
                    }}
                  >
                    {part}
                  </pre>
                )
              )
            : typeof msg.text === 'object' && msg.text.type === 'code' ? (
                <CodeBlock code={msg.text.text || ''} />
              ) : (
                <pre
                  style={{
                    margin: 0,
                    fontFamily: 'inherit',
                    background: 'none',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '1rem',
                    color: msg.sender === 'user' ? '#22223b' : '#166534',
                    padding: 0
                  }}
                >
                  {msg.text}
                </pre>
              )}
        </div>
      ))}
      {botTyping && (
        <div className="gfa-message gfa-bot gfa-typing">Assistant is typing...</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
