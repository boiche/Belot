namespace Belot.Services
{
    using Services.Application;
    using Services.Interfaces;

    public class JudgeManager<T> : IJudgeManager<T> where T : IJudgeService
    {
        public Dictionary<Guid, T> Judges { get; }

        public JudgeManager()
        {
            Judges = [];
        }

        public T GetJudge(Guid id)
        {
            try
            {
                return Judges[id];
            }
            catch (KeyNotFoundException)
            {
                ApplicationEvents.RaiseJudgeNotFound(this, new Application.Events.JudgeNotFoundArgs() { GameId = id });
                return default;
            }
        }
    }
}
