import SQLite from 'expo-sqlite';

const database_name = 'OnePieceStore.db';

export const getDBConnection = async () => {
  return SQLite.openDatabase(database_name);
};

// Função para inicializar as tabelas do banco de dados
export const initDB = async () => {
  try{
    const db = await getDBConnection();
    await db.transaction(async (tx) => {
        await tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Produtos (codigo INTEGER PRIMARY KEY NOT NULL, name TEXT, descricao TEXT, preco REAL, categoria TEXT, imagem TEXT, FOREIGN KEY (categoria) REFERENCES Categoria (codigo));'
        );
        await tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Vendas (codigo INTEGER PRIMARY KEY NOT NULL, dataVenda TEXT, total REAL);'
        );
        await tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ItensVenda (codigoVenda INTEGER, codigoProduto INTEGER, quantidade INTEGER, FOREIGN KEY (codigoVenda) REFERENCES Vendas (codigo), FOREIGN KEY (codigoProduto) REFERENCES Produtos (codigo));'
        );
        await tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Categorias (id INTEGER PRIMARY KEY NOT NULL, nome TEXT, descricao TEXT, isSub BOOLEAN, mainCat TEXT);'
        );
      });
  } catch (error) {
    console.log(error);
  }
};

export const insertProduct = async (name, descricao, preco, categoria) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Produtos (name, descricao, preco, categoria) VALUES (?, ?, ?, ?);',
        [name, descricao, preco, categoria],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const getProducts = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Produtos;',
        [],
        (_, results) => {
          let data = [];
          for (let i = 0; i < results.rows.length; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getProductByName = async (name) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Produtos WHERE name = ?;',
        [name],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            reject('Produto não encontrado');
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const updateProduct = async (codigo, name, descricao, preco, categoria) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Produtos SET name = ?, descricao = ?, preco = ?, categoria = ? WHERE codigo = ?;',
        [name, descricao, preco, categoria, codigo],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteProduct = async (codigo) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Produtos WHERE codigo = ?;',
        [codigo],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const insertCategories = async (db, name, descricao) => {
  try {
    console.log("Entrou");
    db.transaction(async (tx) => {
      tx.executeSql(
        'INSERT INTO Categorias (nome, descricao, isSub, mainCat) VALUES (?, ?, ?, ?)',
        [name, descricao, false, null],
      );
    });
    console.log("Categoria inserida com sucesso!");
  } catch (error) {
    console.log({ name, descricao});
    console.error("Erro ao inserir categoria:", error);
    throw error; // Para permitir tratamento de erro onde a função é chamada
  }
};


export const getCategories = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Categorias;',
        [],
        (_, results) => {
          let data = [];
          for (let i = 0; i < results.rows.length; i++) {
            data.push(results.rows.item(i));
          }
          resolve(data);
        },
        (_, error) => reject(error)
      );
    });
  });
};


export const updateCatagory = async (codigo, name, descricao) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Categorias SET nome = ?, descricao = ? WHERE codigo = ?;',
        [name, descricao, codigo],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteCategory = async (codigo) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Categorias WHERE codigo = ?;',
        [codigo],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const lerImagemComoBase64 = async imagePath => {
  try {
    let base64Image = '';

    // Verificar se o ambiente é Android ou iOS
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Ler o arquivo como base64 usando a biblioteca react-native-fs
      base64Image = await RNFS.readFile(imagePath, 'base64');
    } else {
      console.error('Plataforma não suportada.');
    }

    return base64Image;
  } catch (error) {
    throw new Error('Erro ao ler imagem como base64: ' + error.message);
  }
};