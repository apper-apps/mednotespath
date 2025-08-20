import { useState, useRef, useEffect } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import { aiChatService } from "@/services/api/aiChatService"
import { toast } from "react-toastify"

function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      // Add welcome message when first opened
      setMessages([{
        id: 1,
        text: "Hi! I'm your AI study assistant. Ask me questions like 'Summarize this page' or 'Explain this image' and I'll help you understand the content better.",
        isAI: true,
        timestamp: new Date()
      }])
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      isAI: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const aiResponse = await aiChatService.sendMessage(userMessage.text)
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isAI: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("AI Chat error:", error)
      toast.error("Sorry, I'm having trouble responding right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      text: "Hi! I'm your AI study assistant. Ask me questions like 'Summarize this page' or 'Explain this image' and I'll help you understand the content better.",
      isAI: true,
      timestamp: new Date()
    }])
    toast.success("Chat cleared")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Interface */}
      <div className={cn(
        "absolute bottom-16 right-0 w-80 max-w-[calc(100vw-3rem)]",
        "bg-white rounded-2xl shadow-2xl border border-gray-200",
        "transition-all duration-300 ease-out transform origin-bottom-right",
        "chat-interface",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-2 pointer-events-none"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center">
              <ApperIcon name="Bot" size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-sm">AI Study Assistant</h3>
              <p className="text-xs text-text-secondary">Ask me anything about your studies</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="h-8 w-8 p-0"
          >
            <ApperIcon name="RotateCcw" size={14} />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isAI ? "justify-start" : "justify-end"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                message.isAI
                  ? "bg-gray-100 text-text-primary"
                  : "bg-gradient-to-r from-primary to-primary-light text-white"
              )}>
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder="Ask me to summarize, explain, or help with anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="resize-none border-gray-200 focus:border-primary"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="h-10 w-10 p-0"
            >
              <ApperIcon name="Send" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <Button
        onClick={handleToggle}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg hover:shadow-xl",
          "transition-all duration-300 chat-bubble",
          isOpen && "rotate-180"
        )}
      >
        <ApperIcon name={isOpen ? "X" : "MessageCircle"} size={24} />
      </Button>
    </div>
  )
}

export default AIChatBubble