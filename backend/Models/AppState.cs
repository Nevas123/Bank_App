namespace AppBank.Api.Models;

public sealed class AppState
{
    public DemoUser User { get; init; } = default!;

    public decimal Balance { get; set; }

    public List<TransactionRecord> Transactions { get; init; } = [];

    public HashSet<string> ProcessedDraftIds { get; init; } = [];
}
