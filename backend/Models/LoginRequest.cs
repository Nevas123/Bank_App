using System.ComponentModel.DataAnnotations;

namespace AppBank.Api.Models;

public sealed record LoginRequest(
    [property: Required] string? Email,
    [property: Required] string? Password);
