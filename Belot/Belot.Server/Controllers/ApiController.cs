namespace Belot.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    [Produces("application/json")]
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ApiController : ControllerBase
    {
    }
}
