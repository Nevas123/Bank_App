using AppBank.Api.Models;
using AppBank.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "appbank.session";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddSingleton<AppStateService>();

var app = builder.Build();

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

var api = app.MapGroup("/api");

async Task<IResult> loginHandler(LoginRequest request, HttpContext httpContext, AppStateService state)
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            errors["email"] = ["Email is required."];
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            errors["password"] = ["Password is required."];
        }

        return Results.ValidationProblem(errors);
    }

    if (!state.ValidateCredentials(request.Email.Trim(), request.Password))
    {
        return Results.Unauthorized();
    }

    var profile = state.GetProfile();
    var claims = new List<Claim>
    {
        new(ClaimTypes.Name, profile.FullName),
        new(ClaimTypes.Email, profile.Email)
    };
    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    var principal = new ClaimsPrincipal(identity);

    return await SignInAndReturnSessionAsync(httpContext, principal, state);
}

api.MapPost("/auth/login", loginHandler);
api.MapPost("/login", loginHandler);

async Task<IResult> logoutHandler(HttpContext httpContext)
{
    await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.NoContent();
}

api.MapPost("/auth/logout", logoutHandler);
api.MapPost("/logout", logoutHandler);

api.MapGet("/auth/me", (ClaimsPrincipal user, AppStateService state) =>
{
    if (user.Identity?.IsAuthenticated != true)
    {
        return Results.Ok(new SessionResponse(false, null, 0m, []));
    }

    return Results.Ok(state.GetSession());
});

api.MapGet("/profile", (AppStateService state) => Results.Ok(state.GetProfile()))
    .RequireAuthorization();

api.MapGet("/transactions", (AppStateService state) =>
    Results.Ok(new
    {
        Balance = state.GetBalance(),
        Transactions = state.GetTransactions()
    }))
    .RequireAuthorization();

IResult transferHandler(TransferDraftRequest request, AppStateService state)
{
    var errors = state.ValidateTransfer(request);
    if (errors.Count > 0)
    {
        return Results.ValidationProblem(errors);
    }

    var result = state.CreateTransfer(request);
    return Results.Ok(result);
}

api.MapPost("/transfer", transferHandler).RequireAuthorization();
api.MapPost("/transfers", transferHandler).RequireAuthorization();

async Task<IResult> resetHandler(HttpContext httpContext, AppStateService state)
{
    state.Reset();
    await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.NoContent();
}

api.MapPost("/dev/reset", resetHandler);
api.MapPost("/reset", resetHandler);

app.Run();

static async Task<IResult> SignInAndReturnSessionAsync(
    HttpContext httpContext,
    ClaimsPrincipal principal,
    AppStateService state)
{
    await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
    return Results.Ok(state.GetSession());
}
