package app.roamfx.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

abstract class LlmTravelMoneyAdvisorSupport implements TravelMoneyAdvisor {
  static final String JSON_INSTRUCTION = """
    Return only valid JSON. Do not wrap it in markdown.
    Use numeric values for money and confidenceScore.
    Include safetyWarnings inside scamWarnings where relevant.
    The guidance must never recommend unlicensed peer-to-peer cash exchange, user-to-user cash meetups, informal dealers, or bypassing KYC.
    Recommend verified authorised partners for all currency exchange and leftover buyback transactions.
    """;

  private final ObjectMapper objectMapper;
  private final HttpClient httpClient;
  private final TravelMoneyPromptTemplate promptTemplate;
  private final String providerName;

  LlmTravelMoneyAdvisorSupport(ObjectMapper objectMapper, TravelMoneyPromptTemplate promptTemplate, String providerName) {
    this.objectMapper = objectMapper;
    this.promptTemplate = promptTemplate;
    this.providerName = providerName;
    this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
  }

  @Override public TravelMoneyPlan plan(TravelMoneyPlanRequest request) {
    var fallback = new MockTravelMoneyAdvisor().plan(request);
    var content = complete(promptTemplate.build(request) + "\n" + JSON_INSTRUCTION);
    return parse(content, fallback);
  }

  protected abstract String complete(String prompt);

  protected String postJson(String url, Map<String, String> headers, Object body) {
    try {
      var builder = HttpRequest.newBuilder(URI.create(url))
        .timeout(Duration.ofSeconds(35))
        .header("Content-Type", "application/json");
      headers.forEach(builder::header);
      var request = builder.POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body))).build();
      var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() < 200 || response.statusCode() >= 300) {
        throw new IllegalStateException(providerName + " returned HTTP " + response.statusCode());
      }
      return response.body();
    } catch (IOException e) {
      throw new IllegalStateException(providerName + " request failed", e);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException(providerName + " request interrupted", e);
    }
  }

  protected String openAiCompatibleChat(String endpoint, String apiKey, String model, String prompt, Map<String, String> extraHeaders) {
    var headers = new java.util.LinkedHashMap<String, String>();
    headers.put("Authorization", "Bearer " + apiKey);
    headers.putAll(extraHeaders);
    var body = Map.of(
      "model", model,
      "temperature", 0.2,
      "response_format", Map.of("type", "json_object"),
      "messages", List.of(
        Map.of("role", "system", "content", "You are RoamFX Travel Money Assistant. Return safe, compliance-aware JSON only."),
        Map.of("role", "user", "content", prompt)
      )
    );
    var json = readJson(postJson(endpoint, headers, body));
    return json.path("choices").path(0).path("message").path("content").asText();
  }

  TravelMoneyPlan parse(String rawContent, TravelMoneyPlan fallback) {
    var json = readJson(extractJson(rawContent));
    return new TravelMoneyPlan(
      decimal(json, "recommendedCashAmount", fallback.recommendedCashAmount()),
      decimal(json, "recommendedCardAmount", fallback.recommendedCardAmount()),
      strings(json, "suggestedDenominations", fallback.suggestedDenominations()),
      decimal(json, "dailyBudgetEstimate", fallback.dailyBudgetEstimate()),
      decimal(json, "emergencyCashSuggestion", fallback.emergencyCashSuggestion()),
      text(json, "airportExchangeWarning", fallback.airportExchangeWarning()),
      text(json, "atmUsageAdvice", fallback.atmUsageAdvice()),
      text(json, "cardAcceptanceAdvice", fallback.cardAcceptanceAdvice()),
      strings(json, "scamWarnings", fallback.scamWarnings()),
      strings(json, "countrySpecificTips", fallback.countrySpecificTips()),
      strings(json, "checklist", fallback.checklist()),
      decimal(json, "confidenceScore", BigDecimal.valueOf(0.76)).min(BigDecimal.ONE),
      "This is general travel-money guidance, not legal or regulated financial advice. Rates, fees, KYC requirements, and local rules may change; confirm with verified authorised partners before any transaction.",
      providerName);
  }

  JsonNode readJson(String value) {
    try {
      return objectMapper.readTree(value);
    } catch (Exception e) {
      throw new IllegalStateException(providerName + " returned invalid JSON", e);
    }
  }

  String extractJson(String value) {
    if (value == null || value.isBlank()) throw new IllegalStateException(providerName + " returned empty content");
    var trimmed = value.trim();
    var start = trimmed.indexOf('{');
    var end = trimmed.lastIndexOf('}');
    if (start < 0 || end <= start) throw new IllegalStateException(providerName + " returned non-JSON content");
    return trimmed.substring(start, end + 1);
  }

  BigDecimal decimal(JsonNode json, String field, BigDecimal fallback) {
    var node = json.path(field);
    if (node.isMissingNode() || node.isNull()) return fallback;
    try {
      return new BigDecimal(node.asText()).max(BigDecimal.ZERO);
    } catch (NumberFormatException e) {
      return fallback;
    }
  }

  String text(JsonNode json, String field, String fallback) {
    var value = json.path(field).asText(null);
    return value == null || value.isBlank() ? fallback : value;
  }

  List<String> strings(JsonNode json, String field, List<String> fallback) {
    var node = json.path(field);
    if (!node.isArray()) return fallback;
    var values = new ArrayList<String>();
    node.forEach(item -> {
      var value = item.asText("");
      if (!value.isBlank()) values.add(value);
    });
    return values.isEmpty() ? fallback : values;
  }
}
