export type MessageCallback<T> = (this: Event, data: T) => void | Promise<void>;

export interface SharedWorkerServer {
  ports(): MessagePort[];

  addMessageListener<T>(fn: MessageCallback<T>): void;

  dispatch(port: MessagePort, data: any): void;

  broadcast(data: any): void;
}

export interface SharedWorkerClient {
  addMessageListener<T>(fn: MessageCallback<T>): void;

  dispatch(data: any): void;
}
