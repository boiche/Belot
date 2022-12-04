namespace Belot.Services.Interfaces
{
    /// <summary>
    /// Provides interface for managing a group of judges
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IJudgeManager<T> where T : IJudgeService
    {
        /// <summary>
        /// Contains all judges to all created active games
        /// </summary>
        Dictionary<Guid, T> Judges { get; }
    }
}
