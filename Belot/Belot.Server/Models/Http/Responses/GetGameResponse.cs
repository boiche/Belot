namespace Belot.Models.Http.Responses
{
    using Models.DataEntries;

    public class GetGameResponse : BaseResponse
    {
        public Game Game { get; set; }
    }
}
