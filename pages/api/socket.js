import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
    });
    res.socket.server.io = io;

    io.on('connection', socket => {
      console.log('New client connected');
      socket.on('user-status', ({ userId, status }) => {
        socket.broadcast.emit('user-status-update', { userId, status });
      });

      socket.on('new-message', message => {
        socket.broadcast.emit('new-message', message);
      });
    });
  }
  res.end();
};

export default SocketHandler;

