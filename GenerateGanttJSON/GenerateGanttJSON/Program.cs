using System;
using System.Collections.Generic;

namespace GenerateGanttJSON
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length == 2)
            {
                try
                {
                    var numberResurce = int.Parse(args[0]);
                    var numberTasks = int.Parse(args[1]);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                }
            }
            else
            {
                Console.WriteLine("Wrong number of arguments. Enter two numbers");
            }
        }
    }
}