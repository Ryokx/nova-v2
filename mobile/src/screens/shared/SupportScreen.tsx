import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Radii, Shadows, Spacing } from "../../constants/theme";
import type { RootStackScreenProps } from "../../navigation/types";

/* ── Chat mock data ── */
type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    text: "Bonjour ! Je suis l'assistant Nova. Comment puis-je vous aider ?",
    sender: "bot",
    timestamp: "10:00",
  },
  {
    id: "2",
    text: "Bonjour, j'ai une question sur le paiement par séquestre.",
    sender: "user",
    timestamp: "10:01",
  },
  {
    id: "3",
    text: "Bien sûr ! Le séquestre fonctionne ainsi : le client paie 100% à la signature du devis. L'argent est bloqué jusqu'à validation de l'intervention. L'artisan est payé sous 48h après validation.",
    sender: "bot",
    timestamp: "10:01",
  },
];

/* ── Email subject tags ── */
const SUBJECT_TAGS = [
  "Paiement",
  "Sequestre",
  "Artisan",
  "Mission",
  "Compte",
  "Bug",
  "Autre",
];

/* ── Tab toggle component ── */
function TabToggle({
  active,
  onChange,
}: {
  active: "chat" | "email";
  onChange: (tab: "chat" | "email") => void;
}) {
  return (
    <View style={tabStyles.container}>
      <TouchableOpacity
        style={[tabStyles.tab, active === "chat" && tabStyles.tabActive]}
        onPress={() => onChange("chat")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            tabStyles.tabText,
            active === "chat" && tabStyles.tabTextActive,
          ]}
        >
          Chat
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[tabStyles.tab, active === "email" && tabStyles.tabActive]}
        onPress={() => onChange("email")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            tabStyles.tabText,
            active === "email" && tabStyles.tabTextActive,
          ]}
        >
          Email
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: 3,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.sm,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  tabText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    fontFamily: "DMSans_600SemiBold",
    color: Colors.forest,
  },
});

/* ── Chat bubble ── */
function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";
  return (
    <View
      style={[
        chatStyles.bubbleRow,
        isUser ? chatStyles.bubbleRowRight : chatStyles.bubbleRowLeft,
      ]}
    >
      <View
        style={[
          chatStyles.bubble,
          isUser ? chatStyles.bubbleUser : chatStyles.bubbleBot,
        ]}
      >
        <Text
          style={[
            chatStyles.bubbleText,
            isUser ? chatStyles.bubbleTextUser : chatStyles.bubbleTextBot,
          ]}
        >
          {message.text}
        </Text>
        <Text
          style={[
            chatStyles.timestamp,
            isUser ? chatStyles.timestampUser : chatStyles.timestampBot,
          ]}
        >
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
}

const chatStyles = StyleSheet.create({
  bubbleRow: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  bubbleRowRight: {
    alignItems: "flex-end",
  },
  bubbleRowLeft: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii["2xl"],
  },
  bubbleUser: {
    backgroundColor: Colors.deepForest,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: Colors.white,
  },
  bubbleTextBot: {
    color: Colors.text,
  },
  timestamp: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    marginTop: 4,
  },
  timestampUser: {
    color: Colors.lightSage,
    textAlign: "right",
  },
  timestampBot: {
    color: Colors.textHint,
  },
});

