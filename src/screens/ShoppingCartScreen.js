// src/screens/ShoppingCartScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
// Funções fictícias para acessar e modificar o carrinho de compras
//import { getCartItems, addToCart, removeFromCart, clearCart, checkout } from '../database/Database';

function ShoppingCartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);

  /*useEffect(() => {
    loadCartItems();
  }, []);*/

  /*const loadCartItems = async () => {
    const items = await getCartItems(); // Substitua pela sua lógica de acesso ao SQLite
    setCartItems(items);
  };*/

  /*const handleCheckout = async () => {
    await checkout(); // Implemente a lógica de finalizar compra
    navigation.goBack();
  };*/

  return (
    /*<View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.productName} - Quantidade: {item.quantity}</Text>
            <Button title="Remover" onPress={() => removeFromCart(item.productId)} />
          </View>
        )}
      />
      <Button title="Finalizar Compra" onPress={handleCheckout} />
    </View>*/

    <View style={styles.container}>
      <Text>Aba do carrinho</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
});

export default ShoppingCartScreen;