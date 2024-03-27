//CategoryListScreen.js
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, FlatList, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { initDB, insertCategories, getCategories, updateCategory, deleteCategory } from '../database/database'; 

const CategoryListScreen = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [db, setDB] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const db = await initDB();
        setDB(db);
        fetchAndSetCategories(db);
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      }
    };
    initializeDB();
  }, []);

  // Função para tratar a inserção de uma categoria
  const handleInsertCategory = async () => {
    try {
      await insertCategories(db, nome, descricao);
      Alert.alert("Sucesso", "Categoria inserida com sucesso!");
      setNome('');
      setDescricao('');
      closeModal();
      fetchAndSetCategories(db);
    } catch (error) {
      console.error('Erro ao inserir categoria:', error);
      Alert.alert("Erro", "Não foi possível inserir a categoria");
    }
  }

  // Função para tratar a remoção de uma categoria
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(db, categoryId);
      Alert.alert("Sucesso", "Categoria removida com sucesso!");
      fetchAndSetCategories(db);
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      Alert.alert("Erro", "Não foi possível remover a categoria");
    }
  };

  // Função para tratar a atualização de uma categoria
  const handleUpdateCategory = async () => {
    try {
      await updateCategory(db, editingCategory.id, nome, descricao);
      Alert.alert("Sucesso", "Categoria atualizada com sucesso!");
      setNome('');
      setDescricao('');
      setEditingCategory(null);
      closeModal();
      fetchAndSetCategories(db);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      Alert.alert("Erro", "Não foi possível atualizar a categoria");
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openEditModal = (category) => {
    setEditingCategory(category); // Armazena a categoria atual para edição
    setNome(category.nome);
    setDescricao(category.descricao);
    setIsModalVisible(true);
  };

  // Função para categorizar categorias principais e suas subcategorias.
  const categorizeCategories = (categories) => {
    const mainCategories = categories.filter(category => category.isSub == 'false');
    const subCategories = categories.filter(category => category.isSub == 'true');

    const categorized = mainCategories.map(category => ({
      ...category,
      subCategories: subCategories.filter(sub => sub.mainCat === category.nome),
    }));

    return categorized;
  };

  const fetchAndSetCategories = async (db) => {
    try {
      const fetchedCategories = await getCategories(db);
      const categorizedCategories = categorizeCategories(fetchedCategories);
      setCategories(categorizedCategories); // Utiliza as categorias categorizadas
      const initialExpandedState = {};
      categorizedCategories.forEach(category => {
        initialExpandedState[category.id] = false;
        // Inicializa o estado expandido para subcategorias
        category.subCategories.forEach(subCategory => {
          initialExpandedState[subCategory.id] = false;
        });
      });
      setExpandedCategories(initialExpandedState);
    } catch (error) {
      console.error('Erro ao recuperar categorias:', error);
    }
  };

  const toggleDescription = (categoryId) => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }));
  };

  const renderCategoryCard = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        {/* Card da categoria principal */}
        <TouchableOpacity style={styles.card} onPress={() => toggleDescription(item.id)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>{item.nome}</Text>
            {item.nome === 'Zoan' && (
              <TouchableOpacity style={styles.addButton} onPress={(e) => {
                e.stopPropagation();
                setNome(item.nome);
                setDescricao(item.descricao);
                setIsModalVisible(true);
              }}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>
          {expandedCategories[item.id] && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.cardDescription}>{item.descricao}</Text>
            </View>
          )}
        </TouchableOpacity>
        
           {/* Cards das subcategorias */}
          {expandedCategories[item.id] && item.subCategories && item.subCategories.map(sub => (
            <View key={sub.id}>
              <TouchableOpacity style={styles.subCard} onPress={() => toggleDescription(sub.id)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardText}>{sub.nome}</Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(sub)}>
                      <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCategory(sub.id)}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {expandedCategories[sub.id] && (
                  <View style={styles.descriptionContainer}>
                  <Text style={styles.cardDescription}>{sub.descricao}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryCard}
        style={styles.flatList}
      />
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome da Categoria"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />
            {editingCategory ? (
            <Button
              title="Atualizar Categoria"
              onPress={handleUpdateCategory}
            />
          ) : (
            <Button
              title="Inserir Categoria"
              onPress={handleInsertCategory}
            />
          )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Assegura que o nome e o botão estejam nas extremidades
    alignItems: 'center', // Centraliza verticalmente o nome e o botão
  },
  cardText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
  },
  subCard: {
    backgroundColor: '#f9f9f9', // Cor de fundo diferente para subcategorias
    marginLeft: 20, // Indenta o card filho para distingui-lo do pai
    marginRight: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  subCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  subCardButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#f0ad4e', // Cor de fundo amarelo para edição
    padding: 10,
    marginRight: 5, // Espaço entre os botões de editar e deletar
    borderRadius: 5, // Bordas arredondadas
  },
  deleteButton: {
    backgroundColor: '#d9534f', // Cor de fundo vermelho para deletar
    padding: 10,
    borderRadius: 5, // Bordas arredondadas
  },
  addButton: {
    backgroundColor: '#ccc',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 10,
    opacity: 0.6,
  },
  descriptionContainer: {
    borderTopWidth: 1, // Adiciona a linha separadora acima da descrição
    borderTopColor: '#ccc',
    marginTop: 10, // Espaço acima da linha separadora
    paddingTop: 10, // Espaço abaixo da linha separadora
  },
  descriptionSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
    marginTop: 10, // Adicionando margem acima para separar a descrição do restante do card
  },
  flatList: {
    width: '100%',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalInput: {
    width: '100%',
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute', // Posicionamento absoluto
    top: -40, // Espaço do topo do modal
    right: 10, // Espaço do lado direito do modal
    backgroundColor: 'lightgrey', // Cor de fundo para o botão
    borderRadius: 15, // Arredondar os cantos do botão
    width: 30, // Largura do botão
    height: 30, // Altura do botão
    alignItems: 'center', // Centralizar o texto do botão horizontalmente
    justifyContent: 'center', // Centralizar o texto do botão verticalmente
    zIndex: 1, // Garantir que o botão fique acima dos outros elementos
  },
  closeButtonText: {
    fontSize: 16, // Tamanho da fonte do "X"
    color: 'black', // Cor do texto do "X"
    fontWeight: 'bold', // Negrito para o texto do "X"
  },
});

export default CategoryListScreen;
