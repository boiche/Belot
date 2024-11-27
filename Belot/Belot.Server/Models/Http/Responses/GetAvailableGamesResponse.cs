namespace Belot.Models.Http.Responses
{
    using Models.DataEntries;

    public class GetAvailableGamesResponse : BaseResponse
    {
        public List<Game> Games { get; set; }
    }
}
