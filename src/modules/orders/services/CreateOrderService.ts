import { getCustomRepository } from 'typeorm';
import AppError from '../../../shared/errors/AppErros';
import CustomersRepository from '../../customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '../../products/typeorm/repositories/produtsRepository';
import Order from '../typeorm/entities/Order';
import OrderRepository from '../typeorm/repositories/OrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const orderRepository = getCustomRepository(OrderRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productRepository = getCustomRepository(ProductRepository);
    const customerExists = await customerRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    const existsProducts = await productRepository.findAllByIds(products);
    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids');
    }

    const existsProductsIds = existsProducts.map(product => product.id);
    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );
    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not avaible for ${quantityAvailable[0].id}`,
      );
    }

    const serializedProduct = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await orderRepository.createOrder({
      customer: customerExists,
      products: serializedProduct,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
