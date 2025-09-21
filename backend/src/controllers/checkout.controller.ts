// src/controllers/checkout.controller.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import Resource from '../models/Resource.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export const createCheckoutSession = async (req: Request, res: Response) => {
    const user = req.user!;
    const { resourceId } = req.body;

    try {
        const resource = await Resource.findById(resourceId);
        if (!resource || resource.isFree) {
            return res.status(400).json({ message: 'This resource is not for sale.' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: resource.title,
                        description: resource.description,
                    },
                    unit_amount: resource.price * 100, // Price in cents
                },
                quantity: 1,
            }],
            metadata: {
                userId: user._id.toString(),
                resourceId: resource._id.toString(),
            },
            success_url: `${process.env.FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/library`,
        });

        res.json({ url: session.url });
    } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};