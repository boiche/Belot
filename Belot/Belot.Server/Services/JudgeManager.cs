using Belot.Services.Application;
using Belot.Services.Interfaces;

namespace Belot.Services
{
    public class JudgeManager<T> : IJudgeManager<T> where T : IJudgeService
    {
        public Dictionary<Guid, T> Judges { get; }

        public JudgeManager()
        {
            Judges = new Dictionary<Guid, T>();
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