/* ── Main component ── */
export function SupportScreen({
  navigation,
}: RootStackScreenProps<"Support">) {
  const [activeTab, setActiveTab] = useState<"chat" | "email">("chat");

  /* Chat state */
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const chatListRef = useRef<FlatList>(null);

  /* Email state */
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const ts = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      text: chatInput.trim(),
      sender: "user",
      timestamp: ts,
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        text: "Merci pour votre message. Un conseiller va prendre le relais sous peu. En attendant, n'hésitez pas à préciser votre demande.",
        sender: "bot",
        timestamp: ts,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const sendEmail = () => {
    if (!emailBody.trim()) {
      Alert.alert("Erreur", "Veuillez décrire votre problème.");
      return;
    }
    setEmailSent(true);
  };

  const resetEmail = () => {
    setEmailSent(false);
    setSelectedTags([]);
    setEmailSubject("");
    setEmailBody("");
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>{"‹"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Tab toggle */}
      <TabToggle active={activeTab} onChange={setActiveTab} />

      {/* ── Chat view ── */}
      {activeTab === "chat" && (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          {/* Online indicator */}
          <View style={styles.onlineBar}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>En ligne</Text>
          </View>

          {/* Messages */}
          <FlatList
            ref={chatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              chatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
              <Text style={styles.attachIcon}><MaterialCommunityIcons name="bell" size={22} color={Colors.navy} /></Text>
            </TouchableOpacity>
            <TextInput
              style={styles.chatInput}
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="Écrivez votre message..."
              placeholderTextColor={Colors.textHint}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                !chatInput.trim() && styles.sendBtnDisabled,
              ]}
              onPress={sendChatMessage}
              disabled={!chatInput.trim()}
              activeOpacity={0.7}
            >
              <Text style={styles.sendIcon}>{"↑"}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ── Email view ── */}
      {activeTab === "email" && (
        <ScrollView
          style={styles.emailScroll}
          contentContainerStyle={styles.emailContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {emailSent ? (
            /* Success state */
            <View style={styles.successContainer}>
              <View style={styles.successIconWrap}>
                <Text style={styles.successIcon}>{"✓"}</Text>
              </View>
              <Text style={styles.successTitle}>Message envoyé !</Text>
              <Text style={styles.successDesc}>
                Notre équipe vous répondra sous 24h par email. Vous recevrez une
                notification lorsque votre ticket sera traité.
              </Text>
              <TouchableOpacity
                style={styles.newEmailBtn}
                onPress={resetEmail}
                activeOpacity={0.8}
              >
                <Text style={styles.newEmailBtnText}>
                  Envoyer un autre message
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Subject tags */}
              <Text style={styles.fieldLabel}>Sujet</Text>
              <View style={styles.tagsWrap}>
                {SUBJECT_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedTags.includes(tag) && styles.tagActive,
                    ]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        selectedTags.includes(tag) && styles.tagTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Subject input */}
              <Text style={styles.fieldLabel}>Titre (optionnel)</Text>
              <TextInput
                style={styles.textInput}
                value={emailSubject}
                onChangeText={setEmailSubject}
                placeholder="Résumé de votre demande"
                placeholderTextColor={Colors.textHint}
              />

              {/* Description */}
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={emailBody}
                onChangeText={setEmailBody}
                placeholder="Décrivez votre problème en détail..."
                placeholderTextColor={Colors.textHint}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              {/* Screenshot upload */}
              <Text style={styles.fieldLabel}>
                Capture d'écran (optionnel)
              </Text>
              <TouchableOpacity
                style={styles.uploadArea}
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert("Upload", "Fonctionnalité à venir.")
                }
              >
                <Text style={styles.uploadIcon}><MaterialCommunityIcons name="bell" size={22} color={Colors.navy} /></Text>
                <Text style={styles.uploadText}>
                  Appuyez pour ajouter une capture
                </Text>
              </TouchableOpacity>

              {/* Send button */}
              <TouchableOpacity
                style={[
                  styles.emailSendBtn,
                  !emailBody.trim() && styles.emailSendBtnDisabled,
                ]}
                onPress={sendEmail}
                disabled={!emailBody.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.emailSendBtnText}>Envoyer</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPage,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  backArrow: {
    fontSize: 28,
    color: Colors.text,
    marginTop: -2,
  },
  headerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: Colors.text,
  },

  /* Online */
  onlineBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: Spacing.xs,
  },
  onlineText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.success,
  },

  /* Chat */
  chatContainer: {
    flex: 1,
  },
  chatList: {
    paddingVertical: Spacing.sm,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  attachIcon: {
    fontSize: 18,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.bgPage,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Colors.deepForest,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.border,
  },
  sendIcon: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "700",
  },

  /* Email */
  emailScroll: { flex: 1 },
  emailContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.forest,
  },
  tagText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tagTextActive: {
    color: Colors.forest,
    fontFamily: "DMSans_600SemiBold",
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 140,
    paddingTop: Spacing.md,
  },
  uploadArea: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.border,
    borderRadius: Radii.xl,
    paddingVertical: Spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  uploadIcon: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  uploadText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: Colors.textHint,
  },
  emailSendBtn: {
    backgroundColor: Colors.deepForest,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    marginTop: Spacing["2xl"],
  },
  emailSendBtnDisabled: {
    backgroundColor: Colors.border,
  },
  emailSendBtnText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: Colors.white,
  },

  /* Success */
  successContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
  },
  successIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  successIcon: {
    fontSize: 32,
    color: Colors.forest,
  },
  successTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  successDesc: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing["3xl"],
  },
  newEmailBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing["2xl"],
  },
  newEmailBtnText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: Colors.forest,
  },
});
