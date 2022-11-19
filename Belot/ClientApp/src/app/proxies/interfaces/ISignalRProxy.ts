export default interface ISignalRProxy {
  createConnection(): ISignalRProxy;
  startConnection(): Promise<void>;
  invoke(method: string, ...args: any[]): Promise<any>;
}
