import httpMocks from 'node-mocks-http';

import { HTTP_CODES } from '../app/models/HTTP';
import * as ProductController from '../app/controllers/productController';
import * as Utils from '../app/utils/utils';
import * as ProductModel from '../app/models/productModel';
const allProducts = require('./data/mockProducts');

jest.mock('../app/models/productModel');

const mockedProduct = {
  id: "12345",
  name: "Random Item",
  description: "Created to be tested",
  price: 0
};
const getPostData = jest.spyOn(Utils, 'getPostData');
const errMessage = { message: 'Product not found' };
let req, res;

describe('product api suite', () => {
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.resetAllMocks()
  });

  it('should fetch all products', async () => {
    (ProductModel.findAll as jest.Mock).mockReturnValue(allProducts);
    
    await ProductController.getProducts(req, res);
  
    expect(res.statusCode).toBe(HTTP_CODES.OK);
    expect(res._getJSONData()).toHaveLength(allProducts.length);
  });

  it('should fetch single product by id', async () => {
    (ProductModel.findById as jest.Mock).mockReturnValue(mockedProduct);
    
    await ProductController.getProduct(req, res, '12345');
  
    expect(res.statusCode).toBe(HTTP_CODES.OK);
    expect(res._getJSONData()).toEqual(mockedProduct);
  });

  it('should receive error message when product could not be found', async () => {
    (ProductModel.findById as jest.Mock).mockReturnValue(undefined);
    
    await ProductController.getProduct(req, res, 'random_id');
  
    expect(res.statusCode).toBe(HTTP_CODES.NOT_FOUND);
    expect(res._getJSONData()).toEqual(errMessage);
  });

  it('should call getPostData when creating product', async () => {
    await ProductController.createProduct(req, res);
  
    expect(getPostData).toHaveBeenCalledTimes(1);
  });

  it('should create new product', async () => {
    getPostData.mockResolvedValueOnce({
      name: "Random Item",
      description: "Created to be tested",
      price: 0
    });

    (ProductModel.create as jest.Mock).mockReturnValue(mockedProduct);
    await ProductController.createProduct(req, res);
  
    expect(res.statusCode).toBe(HTTP_CODES.CREATED);
    expect(res._getJSONData()).toEqual(mockedProduct);
  });

  it('should update the product', async () => {
    getPostData.mockResolvedValueOnce({
      name: "Updated Item",
      description: "Created to be tested",
      price: 10
    });

    (ProductModel.findById as jest.Mock).mockReturnValue(mockedProduct);

    (ProductModel.update as jest.Mock).mockReturnValue({
      id: '12345',
      name: "Updated Item",
      description: "Created to be tested",
      price: 10
    });

    await ProductController.updateProduct(req, res, '12345');
  
    expect(res.statusCode).toBe(HTTP_CODES.CREATED);
    expect(res._getJSONData()).toEqual({
      id: '12345',
      name: "Updated Item",
      description: "Created to be tested",
      price: 10
    });
  });

  it('should send error message if product is not found', async () => {
    getPostData.mockResolvedValueOnce({
      name: "Updated Item",
      description: "Created to be tested",
      price: 10
    });

    (ProductModel.findById as jest.Mock).mockReturnValue(undefined);
    await ProductController.updateProduct(req, res, '1234');
  
    expect(res.statusCode).toBe(HTTP_CODES.NOT_FOUND);
    expect(res._getJSONData()).toEqual(errMessage);
  });

  it('should delete the product', async () => {
    (ProductModel.findById as jest.Mock).mockReturnValue(mockedProduct);
    await ProductController.deleteProduct(req, res, '12345');

    expect(res.statusCode).toBe(HTTP_CODES.OK);
    expect(res._getJSONData()).toEqual({ message: `Product ${mockedProduct.name} (id: ${mockedProduct.id}) has been removed!` });
  });

  it('should send error message if product not found', async () => {
    (ProductModel.findById as jest.Mock).mockReturnValue(undefined);
    await ProductController.deleteProduct(req, res, '1234');

    expect(res.statusCode).toBe(HTTP_CODES.NOT_FOUND);
    expect(res._getJSONData()).toEqual(errMessage);
  });
});