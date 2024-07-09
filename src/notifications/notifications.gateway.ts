import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendNotification')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ): void {
    // Business logic to save the message to the database
    // Broadcasting the new message to all connected clients, excluding the sender
    client.broadcast.emit('newMessage', message);

    // Let's add a bit of humor - respond to the sender with an acknowledgement
    client.emit('acknowledgement', 'Your message was received loud and clear!');
  }
}
