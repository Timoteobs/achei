using System.Net.Mail;

namespace Domain.Common.Validation;

public static class DomainValidator
{
    public static void Validator(params ValidationRule[] rules)
    {
        foreach (var rule in rules)
            rule.Validate();
    }
}

public sealed class ValidationRule
{
    private readonly bool _isInvalid;
    private readonly string _message;

    private ValidationRule(bool isInvalid, string message)
    {
        _isInvalid = isInvalid;
        _message = message;
    }

    public void Validate()
    {
        if (_isInvalid)
            throw new ArgumentException(_message);
    }

    public static ValidationRule Required(string? value, string fieldName) =>
        new(string.IsNullOrWhiteSpace(value), $"{fieldName} é obrigatório.");

    public static ValidationRule MaxLength(string? value, int maxLength, string fieldName) =>
        new(!string.IsNullOrWhiteSpace(value) && value.Length > maxLength,
            $"{fieldName} deve ter no máximo {maxLength} caracteres.");

    public static ValidationRule ExactLength(string? value, int length, string fieldName) =>
        new(!string.IsNullOrWhiteSpace(value) && value.Length != length,
            $"{fieldName} deve conter {length} caracteres.");

    public static ValidationRule Email(string? value, string fieldName)
    {
        var isInvalid = !string.IsNullOrWhiteSpace(value) && !MailAddress.TryCreate(value, out _);
        return new(isInvalid, $"{fieldName} inválido.");
    }

    public static ValidationRule Positive(long value, string fieldName) =>
        new(value <= 0, $"{fieldName} deve ser maior que zero.");

    public static ValidationRule PositiveWhenProvided(long? value, string fieldName) =>
        new(value.HasValue && value <= 0, $"{fieldName} deve ser maior que zero.");

    public static ValidationRule NonNegative(int value, string fieldName) =>
        new(value < 0, $"{fieldName} não pode ser negativo.");

    public static ValidationRule OneOf(string? value, string fieldName, params string[] allowedValues) =>
        new(!string.IsNullOrWhiteSpace(value) &&
            !allowedValues.Contains(value, StringComparer.OrdinalIgnoreCase),
            $"{fieldName} inválido.");

    public static ValidationRule FutureDate(DateTime value, string fieldName) =>
        new(value <= DateTime.UtcNow, $"{fieldName} deve ser uma data futura.");

    public static ValidationRule EnumDefined<TEnum>(TEnum value, string fieldName)
        where TEnum : struct, Enum =>
        new(!Enum.IsDefined(value), $"{fieldName} inválido.");

    public static ValidationRule BirthDate(DateTime date, int minAge, string fieldName)
    {
        var today = DateTime.UtcNow.Date;
        var age = today.Year - date.Year;

        if (date.Date > today.AddYears(-age))
            age--;

        return new(date == default || date > today || age < minAge,
            $"{fieldName} inválida. Idade mínima: {minAge} anos.");
    }

    public static ValidationRule Argon2idHash(string? value, string fieldName)
    {
        var parts = value?.Split('$', StringSplitOptions.RemoveEmptyEntries) ?? [];
        var isInvalid = parts.Length != 5 ||
            parts[0] != "argon2id" ||
            parts[1] != "v=19" ||
            !parts[2].Contains("m=") ||
            !parts[2].Contains("t=") ||
            !parts[2].Contains("p=") ||
            string.IsNullOrWhiteSpace(parts[3]) ||
            string.IsNullOrWhiteSpace(parts[4]);

        return new(isInvalid, $"Formato inválido do {fieldName}.");
    }
}
