import { Link, router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaskInput from "react-native-mask-input";
import { useMultiStepStore } from "@/store/useFormStore";
import api from "@/api/axiosInstance";

const FormularioCompleto = () => {
  // Estados consolidados em um único objeto
  const [formData, setFormData] = useState({
    // Dados da primeira etapa
    matricula: "",
    escola: "",
    irmaos: "",
    irmaosNomes: "",
    especialista: "",
    especialistaTipo: "",
    alergias: "",
    alergiaTipo: "",
    medicamento: "",
    medicamentoTipo: "",

    // Dados da segunda etapa
    reside: "",
    respNome: "",
    respTelefone: "",
    pessoasAutorizadas: "",
  });

  const { clearAll } = useMultiStepStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const telefoneMask = [
    "(",
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  const handleChange = useCallback((field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateStep1 = () => {
    if (!formData.matricula) {
      Alert.alert("Atenção", "Selecione o tipo de matrícula!");
      return false;
    }
    if (
      (formData.matricula === "transferencia_municipal_estadual" ||
        formData.matricula === "transferencia_particular") &&
      !formData.escola.trim()
    ) {
      Alert.alert("Atenção", "Informe o nome da escola anterior!");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.reside.trim()) {
      Alert.alert("Atenção", "Informe com quem o aluno reside!");
      return false;
    }
    if (!formData.respNome.trim()) {
      Alert.alert("Atenção", "Informe o nome do responsável financeiro!");
      return false;
    }
    if (!formData.respTelefone.trim() || formData.respTelefone.length < 14) {
      Alert.alert("Atenção", "Informe um telefone válido para o responsável!");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleSubmitAll = async () => {
    if (!validateStep2()) return;

    setLoading(true);

    const stepsData = useMultiStepStore.getState().stepsData;

    try {
      if (stepsData.aluno) {
        await api.post("/alunos", stepsData.aluno);
      }
      if (stepsData.mae) {
        await api.post("/maes", stepsData.mae);
      }
      if (stepsData.pai) {
        await api.post("/pais", stepsData.pai);
      }
      // Envie os dados do formulário de observações (formData local)
      await api.post("/observacoes", formData);

      clearAll();
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
        { text: "OK", onPress: () => router.push("/") },
      ]);
    } catch (err) {
      Alert.alert("Erro", "Falha no envio. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 ? (
        <>
          {/* Seção Observações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>

            {/* Matrícula */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Matrícula</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.matricula}
                  onValueChange={(value) => handleChange("matricula", value)}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Inicial" value="inicial" />
                  <Picker.Item
                    label="Transferência Municipal/Estadual"
                    value="transferencia_municipal_estadual"
                  />
                  <Picker.Item
                    label="Transferência Particular"
                    value="transferencia_particular"
                  />
                </Picker>
              </View>
              {(formData.matricula === "transferencia_municipal_estadual" ||
                formData.matricula === "transferencia_particular") && (
                <TextInput
                  style={styles.input}
                  placeholder="Qual Escola"
                  value={formData.escola}
                  onChangeText={(value) => handleChange("escola", value)}
                />
              )}
            </View>

            {/* Irmão(s) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Irmão(s)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.irmaos}
                  onValueChange={(value) => handleChange("irmaos", value)}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Sim" value="sim" />
                  <Picker.Item label="Não" value="nao" />
                </Picker>
              </View>
              {formData.irmaos === "sim" && (
                <TextInput
                  style={styles.input}
                  placeholder="Qual(s) Irmão(s)?"
                  value={formData.irmaosNomes}
                  onChangeText={(value) => handleChange("irmaosNomes", value)}
                />
              )}
            </View>

            {/* Especialista */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Especialista</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.especialista}
                  onValueChange={(value) => handleChange("especialista", value)}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Sim" value="sim" />
                  <Picker.Item label="Não" value="nao" />
                </Picker>
              </View>
              {formData.especialista === "sim" && (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Neurologista, Fonoaudiólogo"
                  value={formData.especialistaTipo}
                  onChangeText={(value) =>
                    handleChange("especialistaTipo", value)
                  }
                />
              )}
            </View>

            {/* Alergias */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alergias</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.alergias}
                  onValueChange={(value) => handleChange("alergias", value)}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Sim" value="sim" />
                  <Picker.Item label="Não" value="nao" />
                </Picker>
              </View>
              {formData.alergias === "sim" && (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Alimentação, Remédios..."
                  value={formData.alergiaTipo}
                  onChangeText={(value) => handleChange("alergiaTipo", value)}
                />
              )}
            </View>

            {/* Medicamento em Uso */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medicamento em Uso</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.medicamento}
                  onValueChange={(value) => handleChange("medicamento", value)}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Selecione" value="" />
                  <Picker.Item label="Sim" value="sim" />
                  <Picker.Item label="Não" value="nao" />
                </Picker>
              </View>
              {formData.medicamento === "sim" && (
                <TextInput
                  style={styles.input}
                  placeholder="Qual medicamento?"
                  value={formData.medicamentoTipo}
                  onChangeText={(value) =>
                    handleChange("medicamentoTipo", value)
                  }
                />
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleNextStep}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Seção Final */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reside Com</Text>
            <TextInput
              style={styles.inputFull}
              placeholder="Ex: Pai, Mãe, Avós..."
              value={formData.reside}
              onChangeText={(v) => handleChange("reside", v)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsável Financeiro</Text>
            <View style={styles.row}>
              <TextInput
                style={styles.input}
                placeholder="Nome do Responsável"
                value={formData.respNome}
                onChangeText={(v) => handleChange("respNome", v)}
              />
              <MaskInput
                style={styles.input}
                placeholder="Telefone"
                value={formData.respTelefone}
                onChangeText={(v) => handleChange("respTelefone", v)}
                mask={telefoneMask}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Pessoas Autorizadas a Buscar
            </Text>
            <TextInput
              style={styles.inputFull}
              placeholder="Nomes completos separados por vírgula"
              value={formData.pessoasAutorizadas}
              onChangeText={(v) => handleChange("pessoasAutorizadas", v)}
              multiline
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={() => setStep(1)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitAll}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    color: "#902121",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  inputFull: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#8B0000",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
    flex: 1,
  },
  backButton: {
    backgroundColor: "#902121",
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormularioCompleto;
