using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace GenerateGanttJSON
{
    public class Task
    {
        [JsonProperty("id")]
        public uint Id { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("start")]
        public DateTime Start { get; set; }
        [JsonProperty("stop")]
        public DateTime Stop { get; set; }
        [JsonProperty("baseColor")]
        public string BaseColor { get; set; }
        [JsonProperty("connect")]
        public List<uint> Connect { get; set; }

        public Task(uint id, string name, DateTime start, DateTime stop, List<uint> connect, string baseColor)
        {
            Id = id;
            Name = name;
            Start = start;
            Stop = stop;
            Connect = connect;
            BaseColor = baseColor;
        }
    }
}