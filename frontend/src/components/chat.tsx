import { useState, useEffect, useRef } from 'react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

const Chat = () => {
 const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "As-salamu alaykum! I am the Ejada AI assistant. How can I help you with your Quran learning today?",
      sender: 'ai',
    },
  ]);
  
  // 'inputValue' will hold the text currently being typed by the user.
  const [inputValue, setInputValue] = useState('');

  // This is a reference to the message container div. We'll use it to auto-scroll.
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // This function makes the chat scroll to the bottom every time a new message is added.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // We use useEffect to call scrollToBottom whenever the 'messages' array changes.
  useEffect(scrollToBottom, [messages]);


  // This function handles the sending of a message.
  const handleSendMessage = () => {
    // We do nothing if the input is just empty spaces.
    if (inputValue.trim() === '') return;

    // Create the user's new message object.
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    // Add the user's message to the messages array.
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Clear the input box after sending.
    setInputValue('');

    // --- Simulate AI response ---
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1, // Ensure unique ID
        text: "JazakAllah Khair for your message. I am processing your request...",
        sender: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1500); // Wait 1.5 seconds before showing the AI response
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      
      {/* Header */}
      <header className="bg-green-800 text-white p-4 text-center text-xl font-bold shadow-md">
        Ejada Quran Platform
      </header>

      {/* Message History */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none shadow'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {/* This empty div is our scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form */}
      <footer className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message here..."
            className="flex-1 p-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-700 text-white p-3 rounded-r-full hover:bg-green-800 transition-colors"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chat;