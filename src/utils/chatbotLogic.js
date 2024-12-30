export async function getChatbotResponse(input) {
    try {
      const response = await fetch('/api/chatbot');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      const lowercaseInput = input.toLowerCase();
  
      for (const [key, value] of Object.entries(data)) {
        if (key !== 'unknown' && value.keywords) {
          for (const keyword of value.keywords) {
            if (lowercaseInput.includes(keyword)) {
              return value.responses[Math.floor(Math.random() * value.responses.length)];
            }
          }
        }
      }
  
      return data.unknown.responses[Math.floor(Math.random() * data.unknown.responses.length)];
    } catch (error) {
      console.error('Error fetching chatbot data:', error);
      return "I'm sorry, I'm having trouble thinking right now. Can you try again later?";
    }
  }
  
  