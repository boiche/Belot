using System.Diagnostics;

namespace Belot
{
    public static class DebugHelper
    {
        public static void WriteLine(Func<string> action)
        {
            Debug.WriteLine("");
            Debug.WriteLine(action.Invoke());            
            Debug.WriteLine("");

            Console.WriteLine();
            Console.WriteLine(action.Invoke());
            Console.WriteLine();
        }
    }
}
