using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace GenerateGanttJSON
{
    public class Task
    {
        [JsonProperty("resource")]
        public string Resource { get; set; }
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("start")]
        public DateTime Start { get; set; }
        [JsonProperty("stop")]
        public DateTime Stop { get; set; }
        [JsonProperty("connect")]
        public List<string> Connect { get; set; }
        
        
        public Task(string resource, string name, DateTime start, DateTime stop, List<string> connect)
        {
            Resource = resource;
            Name = name;
            Start = start;
            Stop = stop;
            Connect = connect;
        }
    }
}