package app.roamfx.ai;

import java.util.StringJoiner;
import org.springframework.stereotype.Component;

@Component
public class TravelMoneyPromptTemplate {
  public String build(TravelMoneyAdvisor.TravelMoneyPlanRequest r) {
    var prompt = new StringJoiner("\n");
    prompt.add("You are RoamFX Travel Money Assistant.");
    prompt.add("Provide practical travel-money planning guidance, not legal, investment, tax, or personalised regulated financial advice.");
    prompt.add("Always recommend completing currency exchange only through verified authorised partners, banks, FFMCs, or other authorised providers.");
    prompt.add("Do not suggest unlicensed peer-to-peer currency exchange, user-to-user cash meetups, informal dealers, or bypassing KYC/legal requirements.");
    prompt.add("Include a disclaimer that rates, fees, KYC requirements, and local rules can change and the traveller should confirm before any transaction.");
    prompt.add("Return JSON with keys: recommendedCashAmount, recommendedCardAmount, suggestedDenominations, dailyBudgetEstimate, emergencyCashSuggestion, airportExchangeWarning, atmUsageAdvice, cardAcceptanceAdvice, scamWarnings, countrySpecificTips, checklist, confidenceScore.");
    prompt.add("Destination country: " + r.destinationCountry());
    prompt.add("Destination city: " + nullSafe(r.destinationCity()));
    prompt.add("Departure country: " + r.departureCountry());
    prompt.add("Trip days: " + r.tripDays());
    prompt.add("Traveller count: " + r.travellerCount());
    prompt.add("Travel style: " + r.travelStyle());
    prompt.add("Hotel booked: " + r.hotelBooked());
    prompt.add("Cards available: " + listSafe(r.cardsAvailable()));
    prompt.add("Expected activities: " + listSafe(r.expectedActivities()));
    prompt.add("Planned cash amount: " + r.plannedCashAmount());
    prompt.add("Preferred currency: " + r.preferredCurrency());
    prompt.add("Risk preference: " + r.riskPreference());
    return prompt.toString();
  }

  private String nullSafe(String value) { return value == null || value.isBlank() ? "not specified" : value; }
  private String listSafe(java.util.List<String> values) { return values == null || values.isEmpty() ? "not specified" : String.join(", ", values); }
}
