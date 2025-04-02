const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET /api/products with pagination and optional search filtering
router.get('/products', async (req, res, next) => {
  try {
    // Get pagination parameters from query; default to page 1, 10 items per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get search query if provided
    const searchQuery = req.query.search;
    const whereClause = searchQuery ? { name: { contains: searchQuery, mode: 'insensitive' } } : undefined;
    
    // Fetch products with pagination, optional search filter, and order by creation date ascending
    const products = await prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    next(error);
  }
});

// GET /api/products/:id
router.get('/products/:id', async (req, res, next) => {
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
    next(error);
  }
});

// POST /api/products/:id/reviews
router.post('/products/:id/reviews', async (req, res, next) => {
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
    next(error);
  }
});

// GET /api/products/:id/reviews
router.get('/products/:id/reviews', async (req, res, next) => {
  const productId = parseInt(req.params.id);
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    next(error);
  }
});

// POST /api/affiliate/token
router.post('/affiliate/token', async (req, res, next) => {
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
    next(error);
  }
});

module.exports = router;