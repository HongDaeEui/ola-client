import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://olalab.kr',
      /\.olalab\.kr$/,
      /ola-.*\.vercel\.app$/,
      /\.onrender\.com$/,
    ],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private userSockets = new Map<string, string>(); // email → socketId

  handleConnection(client: Socket) {
    const email = client.handshake.query.userEmail as string;
    if (email) {
      this.userSockets.set(email, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [email, id] of this.userSockets.entries()) {
      if (id === client.id) {
        this.userSockets.delete(email);
        break;
      }
    }
  }

  notifyUser(email: string, notification: unknown) {
    const socketId = this.userSockets.get(email);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }
}
