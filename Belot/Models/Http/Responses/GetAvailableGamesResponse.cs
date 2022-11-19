namespace Belot.Models.Http.Responses
{
    public class GetAvailableGamesResponse : BaseResponse
    {
        public List<Game> games { get; set; }
    }
}
