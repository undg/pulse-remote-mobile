import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useTheme } from "../theme";
import type { ThemePreference } from "../theme";
import { useConfig } from "config/storage";

export function ConfigScreen() {
  const { config, serverUrl, loading, updateConfig, resetConfig } = useConfig();
  const { colors, preference, setPreference } = useTheme();
  const [hostname, setHostname] = useState(config.hostname);
  const [port, setPort] = useState(config.port);
  const [endpoint, setEndpoint] = useState(config.endpoint);
  const [minVolume, setMinVolume] = useState(String(config.minVolume));
  const [maxVolume, setMaxVolume] = useState(String(config.maxVolume));
  const [stepVolume, setStepVolume] = useState(String(config.stepVolume));
  const [showMonitors, setShowMonitors] = useState(config.showMonitoredSources);
  const [bottomPadding, setBottomPadding] = useState(32);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [themeChoice, setThemeChoice] = useState<ThemePreference>(preference);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardVisible(true);
      setBottomPadding(Math.max(32, e.endCoordinates.height - 12));
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      setBottomPadding(32);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSave = () => {
    updateConfig({
      hostname,
      port,
      endpoint,
      minVolume: Number(minVolume),
      maxVolume: Number(maxVolume),
      stepVolume: Number(stepVolume),
      showMonitoredSources: showMonitors,
    });
  };

  const handleReset = () => {
    resetConfig();
    setHostname("192.168.1.93");
    setPort("8448");
    setEndpoint("/api/v1/ws");
    setMinVolume("0");
    setMaxVolume("150");
    setStepVolume("5");
    setShowMonitors(true);
  };

  const focusScroll = (y: number) => {
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  const actionsStyle = keyboardVisible
    ? [styles.actions, styles.stickyActions]
    : styles.actions;

  const selectTheme = (next: ThemePreference) => {
    setThemeChoice(next);
    setPreference(next);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading config...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: bottomPadding, backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      >
        <Text style={[styles.label, { color: colors.text }]}>Hostname</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={hostname}
          onFocus={() => focusScroll(0)}
          onChangeText={(text) => setHostname(text)}
          placeholder="192.168.x.x"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: colors.text }]}>Port</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={port}
          onFocus={() => focusScroll(80)}
          onChangeText={(text) => setPort(text)}
          keyboardType="numeric"
          placeholderTextColor={colors.muted}
        />

        <Text style={[styles.label, { color: colors.text }]}>Endpoint</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={endpoint}
          onFocus={() => focusScroll(160)}
          onChangeText={(text) => setEndpoint(text)}
          autoCapitalize="none"
          placeholderTextColor={colors.muted}
        />

        <Text style={[styles.label, { color: colors.text }]}>Server URL</Text>
        <Text
          style={[
            styles.code,
            { backgroundColor: colors.surfaceMuted, color: colors.text },
          ]}
        >
          {serverUrl || "Not set"}
        </Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={[styles.label, { color: colors.text }]}>
              Min volume
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              value={minVolume}
              onFocus={() => focusScroll(260)}
              onChangeText={(text) => setMinVolume(text)}
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.col}>
            <Text style={[styles.label, { color: colors.text }]}>
              Max volume
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              value={maxVolume}
              onFocus={() => focusScroll(260)}
              onChangeText={(text) => setMaxVolume(text)}
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.col}>
            <Text style={[styles.label, { color: colors.text }]}>Step</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              value={stepVolume}
              onFocus={() => focusScroll(260)}
              onChangeText={(text) => setStepVolume(text)}
              keyboardType="numeric"
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={[styles.label, { color: colors.text }]}>
            Show monitored sources
          </Text>
          <Switch
            value={showMonitors}
            onValueChange={(value) => setShowMonitors(value)}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={showMonitors ? colors.primary : undefined}
          />
        </View>

        <View style={styles.rowBetween}>
          <Text style={[styles.label, { color: colors.text }]}>Theme</Text>
          <View style={styles.themeRow}>
            {(["system", "light", "dark"] as ThemePreference[]).map(
              (option) => {
                const active = themeChoice === option;
                return (
                  <Pressable
                    key={option}
                    style={[
                      styles.themeChip,
                      {
                        backgroundColor: active
                          ? colors.buttonPrimary
                          : colors.surfaceMuted,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => selectTheme(option)}
                  >
                    <Text
                      style={[
                        styles.themeChipText,
                        {
                          color: active
                            ? colors.buttonPrimaryText
                            : colors.text,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>
        </View>

        <View style={actionsStyle}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
            onPress={handleSave}
          >
            <Text
              style={[styles.buttonText, { color: colors.buttonPrimaryText }]}
            >
              Save
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: colors.error }]}
            onPress={handleReset}
          >
            <Text
              style={[styles.buttonText, { color: colors.buttonPrimaryText }]}
            >
              Reset
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10 },
  label: { fontWeight: "600", marginBottom: 4 },
  code: { padding: 10, borderRadius: 8, fontFamily: "monospace" },
  row: { flexDirection: "row", gap: 8 },
  col: { flex: 1 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  themeRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  themeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeChipText: { fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  stickyActions: { paddingBottom: 0 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  save: { backgroundColor: "#16a34a" },
  reset: { backgroundColor: "#ef4444" },
  buttonText: { color: "white", fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
