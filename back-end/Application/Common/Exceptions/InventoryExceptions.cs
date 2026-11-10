namespace Application.Common.Exceptions;

public static class InventoryExceptions
{
    public static ResourceNotFoundException ReferenceNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("inventory.reference_not_found", "Um dos recursos relacionados não foi encontrado ou não está mais disponível.", innerException);
    }

    public static ResourceNotFoundException RoomNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("inventory.room_not_found", "Ambiente não encontrado ou sem permissão de acesso.", innerException);
    }

    public static BusinessConflictException RoomHasDependencies(Exception? innerException = null)
    {
        return new BusinessConflictException("inventory.room_has_dependencies", "Não é possível excluir um ambiente com registros vinculados. Remova os vínculos antes de excluir.", innerException);
    }

    public static ResourceNotFoundException BoxNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("inventory.box_not_found", "Caixa não encontrada ou sem permissão de acesso.", innerException);
    }

    public static BusinessConflictException BoxHasDependencies(Exception? innerException = null)
    {
        return new BusinessConflictException("inventory.box_has_dependencies", "Não é possível excluir uma caixa com registros vinculados. Remova os vínculos antes de excluir.", innerException);
    }

    public static ResourceNotFoundException ItemNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("inventory.item_not_found", "Item não encontrado ou sem permissão de acesso.", innerException);
    }

    public static ResourceNotFoundException ItemReferenceNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("inventory.item_reference_not_found", "Local ou categoria não encontrado ou indisponível neste espaço.", innerException);
    }

    public static BusinessConflictException ItemHasDependencies(Exception? innerException = null)
    {
        return new BusinessConflictException("inventory.item_has_dependencies", "Não é possível excluir um item com registros vinculados. Remova os vínculos antes de excluir.", innerException);
    }
}
