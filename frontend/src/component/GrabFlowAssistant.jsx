import React, { useState, useRef, useEffect } from 'react';
import './home.css';
import ServiceButtons from './ServiceButtons';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function GrabFlowAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [activated, setActivated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanDropdown, setShowLanDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [showDownload, setShowDownload] = useState(false);
  const [responseComplete, setResponseComplete] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState('integration.txt');
  const [lastResponseType, setLastResponseType] = useState(null);
  const [lastlanguage, setLastLanguage] = useState('React');
  

  const messagesEndRef = useRef(null);

  const services = ['GrabPay', 'GrabExpress', 'GrabDefence', 'Farefeed'];
  const language = ['React', 'Python', 'Kotlin', 'Java'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, botTyping]);

  useEffect(() => {
    if (responseComplete && lastResponseType === 'code') {
    fetch('http://localhost:4000/api/invoke-bedrock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'grabpay',
        language: lastlanguage,
        userTask: input,
        type: 'code'
      })
    })
      .then(async res => {
        const contentType = res.headers.get('Content-Type');
        let extension = 'txt'; // default fallback

        if (contentType) {
          if (contentType.includes('application/zip')) extension = 'zip';
          else if (contentType.includes('application/javascript')) extension = 'js';
          else if (contentType.includes('text/x-python')) extension = 'py';
          else if (contentType.includes('text/plain')) extension = 'txt';
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);
        setDownloadFileName(`integration.${extension}`);
        setShowDownload(true);
      })
      .catch(err => console.error('Download fetch error:', err));

    setResponseComplete(false);
    }
  }, [responseComplete]);

  const parseBotMessage = (text) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    const parts = [];
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push({
        type: "code",
        raw: match[0],
        lang: match[1] || "",
        text: match[2].trim()
      });
      lastIndex = codeBlockRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setBotTyping(true);
    setShowLanDropdown(false);
    setShowDropdown(false);
    if (input.trim().toLowerCase() === 'activate' || activated) {
      setActivated(true);
    }
    try {
      const response = await fetch('http://localhost:4000/api/invoke-bedrock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'grabpay',
          language: lastlanguage,
          userTask: input,
          type:'chat'
        })
      });

      setLastResponseType('code'); 

      const data = await response.json();

      if (data.success) {
        const text = data.data;
        let index = 0;
        const interval = setInterval(() => {
          if (index < text.length) {
            setMessages(prev => {
              const lastBot = prev[prev.length - 1]?.sender === 'bot' ? prev.slice(0, -1) : prev;
              const parsed = parseBotMessage(text.slice(0, index + 2));
              return [...lastBot, { sender: 'bot', text: parsed }];
            });
            index+=2;
          } else {
            clearInterval(interval);
            setBotTyping(false);
            setResponseComplete(true);
          }
        }, 10);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${data.error}` }]);
        setBotTyping(false);
      }
    } catch (err) {
      console.error('Bedrock API error:', err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: `Server error: ${err.message}` }
      ]);
      setBotTyping(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setInput(`Integrate ${service}`);
    setActivated(true);
  };

  const handleLanServiceClick = (language) => {
    if (!selectedService) return;
    setInput(`Integrate ${selectedService} in my ${language} app`);
    setLastLanguage(language);
    setActivated(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={`gfa-container ${activated ? 'activated' : 'centered'}`}>
      <div className="gfa-content-wrapper">
        <h1 className="gfa-title">GrabFlow Developer Assistant</h1>
        <div className={input ? 'gfa-messages activated' : 'gfa-messages'}>
          <ChatMessages
            messages={messages}
            botTyping={botTyping}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {showDownload && downloadUrl && (
          <div style={{ textAlign: 'right', marginRight: '27px', marginBottom: '20px' }}>
            <a href={downloadUrl} download={downloadFileName}>
              <button className="gfa-download-btn">⚙️ Script</button>
            </a>
          </div>
        )}
      </div>

      <div className='gfa-show-wrapper'>
        <div>
          {activated && input && (
            <div className="gfa-dropdown-toggle">
              {!showDropdown && (
                <button onClick={() => setShowDropdown(true)}>
                  APIs
                </button>
              )}
              {showDropdown && (
                <div className="gfa-dropdown">
                  <ServiceButtons
                    services={services}
                    onServiceClick={(service) => {
                      setShowDropdown(false);
                      handleServiceClick(service);
                      setShowLanDropdown(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          {activated && input && (
            <div className="gfa-dropdown-toggle">
              {!showLanDropdown && (
                <button onClick={() => setShowLanDropdown(true)}>
                  Languages
                </button>
              )}
              {showLanDropdown && (
                <div className="gfa-dropdown-language">
                  <ServiceButtons
                    services={language}
                    onServiceClick={(lang) => {
                      handleLanServiceClick(lang);
                      setShowLanDropdown(false);
                      setShowDropdown(false);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activated && (
        <div className="gfa-chat-bar-sticky">
          <ChatInput
            input={input}
            onInputChange={setInput}
            onInputKeyDown={handleInputKeyDown}
            onSend={handleSend}
          />
        </div>
      )}

      {!activated && (
        <div className="gfa-chat-bar-inline">
          <ChatInput
            input={input}
            onInputChange={setInput}
            onInputKeyDown={handleInputKeyDown}
            onSend={handleSend}
          />
        </div>
      )}

      <div>
        {!activated && (
          <div className="gfa-service-buttons">
            <ServiceButtons services={services} onServiceClick={handleServiceClick} />
          </div>
        )}
      </div>
    </div>
  );
}