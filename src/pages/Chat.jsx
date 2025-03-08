"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getMessages, sendMessage } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Chat = ({ storeView = false }) => {
  const { storeName, username } = useParams();
  const { user, store } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const chatId = storeView
        ? `${store.store_name}_and_${username}`
        : `${storeName}_and_${user.username}`;
      const response = await getMessages(chatId);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const chatId = storeView
        ? `${store.store_name}_and_${username}`
        : `${storeName}_and_${user.username}`;
      await sendMessage(chatId, newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: user.username, message: newMessage, timestamp: new Date() },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <div className="py-12 text-center">Loading chat...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto">
      <h1 className="mb-8 text-3xl font-bold">
        Chat with {storeView ? username : storeName}
      </h1>
      <div className="bg-card p-4 rounded-lg shadow h-[60vh] overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${
                message.sender === (storeView ? store.store_name : user.username)
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === (storeView
                    ? store.store_name
                    : user.username)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {message.message}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No messages found.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Chat;