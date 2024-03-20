import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import OrderController from '../controllers/OrderController';
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated';

const ordersRouter = Router();
const orderController = new OrderController();

ordersRouter.use(isAuthenticated);
ordersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  orderController.show,
);
ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().required(),
      products: Joi.required(),
    },
  }),
  orderController.create,
);

export default ordersRouter;
