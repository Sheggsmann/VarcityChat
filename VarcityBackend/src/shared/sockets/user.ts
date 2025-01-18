import { Server, Socket } from 'socket.io';
import { ChatHandler } from './chatHandler';
import { config } from '@root/config';
import { AuthPayload } from '@auth/interfaces/auth.interface';
import JWT from 'jsonwebtoken';
import Logger from 'bunyan';

const log: Logger = config.createLogger('SocketIOUserHandler');

export let socketIOUserObject: Server;

export interface UserSocket extends Socket {
  user?: AuthPayload;
}

export class SocketIOUserHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }

  public listen(): void {
    this.io.use(async (socket: UserSocket, next) => {
      const authToken =
        (socket.handshake.auth.authToken as string) ||
        (socket.handshake.headers.authorization as string);

      if (!authToken) {
        return next(new Error('No AuthToken provided'));
      }

      try {
        const user = JWT.verify(authToken, config.JWT_TOKEN!);
        socket.user = user as AuthPayload;
        next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return next(new Error('Invalid AuthToken provided'));
      }
    });

    this.io.on('connection', (socket: UserSocket) => {
      const user: AuthPayload = socket.user!;
      log.info(`User ${user.userId} connected`);

      // The user joins the room with their userId
      socket.join(user.userId);

      // Pass the socket to the ChatHandler
      new ChatHandler(socket);

      socket.on('disconnect', () => {
        // User disconnected
        console.log('user disconnected');
      });
    });
  }
}
