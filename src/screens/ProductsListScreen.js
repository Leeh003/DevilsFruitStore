import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker'; 
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { initDB, getCategories, getProducts } from '../database/database'; 

const ProductListScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [products, setProducts] = useState([]); 
  const [db, setDB] = useState(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await initDB();
        setDB(db);
        const productsList = await getProducts(db);
        setProducts(productsList);
        fetchCategories(db);
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

  // Atualiza a quantidade de um produto
  const updateQuantity = (id, newQuantity) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    }));
  };

  // Renderização de cada produto
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Nome"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {/* Picklist de categorias */}
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue, itemIndex) => setCategoria(itemValue)}
        >
          {/* Opções de categorias */}
          {renderCategoryOptions()}
        </Picker>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item, index) => String(index)}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    marginRight: 5,
    paddingHorizontal: 10,
  },
  pickerStyle: {
    flex: 1,
  },
  productCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  // Adicione mais estilos conforme necessário
});

export default ProductListScreen;
