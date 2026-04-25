package app.roamfx.common;

public final class Enums {
  private Enums() {}
  public enum Role { TRAVELLER, PARTNER_ADMIN, PLATFORM_ADMIN }
  public enum KycStatus { NOT_STARTED, PENDING, VERIFIED, REJECTED }
  public enum LicenseType { AD_CATEGORY_I, AD_CATEGORY_II, FFMC, BANK, TRAVEL_FOREX_PARTNER }
  public enum VerificationStatus { PENDING, VERIFIED, REJECTED, SUSPENDED }
  public enum BookingType { BUY_FOREX, SELL_LEFTOVER_FOREX }
  public enum PaymentMode { CASH, UPI, CARD, BANK_TRANSFER }
  public enum FulfilmentMode { PICKUP, DELIVERY, STORE_VISIT }
  public enum BookingStatus { DRAFT, PENDING_KYC, RATE_LOCKED, PARTNER_REVIEW, CONFIRMED, READY_FOR_PICKUP, COMPLETED, CANCELLED, EXPIRED, REJECTED }
  public enum DocumentType { PASSPORT, PAN, VISA, FLIGHT_TICKET, ADDRESS_PROOF, CURRENCY_DECLARATION_FORM, OTHER }
  public enum DocumentStatus { UPLOADED, UNDER_REVIEW, VERIFIED, REJECTED }
  public enum CommunityPostType { TIP, QUESTION, LEFTOVER_CURRENCY_REQUEST, RATE_ALERT }
  public enum CommunityPostStatus { ACTIVE, HIDDEN, FLAGGED }
  public enum TravelStyle { BUDGET, MID_RANGE, LUXURY }
  public enum RiskPreference { LOW, MODERATE, HIGH }
  public enum WaitlistInterest { BUY_FOREX, SELL_LEFTOVER, PARTNER_LISTING, AI_PLANNER }
  public enum AnalyticsEventType { LANDING_VIEWED, RATE_SEARCH_STARTED, WAITLIST_JOINED, BOOKING_STARTED, BOOKING_COMPLETED }
}
