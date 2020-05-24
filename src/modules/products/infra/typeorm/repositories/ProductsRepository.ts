import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const findProducts = await this.ormRepository.find({
      id: In(productsIds),
    });

    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsIds = products.map(product => {
      return { id: product.id };
    });
    const productsToUpdate = await this.findAllById(productsIds);

    const result = productsToUpdate.map(async updateProduct => {
      return this.ormRepository.update(updateProduct.id, {
        quantity: updateProduct.quantity,
      });
    });

    console.log(result);

    const updatedProducts = await this.ormRepository.find({
      where: {
        id: In(productsIds),
      },
    });

    return updatedProducts;
  }
}

export default ProductsRepository;
