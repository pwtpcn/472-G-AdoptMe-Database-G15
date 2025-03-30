import Elysia, { error, t } from "elysia";
import CartRepository from "../repositories/CartRepository";

const CartController = new Elysia({
    prefix: "/api/cart",
    tags: ["Cart"],
})

// Finish Cart Controller / Repository / Schema

CartController.get(
    "/getCart/:user_id",
    async ({ params: { user_id } }) => {
        const cartRepository = new CartRepository();
        const cart = await cartRepository.getCartByUserId(user_id);
        return cart ?? error(404, { error: "Cart not found" });
    },
    {
        params: t.Object({
            user_id: t.String(),
        }),
        detail: {
            summary: "Get user's cart",
            description: "Get all items in user's cart",
        }
    }
)

CartController.post(
    "/addToCart",
    async ({ body: { user_id, product_id, quantity } }) => {
        const cartRepository = new CartRepository();
        if(product_id <= 0) {
            return error(400, { error: "Invalid product ID" });
        }
        if(user_id === "") {
            return error(400, { error: "Invalid user ID" });
        }
        const cartItem = await cartRepository.addToCart({
            user_id,
            product_id,
            quantity
        });
        return cartItem ?? error(404, { error: "Cart not found" });
    },
    {
        body: t.Object({
            user_id: t.String(),
            product_id: t.Number(),
            quantity: t.Number(),
        }),
        detail: {
            summary: "Add item to cart",
            description: "Add a product to user's cart",
        }
    }
)

CartController.patch(
    "/updateCartItem",
    async ({ body: { user_id, product_id, quantity } }) => {
        if(product_id <= 0) {
            return error(400, { error: "Invalid product ID" });
        }
        if(user_id === "") {
            return error(400, { error: "Invalid user ID" });
        }
        const cartRepository = new CartRepository();
        const cartItem = await cartRepository.updateCartItem({
            user_id,
            product_id,
            quantity
        });
        return cartItem ?? error(404, { error: "Cart not found" });
    },
    {
        body: t.Object({
            user_id: t.String(),
            product_id: t.Number(),
            quantity: t.Number(),
        }),
        detail: {
            summary: "Update cart item",
            description: "Update quantity of an item in cart",
        }
    }
)

CartController.delete(
    "/removeFromCart",
    async ({ body: { user_id, product_id } }) => {
        const cartRepository = new CartRepository();
        if(user_id === "") {
            return error(404, { error: "Invalid user ID" });
        }
        const cartItem = await cartRepository.getByUserIdAndProductId(
            user_id,
            product_id
        );
         if(!cartItem)
            return error(404, { error: "Cart not found" });
        const removed = await cartRepository.removeFromCart({cart_id : cartItem.id});
        return removed;
    },
    {
        body: t.Object({
            user_id: t.String(),
            product_id: t.Number(),
        }),
        detail: {
            summary: "Remove item from cart",
            description: "Remove a product from user's cart",
        }
    }
)

CartController.delete(
    "/clearCart/:user_id",
    async ({ params: { user_id } }) => {
        if(user_id === "") {
            return error(400, { error: "Invalid user ID" });
        }
        const cartRepository = new CartRepository();
        const result = await cartRepository.clearCart(user_id);
        return result ?? error(404, { error: "Cart not found" });
    },
    {
        params: t.Object({
            user_id: t.String(),
        }),
        detail: {
            summary: "Clear cart",
            description: "Remove all items from user's cart",
        }
    }
)

export default CartController; 