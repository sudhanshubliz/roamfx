package app.roamfx.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;

final class AnthropicTravelMoneyAdvisor extends LlmTravelMoneyAdvisorSupport {
  private final String apiKey;
  private final String model;

  AnthropicTravelMoneyAdvisor(ObjectMapper objectMapper, TravelMoneyPromptTemplate promptTemplate, String apiKey, String model) {
    super(objectMapper, promptTemplate, "Anthropic");
    this.apiKey = apiKey;
    this.model = model;
  }

  @Override protected String complete(String prompt) {
    var body = Map.of(
      "model", model,
      "max_tokens", 1300,
      "temperature", 0.2,
      "system", "You are RoamFX Travel Money Assistant. Return safe, compliance-aware JSON only.",
      "messages", List.of(Map.of("role", "user", "content", prompt))
    );
    var json = readJson(postJson("https://api.anthropic.com/v1/messages", Map.of(
      "x-api-key", apiKey,
      "anthropic-version", "2023-06-01"
    ), body));
    return json.path("content").path(0).path("text").asText();
  }
}
