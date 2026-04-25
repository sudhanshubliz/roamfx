package app.roamfx.ai;

import app.roamfx.common.Enums.RiskPreference;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "app.aiProvider", havingValue = "mock", matchIfMissing = true)
public class MockTravelMoneyAdvisor implements TravelMoneyAdvisor {
  private static final String DISCLAIMER = "This is general travel-money guidance, not legal or regulated financial advice. Rates, fees, KYC requirements, and local rules may change; confirm with verified authorised partners before any transaction.";

  @Override public TravelMoneyPlan plan(TravelMoneyPlanRequest r) {
    var styleMultiplier = switch (r.travelStyle()) { case LUXURY -> 2.3; case MID_RANGE -> 1.45; default -> 0.9; };
    var riskCashRatio = switch (r.riskPreference()) { case LOW -> 0.28; case MODERATE -> 0.36; case HIGH -> 0.45; };
    var activityLoad = r.expectedActivities() == null ? 0 : Math.min(6, r.expectedActivities().size());
    var daily = BigDecimal.valueOf((70 + activityLoad * 12) * styleMultiplier * Math.max(1, r.travellerCount()))
      .setScale(0, RoundingMode.HALF_UP);
    var total = daily.multiply(BigDecimal.valueOf(Math.max(1, r.tripDays())));
    var plannedCash = r.plannedCashAmount() == null ? BigDecimal.ZERO : r.plannedCashAmount();
    var recommendedCash = plannedCash.signum() > 0 ? plannedCash.min(total.multiply(BigDecimal.valueOf(0.65))) : total.multiply(BigDecimal.valueOf(riskCashRatio));
    if (!r.hotelBooked()) recommendedCash = recommendedCash.add(daily.multiply(BigDecimal.valueOf(0.35)));
    var emergency = daily.multiply(r.riskPreference() == RiskPreference.LOW ? BigDecimal.valueOf(0.75) : BigDecimal.valueOf(1.25)).setScale(0, RoundingMode.HALF_UP);
    recommendedCash = recommendedCash.add(emergency.multiply(BigDecimal.valueOf(0.25))).setScale(0, RoundingMode.HALF_UP);
    var recommendedCard = total.subtract(recommendedCash).max(daily).setScale(0, RoundingMode.HALF_UP);
    var currency = r.preferredCurrency().toUpperCase();

    var checklist = new ArrayList<String>();
    checklist.add("Compare rates and fees with verified authorised partners before locking a booking.");
    checklist.add("Keep passport, PAN or local ID, visa, and flight/hotel proof ready where required.");
    checklist.add("Use non-cash payment modes for high-value transactions where regulations require it.");
    checklist.add("Save partner receipts and rate-lock confirmation.");
    if (!r.hotelBooked()) checklist.add("Keep extra first-night cash buffer until accommodation is confirmed.");

    return new TravelMoneyPlan(
      recommendedCash,
      recommendedCard,
      List.of("Mix small " + currency + " notes for taxis, tips, transit, and snacks.", "Keep only one day of cash in your wallet; store the rest separately.", "Avoid carrying all funds in high denominations."),
      daily,
      emergency,
      "Airport counters can be convenient but often have wider spreads or hidden fees. Use them only for a small emergency amount and compare city partner rates first.",
      "Prefer bank-affiliated ATMs in secure locations, decline dynamic currency conversion when offered, and check withdrawal fees before confirming.",
      cardAdvice(r),
      List.of("Avoid street dealers, hotel-lobby strangers, and social-media cash exchange offers.", "RoamFX does not support unlicensed peer-to-peer currency exchange or user-to-user cash meetups.", "Be cautious of rates that are far better than market; fake notes and bait-and-switch fees are common risks."),
      List.of("For " + destinationLabel(r) + ", carry a first-day cash buffer in " + currency + ".", "Use verified authorised partners for purchase or buy-back.", "Split payment methods across cash, card, and a backup card."),
      checklist,
      BigDecimal.valueOf(0.82),
      DISCLAIMER,
      providerName());
  }

  String cardAdvice(TravelMoneyPlanRequest r) {
    var cards = r.cardsAvailable() == null ? List.<String>of() : r.cardsAvailable();
    if (cards.isEmpty()) return "Card acceptance varies by city and merchant. Carry enough authorised-partner cash for essentials and consider a prepaid travel card.";
    return "Use " + String.join(" and ", cards) + " for hotels and larger merchants, but keep cash for small vendors, transit, and backup.";
  }

  String destinationLabel(TravelMoneyPlanRequest r) {
    return (r.destinationCity() == null || r.destinationCity().isBlank()) ? r.destinationCountry() : r.destinationCity() + ", " + r.destinationCountry();
  }
}
