using System;
using System.Collections.Generic;

namespace GenerateGanttJSON
{
    internal class Program
    {
        private Random _rnd = new Random();
        private int _counterTask;
        public static void Main(string[] args)
        {
            if (args.Length == 2)
            {
                try
                {
                    var numberResource = int.Parse(args[0]);
                    var numberTasks = int.Parse(args[1]);
                    var resources = new List<Resource>();
                    for (var i = 0; i < numberResource; i++)
                    {
                        var rndCountTaskResource = _rnd.Next(0, numberTasks / 2);
                        numberTasks -= rndCountTaskResource;
                        var tmpTasks = new List<Task>();
                        for (var j = 0; j < rndCountTaskResource; j++)
                        {
                            
                        }
                    }
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