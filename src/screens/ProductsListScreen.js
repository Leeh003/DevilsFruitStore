//ProductListScreen.js
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker'; 
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { initDB, getCategories, getProducts, getProductByName, getProductByCategory } from '../database/database'; 
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import Header from '../components/Header';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';

const ProductListScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [products, setProducts] = useState([]); 
  const [db, setDB] = useState(null);
  const [refresh, setRefresh] = useState(false); 
  const [cartItems, setCartItems] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const db = await initDB();
          setDB(db);
          const productsList = await getProducts(db);
          addStandardQuantity(productsList);
          const fetchedCategories = await getCategories(db);
          setCategorias(fetchedCategories);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
        }
      };
      fetchData();
    }, [refresh])
  );
  
  const renderCategoryOptions = () => {
    const emptyOption = <Picker.Item key={-1} label="Selecionar categoria..." value="" />;
    const categoryOptions = categorias.map((category) => (
      <Picker.Item key={category.id} label={category.nome} value={category.id} />
    ));
    return [emptyOption, ...categoryOptions];
  };
  

  const addStandardQuantity = (productsList) => {
    const productsWithQuantity = productsList.map((product, index) => ({
      ...product,
      quantity: 1,
      id: product.codigo,
    }));
    setProducts(productsWithQuantity);
  }

  const goToProductDetails = (productId, name, description, price, categoryId, imagem) => {
    navigation.navigate('ProductDetails', { id: productId, nomeEdit: name, descricaoEdit: description, valorEdit: price, categoriaEdit: categoryId, imagemEdit: imagem , refresh: true });
  };

  const searchProductName = async () => {
    const productsList = await getProductByName(db, searchTerm);
    addStandardQuantity(productsList);
  };

  const searchByCategory = async (selectedCategory) => {
    let productsList;
    if (selectedCategory === '') {
      productsList = await getProducts(db);
    } else {
      productsList = await getProductByCategory(db, selectedCategory);
    }
    addStandardQuantity(productsList);
  };

  const updateQuantity = (productId, delta) => {
    setProducts(currentProducts => currentProducts.map(product => {
      if (product.id === productId) {
        const updatedQuantity = Math.max(1, product.quantity + delta);
        return { ...product, quantity: updatedQuantity };
      }
      return product;
    }));
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    const quantityToAdd = item.quantity; 
  
    if (existingItem) {
      setCartItems((prevCartItems) =>
        prevCartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: quantityToAdd }]);
    }
    toggleModal();
  };
  

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const renderProduct = ({ item }) => 
  (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <Image source={{ uri: item.imagem }} style={styles.productImage} />
      <Text style={styles.productPrice}>R$: {item.preco}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={() => goToProductDetails(item.id, item.name, item.descricao, item.preco, item.categoria, item.imagem)}>
        <Text>Edit</Text>
      </TouchableOpacity>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
       <Header />
    <View style={styles.searchContainer}>
      <TextInput
        style={[styles.searchInput, { flex: 1 }]}
        placeholder="Nome"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onBlur={() => searchProductName()}
      />
     <Picker
        style={[styles.pickerStyle, { flex: 1 }]}
        selectedValue={categoria}
        onValueChange={(itemValue) => {
          setCategoria(itemValue);
          searchByCategory(itemValue);
        }}
      >
        {/* Opções de categorias */}
        {renderCategoryOptions()}
      </Picker>

    </View>
    <TouchableOpacity
        style={styles.newProductButton}
        onPress={() => navigation.navigate('ProductDetails', { refresh: true })}
      >
        <Text style={styles.newProductButtonText}>Novo Produto</Text>
      </TouchableOpacity>
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      numColumns={2}
    />
     <ShoppingCartScreen isVisible={isModalVisible} toggleModal={toggleModal} cartItems={cartItems} setCartItems={setCartItems} db={db}/>
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
    width: 160,
    height: 100,
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    marginBottom: 10,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  newProductButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  newProductButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductListScreen;
