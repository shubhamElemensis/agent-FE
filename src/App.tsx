import ChatBot from "./components/ChatBot";
import "./App.css";

function App() {
  // Optional: Custom message handler for API integration
  const handleSendMessage = async (message: string): Promise<string> => {
    // Example: Replace with your actual API call
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message }),
    // });
    // const data = await response.json();
    // return data.reply;

    // For now, use the default mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`You said: "${message}". I'm here to help!`);
      }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to ChatBot Widget
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern, feature-rich chatbot UI built with React and TypeScript
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Fast & Responsive</h3>
              <p className="text-gray-600">
                Built with React and optimized for performance
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold mb-2">Customizable</h3>
              <p className="text-gray-600">
                Easy to customize colors, position, and behavior
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">♿</div>
              <h3 className="text-lg font-semibold mb-2">Accessible</h3>
              <p className="text-gray-600">
                Built with accessibility in mind (ARIA labels, keyboard nav)
              </p>
            </div>
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-900 mb-3">
              Try the Chatbot
            </h2>
            <p className="text-blue-700">
              Click the chat button in the bottom-right corner to start a conversation!
            </p>
          </div>
        </div>
      </div>

      {/* ChatBot Widget */}
      <ChatBot
        botName="AI Assistant"
        initialMessage="Hello! I'm your AI assistant. How can I help you today?"
        placeholder="Ask me anything..."
        position="bottom-right"
        showTypingIndicator={true}
        showTimestamps={true}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;
