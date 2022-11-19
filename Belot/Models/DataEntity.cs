namespace Belot.Models
{
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
