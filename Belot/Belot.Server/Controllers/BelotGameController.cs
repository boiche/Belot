using Belot.Data;
using Belot.Models.Http.Requests;
using Belot.Models.Http.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Belot.Controllers
{
    [ApiController]
    public class BelotGameController(ApplicationDbContext context) : ControllerBase
    {
        [HttpGet]
        [Route("BelotGame/GetAvailableGames")]
        public GetAvailableGamesResponse GetAvailableGames()
        {
            var result = context.Games.Where(x => x.ConnectedPlayers < 4).ToList();
            return new GetAvailableGamesResponse()
            {
                Games = result
            };
        }

        [HttpGet]
        [Route("BelotGame/GetGame")]
        public GetGameResponse GetGame([FromQuery] GetGameRequest request)
        {
            var result = context.Games.First(x => x.Id.ToString() == request.id);
            return new GetGameResponse()
            {
                Game = result
            };
        }
    }
}
