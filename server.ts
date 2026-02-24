import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('ecommerce.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image TEXT,
    rating REAL,
    reviews INTEGER
  );

  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed Data if empty
const count = db.prepare('SELECT count(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  const products = [
    {
      title: "Apple iPhone 15 (128 GB) - Black",
      description: "DYNAMIC ISLAND COMES TO IPHONE 15 — Dynamic Island bubbles up alerts and Live Activities — so you don’t miss them while you’re doing something else. You can see who’s calling, check your flight status, and so much more.",
      price: 79900,
      category: "Mobiles",
      image: "https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg",
      rating: 4.6,
      reviews: 1245
    },
    {
      title: "Samsung Galaxy S24 Ultra 5G AI Smartphone",
      description: "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 17.25cm (6.8\") flat display. It's an absolute marvel of design.",
      price: 129999,
      category: "Mobiles",
      image: "https://m.media-amazon.com/images/I/71CXhVhpM0L._SX679_.jpg",
      rating: 4.5,
      reviews: 890
    },
    {
      title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      description: "Industry Leading noise cancellation-two processors control 8 microphones for unprecedented noise cancellation. With Auto NC Optimizer, noise canceling is automatically optimized based on your wearing conditions and environment.",
      price: 26990,
      category: "Electronics",
      image: "https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg",
      rating: 4.4,
      reviews: 3400
    },
    {
      title: "Nike Men's Air Max SC Sneaker",
      description: "With its easygoing lines, heritage track look and of course, visible Air cushioning, the Nike Air Max SC is the perfect finish to any outfit.",
      price: 4599,
      category: "Fashion",
      image: "https://m.media-amazon.com/images/I/61-r9zJ4ZpL._SY695_.jpg",
      rating: 4.1,
      reviews: 560
    },
    {
      title: "Puma Men's T-Shirt",
      description: "Style Name:-T-Shirt; Model Name:-Ess Small Logo Tee; Brand Color:-Puma Black; Activity Group:-Basics; Collection:-Essentials",
      price: 899,
      category: "Fashion",
      image: "https://m.media-amazon.com/images/I/51uGECDrBQL._SX679_.jpg",
      rating: 4.0,
      reviews: 210
    },
    {
      title: "Dell G15 5530 Gaming Laptop",
      description: "Processor: Intel Core i5-13450HX 13th Gen | RAM: 16GB DDR5 | Storage: 512GB SSD | Graphics: NVIDIA GeForce RTX 3050 6GB GDDR6",
      price: 76990,
      category: "Laptops",
      image: "https://m.media-amazon.com/images/I/51j9L5aKk+L._SX679_.jpg",
      rating: 4.2,
      reviews: 150
    },
    {
      title: "Logitech MX Master 3S Wireless Mouse",
      description: "Any-surface tracking - now 8K DPI: Use MX Master 3S cordless computer mouse to work on any surface - even glass - with the upgraded 8000 DPI sensor with customizable sensitivity.",
      price: 9495,
      category: "Electronics",
      image: "https://m.media-amazon.com/images/I/61ni3t1ryQL._SX679_.jpg",
      rating: 4.7,
      reviews: 5600
    },
    {
      title: "Kindle Paperwhite (16 GB)",
      description: "Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
      price: 14999,
      category: "Electronics",
      image: "https://m.media-amazon.com/images/I/51p4-eX4g3L._SX679_.jpg",
      rating: 4.5,
      reviews: 9000
    }
  ];

  const insert = db.prepare('INSERT INTO products (title, description, price, category, image, rating, reviews) VALUES (@title, @description, @price, @category, @image, @rating, @reviews)');
  db.transaction(() => {
    for (const product of products) insert.run(product);
  })();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND title LIKE ?';
      params.push(`%${search}%`);
    }

    const products = db.prepare(query).all(...params);
    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.get('/api/cart', (req, res) => {
    const cart = db.prepare(`
      SELECT cart.id, cart.quantity, products.* 
      FROM cart 
      JOIN products ON cart.product_id = products.id
    `).all();
    res.json(cart);
  });

  app.post('/api/cart', (req, res) => {
    const { productId } = req.body;
    const existing = db.prepare('SELECT * FROM cart WHERE product_id = ?').get(productId) as any;

    if (existing) {
      db.prepare('UPDATE cart SET quantity = quantity + 1 WHERE id = ?').run(existing.id);
    } else {
      db.prepare('INSERT INTO cart (product_id, quantity) VALUES (?, 1)').run(productId);
    }
    res.json({ success: true });
  });

  app.delete('/api/cart/:id', (req, res) => {
    db.prepare('DELETE FROM cart WHERE product_id = ?').run(req.params.id);
    res.json({ success: true });
  });
  
  app.post('/api/cart/update', (req, res) => {
      const { id, quantity } = req.body;
      if (quantity <= 0) {
          db.prepare('DELETE FROM cart WHERE product_id = ?').run(id);
      } else {
          db.prepare('UPDATE cart SET quantity = ? WHERE product_id = ?').run(quantity, id);
      }
      res.json({ success: true });
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
