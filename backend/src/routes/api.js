const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Mock product data
const products = [
  { id: 1, name: 'Product A', description: 'Description A', price: 29.99 },
  { id: 2, name: 'Product B', description: 'Description B', price: 49.99 },
];

// GET /api/products
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/products/:id/reviews
router.post('/products/:id/reviews', async (req, res) => {
  const userId = parseInt(req.body.userId, 10);
  const rating = parseInt(req.body.rating, 10);
  const comment = req.body.comment;
  console.log('Review submission:', {
    productId: req.params.id,
    userId,
    rating,
    comment
  });

  try {
    const review = await prisma.review.create({
      data: {
        productId: parseInt(req.params.id),
        userId,
        rating,
        comment
      }
    });
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/products/:id/reviews
router.get('/products/:id/reviews', async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/affiliate/token
router.post('/affiliate/token', async (req, res) => {
  const { userId } = req.body;

  try {
    const token = `token-${userId}-${Date.now()}`;
    const affiliate = await prisma.affiliate.create({
      data: {
        userId,
        token
      }
    });

    res.status(200).json({ userId, token });
  } catch (error) {
    console.error('Error generating affiliate token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;