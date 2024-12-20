﻿using Belot.Models.Belot;
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
        /// Indicates the clients that a player has joined the game.
        /// </summary>
        /// <returns></returns>
        Task JoinedGame();
        /// <summary>
        /// Removes client from the group
        /// </summary>
        /// <returns></returns>
        Task LeaveGame(LeaveGameRequest request);
        /// <summary>
        /// Creates new instance of a game
        /// </summary>
        /// <returns></returns>
        Task CreateGame(CreateGameRequest request);
        Task DealCards(DealCardsRequest request);
        Task Announce(GameAnnouncementRequest request);
        Task RefreshPlayer();
        Task DealNew();
        Task UpdateClientAnnouncements(GameAnnouncement announcement, int playerIndex);
        Task SecondDeal(GameAnnouncement announcement);
        /// <summary>
        /// Indicates client that he is on turn.
        /// </summary>
        /// <returns></returns>
        Task OnTurn(Turn turn);

        /// <summary>
        /// Indicates client that a card was thrown and execute visualization of it.
        /// </summary>
        /// <param name="card">The thrown card</param>
        /// <param name="gameId">The game in which the card is thrown</param>
        /// <param name="opponentConnectionId">The player that threw the card</param>
        /// <returns></returns>
        Task ShowOpponentCard(ShowOpponentCardResponse response);

        /// <summary>
        /// Indicates clients that the current hand has been completed and to trigger collection animation
        /// </summary>
        /// <returns></returns>
        Task CollectCards(CollectCardsResponse response);
        Task ShowScore(ShowScoreResponse response);
        Task ShowWinning(ShowWinnerResponse response);
        Task ShowLosing(ShowLoserResponse response);

        /// <summary>
        /// Indicates clients to show the hand announcements
        /// </summary>
        /// <returns></returns>
        Task ShowHandAnnouncements();

        /// <summary>
        /// Indicates clients that a hand announcement has been announced
        /// </summary>
        /// <param name="relativeIndex">The relative index of the player based on the player who has announced</param>
        /// <returns></returns>
        Task AnnounceHandAnnouncement(HandAnnouncement handAnnouncement, int relativeIndex);
        Task Error(string message);
    }
}
