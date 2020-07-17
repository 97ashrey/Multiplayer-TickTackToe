using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ticktacktoe.Requests
{
    public class DisconnectFromGameRequest
    {
        public string GameId { get; set; }

        public string PlayerId { get; set; }

    }
}

