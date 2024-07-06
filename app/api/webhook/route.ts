import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
	const body = await req.text();
	const signature = headers().get('Stripe-Signature') as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
		// !!!!!!!!!!!!!!!! attention ici c'est error:any a chaque fois que je sauvegarde cela me met une erreur
	} catch (error : any) {
		return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
	}

	const session = event.data.object as Stripe.Checkout.Session;
	const address = session?.customer_details?.address;

	const addressComponents = [
		address?.line1,
		address?.line2,
		address?.city,
		address?.state,
		address?.postal_code,
		address?.country,
	];

	const addressString = addressComponents.filter((c) => c !== null).join(', ');

	if (event.type === 'checkout.session.completed') {
		const order = await prismadb.order.update({
			where: {
				id: session?.metadata?.orderId,
			},
			data: {
				isPaid: true,
				address: addressString,
				phone: session?.customer_details?.phone || '',
			},
			include: {
				orderItems: true,
			},
		});

		const productIds = order.orderItems.map((orderItem) => orderItem.productId);

		// Get current stock for each product
		const products = await prismadb.product.findMany({
			where: {
				id: {
					in: [...productIds],
				},
			},
			select: {
				id: true,
				stock: true,
			},
		});

		const updates = products.map((product) => {
			if (product.stock) {
				const newStock = product.stock - 1;
				return prismadb.product.update({
					where: {
						id: product.id,
					},
					data: {
						stock: newStock,
						isArchived: newStock <= 0,
					},
				});
			} else {
				return prismadb.product.update({
					where: {
						id: product.id,
					},
					data: {
						isArchived: true,
					},
				});
			}
		});

		await Promise.all(updates);
	}
	return new NextResponse(null, { status: 200 });
}
