import { io } from 'socket.io-client'

let socket = null

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'], // Используем только websocket
      path: '/socket.io', // Указываем путь
      reconnection: true,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}