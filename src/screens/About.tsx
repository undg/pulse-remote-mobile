import { ScrollView, View, Text, StyleSheet } from "react-native";
import { LoadingOrError } from "components/LoadingOrError";
import { useConfig } from "config/storage";
import { useVolumeStore } from "state/volume";
import { useTheme } from "../theme";

const placeholder = "Not available";

export function AboutScreen() {
  const { colors } = useTheme();
  const { loading, hasUrl, serverUrl } = useConfig();
  const { buildInfo, wsStatus, reconnect } = useVolumeStore(serverUrl);

  if (loading) {
    return <LoadingOrError loading />;
  }

  if (!hasUrl || !serverUrl) {
    return (
      <LoadingOrError error="Please set a hostname in Config to connect." />
    );
  }

  if (wsStatus === "Closed" || wsStatus === "Closing") {
    return <LoadingOrError error="Connection lost" onRetry={reconnect} />;
  }

  const rows = [
    { label: "Version", value: buildInfo?.gitVersion },
    { label: "Commit", value: buildInfo?.gitCommit },
    { label: "Platform", value: buildInfo?.platform },
    { label: "Build Date", value: buildInfo?.buildDate },
    { label: "Go Version", value: buildInfo?.goVersion },
    { label: "Compiler", value: buildInfo?.compiler },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Server info</Text>
        {rows.map((row) => {
          const value =
            row.value && row.value.trim().length ? row.value : placeholder;
          return (
            <View key={row.label} style={styles.row}>
              <Text style={[styles.label, { color: colors.muted }]}>
                {row.label}
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: value === placeholder ? colors.muted : colors.text },
                ]}
              >
                {value}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  card: { borderRadius: 12, padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: "700" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "600" },
});
