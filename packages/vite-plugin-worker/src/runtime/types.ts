export interface SharedWorkerServer {
  ports(): MessagePort[];

  dispatch(port: MessagePort, data: any): void;

  broadcast(data: any): void;
}
