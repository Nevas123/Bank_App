namespace AppBank.Api.Models;

public sealed record SessionResponse(
    bool IsAuthenticated,
    ProfileResponse? User,
    decimal Balance,
    IReadOnlyList<TransactionRecord> Transactions);
