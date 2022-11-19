namespace Belot.SignalR
{
    public interface IBelotHub
    {
        Task ShowTurn(string turnInfo);
        Task JoinGame(Guid? gameId);
        Task LeaveGame();
        Task CreateGame();
    }
}
