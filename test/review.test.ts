import { afterAll, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import OrderController from "../src/controllers/OrderController";

const app = new Elysia().use(OrderController);
const server = app.listen(3000);

describe("Product API", () => {
	it("get all order by product id", async () => {
	  const response = await fetch("http://localhost:3000/api/order/getByProductId/2");
	  const data = await response.json();

	  expect(response.status).toBe(200);
	  expect(Array.isArray(data)).toBe(true);
	});


    it("add comment success", async () =>{
        const response = await fetch("http://localhost:3000/api/order/addComment",{
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: 2,
              rating: "3.0",
              comment: "medium",
            }),
          });
        const data = await response.json();
  
        expect(response.status).toBe(200);
        expect(data.rating).toBe("3.0");
    })

    it("add comment to invalid order", async () =>{
        const response = await fetch("http://localhost:3000/api/order/addComment",{
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: 999,
              rating: "3.0",
              comment: "medium",
            }),
          });
        const data = await response.json();
  
        expect(response.status).toBe(404);
        expect(data.error).toBe("Order not found");
    })

    it("add comment success", async () =>{
        const response = await fetch("http://localhost:3000/api/order/addReplyAdmin",{
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: 2,
              reply_admin: "thank you",
            }),
          });
        const data = await response.json();
  
        expect(response.status).toBe(200);
        expect(data.rating).toBe("3.0");
    })
    it("add comment to invalid order", async () =>{
        const response = await fetch("http://localhost:3000/api/order/addReplyAdmin",{
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: 999,
              reply_admin: "thank you",

            }),
          });
        const data = await response.json();
  
        expect(response.status).toBe(404);
        expect(data.error).toBe("Order not found");
    })
    afterAll(() => {
        server.stop(); // Stop the test server
    });
    
    
})
