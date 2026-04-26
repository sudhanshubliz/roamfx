package app.roamfx.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;

final class GeminiTravelMoneyAdvisor extends LlmTravelMoneyAdvisorSupport {
  private final String apiKey;
  private final String model;

  GeminiTravelMoneyAdvisor(ObjectMapper objectMapper, TravelMoneyPromptTemplate promptTemplate, String apiKey, String model) {
    super(objectMapper, promptTemplate, "Google Gemini");
    this.apiKey = apiKey;
    this.model = model;
  }

  @Override protected String complete(String prompt) {
    var body = Map.of(
      "generationConfig", Map.of("temperature", 0.2, "responseMimeType", "application/json"),
      "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
    );
    var json = readJson(postJson("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey, Map.of(), body));
    return json.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
  }
}
