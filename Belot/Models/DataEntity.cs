namespace Belot.Models
{
    /// <summary>
    /// Describes an object that is mapped to EF
    /// </summary>
    public abstract class DataEntity
    {
        public DataEntity()
        {
            CreateOn = DateTime.Now;
            ModifiedOn = DateTime.Now;
        }
        public DateTime CreateOn { get; set; }
        public DateTime ModifiedOn { get; set; }

        public ApplicationUser CreatedBy { get; set; }
        public ApplicationUser ModifiedBy { get; set; }
    }
}
