import { PrismaClient } from '@prisma/client';
import { getAuthUser } from '../../lib/auth';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function saveBase64Image(base64String) {
  // Example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 string');
  }

  const ext = matches[1].split('/')[1]; // e.g. 'png' or 'jpeg'
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');

  // Generate unique filename
  const fileName = `menu-item-${Date.now()}.${ext}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  // Ensure uploads directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // Write file to disk
  fs.writeFileSync(filePath, buffer);

  // Return the public URL path
  return `/uploads/${fileName}`;
}

export default async function handler(req, res) {
  const user = await getAuthUser(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }

    let imagePath = '';
    try {
      if (image && image.startsWith('data:')) {
        // Save base64 image to file and get path
        imagePath = saveBase64Image(image);
      } else if (image) {
        // If user still sends a URL, keep it
        imagePath = image;
      }
    } catch (error) {
      console.error('Error saving image:', error);
      return res.status(400).json({ error: 'Invalid image format.' });
    }

    try {
      const newItem = await prisma.menuItem.create({
        data: {
          name,
          description: description || '',
          price: parseFloat(price),
          category,
          image: imagePath,
        },
      });

      return res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating menu item:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    try {
      const items = await prisma.menuItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching menu:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Menu item ID is required to delete.' });
    }

    try {
      const deletedItem = await prisma.menuItem.delete({
        where: { id: id },
      });

      return res.status(200).json({ message: 'Item deleted', item: deletedItem });
    } catch (error) {
      console.error('Error deleting item:', error);
      return res.status(500).json({ error: 'Failed to delete menu item.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
