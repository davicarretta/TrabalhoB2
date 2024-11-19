import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, TouchableOpacity, StyleSheet, View, ActivityIndicator } from "react-native";
import { supabase } from "../supabaseClient";

type Grupo = {
  id: string;
  nome: string;
  descricao: string;
};

type Avaliacao = {
  grupo_id: string;
  pontuacao: number;
  feedback: string;
};

export default function HomeScreen({ navigation }: any) {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<{ [key: string]: Avaliacao }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const { data: gruposData, error: gruposError } = await supabase.from("grupos").select("*");
      if (gruposError) throw gruposError;

      const { data: avaliacoesData, error: avaliacoesError } = await supabase.from("avaliacoes").select("*");
      if (avaliacoesError) throw avaliacoesError;

      const avaliacoesMap: { [key: string]: Avaliacao } = {};
      avaliacoesData.forEach((avaliacao: Avaliacao) => {
        avaliacoesMap[avaliacao.grupo_id] = avaliacao;
      });

      setGrupos(gruposData);
      setAvaliacoes(avaliacoesMap);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  const renderGroup = ({ item }: { item: Grupo }) => (
    <TouchableOpacity onPress={() => navigation.navigate("GroupDetails", { groupId: item.id })}>
      <View style={styles.card}>
        <Text style={styles.groupName}>{item.nome}</Text>
        <Text style={styles.groupDescription}>{item.descricao}</Text>
        {avaliacoes[item.id] && (
          <View style={styles.evaluationContainer}>
            <Text style={styles.evaluationScore}>Nota: {avaliacoes[item.id].pontuacao}/10</Text>
            <Text style={styles.evaluationFeedback}>{avaliacoes[item.id].feedback}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1F2C73" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={grupos}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e0f7fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  card: {
    padding: 20,
    marginVertical: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  groupName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2C73",
    marginBottom: 8,
    textAlign: "left",
  },
  groupDescription: {
    fontSize: 16,
    color: "#58608C",
    marginBottom: 12,
    textAlign: "left",
  },
  evaluationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
  },
  evaluationScore: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2C73",
  },
  evaluationFeedback: {
    fontSize: 14,
    color: "#58608C",
    marginTop: 6,
  },
});
