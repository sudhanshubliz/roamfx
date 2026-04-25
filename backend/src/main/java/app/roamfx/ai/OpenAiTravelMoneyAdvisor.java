package app.roamfx.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "app.aiProvider", havingValue = "openai")
public class OpenAiTravelMoneyAdvisor implements TravelMoneyAdvisor {
  private final TravelMoneyPromptTemplate promptTemplate;
  private final MockTravelMoneyAdvisor fallback = new MockTravelMoneyAdvisor();

  public OpenAiTravelMoneyAdvisor(TravelMoneyPromptTemplate promptTemplate) {
    this.promptTemplate = promptTemplate;
  }

  @Override public TravelMoneyPlan plan(TravelMoneyPlanRequest request) {
    var prompt = promptTemplate.build(request);
    // TODO: Call OpenAI Responses API with prompt, parse structured JSON, validate compliance fields, and return typed plan.
    return withProvider(fallback.plan(request), "OpenAI placeholder");
  }

  private TravelMoneyPlan withProvider(TravelMoneyPlan plan, String provider) {
    return new TravelMoneyPlan(plan.recommendedCashAmount(), plan.recommendedCardAmount(), plan.suggestedDenominations(),
      plan.dailyBudgetEstimate(), plan.emergencyCashSuggestion(), plan.airportExchangeWarning(), plan.atmUsageAdvice(),
      plan.cardAcceptanceAdvice(), plan.scamWarnings(), plan.countrySpecificTips(), plan.checklist(), plan.confidenceScore(),
      plan.disclaimer(), provider);
  }
}
