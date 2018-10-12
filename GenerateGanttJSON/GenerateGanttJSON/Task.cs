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
        [JsonProperty("connect")]
        public List<uint> Connect { get; set; }
        
        
        public Task(uint id ,string resource, string name, DateTime start, DateTime stop, List<uint> connect)
        {
            Id = id;
            Resource = resource;
            Name = name;
            Start = start;
            Stop = stop;
            Connect = connect;
        }
    }
}