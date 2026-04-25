package app.roamfx.rate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity @Table(name = "currencies")
public class Currency {
  @Id @Column(length = 3) public String code;
  public String name;
  public String symbol;
  public boolean active = true;
}
