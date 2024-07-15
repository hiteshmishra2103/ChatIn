"use client"
import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
import { useAuthStore } from '../zustand/useAuthStore';
import { useUsersStore } from '../zustand/useUsersStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import useMountedStore from '../zustand/useMountedStore';
import axios from "axios";
import ChatUsers from '../_components/chatUsers';

const Chat = () => {
    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState(null);
    const { authName } = useAuthStore();
    const { updateUsers } = useUsersStore();
    const { chatReceiver } = useChatReceiverStore();
    const { chatMsgs, updateChatMsgs } = useChatMsgsStore();

    const getUserData = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}:8081/users`, { withCredentials: true });
        updateUsers(res.data);
        console.log(res.data);
    };

    useEffect(() => {
        const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_HOST}:8080`, { query: { username: authName } });
        setSocket(newSocket);

        newSocket.on('chat msg', msg => {
            console.log('received msg on client ' + msg.text);
            updateChatMsgs([...chatMsgs, msg]);
        });

        getUserData();

        return () => newSocket.close();
    }, []);

    const sendMsg = (e) => {
        e.preventDefault();
        const msgToBeSent = { text: msg, sender: authName, receiver: chatReceiver };
        if (socket) {
            socket.emit('chat msg', msgToBeSent);
            updateChatMsgs([...chatMsgs, msgToBeSent]);
            setMsg('');
        }
    };

    return (
        <div className='h-screen flex divide-x-4'>
            <div className='w-1/5'>
                <ChatUsers />
            </div>
            <div className='w-4/5 flex flex-col'>
                <div className="flex items-center justify-center h-16 bg-white shadow-md">
                    <h1 className="text-lg font-semibold">{`${authName} is chatting with ${chatReceiver}`}</h1>
                </div>
                <div className='w-full flex flex-col  h-3/5 overflow-y-auto' style={{ minHeight: 'calc(100vh - 200px)' }}>
                    {chatMsgs.map((msg, index) => (
                        <div key={index} className={`m-3 p-1 break-words max-w-fit ${msg.sender === authName ? 'text-right' : 'text-left'}`}>
                            <span className={`p-2 rounded-2xl text-white ${msg.sender === authName ? 'bg-blue-600' : 'bg-black'}`}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                </div>
                <div className='h-fit w-4/5  m-auto' style={{ position: 'sticky', bottom: 0, zIndex: 1000 }}>
                    <form onSubmit={sendMsg}>
                        <div className="w-full relative">
                            <input type="text"
                                value={msg}
                                onChange={(e) => setMsg(e.target.value)}
                                placeholder="Type your text here"
                                required
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border outline-none rounded-lg bg-gray-50 " />
                            <button type="submit"
                                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
