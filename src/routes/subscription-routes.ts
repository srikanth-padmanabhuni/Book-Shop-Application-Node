import express from "express";
import { createSubscription, deleteSubscription, getSubscriptionById, getSubscriptions, updateSubscription } from "../controllers/subscription-controller";

const router = express.Router();

router.post('/api/create', (req, res) => {
    return createSubscription(req, res);
})

router.put('/api/update', (req, res) => {
    return updateSubscription(req, res);
})

router.delete('/api/delete', (req, res) => {
    return deleteSubscription(req, res);
})

router.get('/api/getAll', (req, res) => {
    return getSubscriptions(req, res);
})

router.post('/api/get', (req, res) => {
    return getSubscriptionById(req, res);
})

export { router as subscriptionRoutes }