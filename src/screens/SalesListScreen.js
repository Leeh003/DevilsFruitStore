// SalesListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { initDB, getSales } from '../database/database';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const SalesListScreen = () => {
  const [sales, setSales] = useState([]);
  const [db, setDB] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const db = await initDB();
        setDB(db);
        const salesData = await getSales(db);
        setSales(salesData);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }
    };

    fetchSales();
  }, []);

  const renderSaleCard = ({ item }) => (
    <View style={styles.saleCard}>
      <Text style={styles.saleText}>Código da Venda: {item.codigo}</Text>
      <Text style={styles.saleText}>Data da Venda: {item.data}</Text>
      <Text style={styles.saleText}>Valor: {item.valor}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <Header/>
      <FlatList
        data={sales}
        renderItem={renderSaleCard}
        keyExtractor={(item) => item.codigo.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  saleCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  saleText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default SalesListScreen;
