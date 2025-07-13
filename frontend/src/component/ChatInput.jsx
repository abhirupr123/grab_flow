import React from 'react';

export default function ChatInput({ input, onInputChange, onInputKeyDown, onSend }) {
  return (
    <div className="gfa-input-row">
      <input
        className="gfa-input"
        placeholder="Type your integration request..."
        value={input}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={onInputKeyDown}
        aria-label="Chat input"
      />
      <button
        onClick={onSend}
        className="gfa-send-btn"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}