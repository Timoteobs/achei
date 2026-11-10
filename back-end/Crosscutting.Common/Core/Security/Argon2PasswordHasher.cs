using System.Security.Cryptography;
using System.Text;
using Application.Interfaces.Security;
using Konscious.Security.Cryptography;

namespace Crosscutting.Common.Core.Security;

public sealed class Argon2PasswordHasher : IPasswordHasherService
{
    private const int SaltLength = 16;
    private const int HashLength = 32;
    private const int MemorySize = 19456;
    private const int Iterations = 2;
    private const int DegreeOfParallelism = 1;
    private const int Version = 19;

    public string Hash(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Senha não pode ser vazia.", nameof(password));
        }

        var salt = RandomNumberGenerator.GetBytes(SaltLength);
        var hash = GenerateHash(password, salt, MemorySize, Iterations,
            DegreeOfParallelism, HashLength);

        return string.Join('$', string.Empty, "argon2id", $"v={Version}",
            $"m={MemorySize},t={Iterations},p={DegreeOfParallelism}",
            Convert.ToBase64String(salt), Convert.ToBase64String(hash));
    }

    public bool Verify(string password, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(passwordHash))
        {
            return false;
        }

        var parts = passwordHash.Split('$', StringSplitOptions.RemoveEmptyEntries);

        if (!PartsValidation(parts))
        {
            throw new FormatException("Formato inválido do hash.");
        }

        var parameters = ParseParameters(parts[2]);
        var salt = Convert.FromBase64String(parts[3]);
        var expectedHash = Convert.FromBase64String(parts[4]);
        var actualHash = GenerateHash(password, salt, parameters.MemorySize,
            parameters.Iterations, parameters.DegreeOfParallelism, expectedHash.Length);

        return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
    }

    private static bool PartsValidation(string[] parts)
    {
        return parts.Length == 5 && parts[0] == "argon2id" && parts[1] == $"v={Version}";
    }

    private static byte[] GenerateHash(string password, byte[] salt, int memorySize, int iterations, int degreeOfParallelism, int hashLength)
    {
        using var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Salt = salt,
            MemorySize = memorySize,
            Iterations = iterations,
            DegreeOfParallelism = degreeOfParallelism
        };

        return argon2.GetBytes(hashLength);
    }

    private static Argon2Parameters ParseParameters(string parametersText)
    {
        var parameters = parametersText.Split(',')
            .Select(part => part.Split('='))
            .Where(part => part.Length == 2)
            .ToDictionary(part => part[0], part => int.Parse(part[1]));

        if (!parameters.TryGetValue("m", out var memorySize) || memorySize <= 0 ||
            !parameters.TryGetValue("t", out var iterations) || iterations <= 0 ||
            !parameters.TryGetValue("p", out var degreeOfParallelism) || degreeOfParallelism <= 0)
        {
            throw new FormatException("Parâmetros inválidos do Argon2.");
        }

        return new(memorySize, iterations, degreeOfParallelism);
    }

    private sealed record Argon2Parameters(int MemorySize, int Iterations, int DegreeOfParallelism);
}
