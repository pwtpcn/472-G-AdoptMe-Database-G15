import { order, order_status, pet } from "@prisma/client";
import db from "./Database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class OrderRepository {
	public async getAll(): Promise<order[]> {
		return await db.order.findMany();
	}

	public async getById(id: number): Promise<order | null> {
		return await db.order.findUnique({
			where: { id: id }
		});
	}

	public async getByUserId(user_id: string): Promise<order[]> {
		return await db.order.findMany({
			where: { user_id: user_id }
		});
	}

	public async getByProductId(product_id: number): Promise<order[]> {
		return await db.order.findMany({
			where: {
				product_id: product_id,
				NOT: {
					comment: null,
					rating: null,
				},
			}
		});
	}
	public async createOrder({
		user_id,
		product_id,
		quantity,
		total_price,
		session_id
	}: {
		user_id: string;
		product_id: number;
		quantity: number;
		total_price: number;
		session_id: string;
	}): Promise<order> {
		try {
			const response = await db.order.create({
				data: {
					user_id: user_id,
					product_id: product_id,
					session_id: session_id,
					quantity: quantity,
					total_price: total_price,
					order_date: new Date(),
					order_status: order_status.SUCCESSFUL
				}
			});
			return response;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			throw JSON.stringify({error: "Internal Server Error"});
		}
	}

    public async updateOrder({
        id,
        order,
    }: {
        id: number;
        order : Partial<order>;
    }): Promise<order | null> {
        try {
            const response = await db.order.update({
                where: { id: id },
                data: { 
                    ...order
                }
            });
            return response;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw JSON.stringify({error: error.message});
            }
            throw JSON.stringify({error: "Internal Server Error"});
        }
    }
	public async addComment({
		id,
		rating,
		comment
	}: {
		id: number;
		rating : string;
		comment: string;
	}): Promise<order | null> {
		try {
			const response = await db.order.update({
				where: { id: id },
				data: { 
					rating: rating,
					comment: comment
				}
			});
			return response;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			throw JSON.stringify({error: "Internal Server Error"});
		}
	}
	public async addReplyAdmin({
		id,
		reply_admin
	}: {
		id: number;
		reply_admin: string;
	}): Promise<order | null> {
		try {
			const response = await db.order.update({
				where: { id: id },
				data: { 
					reply_admin: reply_admin
				}
			});
			return response;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				throw JSON.stringify({error: error.message});
			}
			throw JSON.stringify({error: "Internal Server Error"});
		}
	}
}


export default OrderRepository;
