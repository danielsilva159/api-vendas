import AppError from '../../../shared/errors/AppErros';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
}
class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customerRepository = getCustomRepository(CustomersRepository);
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer not found');
    }

    const customerExists = await customerRepository.findByEmail(email);
    if (customerExists && customerExists.id !== id) {
      throw new AppError('There is already one customer with this email');
    }

    customer.name = name;
    customer.email = email;
    await customerRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
