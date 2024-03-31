import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ showCartIcon = false }) => {
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
      {showCartIcon && ( // Renderiza o ícone do carrinho somente se showCartIcon for true
        <TouchableOpacity onPress={() => navigation.navigate('ShoppingCart')}>
          <Ionicons name="cart-sharp" style={styles.cartIcon} />
        </TouchableOpacity>
      )}
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
    fontSize: 24, 
    color: 'green',
  },
};

export default Header;
