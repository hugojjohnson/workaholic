import { io, Socket } from 'socket.io-client';
import { SocketTimerInterface } from '../Interfaces';

class SocketService {
    public socket: Socket | null = null;

    public connect(url: string, token: string): void {
        this.socket = io(url.substring(0, url.indexOf("/", 8)), { path: "/workaholic/socket.io", query: { token } });
        
        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public sendMessage(event: string, timer: SocketTimerInterface): void {
        if (this.socket) {
            this.socket.emit(event, timer);
        }
    }

    public onMessage(event: string, callback: (timer: SocketTimerInterface) => void): void {
        if (this.socket) {
            this.socket.off(event) // Remove all previous listeners
            this.socket.on(event, callback);
        } else {
            console.log("Socket doesn't exist!")
        }
    }
}

const socketService = new SocketService();
export default socketService;
