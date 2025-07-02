import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (serverUrl) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(serverUrl);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl]);

  return socketRef.current;
};