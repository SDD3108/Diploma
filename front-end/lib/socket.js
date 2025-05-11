import { io } from 'socket.io-client'

let socket = null

export const initializeSocket = (token)=>{
  if(!socket){
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL,{
      auth: {token},
      reconnection: true,
      reconnectionDelay: 1000,
    })
  }
  return socket
}