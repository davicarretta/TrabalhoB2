import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { supabase } from "../supabaseClient";

export default function SignUpScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpWithEmail = async () => {
    console.log("Tentando cadastrar...");
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.log("Erro no cadastro:", error);
      Alert.alert("Erro no cadastro", error.message);
    } else {
      console.log("Cadastro realizado com sucesso!");
      Alert.alert("Sucesso", "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar.");
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.signupButton} onPress={signUpWithEmail}>
        <Text style={styles.signupButtonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.signupButton, styles.backButton]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.signupButtonText}>Voltar para Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#e0f7fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1F2C73",
  },
  input: {
    width: "50%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  signupButton: {
    width: "50%",
    height: 50,
    backgroundColor: "#00796b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#004d40",
    marginTop: 10,
  },
});
