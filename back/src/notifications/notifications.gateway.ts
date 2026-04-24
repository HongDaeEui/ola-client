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
      // 재연결 시 기존 socketId가 있으면 새 socketId로 덮어써 최신 소켓을 유지한다.
      this.userSockets.set(email, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    // stale 소켓이 뒤늦게 disconnect되어 새 연결을 끊지 않도록,
    // Map에 저장된 socketId가 현재 disconnect된 socket.id와 동일할 때만 삭제한다.
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
