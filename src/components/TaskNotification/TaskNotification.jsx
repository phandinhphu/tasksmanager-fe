import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import socket from '../../utils/socket';

function TaskReminderListener({ userId }) {
    const queueRef = useRef([]); // Hàng đợi các message
    const isReadingRef = useRef(false); // Đánh dấu đang đọc

    useEffect(() => {
        if (!userId) return;

        // Gửi userId lên server sau khi đăng nhập
        socket.emit('register', userId);

        // Lắng nghe sự kiện từ server
        socket.on('notification', (data) => {
            const message = `🔔 ${data.message}`;
            toast.info(message, {
                position: 'top-right',
                autoClose: 5000,
            });

            queueRef.current.push(data.message); // Thêm vào hàng đợi
            processQueue(); // Xử lý hàng đợi
        });

        // Dọn dẹp khi unmount
        return () => {
            socket.off('notification');
        };
    }, [userId]);

    const processQueue = () => {
        if (isReadingRef.current) return; // Đang đọc thì không làm gì
        if (queueRef.current.length === 0) return; // Không có gì để đọc

        const synth = window.speechSynthesis;
        if (!synth) return;

        const message = queueRef.current.shift(); // Lấy message đầu tiên
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'vi-VN';
        utter.pitch = 1;
        utter.rate = 1;

        isReadingRef.current = true;
        synth.speak(utter);

        utter.onend = () => {
            isReadingRef.current = false;
            processQueue(); // Đọc tiếp message kế tiếp
        };
    };

    return <></>; // Component không hiển thị gì
}

export default TaskReminderListener;
