import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Order from './Order';
import Product from '../../../products/typeorm/entities/product';

@Entity('orders_products')
class OrderProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('decimal')
  price: number;
  @Column('int')
  quantity: number;
  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order;
  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product;
  @Column()
  order_id: string;
  @Column()
  product_id: string;
  @CreateDateColumn()
  created_at: Date;
  @CreateDateColumn()
  updated_at: Date;
}

export default OrderProducts;
