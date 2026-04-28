import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type Partner = {
  id: string;
  name: string;
  city: string;
  area: string;
  lat: number;
  lng: number;
  license: string;
  rating: number;
  branches: number;
  phone: string;
  fulfilment: string;
  eta: string;
  delivery: boolean;
  airport: boolean;
  inventory: number;
  rates: Record<string, number>;
};

const amountOptions = [50000, 100000, 150000];
const currencyOptions = ["EUR", "USD", "GBP", "AED"] as const;
const sortOptions = ["Best rate", "Nearest", "Rating", "Delivery"] as const;

const cityCoordinates: Record<string, { lat: number; lng: number; label: string }> = {
  delhi: { lat: 28.5562, lng: 77.1, label: "Delhi NCR" },
  mumbai: { lat: 19.0896, lng: 72.8656, label: "Mumbai" },
  bengaluru: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" },
  bangalore: { lat: 12.9716, lng: 77.5946, label: "Bengaluru" }
};

const partners: Partner[] = [
  {
    id: "global-forex",
    name: "Global Forex Pvt. Ltd.",
    city: "Delhi NCR",
    area: "T3, Delhi Airport",
    lat: 28.5562,
    lng: 77.1,
    license: "RBI authorised AD-I",
    rating: 4.8,
    branches: 15,
    phone: "+911145551010",
    fulfilment: "Airport pickup",
    eta: "Today, 4:00 PM",
    delivery: false,
    airport: true,
    inventory: 95000,
    rates: { EUR: 91.32, USD: 83.44, GBP: 106.12, AED: 22.83 }
  },
  {
    id: "travel-currency",
    name: "Travel Currency Exchange",
    city: "Delhi NCR",
    area: "Connaught Place",
    lat: 28.6315,
    lng: 77.2167,
    license: "RBI authorised FFMC",
    rating: 4.7,
    branches: 20,
    phone: "+911145552020",
    fulfilment: "Home delivery",
    eta: "Tomorrow, 10:00 AM - 1:00 PM",
    delivery: true,
    airport: false,
    inventory: 78000,
    rates: { EUR: 90.83, USD: 83.21, GBP: 105.76, AED: 22.71 }
  },
  {
    id: "world-forex",
    name: "World Forex Services",
    city: "Delhi NCR",
    area: "Aerocity",
    lat: 28.5483,
    lng: 77.1217,
    license: "RBI authorised AD-I",
    rating: 4.6,
    branches: 10,
    phone: "+911145553030",
    fulfilment: "Airport pickup",
    eta: "Tomorrow, 9:00 AM",
    delivery: false,
    airport: true,
    inventory: 52000,
    rates: { EUR: 90.43, USD: 82.98, GBP: 105.11, AED: 22.62 }
  },
  {
    id: "mumbai-money",
    name: "Mumbai Travel Money",
    city: "Mumbai",
    area: "Bandra Kurla Complex",
    lat: 19.0669,
    lng: 72.8675,
    license: "RBI authorised AD-II",
    rating: 4.7,
    branches: 18,
    phone: "+912245551010",
    fulfilment: "Branch pickup",
    eta: "Today, 5:30 PM",
    delivery: true,
    airport: false,
    inventory: 88000,
    rates: { EUR: 91.05, USD: 83.36, GBP: 105.91, AED: 22.78 }
  },
  {
    id: "bengaluru-global",
    name: "Bengaluru Global Forex",
    city: "Bengaluru",
    area: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    license: "Verified travel-forex partner",
    rating: 4.5,
    branches: 8,
    phone: "+918045551010",
    fulfilment: "Store visit",
    eta: "Tomorrow, 11:00 AM",
    delivery: false,
    airport: false,
    inventory: 42000,
    rates: { EUR: 90.71, USD: 83.05, GBP: 105.44, AED: 22.69 }
  }
];

const steps = ["Enter details", "Choose partner", "Verify & pay", "Confirmation"];

function formatInr(value: number) {
  return `INR ${Math.round(value).toLocaleString("en-IN")}`;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.sqrt(h));
}

