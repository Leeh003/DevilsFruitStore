import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { initDB, getSales, getSalesItens } from '../database/database';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const SalesListScreen = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [saleItems, setSaleItems] = useState([]);
  const [db, setDB] = useState(null);
  const [showSaleItems, setShowSaleItems] = useState(false); // Estado para controlar a exibição dos itens da venda

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const db = await initDB();
        setDB(db);
        const salesData = await getSales(db);
        console.log(salesData)
        setSales(salesData);
      } catch (error) {
        console.error('Erro ao buscar vendas:', error);
      }
    };

    fetchSales();
  }, []);

  const fetchSaleItems = async (codigoVenda) => {
    try {
      console.log(codigoVenda)
      const items = await getSalesItens(db, codigoVenda);
      console.log(items);
      setSaleItems(items);
    } catch (error) {
      console.error('Erro ao buscar itens da venda:', error);
    }
  };

  const toggleSaleItems = async (codigoVenda) => {
    if (showSaleItems) {
      setSaleItems([]); // Limpa os itens da venda quando ocultados
    } else {
      await fetchSaleItems(codigoVenda); // Busca os itens da venda quando exibidos
    }
    setShowSaleItems(!showSaleItems); // Alterna o estado de exibição dos itens da venda
  };

  const renderSaleCard = ({ item }) => (
    <TouchableOpacity
      style={styles.saleCard}
      onPress={() => toggleSaleItems(item.codigo)} // Altera o estado de exibição dos itens da venda ao clicar no card da venda
    >
      <Text style={styles.saleText}>Código da Venda: #1000{item.codigo}</Text>
      <Text style={styles.saleText}>Data da Venda: {item.dataVenda.split('T')[0]}</Text>
      <Text style={styles.saleText}>Valor: {item.total}</Text>
      {showSaleItems && selectedSale?.codigo === item.codigo && ( // Renderiza os itens da venda apenas se o estado showSaleItems for true e o card da venda for o selecionado
        <FlatList
          data={saleItems}
          renderItem={({ item }) => (
            <View style={styles.saleItem}>
              <Text>{item.nome}</Text>
              <Text>{item.quantity}</Text>
              <Text>{item.preco}</Text>
            </View>
          )}
          keyExtractor={(item) => item.codigo.toString()}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
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
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SalesListScreen;
