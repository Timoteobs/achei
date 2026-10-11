using System.ComponentModel.DataAnnotations;

namespace Domain.Common;

public abstract class BaseEntity
{
    public long Id { get; protected set; }

    private List<ValidationResult> _validationErrors = [];

    public bool IsValid()
    {
        _validationErrors = [];
        var context = new ValidationContext(this);
        return Validator.TryValidateObject(this, context, _validationErrors, true);
    }

    public List<ValidationResult> GetValidationResults() => _validationErrors;

    public bool ExistProperty(object obj, string property) =>
        obj.GetType().GetProperty(property) is not null;
}
