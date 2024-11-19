import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { supabase } from '../supabaseClient';

type Props = {
  route: { params: { groupId: string } };
};

type Group = {
  id: string;
  nome: string;
  descricao: string;
  lider_id: string;
};

type Member = {
  id: string;
  nome: string;
};

export default function GroupDetailsScreen({ route }: Props) {
  const { groupId } = route.params;
  const [group, setGroup] = useState<Group | null>(null);
  const [leader, setLeader] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupDetails();
    fetchGroupMembers();
  }, []);

  async function fetchGroupDetails() {
    const { data, error } = await supabase
      .from('grupos')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) {
      console.error('Erro ao buscar detalhes do grupo:', error);
    } else {
      setGroup(data);
      fetchLeader(data.lider_id);
    }
    setLoading(false);
  }

  async function fetchLeader(leaderId: string) {
    const { data, error } = await supabase
      .from('alunos')
      .select('nome')
      .eq('id', leaderId)
      .single();

    if (error) {
      console.error('Erro ao buscar líder do grupo:', error);
    } else {
      setLeader(data?.nome || 'Líder não encontrado');
    }
  }

  async function fetchGroupMembers() {
    const { data, error } = await supabase
      .from('alunos')
      .select('id, nome')
      .eq('grupo_id', groupId);

    if (error) {
      console.error('Erro ao buscar membros do grupo:', error);
    } else {
      setMembers(data);
    }
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00695c" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Grupo não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{group.nome}</Text>
      <Text style={styles.description}>{group.descricao}</Text>
      <View style={styles.divider} />
      <Text style={styles.leader}>
        Líder do Grupo: <Text style={styles.leaderName}>{leader}</Text>
      </Text>
      <View style={styles.divider} />
      <Text style={styles.subtitle}>Membros do Grupo:</Text>
      {members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberCard}>
              <Text style={styles.memberName}>{item.nome}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noMembersText}>Nenhum membro cadastrado no grupo.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#e0f7fa' }, // Cor de fundo mais suave
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0f7fa' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#00695c', textAlign: 'center', marginBottom: 16 },
  description: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 16, lineHeight: 24 },
  divider: { height: 1, backgroundColor: '#b2dfdb', marginVertical: 16 },
  leader: { fontSize: 18, fontWeight: 'bold', color: '#00695c', marginBottom: 16, textAlign: 'center' },
  leaderName: { fontSize: 20, fontWeight: 'bold', color: '#F280B6' },
  subtitle: { fontSize: 20, fontWeight: '600', color: '#00695c', marginBottom: 12 },
  memberCard: {
    backgroundColor: '#00796b', // Cor do fundo dos membros
    padding: 15,
    marginBottom: 10,
    borderRadius: 12, // Bordas mais arredondadas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  memberName: { fontSize: 16, fontWeight: '500', color: '#FFF' },
  noMembersText: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
  errorText: { fontSize: 18, color: '#E74C3C', textAlign: 'center' },
});
