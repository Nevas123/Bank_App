using System.ComponentModel.DataAnnotations;

namespace AppBank.Api.Models;

public sealed record TransferDraftRequest(
    [property: Required] string? DraftId,
    [property: Required] string? RecipientName,
    [property: Required] string? AccountNumber,
    [property: Required] string? Amount);
