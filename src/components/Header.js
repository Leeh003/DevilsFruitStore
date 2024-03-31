import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductsList')}>
        <Text style={styles.link}>Produtos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CategoriesList')}>
        <Text style={styles.link}>Categorias</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SalesList')}>
        <Text style={styles.link}>Vendas</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ShoppingCart')}>
        <Text style={styles.cartIcon}>Carrinho</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  link: {
    marginRight: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  cartIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
};

export default Header;
