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
                    var numberMaxTasks = numberTasks;
                    var resources = new List<Resource>();
                    var now = DateTime.Now;
                    DateTime firstDate = now, secondDate = now;
                    for (var i = 0; i < numberResource; i++)
                    {
                        var rndCountTaskResource = _rnd.Next(0, numberTasks / 2);
                        numberTasks -= rndCountTaskResource;
                        var tmpNameResource = $"resource{i}";
                        var tmpTasks = new List<Task>();
                        for (var j = 0; j < rndCountTaskResource; j++)
                        {
                            var tmpNameTask = $"task{j}";
                            var rndCountConnect = _rnd.Next(0, numberMaxTasks/2);
                            var lstConnect = new List<uint>();
                            int k = 0;
                            while (k < rndCountConnect)
                            {
                                uint rndConnect = (uint)_rnd.Next(0, numberMaxTasks);
                                if (lstConnect.Contains(rndConnect)) continue;
                                lstConnect.Add(rndConnect);
                                ++k;
                            }
                            firstDate.AddHours(1.0d);
                            secondDate.AddHours(_rnd.Next(1, 5));
                            var baseColor = $"#{_rnd.Next(0x1000000):X6}";
                            var lineColor = $"#{_rnd.Next(0x1000000):X6}";
                            tmpTasks.Add(new Task(_counterTask++, tmpNameTask, firstDate, secondDate, lstConnect, baseColor, lineColor));
                        }
                        var size = _rnd.Next(1, 15);
                        var statusName = new char[14];
                        for (int j = 0; j < size; j++)
                        {
                            if ((j & 1) == 0)
                            {
                                statusName[j] = (char)_rnd.Next(65, 91);
                            }
                            else
                            {
                                statusName[j] = (char)_rnd.Next(48, 58);
                            }
                        }
                        resources.Add(new Resource(tmpNameResource, tmpTasks, new string(statusName)));
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