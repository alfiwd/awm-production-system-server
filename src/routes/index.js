const exporess = require("express");
const router = exporess.Router();

const { auth } = require("../middlewares");

const { login, checkToken } = require("../controllers/auth");
const { getCustomer, getCustomerByName, getCustomers, createCustomer, updateCustomer } = require("../controllers/customer");
const { getOrder, getOrdersByCustomerIdQuery, getOrdersByCustomerIdParams, getAllOrders, createOrder, updateOrder, updateOrderOnly, getOrdersBySearch } = require("../controllers/order");
const { getItem, getItems, getItemsByName, createItem, updateItem, deleteItem } = require("../controllers/item");
const { getOrderDetails, getOrderDetailsByOrderId, createOrderDetail, updateStatusOrderDetail } = require("../controllers/order_detail");
const { createItemDetail } = require("../controllers/item_detail");

router.post("/login", login);
router.get("/check-token", auth, checkToken);

router.get("/customer/:id", getCustomer);
router.get("/customers/name", getCustomerByName);
router.get("/customers", getCustomers);
router.post("/customer", createCustomer);
router.put("/customer/:id", auth, updateCustomer);

router.get("/order/:id", getOrder);
router.get("/order/customer", getOrdersByCustomerIdQuery);
router.get("/orders/search-by", getOrdersBySearch);
router.get("/orders", getAllOrders);
router.post("/order", auth, createOrder);
router.put("/order/:id", auth, updateOrder);
router.put("/order/order-only/:id", auth, updateOrderOnly);

router.get("/item/:id", getItem);
router.get("/items", getItems);
router.get("/items/name", getItemsByName);
router.post("/item", auth, createItem);
router.put("/item/:id", auth, updateItem);
router.delete("/item/:id", auth, deleteItem);

router.get("/order-details", getOrderDetails);
router.get("/order-details/:orderId", getOrderDetailsByOrderId);
router.post("/order-detail", auth, createOrderDetail);
router.put("/order-detail/:orderDetailId", auth, updateStatusOrderDetail);

router.post("/item-detail", createItemDetail);

module.exports = router;
