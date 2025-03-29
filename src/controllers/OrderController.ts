import Elysia, { error, t } from "elysia";
import OrderRepository from "../repositories/OrderRepository";
import { order_status } from "@prisma/client";

const OrderController = new Elysia({
	prefix: "/api/order",
	tags: ["Order"],
})

OrderController.get(
	"/getAll",
	async () => {
		const orderRepository = new OrderRepository();
		const orders = await orderRepository.getAll();
		return orders ?? { error: "Orders not found" };
	},
	{
		detail: {
			summary: "Get all orders",
			description: "Get all orders",
		}
	}
)

OrderController.get(
	"/getById/:id", 
	async ({ params: { id } }) => {
		const orderRepository = new OrderRepository();
		const order = await orderRepository.getById(id);
		return order ?? { error: "Order not found" };
	},
	{
		params: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Get order by id",
			description: "Get order by id",
		}
	}
)

OrderController.get(
	"/getByUserId/:user_id", 
	async ({ params: { user_id } }) => {
		const orderRepository = new OrderRepository();
		const orders = await orderRepository.getByUserId(user_id);
		return orders.length > 0 ? orders : { error: "No orders found for this user" };
	},
	{
		params: t.Object({
			user_id: t.String(),
		}),
		detail: {
			summary: "Get orders by user ID",
			description: "Retrieve all orders associated with a specific user ID",
		}
	}
)


OrderController.post(
	"/createOrder",
	async ({ body : { user_id, product_id, quantity, total_price, session_id } }) => {
		const orderRepository = new OrderRepository();
		const order = await orderRepository.createOrder({
            user_id,
            product_id,
            quantity,
            total_price,
			session_id
        });
		return order;
	},
	{
		body: t.Object({
			user_id: t.String(),
			product_id: t.Number(),
			quantity: t.Number(),
			total_price: t.Number(),
			session_id: t.String()
		}),
		detail: {
			summary: "Create order",
			description: "Create order",
		}
	}
)

OrderController.patch(
	"/updateOrder",
	async ({ body : { id, order } }) => {
		const orderRepository = new OrderRepository();
		const updatedOrder = await orderRepository.updateOrder({
            id,
            order
		});
		return updatedOrder;
	},
	{
		body: t.Object({
			id: t.Number(),
			order: t.Object({
				user_id: t.Optional(t.String()),
				product_id: t.Optional(t.Number()),
				quantity: t.Optional(t.Number()),
				total_price: t.Optional(t.Number()),
				order_status: t.Optional(t.Enum(order_status)),
				order_date: t.Optional(t.Date()),
				rating: t.Optional(t.String()),  
                comment: t.Optional(t.String()),
				reply_admin: t.Optional(t.String())
			})
		}),
		detail: {
			summary: "Update order",
			description: "Update order",
		}
	}
)
OrderController.get(
	"/getByProductId/:id", 
	async ({ params: { id } }) => {
		const orderRepository = new OrderRepository();
		const order = await orderRepository.getByProductId(id);
		return order ?? error(404,{error: "Order not found"});
	},
	{
		params: t.Object({
			id: t.Number(),
		}),
		detail: {
			summary: "Get order by product id",
			description: "Retrieve all orders associated with a specific product ID",
		}
	}
)
OrderController.patch(
	"/addComment",
	async ({ body: { id, rating, comment } }) => {
		const orderRepository = new OrderRepository();
		const order = await orderRepository.getById(id);
		if (!order) {
			return error(404,{error: "Order not found"});
		}
		const updatedOrder = await orderRepository.addComment({
            id,
            rating,
			comment
		});
		return updatedOrder;
	},
	{
		body: t.Object({
			id: t.Number(),
			rating: t.String(),
			comment: t.String()
		}),
		detail: {
			summary: "Add comment",
			description: "Add comment",
		}
	}
);
OrderController.patch(
	"/addReplyAdmin",
	async ({ body: { id, reply_admin } }) => {
		const orderRepository = new OrderRepository();
		const order = await orderRepository.getById(id);
		if (!order) {
			return error(404,{error: "Order not found"});
		}
		const updatedOrder = await orderRepository.addReplyAdmin({
            id,
			reply_admin
		});
		return updatedOrder;
	},
	{
		body: t.Object({
			id: t.Number(),
			reply_admin: t.String()
		}),
		detail: {
			summary: "Add reply",
			description: "Add reply",
		}
	}
);
export default OrderController;

