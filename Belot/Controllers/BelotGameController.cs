using Belot.Data;
using Belot.Models.Http.Requests;
using Belot.Models.Http.Responses;
using Belot.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Belot.Controllers
{
    [ApiController]
    public class BelotGameController : ControllerBase
    {
        private readonly IHubContext<BelotHub, IBelotHub> _hub;
        private readonly ApplicationDbContext _context;

        public BelotGameController(IHubContext<BelotHub, IBelotHub> hub, ApplicationDbContext context)
        {
            this._hub = hub;
            this._context = context;
        }

        [HttpGet]
        [Route("/BelotGame/GetAvailableGames")]
        public GetAvailableGamesResponse GetAvailableGames()
        {
            var result = this._context.Games.Where(x => x.ConnectedPlayers < 4).ToList();
            //var result = this._context.Games.Where(x => x.ConnectedPlayers < 4 && !x.HasStarted).ToList();
            return new GetAvailableGamesResponse()
            {
                games = result
            };
        }
    }
}
