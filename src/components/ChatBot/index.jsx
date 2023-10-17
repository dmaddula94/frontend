import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

import config from "./config";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import "./index.scss";
import { useSelector } from "react-redux";

function ChatBot() {
    const theme = useSelector((state) => state.theme);
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="chatbot-wrapper">
      {showChatbot && (
        <div className={`chatbot-container ${theme.darkMode ? "dark" : "light"}`}>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}

      <IconButton
        color="primary"
        onClick={() => setShowChatbot((prev) => !prev)}
        className="chatbot-button"
      >
        <ChatIcon />
      </IconButton>
    </div>
  );
}

export default ChatBot;
