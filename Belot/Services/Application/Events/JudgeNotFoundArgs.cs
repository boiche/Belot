namespace Belot.Services.Application.Events
{
    public class JudgeNotFound
    {
        public delegate void JudgeNotFoundHandler(object sender, JudgeNotFoundArgs args);
    }

    public class JudgeNotFoundArgs : EventArgs
    {
        public Guid GameId { get; set; }
    }
}
