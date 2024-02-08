import { IncomingMessage, ServerResponse } from "http";

import * as Product from '../models/productModel';
import { Product as ProductType } from '../models/Product'; 
import { HTTP_CODES } from '../models/HTTP';
import { getPostData } from '../utils/utils';

// @desc  gets All Products
// @route GET /api/products
export async function getProducts(req: IncomingMessage, res: ServerResponse) {
  try {
    const products = await Product.findAll();

    res.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
  } catch (error) {
    console.log(error);
  }
}

// @desc  gets single Product
// @route GET /api/products/:id
export async function getProduct(req: IncomingMessage, res: ServerResponse, id: string) {
  try {
    const product = await Product.findById(id);
    if (product) {
      res.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(HTTP_CODES.NOT_FOUND, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product not found' }));
    }
  } catch (error) {
    console.log(error);
  }
}

// @desc  Create a Product
// @route POST /api/products/
export async function createProduct(req: IncomingMessage, res: ServerResponse) {
  try {
    const body = await getPostData(req);
    const { name, description, price } = body;
    const newProduct = await Product.create({ name, description, price });
    if (!newProduct) {
      res.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Fail to create product. Please try different product name! '}));
    }

    res.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(newProduct));
  } catch (error) {
    console.log(error);
  }
}

// @desc  Update a Product
// @route PUT /api/products/
export async function updateProduct(req: IncomingMessage, res: ServerResponse, id: string) {
  try {
    const product: ProductType = await Product.findById(id);

    if (!product) {
      res.writeHead(HTTP_CODES.NOT_FOUND, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product not found' }));
    } else {
      const { name, description, price } =  await getPostData(req);
      const productToBeUpdated = {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price
      };

      const updatedProduct = await Product.update(id, productToBeUpdated);
    
      res.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(updatedProduct));
    }
  } catch (error) {
    console.log(error);
  }
}

// @desc  Delete a Product
// @route DELETE /api/products/
export async function deleteProduct(req: IncomingMessage, res: ServerResponse, id: string) {
  try {
    const product: ProductType = await Product.findById(id);

    if (!product) {
      res.writeHead(HTTP_CODES.NOT_FOUND, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product not found'}));
    } else {
      await Product.remove(id);
      
      res.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: `Product ${product.name} (id: ${product.id}) has been removed!` }));
    }
  } catch (error) {
    console.log(error);
  }
}

 