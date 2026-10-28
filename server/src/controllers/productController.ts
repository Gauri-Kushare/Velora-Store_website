import { Request, Response } from 'express';
import { db } from '../data/store.js';

export const getProducts = (req: Request, res: Response): void => {
  try {
    const {
      category,
      department,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      search,
      featured,
    } = req.query;

    const products = db.getProducts({
      category: category as string,
      department: department as string,
      size: size as string,
      color: color as string,
      minPrice: minPrice ? parseInt(minPrice as string, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice as string, 10) : undefined,
      sort: sort as string,
      search: search as string,
      featured: featured !== undefined ? featured === 'true' : undefined,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getProductBySlug = (req: Request, res: Response): void => {
  try {
    const { slug } = req.params;
    const product = db.getProductBySlug(slug);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with slug "${slug}" not found`,
      });
      return;
    }

    // Resolve pairing recommendations
    const pairingProducts = (product.pairingProductIds || [])
      .map((id) => db.getProductById(id))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: {
        ...product,
        pairingProducts,
      },
    });
  } catch (error) {
    console.error('getProductBySlug error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getFeaturedProducts = (_req: Request, res: Response): void => {
  try {
    const featured = db.getProducts({ featured: true });
    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured,
    });
  } catch (error) {
    console.error('getFeaturedProducts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCategories = (_req: Request, res: Response): void => {
  try {
    const allProducts = db.getProducts({});
    const departments = Array.from(new Set(allProducts.map((p) => p.department)));
    const categories = Array.from(new Set(allProducts.map((p) => p.category)));

    res.status(200).json({
      success: true,
      data: {
        departments,
        categories,
      },
    });
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
