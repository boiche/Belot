using Belot.Services.Application.Events;

namespace Belot.Services.Application
{
    internal static class ApplicationEvents
    {
        //NB: in future resolve wether these event will be applicable for all games, or each requires different behaviour (to be static or not)
        internal static event JudgeNotFound.JudgeNotFoundHandler JudgeNotFound;

        internal static void RaiseJudgeNotFound(object sender, JudgeNotFoundArgs args)
        {
            JudgeNotFound.Invoke(sender, args);
        }
    }
}
