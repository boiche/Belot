namespace Belot.Controllers
{
    using Belot.Data;
    using Belot.Models.Http.Requests;
    using Belot.Models.Http.Responses;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    public class BelotGameController(ApplicationDbContext context) : ApiController
    {
        private const int MAX_COUNT_PLAYERS = 4;

        [ProducesResponseType(typeof(GetAvailableGamesResponse), StatusCodes.Status200OK)]
        [HttpGet]
        [Route(nameof(GetAvailableGames))]
        public async Task<GetAvailableGamesResponse> GetAvailableGames()
        {
            var result = await context.Games
                .Where(x => x.ConnectedPlayers < MAX_COUNT_PLAYERS).ToListAsync();

            return new GetAvailableGamesResponse()
            {
                Games = result
            };
        }

        [ProducesResponseType(typeof(GetGameResponse), StatusCodes.Status200OK)]
        [HttpGet]
        [Route(nameof(GetGame))]
        public async Task<GetGameResponse> GetGame([FromQuery] GetGameRequest request)
        {
            var result = await context.Games
                .FirstAsync(x => x.Id.ToString() == request.Id);

            return new GetGameResponse()
            {
                Game = result
            };
        }
    }
}
