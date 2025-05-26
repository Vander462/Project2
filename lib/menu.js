import prisma from './prisma';

/**
 * Gets all menu items, sorted by name
 */
export async function getMenuItems() {
  return await prisma.menuItem.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Gets a menu item by ID
 * @param {number} id
 */
export async function getMenuItemById(id) {
  return await prisma.menuItem.findUnique({
    where: { id },
  });
}

/**
 * Creates a new menu item
 * @param {{ name: string, description?: string, price: number, category: string, image?: string }} menuItemData
 */
export async function createMenuItem(menuItemData) {
  const { name, price, category } = menuItemData;

  if (!name || typeof price !== 'number' || !category) {
    throw new Error('Missing or invalid menu item fields.');
  }

  try {
    return await prisma.menuItem.create({
      data: menuItemData,
    });
  } catch (error) {
    console.error('Failed to create menu item:', error);
    throw error;
  }
}

/**
 * Updates a menu item
 * @param {number} id
 * @param {object} updateData
 */
export async function updateMenuItem(id, updateData) {
  try {
    return await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    console.error(`Failed to update menu item ID ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes a menu item
 * @param {number} id
 */
export async function deleteMenuItem(id) {
  try {
    return await prisma.menuItem.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to delete menu item ID ${id}:`, error);
    throw error;
  }
}

/**
 * Gets menu items by category
 * @param {string} category
 */
export async function getMenuItemsByCategory(category) {
  return await prisma.menuItem.findMany({
    where: { category },
    orderBy: {
      name: 'asc',
    },
  });
}

/**
 * Gets all unique categories
 */
export async function getMenuCategories() {
  const items = await prisma.menuItem.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  return items.map(item => item.category);
}
