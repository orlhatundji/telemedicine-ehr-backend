import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor() {}
  private users = [];

  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() roomName: string,
    @ConnectedSocket() socket: Socket,
  ) {
    // console.log('join_room', roomName);
    const room = this.server.in(roomName);

    const roomSockets = await room.fetchSockets();
    const numberOfPeopleInRoom = roomSockets.length;

    // a maximum of 2 people in a room
    if (numberOfPeopleInRoom > 1) {
      // console.log('too_many_people', roomSockets.length);
      room.emit('too_many_people');
      return;
    }

    if (numberOfPeopleInRoom === 1) {
      room.emit('another_person_ready');
      // console.log('another_person_ready');
    }

    socket.join(roomName);
  }

  @SubscribeMessage('send_connection_offer')
  async sendConnectionOffer(
    @MessageBody()
    {
      offer,
      roomName,
    }: {
      offer: RTCSessionDescriptionInit;
      roomName: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    // console.log('send_connection_offer', roomName);
    this.server.in(roomName).except(socket.id).emit('send_connection_offer', {
      offer,
      roomName,
    });
  }

  @SubscribeMessage('answer')
  async answer(
    @MessageBody()
    {
      answer,
      roomName,
    }: {
      answer: RTCSessionDescriptionInit;
      roomName: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.in(roomName).except(socket.id).emit('answer', {
      answer,
      roomName,
    });
  }

  @SubscribeMessage('send_candidate')
  async sendCandidate(
    @MessageBody()
    {
      candidate,
      roomName,
    }: {
      candidate: unknown;
      roomName: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.in(roomName).except(socket.id).emit('send_candidate', {
      candidate,
      roomName,
    });
  }

  // @SubscribeMessage('connection')
  // async connection(
  //   @MessageBody()
  //   {
  //     roomName,
  //   }: {
  //     roomName: string;
  //   },
  //   @ConnectedSocket() socket: Socket,
  // ) {
  //   console.log('connect ion', roomName, socket.id);
  // }

  @SubscribeMessage('newUser')
  async newUser(
    @MessageBody()
    {
      userName,
      roomName,
    }: {
      userName: string;
      roomName: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    this.users.push({ userName, roomName, socketID: socket.id });
    //Sends the list of users to the client
    socket.emit('newUserResponse', this.users);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody()
    message: {
      senderId: string;
      receiverId: string;
      message: string;
      roomName: string;
      userName: string;
    },
    @ConnectedSocket() client: Socket,
  ): void {
    client.emit('message', message);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.broadcast.emit('typingResponse', message);
  }
}
