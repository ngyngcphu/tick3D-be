import { OrderListResultDto, OrderResultDto } from '@dtos/out';
import { ordersHandler } from '@handlers';
import { verifyToken } from '@hooks';
import { Type } from '@sinclair/typebox';
import { createRoutes } from '@utils';

export const orderPlugin = createRoutes('Order', [
    {
        method: 'GET',
        url: '',
        onRequest: [verifyToken],
        schema: {
            summary: 'Get all orders of the current customer. For managers, return all orders',
            response: {
                200: OrderListResultDto,
                400: Type.String()
            }
        },
        handler: ordersHandler.getOrders
    },
    {
        method: 'GET',
        url: '/:id',
        onRequest: [verifyToken],
        schema: {
            summary:
                'Get the order with the specified id and owned by the current user. For managers, they can view the order without owning it',
            response: {
                200: OrderResultDto,
                404: Type.String(),
                400: Type.String()
            }
        },
        handler: ordersHandler.getOrderById
    }
]);