export default function App() {
  const [amount, setAmount] = useState(100000);
  const [currency, setCurrency] = useState<(typeof currencyOptions)[number]>("EUR");
  const [city, setCity] = useState("Delhi NCR");
  const [manualCity, setManualCity] = useState("Delhi");
  const [coords, setCoords] = useState(cityCoordinates.delhi);
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>("Best rate");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState("global-forex");
  const [bookingStarted, setBookingStarted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [message, setMessage] = useState("Rates updated from verified partner feeds.");

  const rows = useMemo(() => {
    const nearby = partners
      .filter((partner) => city === "Near me" || partner.city.toLowerCase() === city.toLowerCase())
      .map((partner) => {
        const rate = partner.rates[currency];
        const receive = amount / rate;
        const serviceFee = partner.delivery ? 780 : 220;
        const distance = haversineKm(coords, partner);
        return {
          ...partner,
          distance,
          rate,
          receive,
          serviceFee,
          total: amount + serviceFee,
          suspicious: Math.abs(rate - 91) / 91 > 0.05
        };
      });

    const comparable = nearby.length > 0 ? nearby : partners.map((partner) => {
      const rate = partner.rates[currency];
      return {
        ...partner,
        distance: haversineKm(coords, partner),
        rate,
        receive: amount / rate,
        serviceFee: partner.delivery ? 780 : 220,
        total: amount + (partner.delivery ? 780 : 220),
        suspicious: Math.abs(rate - 91) / 91 > 0.05
      };
    });

    return comparable.sort((a, b) => {
      if (sortBy === "Nearest") return a.distance - b.distance;
      if (sortBy === "Rating") return b.rating - a.rating;
      if (sortBy === "Delivery") return Number(b.delivery) - Number(a.delivery);
      return b.receive - a.receive;
    });
  }, [amount, city, coords, currency, sortBy]);

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0];
  const best = rows[0];
  const saving = selected ? Math.max(0, Math.round((selected.receive - rows[rows.length - 1].receive) * selected.rate)) : 0;
  const activeStep = bookingStarted ? 2 : selected ? 1 : 0;

  async function useCurrentLocation() {
    setLocationLoading(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setMessage("Location permission denied. Enter your city manually.");
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      const next = {
        lat: current.coords.latitude,
        lng: current.coords.longitude,
        label: "Near me"
      };
      setCoords(next);
      setCity("Near me");
      setMessage("Showing verified partners ranked by distance from your current location.");
    } catch {
      setMessage("Could not read location. Try manual city search.");
    } finally {
      setLocationLoading(false);
    }
  }

  function applyManualCity() {
    const key = manualCity.trim().toLowerCase();
    const match = cityCoordinates[key];
    if (!match) {
      setMessage("Demo supports Delhi, Mumbai, and Bengaluru. Showing all verified partners.");
      setCity(manualCity.trim() || "All cities");
      return;
    }
    setCoords(match);
    setCity(match.label);
    setMessage(`Showing verified partners near ${match.label}.`);
  }

  function openMaps(partner: Partner) {
    const query = encodeURIComponent(`${partner.name}, ${partner.area}, ${partner.city}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  }

  function callPartner(partner: Partner) {
    Linking.openURL(`tel:${partner.phone}`).catch(() => {
      Alert.alert("Call partner", `Call ${partner.name} at ${partner.phone}`);
    });
  }

  function selectPartner(partnerId: string) {
    setSelectedId(partnerId);
    setBookingStarted(true);
    setMessage("Rate reserved for 5 minutes. Complete KYC and payment with the authorised partner.");
  }

  function showAiPlan() {
    Alert.alert(
      "AI Travel Money Plan",
      `Carry ${currency} ${Math.round(amount / selected.rate * 0.6).toLocaleString("en-IN")} in cash, keep the rest on card, avoid airport counters unless urgent, and transact only through verified authorised partners.`
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.menu}>☰</Text>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>FX</Text>
          </View>
          <Text style={styles.brand}>
            Roam<Text style={styles.brandAccent}>FX</Text>
          </Text>
          <View style={styles.headerSpacer} />
          <TouchableOpacity onPress={() => Alert.alert("Rate alerts", "Rate alert created for your selected route.")}>
            <Text style={styles.bell}>♡</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.currencyRow}>
            <View style={styles.currencyBlock}>
              <Text style={styles.muted}>You're in</Text>
              <Text style={styles.country}>🇮🇳 {city}</Text>
            </View>
            <TouchableOpacity
              style={styles.swapButton}
              onPress={() => setMessage("Sell-leftover flow selected. Buyback will be routed to verified partners only.")}
            >
              <Text style={styles.swapText}>⇄</Text>
            </TouchableOpacity>
            <View style={styles.currencyBlockRight}>
              <Text style={styles.muted}>You need</Text>
              <Text style={styles.country}>🇪🇺 {currency}</Text>
            </View>
          </View>

          <View style={styles.amountBox}>
            <View style={styles.amountCol}>
              <Text style={styles.muted}>You send</Text>
              <Text style={styles.amount}>₹ {amount.toLocaleString("en-IN")}</Text>
              <Text style={styles.small}>Indian Rupee (INR)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.amountCol}>
              <Text style={styles.muted}>You receive</Text>
              <Text style={styles.amount}>{currency} {best.receive.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</Text>
              <Text style={styles.saving}>Best rate • Save ₹{saving.toLocaleString("en-IN")}</Text>
            </View>
          </View>

          <View style={styles.chipRow}>
            {amountOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, amount === option && styles.chipActive]}
                onPress={() => setAmount(option)}
              >
                <Text style={[styles.chipText, amount === option && styles.chipTextActive]}>
                  ₹{option / 1000}k
                </Text>
              </TouchableOpacity>
            ))}
            {currencyOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, currency === option && styles.chipActive]}
                onPress={() => setCurrency(option)}
              >
                <Text style={[styles.chipText, currency === option && styles.chipTextActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.sectionTitle}>Find nearby forex partners</Text>
          <View style={styles.searchRow}>
            <TextInput
              value={manualCity}
              onChangeText={setManualCity}
              placeholder="Enter city: Delhi, Mumbai, Bengaluru"
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
            <TouchableOpacity style={styles.smallButton} onPress={applyManualCity}>
              <Text style={styles.smallButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.locationButton} onPress={useCurrentLocation}>
            <Text style={styles.locationText}>
              {locationLoading ? "Reading location..." : "Use current location"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.compliance}>
          <View style={styles.shield}>
            <Text style={styles.shieldText}>✓</Text>
          </View>
          <View style={styles.complianceCopy}>
            <Text style={styles.complianceTitle}>Verified authorised forex partners only</Text>
            <Text style={styles.complianceText}>
              No peer-to-peer cash exchange. Bookings, KYC, and payments are routed through verified partners.
            </Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.segment, viewMode === "list" && styles.segmentActive]}
            onPress={() => setViewMode("list")}
          >
            <Text style={[styles.segmentText, viewMode === "list" && styles.segmentActiveText]}>☷ List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, viewMode === "map" && styles.segmentActive]}
            onPress={() => setViewMode("map")}
          >
            <Text style={[styles.segmentText, viewMode === "map" && styles.segmentActiveText]}>◇ Map</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.sortChip, sortBy === option && styles.chipActive]}
              onPress={() => setSortBy(option)}
            >
              <Text style={[styles.chipText, sortBy === option && styles.chipTextActive]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{viewMode === "map" ? "Map preview" : "Best partner rates"}</Text>
          <Text style={styles.updated}>{message}</Text>
        </View>

        {viewMode === "map" ? (
          <View style={styles.mapCard}>
            <Text style={styles.mapTitle}>Google Maps-ready partner view</Text>
            <Text style={styles.complianceText}>
              Open a partner card to launch Google Maps with the selected verified money changer.
            </Text>
            {rows.slice(0, 3).map((partner) => (
              <TouchableOpacity key={partner.id} style={styles.mapPin} onPress={() => openMaps(partner)}>
                <Text style={styles.partnerName}>{partner.name}</Text>
                <Text style={styles.small}>{partner.distance.toFixed(1)} km • {partner.area}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {rows.map((partner, index) => (
          <View key={partner.id} style={[styles.partnerCard, partner.id === selected.id && styles.partnerCardBest]}>
            <View style={styles.partnerTop}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>FX</Text>
              </View>
              <View style={styles.partnerNameBlock}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{index === 0 ? "Best Value" : partner.fulfilment}</Text>
                </View>
                <Text style={styles.partnerName}>{partner.name} ✓</Text>
                <Text style={styles.small}>{partner.license} • {partner.rating} ★ • {partner.distance.toFixed(1)} km</Text>
              </View>
              <TouchableOpacity style={styles.selectButton} onPress={() => selectPartner(partner.id)}>
                <Text style={styles.selectText}>{partner.id === selected.id ? "Selected" : "Select"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.metricGrid}>
              <View>
                <Text style={styles.muted}>You receive</Text>
                <Text style={styles.metric}>{currency} {partner.receive.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</Text>
              </View>
              <View>
                <Text style={styles.muted}>Rate</Text>
                <Text style={styles.metric}>INR {partner.rate}</Text>
              </View>
              <View>
                <Text style={styles.muted}>Total cost</Text>
                <Text style={styles.metric}>{formatInr(partner.total)}</Text>
              </View>
            </View>
            {partner.suspicious ? <Text style={styles.warning}>Rate deviates from mid-market mock benchmark. Verify before booking.</Text> : null}
            <Text style={styles.fulfilment}>{partner.fulfilment}</Text>
            <Text style={styles.small}>{partner.area} • {partner.eta} • Inventory {currency} {partner.inventory.toLocaleString("en-IN")}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => callPartner(partner)}>
                <Text style={styles.secondaryButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => openMaps(partner)}>
                <Text style={styles.secondaryButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Your booking progress</Text>
          <View style={styles.stepRow}>
            {steps.map((step, index) => (
              <View key={step} style={styles.stepItem}>
                <View style={[styles.stepDot, index <= activeStep && styles.stepDotActive]}>
                  <Text style={[styles.stepNum, index <= activeStep && styles.stepNumActive]}>{index + 1}</Text>
                </View>
                <Text style={styles.stepLabel}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={styles.lockBox}>
            <Text style={styles.small}>Selected partner</Text>
            <Text style={styles.partnerName}>{selected.name} ✓</Text>
            <Text style={styles.saving}>Rate lock preview: 04:56 • KYC needed above ₹50,000</Text>
          </View>
        </View>

        <View style={styles.aiCard}>
          <Text style={styles.sectionTitle}>AI Travel Money Planner</Text>
          <Text style={styles.aiCopy}>
            Carry a mix of cash and card, avoid airport exchange unless urgent, and use authorised partners only.
          </Text>
          <View style={styles.recommendBox}>
            <Text style={styles.muted}>Recommended cash</Text>
            <Text style={styles.recommend}>{currency} {Math.round((amount / selected.rate) * 0.6).toLocaleString("en-IN")}</Text>
            <TouchableOpacity style={styles.planButton} onPress={showAiPlan}>
              <Text style={styles.selectText}>View plan</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerNote}>
          Rates are indicative. Final rate is locked after booking and partner confirmation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7faf9" },
  container: { flex: 1 },
  content: { padding: 14, paddingBottom: 28 },
  header: { alignItems: "center", flexDirection: "row", gap: 10, paddingBottom: 12 },
  menu: { color: "#0f172a", fontSize: 24 },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#006b75",
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  brandMarkText: { color: "#ffffff", fontSize: 13, fontWeight: "800" },
  brand: { color: "#0f172a", fontSize: 26, fontWeight: "800" },
  brandAccent: { color: "#049485" },
  headerSpacer: { flex: 1 },
  bell: { color: "#0f172a", fontSize: 26 },
  avatar: {
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  avatarText: { color: "#006b75", fontWeight: "800" },
  heroCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14
  },
  currencyRow: { alignItems: "center", flexDirection: "row", gap: 8, marginBottom: 14 },
  currencyBlock: { flex: 1 },
  currencyBlockRight: { alignItems: "flex-end", flex: 1 },
  muted: { color: "#64748b", fontSize: 12 },
  country: { color: "#0f172a", fontSize: 17, fontWeight: "700", marginTop: 4 },
  swapButton: {
    alignItems: "center",
    borderColor: "#dbe4e8",
    borderRadius: 12,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  swapText: { color: "#0f172a", fontSize: 22 },
  amountBox: {
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    padding: 14
  },
  amountCol: { flex: 1 },
  amount: { color: "#0f172a", fontSize: 24, fontWeight: "800", marginVertical: 8 },
  divider: { backgroundColor: "#dbe4e8", marginHorizontal: 12, width: 1 },
  small: { color: "#64748b", fontSize: 12, lineHeight: 18 },
  saving: { color: "#008457", fontSize: 12, fontWeight: "700" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  chipActive: { backgroundColor: "#006b75", borderColor: "#006b75" },
  chipText: { color: "#0f172a", fontWeight: "700" },
  chipTextActive: { color: "#ffffff" },
  searchCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
    padding: 14
  },
  searchRow: { alignItems: "center", flexDirection: "row", gap: 8, marginTop: 10 },
  input: {
    borderColor: "#dbe4e8",
    borderRadius: 12,
    borderWidth: 1,
    color: "#0f172a",
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 11
  },
  smallButton: { backgroundColor: "#006b75", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  smallButtonText: { color: "#ffffff", fontWeight: "800" },
  locationButton: {
    alignItems: "center",
    backgroundColor: "#e8f7f3",
    borderRadius: 12,
    marginTop: 10,
    padding: 12
  },
  locationText: { color: "#006b75", fontWeight: "800" },
  compliance: {
    alignItems: "center",
    backgroundColor: "#e8f7f3",
    borderColor: "#b8ddd4",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    padding: 14
  },
  shield: {
    alignItems: "center",
    borderColor: "#049485",
    borderRadius: 16,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  shieldText: { color: "#049485", fontWeight: "900" },
  complianceCopy: { flex: 1 },
  complianceTitle: { color: "#0f172a", fontSize: 14, fontWeight: "800" },
  complianceText: { color: "#334155", fontSize: 12, lineHeight: 18, marginTop: 3 },
  toolbar: { alignItems: "center", flexDirection: "row", gap: 8, marginTop: 16 },
  segment: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 11
  },
  segmentActive: { borderColor: "#049485", shadowColor: "#006b75", shadowOpacity: 0.12, shadowRadius: 8 },
  segmentText: { color: "#0f172a", fontWeight: "700" },
  segmentActiveText: { color: "#006b75", fontWeight: "800" },
  sortRow: { gap: 8, paddingVertical: 12 },
  sortChip: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  sectionHeader: { gap: 4, marginTop: 4 },
  sectionTitle: { color: "#0f172a", fontSize: 16, fontWeight: "800" },
  updated: { color: "#64748b", fontSize: 12, lineHeight: 17 },
  mapCard: {
    backgroundColor: "#dff5f1",
    borderColor: "#049485",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    padding: 14
  },
  mapTitle: { color: "#0f172a", fontSize: 15, fontWeight: "900" },
  mapPin: { backgroundColor: "#ffffff", borderRadius: 12, marginTop: 10, padding: 12 },
  partnerCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    padding: 14
  },
  partnerCardBest: { borderColor: "#049485", borderWidth: 1.5 },
  partnerTop: { alignItems: "center", flexDirection: "row", gap: 10 },
  logoCircle: {
    alignItems: "center",
    backgroundColor: "#006b75",
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  logoText: { color: "#ffffff", fontSize: 17, fontWeight: "900" },
  partnerNameBlock: { flex: 1 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#d9fbe8",
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 7,
    paddingVertical: 2
  },
  badgeText: { color: "#008457", fontSize: 11, fontWeight: "800" },
  partnerName: { color: "#0f172a", fontSize: 14, fontWeight: "800" },
  selectButton: { backgroundColor: "#006b75", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  selectText: { color: "#ffffff", fontWeight: "800" },
  metricGrid: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  metric: { color: "#0f172a", fontSize: 14, fontWeight: "800", marginTop: 4 },
  fulfilment: { color: "#0f172a", fontSize: 13, fontWeight: "800", marginTop: 12 },
  warning: { color: "#b45309", fontSize: 12, fontWeight: "700", marginTop: 10 },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#006b75",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    padding: 10
  },
  secondaryButtonText: { color: "#006b75", fontWeight: "800" },
  progressCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
    padding: 14
  },
  stepRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  stepItem: { alignItems: "center", flex: 1 },
  stepDot: {
    alignItems: "center",
    borderColor: "#cbd5e1",
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  stepDotActive: { backgroundColor: "#006b75", borderColor: "#006b75" },
  stepNum: { color: "#64748b", fontWeight: "800" },
  stepNumActive: { color: "#ffffff" },
  stepLabel: { color: "#64748b", fontSize: 10, marginTop: 6, textAlign: "center" },
  lockBox: { borderColor: "#dbe4e8", borderRadius: 12, borderWidth: 1, marginTop: 14, padding: 12 },
  aiCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginTop: 16,
    padding: 14
  },
  aiCopy: { color: "#334155", fontSize: 13, lineHeight: 20 },
  recommendBox: { backgroundColor: "#e8f7f3", borderRadius: 12, padding: 14 },
  recommend: { color: "#0f172a", fontSize: 22, fontWeight: "900", marginVertical: 8 },
  planButton: { alignItems: "center", backgroundColor: "#006b75", borderRadius: 10, marginTop: 6, padding: 12 },
  footerNote: { color: "#64748b", fontSize: 12, lineHeight: 18, marginTop: 14, textAlign: "center" }
});
