import { HTTP_METHODS } from '../app/models/HTTP';

let mockedProduct = {
  id: "",
  name: "Random Item",
  description: "Created to be tested",
  price: "7.05"
};

describe('test product controller', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('should create a product', async () => {
    const product = await fetch('http://localhost:5000/api/products', {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(mockedProduct)
    });

    const newProduct = await product.json();
    mockedProduct.id = newProduct.id;
    expect(newProduct).toEqual(mockedProduct);
  });

  it('should fetch all products', async() => {
    const products = await fetch('http://localhost:5000/api/products');
    const allProducts = await products.json();
    expect(allProducts.length).toBeGreaterThan(0);
  });

  it('should fetch product by id', async() => {
    const result = await fetch(`http://localhost:5000/api/products/${mockedProduct.id}`);
    
    const fetchedProduct = await result.json();
    expect(fetchedProduct).toEqual(mockedProduct);
  });

  it('should udpate product by id', async() => {
    const body = {
      name: "Update Item",
      description: "Created to be updated",
      price: "7.08"
    };

    const result = await fetch(`http://localhost:5000/api/products/${mockedProduct.id}`, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(body)
    });
    
    const udpatedProduct = await result.json();
    mockedProduct = { ...mockedProduct, ...body };

    expect(udpatedProduct).toHaveProperty('name', 'Update Item');
    expect(udpatedProduct).toHaveProperty('description', 'Created to be updated');
  });

  it('should delete product by id', async() => {
    const result = await fetch(`http://localhost:5000/api/products/${mockedProduct.id}`, {
      method: HTTP_METHODS.DELETE
    });
    
    const { message } = await result.json();
    expect(message).toBe(`Product ${mockedProduct.name} (id: ${mockedProduct.id}) has been removed!`)
  });
});