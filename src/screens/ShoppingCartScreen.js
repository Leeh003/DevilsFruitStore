import { View, Text, Modal, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { insertSale, insertSaleItems } from '../database/database';

const ShoppingCartScreen = ({ isVisible, toggleModal, cartItems, setCartItems, db }) => {

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      total += item.preco * item.quantity;
    });
    return total;
  };

  const finalizePurchase = async () => {
    try {
      const saleDate = new Date().toISOString();
      const total = calculateTotal();
      const saleId = await insertSale(db, saleDate, total);

      cartItems.forEach(async item => {
        await insertSaleItems(db, saleId, item.id, item.quantity, item.preco);
      });
      toggleModal();
      Alert.alert("Sucesso", "Compra realizada com sucesso!");
      setCartItems([]);
    } catch (error) {
      console.error('Erro ao finalizar a compra:', error);
      Alert.alert("Erro", "Não foi possível realizar a compra");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.imagem }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Quantidade: {item.quantity}</Text>
        <Text style={styles.itemPrice}>Valor: R$ {item.preco * item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity onPress={finalizePurchase} style={styles.finalizeButton}>
            <Text style={styles.finalizeButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemQuantity: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 15,
  },
  closeButtonText: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finalizeButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  finalizeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ShoppingCartScreen;
