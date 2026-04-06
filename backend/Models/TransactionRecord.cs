namespace AppBank.Api.Models;

public sealed record TransactionRecord(
    string Id,
    string Date,
    string Recipient,
    decimal Amount,
    string Status);
