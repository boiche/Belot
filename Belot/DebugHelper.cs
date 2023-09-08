using System.Diagnostics;
using System.Text;

namespace Belot
{
    /// <summary>
    /// Provides basic internal debug methods
    /// </summary>
    public static class DebugHelper
    {
        private static readonly string _loggerPath = "D:\\Belot logs\\logger.txt";

        public static void WriteLine(Func<string> action)
        {
            Debug.WriteLine("");
            Debug.WriteLine(action.Invoke());            
            Debug.WriteLine("");

            Console.WriteLine();
            Console.WriteLine(action.Invoke());
            Console.WriteLine();

            try
            {
                using var stream = new StreamWriter(_loggerPath, true);
                stream.Write(action.Invoke());
                stream.Flush();
            }
            catch (Exception ex) 
            {
                Debug.WriteLine(ex.Message);
            }
        }
    }
}
