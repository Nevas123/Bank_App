using AppBank.Api.Models;
using System.Globalization;

namespace AppBank.Api.Services;

public sealed class AppStateService
{
    private readonly object _sync = new();
    private AppState _state = Seed();

    public ProfileResponse GetProfile()
    {
        lock (_sync)
        {
            return ToProfile(_state.User);
        }
    }

    public SessionResponse GetSession()
    {
        lock (_sync)
        {
            return new SessionResponse(
                true,
                ToProfile(_state.User),
                _state.Balance,
                _state.Transactions.ToList());
        }
    }

    public IReadOnlyList<TransactionRecord> GetTransactions()
    {
        lock (_sync)
        {
            return _state.Transactions.ToList();
        }
    }

    public decimal GetBalance()
    {
        lock (_sync)
        {
            return _state.Balance;
        }
    }

    public bool ValidateCredentials(string email, string password)
    {
        lock (_sync)
        {
            return string.Equals(_state.User.Email, email, StringComparison.OrdinalIgnoreCase)
                && _state.User.Password == password;
        }
    }

    public Dictionary<string, string[]> ValidateTransfer(TransferDraftRequest request)
    {
        var errors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);
        var recipient = request.RecipientName?.Trim() ?? string.Empty;
        var account = request.AccountNumber?.Trim() ?? string.Empty;
        var amountText = request.Amount?.Trim() ?? string.Empty;
        var draftId = request.DraftId?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(draftId))
        {
            errors["draftId"] = ["Draft id is required."];
        }

        if (string.IsNullOrWhiteSpace(recipient))
        {
            errors["recipientName"] = ["Recipient name is required."];
        }
        else if (recipient.All(char.IsDigit))
        {
            errors["recipientName"] = ["Recipient name cannot be numeric only."];
        }

        if (string.IsNullOrWhiteSpace(account))
        {
            errors["accountNumber"] = ["Account number is required."];
        }

        if (string.IsNullOrWhiteSpace(amountText))
        {
            errors["amount"] = ["Amount is required."];
        }
        else if (!decimal.TryParse(amountText, NumberStyles.Number, CultureInfo.InvariantCulture, out var amount))
        {
            errors["amount"] = ["Amount must be a valid number."];
        }
        else if (amount <= 0)
        {
            errors["amount"] = ["Amount must be greater than zero."];
        }
        else if (amount > GetBalance())
        {
            errors["amount"] = ["Amount cannot exceed the available balance."];
        }

        return errors;
    }

    public TransferResult CreateTransfer(TransferDraftRequest request)
    {
        var amount = decimal.Parse(request.Amount!, NumberStyles.Number, CultureInfo.InvariantCulture);

        lock (_sync)
        {
            if (_state.ProcessedDraftIds.Contains(request.DraftId!))
            {
                var existing = _state.Transactions.FirstOrDefault(t =>
                    t.Id == request.DraftId || (
                        t.Recipient == request.RecipientName &&
                        t.Amount == -amount &&
                        t.Status == "Completed"));

                return new TransferResult(
                    _state.Balance,
                    existing ?? _state.Transactions.First(),
                    true);
            }

            _state.Balance -= amount;

            var transaction = new TransactionRecord(
                request.DraftId!,
                "2026-04-06",
                request.RecipientName!.Trim(),
                -amount,
                "Completed");

            _state.Transactions.Insert(0, transaction);
            _state.ProcessedDraftIds.Add(request.DraftId!);

            return new TransferResult(_state.Balance, transaction, false);
        }
    }

    public void Reset()
    {
        lock (_sync)
        {
            _state = Seed();
        }
    }

    private static ProfileResponse ToProfile(DemoUser user) =>
        new(user.FullName, user.Email, user.Phone);

    private static AppState Seed() =>
        new()
        {
            User = new DemoUser(
                "Alex Morgan",
                "alex.morgan@appbank.demo",
                "+34 600 123 456",
                "Demo123!"),
            Balance = 12450.75m,
            Transactions =
            [
                new TransactionRecord("seed-1", "2026-04-03", "Electric Company", -145.90m, "Completed"),
                new TransactionRecord("seed-2", "2026-04-02", "Payroll", 2450.00m, "Completed"),
                new TransactionRecord("seed-3", "2026-04-01", "Green Market", -86.35m, "Completed"),
                new TransactionRecord("seed-4", "2026-03-29", "Rent", -1200.00m, "Completed")
            ]
        };
}
