using System;
using System.Collections.Generic;
using System.IO;

namespace GenerateGanttJSON
{
    internal class Program
    {
        private static readonly Random _rnd = new Random();
        private static uint _counterTask;
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
                        var tmpNameResource = $"resource{i}";
                        var tmpTasks = new List<Task>();
                        for (var j = 0; j < rndCountTaskResource; j++)
                        {
                            var tmpNameTask = $"task{j}";
                            tmpTasks.Add(new Task(_counterTask++,tmpNameTask,,,));
                        }
                        resources.Add(new Resource(tmpNameResource, tmpTasks));
                    }

                    using (var streamWriter = new StreamWriter("TEST.json", false, System.Text.Encoding.Default))
                    {
                        streamWriter.WriteLine(resources.ToJson());
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