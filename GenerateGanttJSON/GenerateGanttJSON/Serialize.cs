using System.Collections.Generic;
using Newtonsoft.Json;

namespace GenerateGanttJSON
{
    public static class Serialize
    {
        public static string ToJson(this List<Resource> self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }
}