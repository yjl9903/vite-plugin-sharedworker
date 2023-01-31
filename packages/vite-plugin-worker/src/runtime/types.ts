export interface SharedWorkerServer {
  ports(): MessagePort[];

  broadcast(data: any): void;
}
