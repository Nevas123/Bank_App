namespace AppBank.Api.Models;

public sealed record TransferResult(
    decimal Balance,
    TransactionRecord Transaction,
    bool AlreadyProcessed);
