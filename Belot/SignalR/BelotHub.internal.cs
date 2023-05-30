using Belot.Data;
using Belot.Models.Belot;
using Belot.Models.Http.Requests.SignalR;
using Belot.Services.Application.Events;
using Microsoft.Data.SqlClient;
using System.Diagnostics;

namespace Belot.SignalR
{
    public partial class BelotHub
    {
        private void DealNewInternal(Guid gameId)
        {
            judgeManager.GetJudge(gameId).DealNew();
        }

        private Task StartGameInternal(Guid gameId)
        {
            Stopwatch stopwatch = new();
            stopwatch.Start();

            judgeManager.GetJudge(gameId).StartGame();

            while (stopwatch.ElapsedMilliseconds < 2000)
            {

            }

            Clients.Group(gameId.ToString()).StartGame(gameId);
            return Task.CompletedTask;
        }

        /// <summary>
        /// Gets the dealer seat based on current player's seat
        /// </summary>
        /// <returns></returns>
        private int GetRelativeDealerIndex(Guid gameId)
        {
            return judgeManager.GetJudge(gameId).GetRelativePlayerIndex(judgeManager.GetJudge(gameId).DealerPlayer.ConnectionId, Context.ConnectionId);
        }

        /// <summary>
        /// Removes a card of player's playing hand
        /// </summary>
        /// <param name="request"></param>
        private void RemoveCardInternal(ThrowCardRequest request)
        {
            var playingHand = judgeManager.GetJudge(request.GameId).GetPlayer(Context.ConnectionId).PlayingHand;
            Card cardToRemove = playingHand.First(x => x.Rank == request.Card.Rank && x.Suit == request.Card.Suit);
            request.Card.FrameIndex = cardToRemove.FrameIndex;
            playingHand.Remove(cardToRemove);
        }

        /// <summary>
        /// Updates currently played turn with the given card
        /// </summary>
        /// <param name="request"></param>
        private void UpdateTurnInternal(ThrowCardRequest request)
        {
            judgeManager.GetJudge(request.GameId).UpdateGameHand(request);
        }

        private void DeleteGameEvent(object sender, JudgeNotFoundArgs args)
        {
            //TODO: find better way to obtain the string
            string connectionString = "Server=localhost\\SQLEXPRESS;Database=Belot_App;Trusted_Connection=True;MultipleActiveResultSets=true";
            using SqlConnection connection = new(connectionString);
            connection.Open();
            SqlCommand command = connection.CreateCommand();
            command.CommandText = $"DELETE FROM dbo.Games WHERE Id = N'{args.GameId}'";
            int result = command.ExecuteNonQuery();
            DebugHelper.WriteLine(() => $"Tried to delete non existing game with Id {args.GameId}. Affected rows of dbo.Games is: {result}");
            connection.Close();
        }
    }
}
