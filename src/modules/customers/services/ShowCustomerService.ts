import AppError from 'src/shared/errors/AppErros';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  user_id: string;
}

class ShowCustomerService {
  public async execute({ user_id }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);
    const customer = await customerRepository.findById(user_id);
    if (!customer) {
      throw new AppError('customer not found');
    }
    return customer;
  }
}

export default ShowCustomerService;
