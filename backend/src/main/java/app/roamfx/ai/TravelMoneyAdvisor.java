package app.roamfx.ai;

import app.roamfx.common.Enums.RiskPreference;
import app.roamfx.common.Enums.TravelStyle;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;

public interface TravelMoneyAdvisor {
  TravelMoneyPlan plan(TravelMoneyPlanRequest request);
  default String providerName() { return getClass().getSimpleName(); }

  record TravelMoneyPlanRequest(
    @NotBlank String destinationCountry,
    String destinationCity,
    @NotBlank String departureCountry,
    @Min(1) @Max(180) int tripDays,
    @Min(1) @Max(20) int travellerCount,
    @NotNull TravelStyle travelStyle,
    boolean hotelBooked,
    List<String> cardsAvailable,
    List<String> expectedActivities,
    @PositiveOrZero BigDecimal plannedCashAmount,
    @NotBlank String preferredCurrency,
    @NotNull RiskPreference riskPreference
  ) {}

  record TravelMoneyPlan(
    BigDecimal recommendedCashAmount,
    BigDecimal recommendedCardAmount,
    List<String> suggestedDenominations,
    BigDecimal dailyBudgetEstimate,
    BigDecimal emergencyCashSuggestion,
    String airportExchangeWarning,
    String atmUsageAdvice,
    String cardAcceptanceAdvice,
    List<String> scamWarnings,
    List<String> countrySpecificTips,
    List<String> checklist,
    @Positive @Max(1) BigDecimal confidenceScore,
    String disclaimer,
    String provider
  ) {}
}
