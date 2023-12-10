using System.Runtime.Serialization;

namespace Belot.Models.Http.Requests
{
    [DataContract]
    public class RegisterRequest : BaseRequest
    {
        [DataMember]
        public string Username { get; set; }
        [DataMember]
        public string Password { get; set; }
        [DataMember]
        public string Email { get; set; }
    }
}
