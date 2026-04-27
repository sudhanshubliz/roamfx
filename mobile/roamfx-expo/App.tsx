import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const partners = [
  {
    name: "Global Forex Pvt. Ltd.",
    badge: "Best Value",
    receive: "EUR 1,095.20",
    rate: "INR 91.32",
    total: "INR 1,00,220",
    fulfilment: "Airport pickup",
    eta: "T3, DEL - Today, 4:00 PM"
  },
  {
    name: "Travel Currency Exchange",
    badge: "Home Delivery",
    receive: "EUR 1,089.10",
    rate: "INR 90.83",
    total: "INR 1,00,780",
    fulfilment: "Home delivery",
    eta: "Tomorrow, 10:00 AM - 1:00 PM"
  },
  {
    name: "World Forex Services",
    badge: "Verified",
    receive: "EUR 1,084.30",
    rate: "INR 90.43",
    total: "INR 1,01,150",
    fulfilment: "Airport pickup",
    eta: "Tomorrow, 9:00 AM"
  }
];

const steps = ["Enter details", "Choose partner", "Verify & pay", "Confirmation"];

export default function App() {
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
          <Text style={styles.bell}>♡</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AS</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.currencyRow}>
            <View style={styles.currencyBlock}>
              <Text style={styles.muted}>You're in</Text>
              <Text style={styles.country}>🇮🇳 India</Text>
            </View>
            <View style={styles.swapButton}>
              <Text style={styles.swapText}>⇄</Text>
            </View>
            <View style={styles.currencyBlockRight}>
              <Text style={styles.muted}>You need</Text>
              <Text style={styles.country}>🇪🇺 EUR - Euro</Text>
            </View>
          </View>

          <View style={styles.amountBox}>
            <View style={styles.amountCol}>
              <Text style={styles.muted}>You send</Text>
              <Text style={styles.amount}>₹ 1,00,000</Text>
              <Text style={styles.small}>Indian Rupee (INR)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.amountCol}>
              <Text style={styles.muted}>You receive</Text>
              <Text style={styles.amount}>€ 1,095.20</Text>
              <Text style={styles.saving}>Best rate • Save ₹1,650</Text>
            </View>
          </View>
        </View>

        <View style={styles.compliance}>
          <View style={styles.shield}>
            <Text style={styles.shieldText}>✓</Text>
          </View>
          <View style={styles.complianceCopy}>
            <Text style={styles.complianceTitle}>
              Verified authorised forex partners only
            </Text>
            <Text style={styles.complianceText}>
              RoamFX does not support peer-to-peer cash exchange. All bookings go through verified partners.
            </Text>
          </View>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity style={[styles.segment, styles.segmentActive]}>
            <Text style={styles.segmentActiveText}>☷ List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.segment}>
            <Text style={styles.segmentText}>◇ Map</Text>
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.segmentText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best partner rates</Text>
          <Text style={styles.updated}>Updated just now</Text>
        </View>

        {partners.map((partner, index) => (
          <View key={partner.name} style={[styles.partnerCard, index === 0 && styles.partnerCardBest]}>
            <View style={styles.partnerTop}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>FX</Text>
              </View>
              <View style={styles.partnerNameBlock}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{partner.badge}</Text>
                </View>
                <Text style={styles.partnerName}>{partner.name} ✓</Text>
                <Text style={styles.small}>RBI authorised • 4.{8 - index} ★</Text>
              </View>
              <TouchableOpacity style={styles.selectButton}>
                <Text style={styles.selectText}>Select</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.metricGrid}>
              <View>
                <Text style={styles.muted}>You receive</Text>
                <Text style={styles.metric}>{partner.receive}</Text>
              </View>
              <View>
                <Text style={styles.muted}>Rate</Text>
                <Text style={styles.metric}>{partner.rate}</Text>
              </View>
              <View>
                <Text style={styles.muted}>Total cost</Text>
                <Text style={styles.metric}>{partner.total}</Text>
              </View>
            </View>
            <Text style={styles.fulfilment}>{partner.fulfilment}</Text>
            <Text style={styles.small}>{partner.eta}</Text>
          </View>
        ))}

        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Your booking progress</Text>
          <View style={styles.stepRow}>
            {steps.map((step, index) => (
              <View key={step} style={styles.stepItem}>
                <View style={[styles.stepDot, index === 0 && styles.stepDotActive]}>
                  <Text style={[styles.stepNum, index === 0 && styles.stepNumActive]}>{index + 1}</Text>
                </View>
                <Text style={styles.stepLabel}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={styles.lockBox}>
            <Text style={styles.small}>Selected partner</Text>
            <Text style={styles.partnerName}>Global Forex Pvt. Ltd. ✓</Text>
            <Text style={styles.saving}>Rate lock preview: 04:56</Text>
          </View>
        </View>

        <View style={styles.aiCard}>
          <View>
            <Text style={styles.sectionTitle}>AI Travel Money Planner</Text>
            <Text style={styles.aiCopy}>
              Smart cash, card, ATM and safety guidance for international travellers.
            </Text>
            <Text style={styles.small}>Trip: Europe • Travellers: 2 • Style: Leisure</Text>
          </View>
          <View style={styles.recommendBox}>
            <Text style={styles.muted}>Recommended cash</Text>
            <Text style={styles.recommend}>€650 - €750</Text>
            <TouchableOpacity style={styles.planButton}>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#f7faf9"
  },
  container: {
    flex: 1
  },
  content: {
    padding: 14,
    paddingBottom: 28
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingBottom: 12
  },
  menu: {
    color: "#0f172a",
    fontSize: 24
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: "#006b75",
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  brandMarkText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800"
  },
  brand: {
    color: "#0f172a",
    fontSize: 26,
    fontWeight: "800"
  },
  brandAccent: {
    color: "#049485"
  },
  headerSpacer: {
    flex: 1
  },
  bell: {
    color: "#0f172a",
    fontSize: 22
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  avatarText: {
    color: "#006b75",
    fontWeight: "800"
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14
  },
  currencyRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 14
  },
  currencyBlock: {
    flex: 1
  },
  currencyBlockRight: {
    alignItems: "flex-end",
    flex: 1
  },
  muted: {
    color: "#64748b",
    fontSize: 12
  },
  country: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 4
  },
  swapButton: {
    alignItems: "center",
    borderColor: "#dbe4e8",
    borderRadius: 12,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  swapText: {
    color: "#0f172a",
    fontSize: 22
  },
  amountBox: {
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    padding: 14
  },
  amountCol: {
    flex: 1
  },
  amount: {
    color: "#0f172a",
    fontSize: 25,
    fontWeight: "800",
    marginVertical: 8
  },
  divider: {
    backgroundColor: "#dbe4e8",
    marginHorizontal: 12,
    width: 1
  },
  small: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18
  },
  saving: {
    color: "#008457",
    fontSize: 12,
    fontWeight: "700"
  },
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
  shieldText: {
    color: "#049485",
    fontWeight: "900"
  },
  complianceCopy: {
    flex: 1
  },
  complianceTitle: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800"
  },
  complianceText: {
    color: "#334155",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  },
  toolbar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 16
  },
  segment: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 11
  },
  segmentActive: {
    borderColor: "#049485",
    shadowColor: "#006b75",
    shadowOpacity: 0.12,
    shadowRadius: 8
  },
  segmentText: {
    color: "#0f172a",
    fontWeight: "700"
  },
  segmentActiveText: {
    color: "#006b75",
    fontWeight: "800"
  },
  filterButton: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800"
  },
  updated: {
    color: "#64748b",
    fontSize: 12
  },
  partnerCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    padding: 14
  },
  partnerCardBest: {
    borderColor: "#049485",
    borderWidth: 1.5
  },
  partnerTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  logoCircle: {
    alignItems: "center",
    backgroundColor: "#006b75",
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  logoText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "900"
  },
  partnerNameBlock: {
    flex: 1
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#d9fbe8",
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 7,
    paddingVertical: 2
  },
  badgeText: {
    color: "#008457",
    fontSize: 11,
    fontWeight: "800"
  },
  partnerName: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800"
  },
  selectButton: {
    backgroundColor: "#006b75",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11
  },
  selectText: {
    color: "#ffffff",
    fontWeight: "800"
  },
  metricGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14
  },
  metric: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4
  },
  fulfilment: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 12
  },
  progressCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
    padding: 14
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14
  },
  stepItem: {
    alignItems: "center",
    flex: 1
  },
  stepDot: {
    alignItems: "center",
    borderColor: "#cbd5e1",
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  stepDotActive: {
    backgroundColor: "#006b75",
    borderColor: "#006b75"
  },
  stepNum: {
    color: "#64748b",
    fontWeight: "800"
  },
  stepNumActive: {
    color: "#ffffff"
  },
  stepLabel: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 6,
    textAlign: "center"
  },
  lockBox: {
    borderColor: "#dbe4e8",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    padding: 12
  },
  aiCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dbe4e8",
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
    marginTop: 16,
    padding: 14
  },
  aiCopy: {
    color: "#334155",
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 8
  },
  recommendBox: {
    backgroundColor: "#e8f7f3",
    borderRadius: 12,
    padding: 14
  },
  recommend: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 8
  },
  planButton: {
    alignItems: "center",
    backgroundColor: "#006b75",
    borderRadius: 10,
    marginTop: 6,
    padding: 12
  },
  footerNote: {
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
    textAlign: "center"
  }
});
