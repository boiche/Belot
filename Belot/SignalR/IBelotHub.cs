using Belot.Models.Http.Requests.SignalR;
using Belot.Models.Http.Responses.SignalR;

namespace Belot.SignalR
{
    public interface IBelotHub
    {
        /// <summary>
        /// Joins new client to a group, named after the GUID of the game.
        /// </summary>
        /// <param name="gameId"></param>
        /// <returns></returns>
        Task JoinGame(JoinGameRequest request);
        /// <summary>
        /// Indicates the clients to start the game.
        /// </summary>
        /// <returns></returns>
        Task StartGame(Guid gameId);
        /// <summary>
        /// Removes client from the group
        /// </summary>
        /// <returns></returns>
        Task LeaveGame(LeaveGameRequest request);
        /// <summary>
        /// Creates new instance of a game
        /// </summary>
        /// <returns></returns>
        Task CreateGame();
        Task DealCards(DealCardsRequest request);
    }
}
