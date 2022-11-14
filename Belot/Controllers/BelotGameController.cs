using Belot.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Belot.Controllers
{
    [ApiController]
    public class BelotGameController : ControllerBase
    {
        private readonly IBelotHub _hub;

        public BelotGameController(IBelotHub hub)
        {
            this._hub = hub;
        }
    }
}
