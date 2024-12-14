import { useState } from "react";
import { useAuth } from "../../../context/Auth/authContext";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import { chatService } from "../../../services/chatService";
import { showNotification } from "../../../utils/notification";
import "./Consult.scss";
import BreadcumbsComponent from "../../Breadcumbs/Breadcumbs";
import ChatBotImage from "../../../assets/images/chatbot.png";

const breadcumbData = [{ title: "Trang chủ", href: "/" }, { title: "Tư vấn" }];

const Consult = () => {
  const { token } = useAuth();

  const [messages, setMessages] = useState([
    {
      message: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sentTime: new Date().toLocaleTimeString(),
      sender: "ClinicCare ChatBox",
      direction: "incoming",
    },
  ]);

  const extractPlainText = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  const handleSend = async (message) => {
    const plainTextMessage = extractPlainText(message);

    const newMessage = {
      message: plainTextMessage,
      sentTime: new Date().toLocaleTimeString(),
      sender: "You",
      direction: "outgoing",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const typingMessage = {
      message: "...",
      sentTime: new Date().toLocaleTimeString(),
      sender: "ClinicCare ChatBox",
      direction: "incoming",
      isTyping: true,
    };

    setMessages((prevMessages) => [...prevMessages, typingMessage]);

    try {
      const res = await chatService(message);

      if (res.success) {
        const aiMessage = {
          message: res.data,
          sentTime: new Date().toLocaleTimeString(),
          sender: "AI",
          direction: "incoming",
        };

        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          aiMessage,
        ]);
      } else {
        showNotification(res.message, "Error");
      }
    } catch (error) {
      console.log(error);
      showNotification("Có lỗi xảy ra. Vui lòng thử lại!", "Error");
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    }
  };

  return (
    <div className="bg-slate-100 pb-8">
      <div className="max-w-4xl mx-auto block py-4">
        <BreadcumbsComponent items={breadcumbData} />
      </div>

      <div className="max-w-4xl mx-auto">
        <div style={{ position: "relative", height: "500px" }}>
          <MainContainer>
            <ChatContainer>
              <MessageList className="p-4">
                {messages.map((msg, index) => (
                  <Message
                    key={index}
                    model={{
                      message: msg.message,
                      sentTime: msg.sentTime,
                      sender: msg.sender,
                      direction: msg.direction,
                    }}
                  >
                    {msg.direction === "outgoing" && (
                      <Avatar name={msg.sender} src={token?.image} />
                    )}
                    {msg.direction === "incoming" && (
                      <Avatar name={msg.sender} src={ChatBotImage} />
                    )}
                    {msg.isTyping && <div className="typing-indicator"></div>}
                  </Message>
                ))}
              </MessageList>
              <MessageInput
                placeholder="Hãy hỏi ChatBot của chúng tôi!"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </div>
  );
};

export default Consult;
