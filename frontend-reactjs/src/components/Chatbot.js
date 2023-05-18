import React, { useState, useEffect, useRef } from 'react';
import APIService from './APIService';
import "../css/Chatbot.css";
import Livestream from './Livestream';

function Chatbot() {
  const [state, setState] = useState({
    messages: [],
    userInput: '',
    isWaiting: false,
    showCancelButton: false,
  });

  const messagesContainerRef = useRef(null);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  function handleUserInput(event) {
    setState((prevState) => ({
      ...prevState,
      userInput: event.target.value,
    }));
  }

  function sendMessage(event) {
    event.preventDefault();

    if (state.userInput.trim() === '' || state.isWaiting) {
      return;
    }

    setState((prevState) => ({
      ...prevState,
      messages: [
        ...prevState.messages,
        { text: prevState.userInput, sender: 'user' },
      ],
      isWaiting: true,
      showCancelButton: true,
    }));

    APIService.Langchain(state.userInput)
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          messages: [
            ...prevState.messages,
            { text: response.answer, sender: 'bot' },
          ],
          isWaiting: false,
          showCancelButton: false,
        }));
      })
      .catch((error) => {
        console.error('Error:', error);
        setState((prevState) => ({
          ...prevState,
          isWaiting: false,
          showCancelButton: false,
        }));
      });

    setState((prevState) => ({
      ...prevState,
      userInput: '',
    }));
  }

  function scrollToBottom() {
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }

  function cancelRequest() {
    clearTimeout(timeoutIdRef.current);
    setState((prevState) => ({
      ...prevState,
      isWaiting: false,
      showCancelButton: false,
    }));
  }

  return (
<div className="chatbot-wrapper">
  <div className="chat-section">
    <div className="chatbot-title">Chatbot</div>

    <div className="chatbot-container">
      <div className="chat-messages" ref={messagesContainerRef}>
        {state.messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === 'user' ? 'user-message' : 'bot-message'
            }`}
          >
            <div
              className={`message-bubble ${
                message.sender === 'user' ? 'user-bubble' : 'bot-bubble'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="user-input-form">
        <input
          type="text"
          value={state.userInput}
          onChange={handleUserInput}
          className="user-input-field"
          disabled={state.isWaiting}
        />

        <button
          type="submit"
          className="send-button"
          disabled={state.isWaiting}
        >
          {state.isWaiting ? 'Sending...' : 'Send'}
        </button>

        {state.showCancelButton && (
          <button onClick={cancelRequest} className="cancel-button-temporary">
            Cancel
          </button>
        )}
      </form>
    </div>
  </div>
</div>
  );
}

export default Chatbot;
