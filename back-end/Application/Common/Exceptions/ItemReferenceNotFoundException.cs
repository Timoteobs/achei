namespace Application.Common.Exceptions;

public sealed class ItemReferenceNotFoundException()
    : Exception("Local ou categoria não encontrado ou indisponível neste espaço.");
