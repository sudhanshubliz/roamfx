package app.roamfx.ai;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/ai")
public class AiController {
  private final TravelMoneyAdvisor advisor;
  public AiController(TravelMoneyAdvisor advisor) { this.advisor = advisor; }
  @PostMapping("/travel-money-plan")
  TravelMoneyAdvisor.TravelMoneyPlan plan(@Valid @RequestBody TravelMoneyAdvisor.TravelMoneyPlanRequest request) {
    return advisor.plan(request);
  }
}
