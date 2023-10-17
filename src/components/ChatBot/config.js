// config.js
import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "WeatherBot",
  initialMessages: [
    {
      widget: "options",
      data: {
        options: [
          {
            label: "How does this weather app work?",
            value: "Our weather app gathers data from various meteorological sources and provides you with the most accurate and up-to-date weather information for your location.",
          },
          {
            label: "How often is the weather data updated?",
            value: "The weather data is updated every hour to ensure you receive the most recent information.",
          },
          {
            label: "Can I get a forecast for the next week?",
            value: "Yes, you can view the forecast for up to 7 days in advance. Just select the 'Weekly Forecast' option.",
          },
          {
            label: "What do the different weather icons mean?",
            value: "Each icon represents a different weather condition, such as sunny, cloudy, rainy, etc. Hover over or click on an icon to see a detailed description.",
          },
          {
            label: "How do I change my location?",
            value: "Use the search bar at the top of the app to enter a new location. You can also select 'Use Current Location' to get weather data for your immediate surroundings.",
          },
          {
            label: "What is the difference between 'real feel' and actual temperature?",
            value: "The actual temperature is the current air temperature. 'Real feel' or 'apparent temperature' takes into account other factors like humidity and wind, giving you an idea of how the temperature actually feels to the human body.",
          },
          {
            label: "How can I report an issue or provide feedback?",
            value: "We value your feedback! Please click on the 'Contact Us' link in the footer to report any issues or provide suggestions.",
          },
          {
            label: "Is there a mobile app version available?",
            value: "Yes, our mobile app is available for both Android and iOS. You can download it from their respective app stores.",
          },
          {
            label: "How do I switch between Celsius and Fahrenheit?",
            value: "You can toggle between Celsius and Fahrenheit by clicking on the temperature unit displayed next to the current temperature.",
          },
          {
            label: "What do the percentage values next to the rain icon mean?",
            value: "The percentage value indicates the probability of precipitation (rain/snow) for that particular time period.",
          },
        ],
      },
    },
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  },
};

export default config;
