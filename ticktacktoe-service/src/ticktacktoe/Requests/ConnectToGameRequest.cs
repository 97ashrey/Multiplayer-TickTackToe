using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ticktacktoe.DataTransferObjects
{
    public class ConnectToGameRequest
    {
        public string GameId { get; set; }

        public string PlayerId { get; set; }

        public string PlayerName { get; set; }
    }
}
