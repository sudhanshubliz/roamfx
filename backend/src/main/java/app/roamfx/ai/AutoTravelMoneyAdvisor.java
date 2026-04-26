package app.roamfx.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class AutoTravelMoneyAdvisor implements TravelMoneyAdvisor {
  private final Environment environment;
  private final ObjectMapper objectMapper;
  private final TravelMoneyPromptTemplate promptTemplate;
  private final MockTravelMoneyAdvisor mock = new MockTravelMoneyAdvisor();

  public AutoTravelMoneyAdvisor(Environment environment, ObjectMapper objectMapper, TravelMoneyPromptTemplate promptTemplate) {
    this.environment = environment;
    this.objectMapper = objectMapper;
    this.promptTemplate = promptTemplate;
  }

  @Override public TravelMoneyPlan plan(TravelMoneyPlanRequest request) {
    var configured = environment.getProperty("app.aiProvider", environment.getProperty("AI_PROVIDER", "auto")).toLowerCase(Locale.ROOT);
    if ("mock".equals(configured)) return mock.plan(request);

    var providers = providers();
    if (!"auto".equals(configured)) {
      var selected = providers.get(configured);
      if (selected == null) return mock.plan(request);
      return selected.plan(request);
    }

    for (var provider : providers.values()) {
      try {
        return provider.plan(request);
      } catch (RuntimeException ignored) {
        // Try the next configured provider without exposing provider errors or secrets to users/logs.
      }
    }
    return mock.plan(request);
  }

  private Map<String, TravelMoneyAdvisor> providers() {
    var providers = new LinkedHashMap<String, TravelMoneyAdvisor>();
    putOpenAi(providers);
    putGemini(providers);
    putAnthropic(providers);
    putOpenAiCompatible(providers, "groq", "Groq", "GROQ_API_KEY", "https://api.groq.com/openai/v1/chat/completions", model("GROQ_MODEL", "llama-3.1-8b-instant"), Map.of());
    putOpenAiCompatible(providers, "deepseek", "DeepSeek", "DEEPSEEK_API_KEY", "https://api.deepseek.com/chat/completions", model("DEEPSEEK_MODEL", "deepseek-chat"), Map.of());
    putOpenAiCompatible(providers, "grok", "xAI Grok", "GROK_API_KEY", "https://api.x.ai/v1/chat/completions", model("GROK_MODEL", "grok-2-latest"), Map.of());
    putOpenAiCompatible(providers, "openrouter", "OpenRouter", "OPENROUTER_API_KEY", "https://openrouter.ai/api/v1/chat/completions", model("OPENROUTER_MODEL", "openai/gpt-4o-mini"), Map.of(
      "HTTP-Referer", environment.getProperty("APP_PUBLIC_URL", "https://roamfx.app"),
      "X-Title", "RoamFX"
    ));
    return providers;
  }

  private void putOpenAi(Map<String, TravelMoneyAdvisor> providers) {
    putOpenAiCompatible(providers, "openai", "OpenAI", "OPENAI_API_KEY", "https://api.openai.com/v1/chat/completions", model("OPENAI_MODEL", "gpt-4o-mini"), Map.of());
  }

  private void putGemini(Map<String, TravelMoneyAdvisor> providers) {
    var key = secret("GOOGLE_API_KEY");
    if (key != null) providers.put("google", new GeminiTravelMoneyAdvisor(objectMapper, promptTemplate, key, model("GOOGLE_MODEL", "gemini-1.5-flash")));
  }

  private void putAnthropic(Map<String, TravelMoneyAdvisor> providers) {
    var key = secret("ANTHROPIC_API_KEY");
    if (key != null) providers.put("anthropic", new AnthropicTravelMoneyAdvisor(objectMapper, promptTemplate, key, model("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")));
  }

  private void putOpenAiCompatible(Map<String, TravelMoneyAdvisor> providers, String key, String name, String envKey, String endpoint, String model, Map<String, String> headers) {
    var apiKey = secret(envKey);
    if (apiKey != null) providers.put(key, new OpenAiCompatibleTravelMoneyAdvisor(objectMapper, promptTemplate, name, endpoint, apiKey, model, headers));
  }

  private String secret(String key) {
    var value = environment.getProperty(key);
    return value == null || value.isBlank() ? null : value;
  }

  private String model(String key, String fallback) {
    return environment.getProperty(key, fallback);
  }
}
