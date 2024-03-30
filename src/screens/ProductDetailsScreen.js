//ProductDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button, Image, TouchableOpacity, Text, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import * as ImagePicker from 'expo-image-picker'; // Import for image selection
import { initDB, insertProduct, updateProduct, deleteProduct, getCategories } from '../database/database'; 

function ProductDetailsScreen({ route, navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState(null);
  const [db, setDB] = useState(null);
  const [categorias, setCategorias] = useState([]);
  //const { productId } = route.params;
  //const [product, setProduct] = useState(null);


  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await initDB();
        setDB(db);
        fetchCategories(db);
         /*const fetchProduct = async () => {
          const data = await getProductById(productId); // Substitua pela sua lógica de acesso ao SQLite
          setProduct(data);
        };
        fetchProduct();*/
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    };
    initializeDB();
  }, []);

  const fetchCategories = async (db) => {
    try {
      const fetchedCategories = await getCategories(db);
      setCategorias(fetchedCategories); // Definindo as categorias no estado local
    } catch (error) {
      console.error('Erro ao recuperar categorias:', error);
    }
  };

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

  const handleSave = async () => {
    try {
      await insertProduct(db, nome, descricao, valor, categoria);
      Alert.alert("Sucesso", "Produto inserido com sucesso!");
      setNome('');
      setDescricao('');
      setValor('');
      setCategoria('');
    } catch (error) {
      console.error('Erro ao inserir produto:', error);
      Alert.alert("Erro", "Não foi possível inserir o produto");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProduct(db, productId, nome, descricao, valor, categoria);
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      setNome('');
      setDescricao('');
      setValor('');
      setCategoria('');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      Alert.alert("Erro", "Não foi possível atualizar o produto");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(db, productId);
      Alert.alert("Sucesso", "Produto removido com sucesso!");
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      Alert.alert("Erro", "Não foi possível remover o produto");
    }
  };

  return (
    <View style={styles.container}>
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
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />
      {/* Picklist de categorias */}
      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue, itemIndex) => setCategoria(itemValue)}
      >
        {/* Opções de categorias */}
        {renderCategoryOptions()}
      </Picker>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  /*return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.description}</Text>
      <Text>Preço: {product.price}</Text>
      <Button title="Adicionar ao Carrinho" onPress={() => navigation.navigate('ShoppingCart', { productId: product.id, productName: product.description })} />
    </View>
    <View style={styles.container}>
      <Text>Aba de detalhe do produto!</Text>
    </View>
  );
}*/

export default ProductDetailsScreen;
