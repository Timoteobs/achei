using System.Security.Cryptography;
using System.Text;
using Application.Interfaces.Security;

namespace Crosscutting.Common.Core.Security;

public sealed class AesEncryption : IEncryptionService
{
    private const int NonceSize = 12;
    private const int TagSize = 16;

    private readonly byte[] _key;

    public AesEncryption(byte[] key)
    {
        if (key.Length is not 16 and not 24 and not 32)
            throw new ArgumentException("A chave AES deve ter 16, 24 ou 32 bytes.");

        _key = key;
    }

    public string Encrypt(string plainText)
    {
        if (string.IsNullOrWhiteSpace(plainText))
            return plainText;

        var nonce = RandomNumberGenerator.GetBytes(NonceSize);
        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var cipherBytes = new byte[plainBytes.Length];
        var tag = new byte[TagSize];

        using var aes = new AesGcm(_key, TagSize);
        aes.Encrypt(nonce, plainBytes, cipherBytes, tag);

        return string.Join('.', "v1", Convert.ToBase64String(nonce),
            Convert.ToBase64String(cipherBytes), Convert.ToBase64String(tag));
    }

    public string Decrypt(string cipherText)
    {
        if (string.IsNullOrWhiteSpace(cipherText))
            return cipherText;

        var parts = cipherText.Split('.');

        if (parts.Length != 4)
            throw new FormatException("Formato inválido do texto criptografado.");

        if (parts[0] != "v1")
            throw new FormatException("Versão inválida do texto criptografado.");

        var nonce = Convert.FromBase64String(parts[1]);
        var cipherBytes = Convert.FromBase64String(parts[2]);
        var tag = Convert.FromBase64String(parts[3]);
        var plainBytes = new byte[cipherBytes.Length];

        using var aes = new AesGcm(_key, TagSize);
        aes.Decrypt(nonce, cipherBytes, tag, plainBytes);

        return Encoding.UTF8.GetString(plainBytes);
    }
}
