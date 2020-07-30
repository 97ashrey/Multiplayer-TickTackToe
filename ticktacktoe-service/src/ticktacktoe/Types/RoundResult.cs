using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ticktacktoe.Types
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum RoundResult
    {
        NotOver,
        Draw,
        TopRow,
        MiddleRow,
        BottomRow,
        LeftColumn,
        MiddleColumn,
        RightColumn,
        Diagonal,
        InversDiagonal
    }
}
