import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows } from "../../constants/theme";
import { Avatar, Button, Card } from "../../components/ui";
import { getAvatarUri } from "../../constants/avatars";
import type { RootStackScreenProps } from "../../navigation/types";

interface LineItem {
  desc: string;
  qty: number;
  unit: string;
  price: number;
}

const stepLabels = ["Client", "Lignes", "Envoi"];

const missionTypes = ["Plomberie", "Chauffage", "Sanitaire", "Urgence"];

/* ── Mock dossiers existants ── */
const existingDossiers = [
  { id: "DEV-2026-089", client: "Pierre Martin", type: "Plomberie", date: "15 mars 2026", amount: "320,00€", status: "En cours" },
  { id: "DEV-2026-085", client: "Sophie Lefèvre", type: "Chauffage", date: "10 mars 2026", amount: "475,00€", status: "Terminé" },
  { id: "DEV-2026-078", client: "Caroline Durand", type: "Plomberie", date: "2 mars 2026", amount: "280,00€", status: "En cours" },
  { id: "DEV-2026-072", client: "Antoine Moreau", type: "Sanitaire", date: "22 fév 2026", amount: "195,00€", status: "Terminé" },
  { id: "DEV-2026-065", client: "Amélie R.", type: "Chauffage", date: "15 fév 2026", amount: "650,00€", status: "Validé" },
  { id: "DEV-2026-058", client: "Luc D.", type: "Urgence", date: "8 fév 2026", amount: "180,00€", status: "Terminé" },
];

