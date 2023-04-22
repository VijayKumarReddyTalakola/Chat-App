import React from 'react'
import Message from './Message'

const Messages = () => {
  return (
    <div className="flex flex-col bg-shadywhite w-full h-full p-2 overflow-y-scroll" style={{maxHeight: '85vh'}}>
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
      <Message />
    </div>
  );
}

export default Messages
