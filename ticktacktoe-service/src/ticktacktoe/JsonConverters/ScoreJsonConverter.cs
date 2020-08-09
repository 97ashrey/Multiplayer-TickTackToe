using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using ticktacktoe.Types;

namespace ticktacktoe.JsonConverters
{
    public class ScoreJsonConverter : JsonConverter<Score>
    {
        public override Score Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            Dictionary<string, int> values = (Dictionary<string, int>)JsonSerializer.Deserialize(ref reader, typeof(Dictionary<string, int>), options);
            Score score = new Score();

            foreach (KeyValuePair<string, int> pair in values)
            {
                score.RegisterKey(pair.Key);
                score.Increment(pair.Key, pair.Value);
            }

            return score;
        }

        public override void Write(Utf8JsonWriter writer, Score value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value.GetAll(), options);
        }
    }
}
