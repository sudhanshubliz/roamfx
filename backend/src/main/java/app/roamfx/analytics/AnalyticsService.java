package app.roamfx.analytics;

import app.roamfx.common.Enums.AnalyticsEventType;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
  private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);

  public void track(AnalyticsEventType eventType, Map<String, ?> properties) {
    // TODO: Send to PostHog, Segment, RudderStack, or a warehouse event pipeline.
    log.info("Analytics placeholder: {} {}", eventType, properties);
  }
}
