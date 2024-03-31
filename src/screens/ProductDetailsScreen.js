import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker'; 
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native'
import { initDB, insertProduct, updateProduct, deleteProduct, getCategories, getProductById } from '../database/database'; 
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; 
import Header from '../components/Header';

function ProductDetailsScreen({ route }) {
  const { id, nomeEdit, descricaoEdit, valorEdit, categoriaEdit, imagemEdit } = route.params;
  const [nome, setNome] = useState(nomeEdit);
  const [descricao, setDescricao] = useState(descricaoEdit);
  const [valor, setValor] = useState(valorEdit);
  const [categoria, setCategoria] = useState(categoriaEdit);
  const [imagem, setImagem] = useState(imagemEdit);
  const [db, setDB] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await initDB();
        setDB(db);
        const fetchedCategories = await getCategories(db);
        setCategorias(fetchedCategories);
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    };
    initializeDB();
  }, []);

  const renderCategoryOptions = () => {
    return categorias.map((category) => (
      <Picker.Item key={category.id} label={category.nome} value={category.id} />
    ));
  };

  const selectImage = async () => {
    try {
      let result = {};

      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.cancelled) {
        setImagem(result.assets[0].uri);
      }
    } catch (error) {
      alert('Erro ao selecionar image: ' + error.message);
      console.error('Erro ao selecionar imagem:', error);
    }
  };

  const handleSaveOrUpdate = async () => {
    if (id) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      await insertProduct(db, nome, descricao, valor, categoria, imagem);
      Alert.alert("Sucesso", "Produto inserido com sucesso!");
      navigation.navigate('ProductsList', { refresh: true }); // Adicione o parâmetro refresh
    } catch (error) {
      console.error('Erro ao inserir produto:', error);
      Alert.alert("Erro", "Não foi possível inserir o produto");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProduct(db, id, nome, descricao, valor, categoria, imagem);
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");      
      console.log( await getProductById(db, id))
      navigation.navigate('ProductsList', { refresh: true }); 
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      Alert.alert("Erro", "Não foi possível atualizar o produto");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(db, id);
      Alert.alert("Sucesso", "Produto removido com sucesso!");
      navigation.navigate('ProductsList', { refresh: true });
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      Alert.alert("Erro", "Não foi possível remover o produto");
    }
  };

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.imageContainer}>
        {/* Exibir imagem aqui */}
        {imagem ? (
          <TouchableOpacity style={styles.image} onPress={selectImage}>
            <Image source={{ uri: imagem }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.imageSelectButton} onPress={selectImage}>
            <Text style={styles.buttonText}>Selecionar Imagem</Text>
          </TouchableOpacity>
        )}
        
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={String(valor)}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      {/* Picklist de categorias */}
      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
      >
        {/* Opções de categorias */}
        {renderCategoryOptions()}
      </Picker>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveOrUpdate}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholderText: {
    color: '#aaa',
  },
  input: {
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default ProductDetailsScreen;
