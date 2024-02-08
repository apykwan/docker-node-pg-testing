import { v4 as uuidv4 } from 'uuid';

import { pool } from '../database';
import { type Product } from './Product';

export async function findAll() {
  const query = 'SELECT * FROM products';
  const { rows } = await pool.query(query);
  return rows;
}

export async function findById(id: string) {
  const query = 'SELECT * FROM products WHERE id=$1 LIMIT 1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

export async function create(product: Product): Promise<Product | Error> {
  const newProd = { ...product, id: uuidv4() };
  const query = `INSERT INTO products(id, name, description, price) VALUES($1, $2, $3, $4)`;
  await pool.query(query, [newProd.id, newProd.name, newProd.description, newProd.price])

  // return the added product
  return await findById(newProd.id);
}

export async function update(id: string, product: Product) {
  const query = 'UPDATE products set name=$1, description=$2, price=$3 WHERE id=$4';
  await pool.query(query, [product.name, product.description, product.price, id]);
  // return the updated product
  return await findById(id);
}

export async function remove(id: string) {
  const query = 'DELETE FROM products WHERE id=$1';
  await pool.query(query, [id]);
}
