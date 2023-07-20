import express from "express";
import { createSubscription, deleteSubscription, getSubscriptionById, getSubscriptions, updateSubscription } from "../controllers/subscription-controller";
import { validateTokenForReader } from "../controllers/auth-controller";

const router = express.Router();

router.post('/api/create', validateTokenForReader, (req, res) => {
    return createSubscription(req, res);
})

router.put('/api/update', validateTokenForReader, (req, res) => {
    return updateSubscription(req, res);
})

router.delete('/api/delete', validateTokenForReader, (req, res) => {
    return deleteSubscription(req, res);
})

router.get('/api/getAll', validateTokenForReader, (req, res) => {
    return getSubscriptions(req, res);
})

router.post('/api/get', validateTokenForReader, (req, res) => {
    return getSubscriptionById(req, res);
})

export { router as subscriptionRoutes }