import { Handler } from '@interfaces';
import { OrderListResultDto, OrderResultDto } from '@dtos/out';
import { prisma } from '@repositories';
import { USER_NOT_FOUND, ORDER_NOT_FOUND } from '@constants';
import { UserRole } from '@prisma/client';
import { OrderQueryStringDto } from '@dtos/in';

const getOrderById: Handler<OrderResultDto, { Params: { orderId: string } }> = async (req, res) => {
    const userId = req.userId;

    const user = await prisma.user.findFirst({
        select: {
            role: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        return res.badRequest(USER_NOT_FOUND);
    }

    const order = await prisma.order.findFirst({
        select: {
            creation_time: true,
            digital_order_id: true,
            district: true,
            est_deli_time: true,
            extra_note: true,
            isPaid: true,
            shipping_fee: true,
            status: true,
            street: true,
            streetNo: true,
            total_price: true,
            ward: true
        },
        where: {
            id: req.params.orderId
        }
    });

    if (!order) {
        return res.notFound(ORDER_NOT_FOUND);
    }

    return {
        creationTime: order.creation_time.toISOString(),
        digitalOrderId: order.digital_order_id || undefined,
        district: order.district,
        estimatedDeliveryTime: order.est_deli_time.toISOString(),
        id: req.params.orderId,
        isPaid: order.isPaid,
        shippingFee: order.shipping_fee,
        status: order.status,
        street: order.street,
        streetNo: order.streetNo,
        totalPrice: order.total_price,
        ward: order.ward,
        note: order.extra_note || undefined,
        userId
    };
};

const getOrders: Handler<OrderListResultDto, { Querystring: OrderQueryStringDto }> = async (req, res) => {
    const userId = req.userId;

    const user = await prisma.user.findFirst({
        select: {
            role: true
        },
        where: {
            id: userId
        }
    });

    if (!user) {
        return res.badRequest(USER_NOT_FOUND);
    }

    try {
        const orders = await prisma.order.findMany({
            select: {
                id: true,
                user_id: true,
                creation_time: true,
                digital_order_id: true,
                district: true,
                est_deli_time: true,
                extra_note: true,
                isPaid: true,
                shipping_fee: true,
                status: true,
                street: true,
                streetNo: true,
                total_price: true,
                ward: true
            },
            where: {
                user_id: user.role === UserRole.MANAGER ? req.query.userId : userId,
                creation_time: {
                    gt: req.query.created_after && new Date(req.query.created_after),
                    lt: req.query.created_before && new Date(req.query.created_before)
                },
                isPaid: req.query.isPaid
            },
            orderBy: {
                creation_time: req.query.orderBy === 'creationTime' ? req.query.order || 'desc' : undefined,
                shipping_fee: req.query.orderBy === 'shippingFee' ? req.query.order || 'desc' : undefined,
                total_price: req.query.orderBy === 'totalPrice' ? req.query.order || 'desc' : undefined
            },
            skip: req.query.start,
            take: req.query.noItems
        });

        return orders.map((order) => ({
            creationTime: order.creation_time.toISOString(),
            digitalOrderId: order.digital_order_id || undefined,
            district: order.district,
            estimatedDeliveryTime: order.est_deli_time.toISOString(),
            id: order.id,
            isPaid: order.isPaid,
            shippingFee: order.shipping_fee,
            status: order.status,
            street: order.street,
            streetNo: order.streetNo,
            totalPrice: order.total_price,
            ward: order.ward,
            note: order.extra_note || undefined,
            userId: order.user_id
        }));
    } catch (e) {
        return [];
    }
};

export const ordersHandler = {
    getOrderById,
    getOrders
};
