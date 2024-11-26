namespace Belot.Models.Http.Requests
{
    using System.Runtime.Serialization;

    [DataContract]
    public class RegisterRequest : BaseRequest
    {
        [DataMember]
        // Other classes do not have this attribute, what's the idea ?
        public string Username { get; set; }

        [DataMember]
        public string Password { get; set; }

        [DataMember]
        public string Email { get; set; }
    }
}
