// Mock AI Chat Service
const aiChatService = {
  async sendMessage(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    const lowerMessage = message.toLowerCase()
    
    // Context-aware responses based on common student queries
    if (lowerMessage.includes('summarize this page') || lowerMessage.includes('summary')) {
      return "I'd be happy to help summarize the content! While I can't see the specific page you're viewing right now, I can help you break down complex topics. Try asking me about specific concepts or sharing the main points you'd like me to explain in simpler terms."
    }
    
    if (lowerMessage.includes('explain this image') || lowerMessage.includes('image')) {
      return "I'd love to help explain images! While I can't currently view the specific image you're looking at, I can help explain concepts, diagrams, or visual elements if you describe them to me. What type of image or diagram are you trying to understand?"
    }
    
    if (lowerMessage.includes('help') && lowerMessage.includes('study')) {
      return "Here are some great ways I can help with your studies:\n\n• Ask me to explain complex concepts in simpler terms\n• Request study tips for specific subjects\n• Get help breaking down difficult topics\n• Ask for memory techniques or mnemonics\n• Request practice questions or quiz ideas\n\nWhat subject are you working on?"
    }
    
    if (lowerMessage.includes('how') && (lowerMessage.includes('remember') || lowerMessage.includes('memorize'))) {
      return "Great question! Here are some proven memory techniques:\n\n• **Spaced Repetition**: Review material at increasing intervals\n• **Active Recall**: Test yourself instead of just re-reading\n• **Mnemonics**: Create memorable associations or acronyms\n• **Visual Learning**: Draw diagrams or mind maps\n• **Teach Others**: Explain concepts to reinforce your understanding\n\nWhich technique would you like to know more about?"
    }
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('exam')) {
      return "I can help you prepare for exams! Here's what I can do:\n\n• Create practice questions on topics you're studying\n• Suggest study schedules and timelines\n• Help with test-taking strategies\n• Explain difficult concepts in different ways\n• Provide tips for managing exam anxiety\n\nWhat subject or topic are you preparing for?"
    }
    
    if (lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('struggling')) {
      return "I understand that some topics can be challenging! Here's how we can tackle difficult material together:\n\n• Break complex topics into smaller, manageable parts\n• Find real-world examples and analogies\n• Use different learning approaches (visual, auditory, kinesthetic)\n• Practice with varied examples\n• Connect new information to what you already know\n\nWhat specific topic are you finding difficult?"
    }
    
    if (lowerMessage.includes('note') && (lowerMessage.includes('take') || lowerMessage.includes('taking'))) {
      return "Effective note-taking is crucial for learning! Here are some proven methods:\n\n• **Cornell Method**: Divide pages into notes, cues, and summary sections\n• **Mind Mapping**: Create visual connections between concepts\n• **Outline Method**: Use hierarchical bullet points\n• **Charting Method**: Organize information in tables\n• **SQ3R**: Survey, Question, Read, Recite, Review\n\nWhich method sounds most helpful for your current studies?"
    }
    
    // Subject-specific responses
    if (lowerMessage.includes('math') || lowerMessage.includes('calculation')) {
      return "Math can be challenging, but with the right approach it becomes much clearer! I can help you:\n\n• Break down complex problems step-by-step\n• Explain mathematical concepts with real examples\n• Suggest practice techniques\n• Help identify where you might be getting stuck\n\nWhat specific math topic are you working on?"
    }
    
    if (lowerMessage.includes('science') || lowerMessage.includes('biology') || lowerMessage.includes('chemistry') || lowerMessage.includes('physics')) {
      return "Science subjects are fascinating! I can help you understand:\n\n• Complex scientific processes and mechanisms\n• How to approach scientific problem-solving\n• Ways to remember scientific terminology\n• Connections between different scientific concepts\n• Study strategies specific to science subjects\n\nWhat scientific concept would you like to explore?"
    }
    
    // General encouraging responses
    const encouragingResponses = [
      "That's a great question! I'm here to help you understand this better. Can you tell me more about what specifically you'd like to know?",
      
      "I'd be happy to help you with that! Learning is all about asking good questions. What aspect would you like me to focus on?",
      
      "Excellent! I love helping students learn. Could you provide a bit more detail about what you're trying to understand?",
      
      "That's exactly the kind of question that leads to deeper learning! Let me know what specific part you'd like me to explain.",
      
      "Great thinking! I can definitely help with that. What would be most useful - a simple explanation, examples, or study tips?"
    ]
    
    // Return a random encouraging response for general queries
    return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)]
  }
}

export { aiChatService }