// src/navigation/AppNavigator.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ProductsListScreen from '../screens/ProductsListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import CategoriesListScreen from '../screens/CategoriesListScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CategoriesList" component={CategoriesListScreen} options={{title: 'Categorias Disponíveis'}} />
        <Stack.Screen name="ProductsList" component={ProductsListScreen} options={{title: 'Produtos Disponíveis'}} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{title: 'Detalhes do Produto'}} />
        <Stack.Screen name="ShoppingCart" component={ShoppingCartScreen} options={{title: 'Carrinho de Compras'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
