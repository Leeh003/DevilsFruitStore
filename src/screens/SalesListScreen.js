import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { initDB, getSales, getSalesItens } from '../database/database';
import Header from '../components/Header';

const SalesListScreen = () => {
  const [sales, setSales] = useState([]);
  const [expandedSaleId, setExpandedSaleId] = useState(null); // Identifica a venda expandida
  const [saleItems, setSaleItems] = useState([]);
  const [db, setDB] = useState(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await initDB();
        setDB(db);
        const salesData = await getSales(db);
        setSales(salesData);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }
    };

    initializeDB();
  }, []);

  const fetchSaleItems = async (saleId) => {
    try {
      const items = await getSalesItens(db, saleId);
      console.log(items)
      setSaleItems(items);
    } catch (error) {
      console.error('Erro ao buscar itens da venda:', error);
    }
  };

  const toggleSaleItems = async (saleId) => {
    if (expandedSaleId === saleId) {
      // Se a venda já está expandida, recolhe
      setExpandedSaleId(null);
      setSaleItems([]);
    } else {
      // Expande a nova venda
      await fetchSaleItems(saleId);
      setExpandedSaleId(saleId);
    }
  };

  const renderSaleItemCard = ({ item }) => (
    <View style={styles.saleItemCard}>
      <Text>Produto: {item.nomeProduto}</Text>
      <Text>Quantidade: {item.quantidade}</Text>
      <Text>Preço Unitário: R$ {item.valorItens}</Text>
      <Text>Preço do Item: R$ {item.valorItens * item.quantidade}</Text>
    </View>
  );

  const renderSaleCard = ({ item }) => (
    <TouchableOpacity
      style={styles.saleCard}
      onPress={() => toggleSaleItems(item.codigo)}
    >
      <Text style={styles.saleText}>Código da Venda: #1000{item.codigo}</Text>
      <Text style={styles.saleText}>Data da Venda: {item.dataVenda.split('T')[0]}</Text>
      <Text style={styles.saleText}>Valor Total: R$ {item.total.toFixed(2)}</Text>
      {expandedSaleId === item.codigo && (
        <FlatList
          data={saleItems}
          renderItem={renderSaleItemCard}
          keyExtractor={(item, index) => `saleItem-${index}`}
        />
      )}
    </TouchableOpacity>
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
  saleItemCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
  },
  // Adicione mais estilos conforme necessário
});

export default SalesListScreen;
