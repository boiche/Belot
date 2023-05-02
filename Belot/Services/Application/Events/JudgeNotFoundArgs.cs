namespace Belot.Services.Application.Events
{
    public class JudgeNotFound
    {
        public delegate void JudgeNotFoundHandler(object sender, JudgeNotFoundArgs args);
    }

    /// <summary>
    /// Describes the game, that has occured with no assigned judge
    /// </summary>
    public class JudgeNotFoundArgs : EventArgs
    {
        public Guid GameId { get; set; }
    }
}
