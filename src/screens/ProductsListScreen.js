// ProductsListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'OnePieceShop.db', location: 'default' },
  () => {},
  error => console.log(error)
);

const ProductsListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM products', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setProducts(temp);
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.description} - ${item.price}</Text>
            <Button
              title="Ver Detalhes"
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default ProductsListScreen;
