import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'OnePieceStore.db';

export const db = SQLite.openDatabase({ name: database_name });

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Produtos (codigo INTEGER PRIMARY KEY NOT NULL, name TEXT, descricao TEXT, preco REAL, categoria TEXT, FOREIGN KEY (categoria) REFERENCES Categoria (codigo));'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Vendas (codigo INTEGER PRIMARY KEY NOT NULL, dataVenda TEXT, total REAL);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ItensVenda (codigoVenda INTEGER, codigoProduto INTEGER, quantidade INTEGER, FOREIGN KEY (codigoVenda) REFERENCES Vendas (codigo), FOREIGN KEY (codigoProduto) REFERENCES Produtos (codigo));'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS Categorias (id INTEGER PRIMARY KEY NOT NULL, nome TEXT);'
    );
  });
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

export const getProductById = async (name) => {
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
