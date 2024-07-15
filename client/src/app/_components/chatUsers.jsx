import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUsersStore'
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore'
import { useAuthStore } from '../zustand/useAuthStore';
import axios from 'axios'
import Spinner from './Spinner';

const ChatUsers = () => {
    const { users } = useUsersStore();
    const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
    const { updateChatMsgs } = useChatMsgsStore();
    const { authName } = useAuthStore();
    const [loading, setLoading] = React.useState(true);

    const setChatReceiver = (user) => {
        updateChatReceiver(user.username);
    }

    useEffect(() => {
        const getMsgs = async () => {
            setLoading(true);
            console.log('getting msgs------------');
            const res = await axios.get('${process.env.NEXT_PUBLIC_BACKEND_HOST}:8080/msgs',
                {
                    params: {
                        'sender': authName,
                        'receiver': chatReceiver
                    }
                },
                {
                    withCredentials: true
                });
            if (res.data.length !== 0) {
                updateChatMsgs(res.data);
            } else {
                updateChatMsgs([]);
            }
            setLoading(false);
        }
        if (chatReceiver) {
            getMsgs();
        }
    }, [chatReceiver])
    const otherUsers = users.filter(user => user.username !== authName);

    return (
        <div>
            {otherUsers.map((user, index) => (
                <div onClick={() => setChatReceiver(user)}
                    className='cursor-pointer hover:bg-black bg-blue-500 text-white rounded-xl m-3 p-5'>
                    {user.username}
                </div>
            ))}
        </div>
    )
}

export default ChatUsers