import io from 'socket.io-client';
        
const SOCKET_ADDR = 'wss://api.dev.qlearning.academy/messaging';
        
export const messageSocket = io(SOCKET_ADDR);
        
// export const SocketContext = React.createContext();
