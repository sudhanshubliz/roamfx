package app.roamfx.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

final class OpenAiCompatibleTravelMoneyAdvisor extends LlmTravelMoneyAdvisorSupport {
  private final String endpoint;
  private final String apiKey;
  private final String model;
  private final Map<String, String> extraHeaders;

  OpenAiCompatibleTravelMoneyAdvisor(ObjectMapper objectMapper, TravelMoneyPromptTemplate promptTemplate, String providerName,
                                     String endpoint, String apiKey, String model, Map<String, String> extraHeaders) {
    super(objectMapper, promptTemplate, providerName);
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.model = model;
    this.extraHeaders = extraHeaders;
  }

  @Override protected String complete(String prompt) {
    return openAiCompatibleChat(endpoint, apiKey, model, prompt, extraHeaders);
  }
}
