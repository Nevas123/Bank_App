namespace AppBank.Api.Models;

public sealed record DemoUser(
    string FullName,
    string Email,
    string Phone,
    string Password);
