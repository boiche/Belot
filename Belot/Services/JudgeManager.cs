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
    }
}
