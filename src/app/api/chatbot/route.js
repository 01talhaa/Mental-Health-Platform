import { NextResponse } from 'next/server';

const chatbotData = {
  "greetings": {
    "keywords": ["hello", "hi", "hey", "greetings"],
    "responses": ["Hello! How can I help you today?", "Hi there! What can I do for you?", "Greetings! How may I assist you?"]
  },
  "farewell": {
    "keywords": ["bye", "goodbye", "see you", "farewell"],
    "responses": ["Goodbye! Have a great day!", "See you later! Take care!", "Farewell! Don't hesitate to come back if you need anything."]
  },
  "help": {
    "keywords": ["help", "assist", "support"],
    "responses": ["I'm here to help! What do you need assistance with?", "How can I support you today?", "I'd be happy to help. What's on your mind?"]
  },
  "about": {
    "keywords": ["who are you", "what are you", "about you"],
    "responses": ["I'm a simple AI chatbot created to assist users.", "I'm an AI assistant designed to help with basic queries.", "I'm a chatbot programmed to provide information and assistance."]
  },
  "weather": {
    "keywords": ["weather", "forecast", "temperature"],
    "responses": ["I'm sorry, I don't have real-time weather data. You might want to check a weather website or app for accurate information."]
  },
  "joke": {
    "keywords": ["joke", "funny", "laugh"],
    "responses": ["Why don't scientists trust atoms? Because they make up everything!", "What do you call a fake noodle? An impasta!", "Why did the scarecrow win an award? He was outstanding in his field!"]
  },
  "unknown": {
    "responses": ["I'm not sure how to respond to that. Could you try rephrasing your question?", "I don't have information about that. Is there something else I can help with?", "I'm still learning and don't know how to answer that. Can you ask me something else?"]
  }
};

export async function GET() {
  return NextResponse.json(chatbotData);
}

