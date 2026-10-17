using ManzilTech.Bookings;
using ManzilTech.Common;
using ManzilTech.HajjAndUmrah;
using ManzilTech.Payments;
using ManzilTech.Studio;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();

builder.Services.AddCommonModule(builder.Configuration);
builder.Services.AddPaymentsModule(builder.Configuration);
builder.Services.AddHajjAndUmrahModule(builder.Configuration);
builder.Services.AddBookingsModule(builder.Configuration);
builder.Services.AddStudioModule(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Liveness only: does not touch the database.
app.MapHealthChecks("/health");

app.Run();
