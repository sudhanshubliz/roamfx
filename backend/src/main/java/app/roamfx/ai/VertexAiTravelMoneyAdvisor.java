package app.roamfx.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "app.aiProvider", havingValue = "vertex")
public class VertexAiTravelMoneyAdvisor implements TravelMoneyAdvisor {
  private final TravelMoneyPromptTemplate promptTemplate;
  private final MockTravelMoneyAdvisor fallback = new MockTravelMoneyAdvisor();

  public VertexAiTravelMoneyAdvisor(TravelMoneyPromptTemplate promptTemplate) {
    this.promptTemplate = promptTemplate;
  }

  @Override public TravelMoneyPlan plan(TravelMoneyPlanRequest request) {
    var prompt = promptTemplate.build(request);
    // TODO: Call Vertex AI Gemini API with prompt, parse structured JSON, validate compliance fields, and return typed plan.
    var plan = fallback.plan(request);
    return new TravelMoneyPlan(plan.recommendedCashAmount(), plan.recommendedCardAmount(), plan.suggestedDenominations(),
      plan.dailyBudgetEstimate(), plan.emergencyCashSuggestion(), plan.airportExchangeWarning(), plan.atmUsageAdvice(),
      plan.cardAcceptanceAdvice(), plan.scamWarnings(), plan.countrySpecificTips(), plan.checklist(), plan.confidenceScore(),
      plan.disclaimer(), "Vertex AI placeholder");
  }
}
