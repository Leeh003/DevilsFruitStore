// src/screens/InsertCategoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { insertCategories, getDBConnection, initDB } from '../database/Database'; 

const InsertCategoryScreen = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    initDB();
  }, []);

  const handleInsertCategory = async () => {
    try {
      const db = await getDBConnection();
      const result = await insertCategories(db, nome, descricao);
      Alert.alert("Sucesso", "Categoria inserida com sucesso!");
      // Limpar os campos após a inserção
      setNome('');
      setDescricao('');
      setIsSub(false);
      setMainCat('');
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível inserir a categoria");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome da Categoria"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button
        title="Inserir Categoria"
        onPress={handleInsertCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
});

export default InsertCategoryScreen;
