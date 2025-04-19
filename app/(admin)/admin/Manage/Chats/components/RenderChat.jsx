/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Sparkles } from "lucide-react";
import { User } from "@heroui/react";
import MessageRow from "./MessageRow";
import ChatInput from "./ChatInput";


const userImg =
  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1734353403~exp=1734357003~hmac=1dbbde6a9a2aef5817bcd7324f2f8b3e49602ae96cc46e4683b72e7b90319dd2&w=826";

export default function RenderChat({
  sendMessage,
  handleSendImage,
  chat: liveChat,
  id,
  user,
}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const listRef = useRef(null);
  const rowHeights = useRef({});

  useEffect(() => {
    setChat(liveChat.reverse());
    scrollToBottom();
  }, [liveChat, user]);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToItem(0, "end");
  }, [chat.length]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      scrollToBottom();
    }
  };

  const getItemSize = (index) => rowHeights.current[index] || 50;

  return (
    <div className="flex flex-col max-h-screen bg-white">
      <div className="bg-white pt-5 pl-4 h-20">
        <User
          avatarProps={{ src: userImg }}
          description={id}
          name={user?.firstName}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={chat.length}
              itemSize={getItemSize}
              ref={listRef}
              estimatedItemSize={100}
            >
              {({ index, style }) => (
                <MessageRow
                  index={index}
                  style={style}
                  msg={chat[index]}
                  rowHeights={rowHeights}
                  listRef={listRef}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleSendImage={handleSendImage}
        listRef={listRef}
        chat={chat}
      />
      <Sparkles
        className="absolute top-7 right-20 text-blue-700 animate-pulse"
        size={24}
      />
    </div>
  );
}
