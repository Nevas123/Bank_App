namespace AppBank.Api.Models;

public sealed record ProfileResponse(
    string FullName,
    string Email,
    string Phone);
