import Player from "../../../BelotEngine/Player";

export default interface ISignalRProxy {
  createConnection(gameId: string): ISignalRProxy;
  startConnection(): Promise<void>;
  invoke(method: string, ...args: any[]): Promise<any>;
  on(method: string, callback: (...args: any[]) => void): void;
  getPlayer(): Promise<Player>;
  getConnectionId(): string | null;
}
