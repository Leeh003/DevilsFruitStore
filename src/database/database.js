//database.js
import * as SQLite from 'expo-sqlite';
const database_name = 'OnePieceStore.db';

export const getDBConnection = async () => {
  return SQLite.openDatabase('OnePieceStore.db');
};

// Função para inicializar as tabelas do banco de dados
export const initDB = async () => {
  try{
    const db = await getDBConnection();
    db.transaction(async (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Produtos (codigo INTEGER PRIMARY KEY NOT NULL, name TEXT, descricao TEXT, preco REAL, categoria TEXT, imagem TEXT, FOREIGN KEY (categoria) REFERENCES Categoria (codigo));'
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Vendas (codigo INTEGER PRIMARY KEY NOT NULL, dataVenda TEXT, total REAL);'
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ItensVenda (codigo INTEGER PRIMARY KEY NOT NULL, codigoVenda INTEGER, codigoProduto INTEGER, quantidade INTEGER, valorItens REAL, FOREIGN KEY (codigoVenda) REFERENCES Vendas (codigo), FOREIGN KEY (codigoProduto) REFERENCES Produtos (codigo));'
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Categorias (id INTEGER PRIMARY KEY NOT NULL, nome TEXT, descricao TEXT, isSub BOOLEAN, mainCat TEXT);'
        );
      });
      checkCategories(db);
      return db;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const insertProduct = async (db, name, descricao, preco, categoria, imagem) => {
  console.log('here')
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Produtos (name, descricao, preco, categoria, imagem) VALUES (?, ?, ?, ?, ?);',
        [name, descricao, preco, categoria, imagem],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const getProducts = async (db) => {
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

export const getProductByCategory = async (db, category) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Produtos WHERE categoria = ?;',
        [category],
        (_, results) => {
          const products = [];
          for (let i = 0; i < results.rows.length; i++) {
            products.push(results.rows.item(i));
          }
          resolve(products);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getProductByName = async (db, name) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Produtos WHERE name LIKE ?;',
        [`%${name}%`],
        (_, results) => {
          const products = [];
          for (let i = 0; i < results.rows.length; i++) {
            products.push(results.rows.item(i));
          }
          resolve(products);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const getProductById = async (db, id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Produtos WHERE codigo = ?;',
        [id],
        (_, results) => {
          const products = [];
          for (let i = 0; i < results.rows.length; i++) {
            products.push(results.rows.item(i));
          }
          resolve(products);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const updateProduct = async (db, codigo, name, descricao, preco, categoria, imagem) => {
  console.log(name, descricao, preco, categoria, imagem, codigo)
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Produtos SET name = ?, descricao = ?, preco = ?, categoria = ?, imagem = ? WHERE `codigo` = ?;',
        [name, descricao, preco, categoria, imagem, codigo],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve('Produto atualizado com sucesso!');
          } else {
            reject('Nenhum produto foi atualizado.');
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteProduct = async (db, codigo) => {
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

export const insertCategories = async (db, name, descricao, isSub, mainCat) => {
  if (isSub === undefined) {
    isSub = true; // Valor padrão para isSub
  }
  if (!mainCat) {
    mainCat = 'Zoan'; // Valor padrão para mainCat
  }

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Categorias (nome, descricao, isSub, mainCat) VALUES (?, ?, ?, ?);',
        [name, descricao, isSub, mainCat],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const getCategories = async (db) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Categorias ORDER BY nome ASC;',
        [],
        (_, results) => {
          const data = [];
          for (let i = 0; i < results.rows.length; i++) {
            const { id, nome, descricao, isSub, mainCat } = results.rows.item(i);
            data.push({ id, nome, descricao, isSub, mainCat });
          }
          resolve(data);
        },
        (_, error) => reject(error)
      );
    });
  });
};


export const updateCategory = async (db, codigo, name, descricao) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Categorias SET nome = ?, descricao = ? WHERE id = ?;',
        [name, descricao, codigo],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteCategory = async (db, codigo) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Categorias WHERE id = ?;',
        [codigo],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

// Função para verificar se existem registros na tabela de categorias
const checkCategories = async (db) => {
  try {
    const categories = await getCategories(db);
    if (categories.length === 0) {
      // Se não houver categorias, insira registros padrão
      await insertCategories(db, 'Paramecia', 'Paramecia concedem a seus usuários poderes sobre-humanos que não envolvem animais ou transformações elementais, podendo alterar características do corpo do usuário ou permitem ao usuário modificar as pessoas, objetos e ambiente ao seu redor. Além disso, existem alguns usuários que podem gerar e manipular substâncias.', false, null);
      await insertCategories(db, 'Logia', 'O tipo mais raro e poderoso das Akuma no Mi, permitem que seus usuários criem, controlem e transformem seu corpo em um elemento natural. A transformação elementar torna o usuário efetivamente intangível, além de permitir que o usuário permaneça no controle de seu corpo, mesmo quando ele é quebrado em pedaços. Eles também ganham todas as habilidades relacionadas a esse elemento.', false, null);
      await insertCategories(db, 'Zoan', 'Zoan ganham a habilidade de se transformar em um animal, bem como em uma forma híbrida entre o animal e a sua própria espécie. Uma descoberta científica recente permite que as frutas Zoan sejam integradas a objetos inanimados, dando-lhes vida e concedendo-lhes as transformações comuns de uma Zoan. Frutas Zoan de animais carnívoros são mais adequadas para o combate.', false, null);
      await insertCategories(db, 'Zoan-Mitologica', 'Frutas Zoan que permitem ao usuário se transformar em criaturas mitológicas, como um dragão ou uma fênix. Frutas Zoan de animais míticos tendem a ter poderes especiais. As Zoan Míticas são o tipo mais raro de Akuma no Mi, ainda mais raras do que as Logia.');
      console.log('Registros padrão de categorias foram inseridos.');
    } else {
      console.log('Registros de categorias já existem.');
    }
  } catch (error) {
    console.error('Erro ao verificar categorias:', error);
  }
};


export const insertSale = async (db, dataVenda, total) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Vendas (dataVenda, total) VALUES (?, ?);',
        [dataVenda, total],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const getSales = async (db) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Vendas ORDER BY codigo DESC;',
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

export const insertSaleItens = async (db, codigoVenda, codigoProduto, quantidade, valorItens) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO ItensVenda (codigoVenda, codigoProduto, quantidade, valorItens) VALUES (?, ?, ?, ?);',
        [codigoVenda, codigoProduto, quantidade, valorItens],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

export const getSalesItens = async (db, codVenda) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT ItensVenda.*, Produtos.name AS nomeProduto
         FROM ItensVenda
         INNER JOIN Produtos ON ItensVenda.codigoProduto = Produtos.codigo
         WHERE ItensVenda.codigoVenda = ?;`,
        [codVenda],
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