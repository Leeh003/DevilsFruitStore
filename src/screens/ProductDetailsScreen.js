// src/screens/ProductDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getProductById } from '../database/database'; // Função fictícia para buscar detalhes do produto

function ProductDetailsScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductById(productId); // Substitua pela sua lógica de acesso ao SQLite
      setProduct(data);
    };
    fetchProduct();
  }, []);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.description}</Text>
      <Text>Preço: {product.price}</Text>
      <Button title="Adicionar ao Carrinho" onPress={() => navigation.navigate('ShoppingCart', { productId: product.id, productName: product.description })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
});

export default ProductDetailsScreen;
