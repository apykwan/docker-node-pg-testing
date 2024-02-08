import { createServer } from 'http';

import * as productController from './controllers/productController';
import { HTTP_METHODS, HTTP_CODES } from './models/HTTP';

export const server = createServer((req, res) => {
  if(req.url === '/api/products' && req.method === HTTP_METHODS.GET) {
    productController.getProducts(req, res);

  } else if (req.url?.match(/\/api\/products\/\w+/) && req.method === HTTP_METHODS.GET) {
    const id = req.url.split('/').pop() as string;

    productController.getProduct(req, res, id);

  } else if (req.url === '/api/products' && req.method === HTTP_METHODS.POST) { 
    productController.createProduct(req, res)

  } else if (req.url?.match(/\/api\/products\/\w+/) && req.method === HTTP_METHODS.PUT) {
    const id = req.url.split('/').pop() as string;
    productController.updateProduct(req, res, id);

  } else if (req.url?.match(/\/api\/products\/\w+/) && req.method === HTTP_METHODS.DELETE) {
    const id = req.url.split('/').pop() as string;
    productController.deleteProduct(req, res, id);

  }else {
    res.writeHead(HTTP_CODES.NOT_FOUND, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route Not Found' }));
  }
});

const PORT: string | number = process.env.PORT || 5000;

 server.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
});
