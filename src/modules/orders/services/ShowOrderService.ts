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
  id: string;
}

class ShowOrderService {
  public async execute({ id }: IRequest): Promise<Order> {
    const orderRepository = getCustomRepository(OrderRepository);
    const order = await orderRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found');
    }

    return order;
  }
}

export default ShowOrderService;