export function CreateQuoteScreen({
  navigation,
}: RootStackScreenProps<"CreateQuote">) {
  const [step, setStep] = useState(0);
  const [isComplementary, setIsComplementary] = useState(false);
  const [linkedDevis, setLinkedDevis] = useState<string | null>(null);
  const [linkedClient, setLinkedClient] = useState<string | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [dossierSearch, setDossierSearch] = useState("");
  const [clientName, setClientName] = useState("Caroline Lefèvre");
  const [clientEmail, setClientEmail] = useState("caroline.l@email.com");
  const [clientPhone, setClientPhone] = useState("06 12 34 56 78");
  const [clientAddress, setClientAddress] = useState("12 rue de Clichy, Paris 9e");
  const [selectedType, setSelectedType] = useState(0);
  const [lines, setLines] = useState<LineItem[]>([
    { desc: "Remplacement robinet mitigeur", qty: 1, unit: "u", price: 85 },
    { desc: "Main d'œuvre", qty: 2, unit: "h", price: 65 },
  ]);
  const [validityIdx, setValidityIdx] = useState(1);
  const [message, setMessage] = useState(
    "Bonjour Mme Lefèvre, voici le devis pour l'intervention."
  );

  const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tva = total * 0.1;
  const ttc = total + tva;

  const addLine = () => {
    setLines([...lines, { desc: "", qty: 1, unit: "u", price: 0 }]);
  };

  const removeLine = (idx: number) => {
    setLines(lines.filter((_, i) => i !== idx));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Back header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}
        >
          <Text style={styles.backIcon}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isComplementary ? "Devis complémentaire" : "Créer un devis"}</Text>
      </View>

      {/* Progress steps */}
      <View style={styles.progressRow}>
        {stepLabels.map((s, i) => (
          <View key={i} style={styles.progressItem}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: i <= step ? Colors.forest : Colors.border },
              ]}
            />
            <Text
              style={[
                styles.progressLabel,
                {
                  color: i <= step ? Colors.forest : Colors.textHint,
                  fontFamily: i === step ? "Manrope_700Bold" : "DMSans_400Regular",
                },
              ]}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 0: Client */}
        {step === 0 && (
          <View>
            {/* Complementary devis option */}
            <TouchableOpacity
              style={[
                styles.complementaryToggle,
                isComplementary && styles.complementaryToggleActive,
              ]}
              activeOpacity={0.85}
              onPress={() => {
                if (isComplementary) {
                  setIsComplementary(false);
                  setLinkedDevis(null);
                  setLinkedClient(null);
                } else {
                  setDossierSearch("");
                  setDossierModalOpen(true);
                }
              }}
            >
              <MaterialCommunityIcons
                name={isComplementary ? "link-variant" : "plus-circle-outline"}
                size={18}
                color={isComplementary ? Colors.forest : Colors.textSecondary}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.complementaryToggleTitle, isComplementary && { color: Colors.forest }]}>
                  Devis complémentaire
                </Text>
                <Text style={styles.complementaryToggleDesc}>
                  {isComplementary
                    ? `Lié au dossier ${linkedDevis} — ${linkedClient}`
                    : "Lier ce devis à un dossier existant"}
                </Text>
              </View>
              <View style={[styles.complementaryCheck, isComplementary && styles.complementaryCheckActive]}>
                {isComplementary && <Text style={{ color: Colors.white, fontSize: 12, fontWeight: "700" }}>✓</Text>}
              </View>
            </TouchableOpacity>

            {isComplementary && (
              <View style={styles.complementaryInfo}>
                <MaterialCommunityIcons name="information-outline" size={13} color={Colors.forest} />
                <Text style={styles.complementaryInfoText}>
                  Ce devis sera rattaché au même dossier. Le client recevra une notification et pourra accepter les deux devis séparément.
                </Text>
              </View>
            )}

            {[
              { label: "Nom du client", value: clientName, set: setClientName },
              { label: "Email", value: clientEmail, set: setClientEmail },
              { label: "Téléphone", value: clientPhone, set: setClientPhone },
              { label: "Adresse", value: clientAddress, set: setClientAddress },
            ].map((f, i) => (
              <View key={i} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={f.value}
                  onChangeText={f.set}
                  placeholderTextColor={Colors.textHint}
                />
              </View>
            ))}

            <Text style={styles.fieldLabel}>Type de mission</Text>
            <View style={styles.typeRow}>
              {missionTypes.map((t, i) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedType(i)}
                  style={[
                    styles.typeBtn,
                    selectedType === i && styles.typeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBtnText,
                      selectedType === i && styles.typeBtnTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Suivant"
              onPress={() => setStep(1)}
              fullWidth
              size="lg"
            />
          </View>
        )}

        {/* Step 1: Lines */}
        {step === 1 && (
          <View>
            <Text style={styles.linesSectionTitle}>Lignes du devis</Text>
            {lines.map((l, i) => (
              <View key={i} style={styles.lineCard}>
                <View style={styles.lineTop}>
                  <Text style={styles.lineDesc}>{l.desc || "(nouvelle ligne)"}</Text>
                  <TouchableOpacity onPress={() => removeLine(i)}>
                    <Text style={styles.lineRemove}>{"✕"}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.lineBottom}>
                  <Text style={styles.lineQtyPrice}>
                    {l.qty} {l.unit} × {l.price}€
                  </Text>
                  <Text style={styles.lineTotal}>
                    {(l.qty * l.price).toFixed(2)}€
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addLineBtn} onPress={addLine}>
              <Text style={styles.addLineText}>+ Ajouter une ligne</Text>
            </TouchableOpacity>

            {/* Totals */}
            <View style={styles.totalsCard}>
              {[
                { label: "Sous-total HT", value: `${total.toFixed(2)}€`, bold: false },
                { label: "TVA (10%)", value: `${tva.toFixed(2)}€`, bold: false },
                { label: "Total TTC", value: `${ttc.toFixed(2)}€`, bold: true },
              ].map((row, i) => (
                <View
                  key={i}
                  style={[styles.totalRow, i > 0 && styles.totalRowBorder]}
                >
                  <Text
                    style={[
                      styles.totalLabel,
                      row.bold && styles.totalLabelBold,
                    ]}
                  >
                    {row.label}
                  </Text>
                  <Text
                    style={[
                      styles.totalValue,
                      row.bold && styles.totalValueBold,
                    ]}
                  >
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>

            <Button
              title="Suivant"
              onPress={() => setStep(2)}
              fullWidth
              size="lg"
            />
          </View>
        )}

        {/* Step 2: Send */}
        {step === 2 && (
          <View>
            <Text style={styles.fieldLabel}>Validité du devis</Text>
            <View style={styles.validityRow}>
              {["7 jours", "14 jours", "30 jours"].map((d, i) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setValidityIdx(i)}
                  style={[
                    styles.validityBtn,
                    validityIdx === i && styles.validityBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.validityText,
                      validityIdx === i && styles.validityTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.messageInput}
              multiline
              value={message}
              onChangeText={setMessage}
              placeholder="Message personnalisé au client..."
              placeholderTextColor={Colors.textHint}
            />

            <View style={styles.escrowInfo}>
              <Text style={styles.escrowIcon}><MaterialCommunityIcons name="shield-lock" size={18} color={Colors.forest} /></Text>
              <Text style={styles.escrowText}>
                Le client recevra le devis sur son espace Nova et paiera via séquestre
              </Text>
            </View>

            <Button
              title="Envoyer le devis au client"
              onPress={() => navigation.navigate("QuoteSignature", { devisId: "DEV-2026-089" })}
              fullWidth
              size="lg"
            />
          </View>
        )}
      </ScrollView>

      {/* ── Dossier search modal ── */}
      <DossierSearchModal
        visible={dossierModalOpen}
        search={dossierSearch}
        onSearchChange={setDossierSearch}
        onSelect={(dossier) => {
          setLinkedDevis(dossier.id);
          setLinkedClient(dossier.client);
          setIsComplementary(true);
          setDossierModalOpen(false);
          // Pre-fill client info from selected dossier
          setClientName(dossier.client);
        }}
        onClose={() => setDossierModalOpen(false)}
      />
    </SafeAreaView>
  );
}

/* ── Dossier Search Modal ── */
function DossierSearchModal({
  visible,
  search,
  onSearchChange,
  onSelect,
  onClose,
}: {
  visible: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (d: typeof existingDossiers[0]) => void;
  onClose: () => void;
}) {
  const filtered = useMemo(() => {
    if (!search.trim()) return existingDossiers;
    const q = search.toLowerCase();
    return existingDossiers.filter(
      (d) =>
        d.client.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={modalStyles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <MaterialCommunityIcons name="close" size={20} color={Colors.navy} />
          </TouchableOpacity>
          <Text style={modalStyles.title}>Lier à un dossier</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Search bar */}
        <View style={modalStyles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.textMuted} />
          <TextInput
            style={modalStyles.searchInput}
            placeholder="Nom du client ou n° de dossier..."
            placeholderTextColor={Colors.textHint}
            value={search}
            onChangeText={onSearchChange}
            autoFocus
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange("")}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        <ScrollView style={modalStyles.list} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={modalStyles.emptyWrap}>
              <MaterialCommunityIcons name="file-search-outline" size={36} color={Colors.border} />
              <Text style={modalStyles.emptyText}>Aucun dossier trouvé</Text>
              <Text style={modalStyles.emptyHint}>Essayez un autre nom ou numéro</Text>
            </View>
          ) : (
            filtered.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={modalStyles.dossierCard}
                activeOpacity={0.85}
                onPress={() => onSelect(d)}
              >
                <Avatar name={d.client} size={42} radius={14} uri={getAvatarUri(d.client)} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={modalStyles.dossierTopRow}>
                    <Text style={modalStyles.dossierClient} numberOfLines={1}>{d.client}</Text>
                    <Text style={modalStyles.dossierAmount}>{d.amount}</Text>
                  </View>
                  <View style={modalStyles.dossierBottomRow}>
                    <Text style={modalStyles.dossierId}>{d.id}</Text>
                    <Text style={modalStyles.dossierDot}>{"•"}</Text>
                    <Text style={modalStyles.dossierType}>{d.type}</Text>
                    <Text style={modalStyles.dossierDot}>{"•"}</Text>
                    <Text style={modalStyles.dossierDate}>{d.date}</Text>
                  </View>
                  <View style={[modalStyles.dossierStatusBadge, {
                    backgroundColor:
                      d.status === "En cours" ? "rgba(245,166,35,0.1)" :
                      d.status === "Validé" ? "rgba(27,107,78,0.1)" :
                      "rgba(34,200,138,0.1)",
                  }]}>
                    <Text style={[modalStyles.dossierStatusText, {
                      color:
                        d.status === "En cours" ? Colors.gold :
                        d.status === "Validé" ? Colors.forest :
                        Colors.success,
                    }]}>{d.status}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 16, paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: Colors.bgPage, alignItems: "center", justifyContent: "center",
  },
  title: { fontFamily: "Manrope_700Bold", fontSize: 17, color: Colors.navy },
  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginHorizontal: 16, marginTop: 14, marginBottom: 10,
    backgroundColor: Colors.white, borderRadius: 14,
    paddingHorizontal: 14, height: 48,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: {
    flex: 1, fontSize: 14, fontFamily: "DMSans_400Regular", color: Colors.navy,
  },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 4 },
  emptyWrap: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontFamily: "DMSans_600SemiBold", fontSize: 15, color: Colors.navy },
  emptyHint: { fontFamily: "DMSans_400Regular", fontSize: 13, color: Colors.textMuted },
  dossierCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: "rgba(10,22,40,0.04)",
    ...Shadows.sm,
  },
  dossierTopRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3,
  },
  dossierClient: { fontFamily: "DMSans_600SemiBold", fontSize: 14, color: Colors.navy, flex: 1, marginRight: 8 },
  dossierAmount: { fontFamily: "DMMono_500Medium", fontSize: 13, color: Colors.navy },
  dossierBottomRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  dossierId: { fontFamily: "DMMono_500Medium", fontSize: 11, color: Colors.forest },
  dossierType: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textSecondary },
  dossierDate: { fontFamily: "DMSans_400Regular", fontSize: 11, color: Colors.textMuted },
  dossierDot: { fontSize: 8, color: Colors.textMuted },
  dossierStatusBadge: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  dossierStatusText: { fontFamily: "DMSans_600SemiBold", fontSize: 10 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPage },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    backgroundColor: "rgba(27,107,78,0.08)",
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 24,
    color: Colors.forest,
    marginTop: -2,
  },
  headerTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
    color: Colors.navy,
  },

  /* Progress */
  progressRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 4,
    marginBottom: 12,
  },
  progressItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  progressBar: {
    height: 3,
    width: "100%",
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  /* Fields */
  /* Complementary toggle */
  complementaryToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  complementaryToggleActive: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderColor: Colors.forest,
    borderWidth: 1.5,
  },
  complementaryToggleTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
  },
  complementaryToggleDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  complementaryCheck: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  complementaryCheckActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  complementaryInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  complementaryInfoText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#14523B",
    flex: 1,
    lineHeight: 16,
  },

  fieldWrap: { marginBottom: 12 },
  fieldLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
    marginBottom: 5,
  },
  fieldInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.lg,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.text,
    backgroundColor: Colors.white,
  },

  /* Type selector */
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  typeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtnActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  typeBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 12.5,
    color: "#4A5568",
  },
  typeBtnTextActive: { color: Colors.white },

  /* Lines */
  linesSectionTitle: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.navy,
    marginBottom: 12,
  },
  lineCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  lineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  lineDesc: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
    flex: 1,
  },
  lineRemove: {
    fontSize: 14,
    color: Colors.red,
    paddingHorizontal: 4,
  },
  lineBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lineQtyPrice: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: Colors.textHint,
  },
  lineTotal: {
    fontFamily: "DMMono_500Medium",
    fontSize: 13,
    color: Colors.navy,
  },
  addLineBtn: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(27,107,78,0.3)",
    alignItems: "center",
    marginBottom: 16,
  },
  addLineText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.forest,
  },

  /* Totals */
  totalsCard: {
    backgroundColor: Colors.white,
    borderRadius: Radii["2xl"],
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(10,22,40,0.04)",
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  totalRowBorder: { borderTopWidth: 1, borderTopColor: Colors.surface },
  totalLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
  },
  totalLabelBold: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: Colors.navy,
  },
  totalValue: {
    fontFamily: "DMMono_500Medium",
    fontSize: 13,
    color: Colors.navy,
  },
  totalValueBold: {
    fontSize: 18,
  },

  /* Validity */
  validityRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  validityBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  validityBtnActive: {
    backgroundColor: Colors.forest,
    borderColor: Colors.forest,
  },
  validityText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.navy,
  },
  validityTextActive: { color: Colors.white },

  /* Message */
  messageInput: {
    height: 80,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.xl,
    padding: 14,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: Colors.text,
    backgroundColor: Colors.white,
    textAlignVertical: "top",
    marginBottom: 12,
  },

  /* Escrow info */
  escrowInfo: {
    backgroundColor: "rgba(27,107,78,0.04)",
    borderRadius: Radii.xl,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(27,107,78,0.08)",
  },
  escrowIcon: { fontSize: 15 },
  escrowText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#14523B",
    flex: 1,
  },
});
