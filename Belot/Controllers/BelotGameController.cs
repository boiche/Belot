using Belot.Data;
using Belot.Models.Http.Requests;
using Belot.Models.Http.Responses;
using Belot.Services.Logging;
using Microsoft.AspNetCore.Mvc;
using Serilog.Events;

namespace Belot.Controllers
{
    [ApiController]
    public class BelotGameController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BelotGameController(ApplicationDbContext context)
        {
            this._context = context;
        }

        [HttpGet]
        [Route("BelotGame/GetAvailableGames")]
        public GetAvailableGamesResponse GetAvailableGames()
        {
            var result = this._context.Games.Where(x => x.ConnectedPlayers < 4).ToList();
            return new GetAvailableGamesResponse()
            {
                games = result
            };
        }

        [HttpGet]
        [Route("BelotGame/GetGame")]
        public GetGameResponse GetGame([FromQuery]GetGameRequest request)
        {
            var result = this._context.Games.First(x => x.Id.ToString() == request.id);
            return new GetGameResponse()
            {
                game = result
            };
        }
    }
}
