export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export const emitProjectCreated = (io, data) => {
  io.emit('projectCreated', data);
};

export const emitProjectUpdated = (io, data) => {
  io.emit('projectUpdated', data);
};

export const emitProjectDeleted = (io, data) => {
  io.emit('projectDeleted', data);
};