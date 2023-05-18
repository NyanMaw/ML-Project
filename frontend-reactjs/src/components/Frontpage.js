import React from 'react'
import Livestream from './Livestream';
import Chatbot from './Chatbot';

const Frontpage = () => {
  return (
    <div className="videostream">
        <Livestream url="ws://127.0.0.1:8000/ws/stream/" />
        <Chatbot></Chatbot>
    </div>
  )
}

export default Frontpage