const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const menuItems = [
  {
    name: "Phaksha Paa",
    price: 300,
    image: "/images/phakpa.jpeg",
    category: "Non-Vegetarian",
    description: "Traditional Bhutanese pork dish with red chilies and radishes"
  },
  {
    name: "Ema Datshi",
    price: 250,
    image: "/images/ema.jpeg",
    category: "Vegetarian",
    description: "Bhutan's national dish - chilies and cheese stew"
  },
  {
    name: "Paneer Butter Masala",
    price: 250,
    image: "/images/veg1.jpg",
    category: "Vegetarian"
  },
  {
    name: "Chicken Curry",
    price: 300,
    image: "/images/non1.jpg",
    category: "Non-Vegetarian"
  },
  {
    name: "Mutton Rogan Josh",
    price: 350,
    image: "/images/non2.jpeg",
    category: "Non-Vegetarian"
  },
  {
    name: "Dal Tadka",
    price: 180,
    image: "/images/veg3.jpeg",
    category: "Vegetarian"
  },
  {
    name: "Chocolate Lava Cake",
    price: 150,
    image: "/images/cake.jpg",
    category: "Desserts"
  },
  {
    name: "Vegetable Biryani",
    price: 280,
    image: "/images/veg2.jpg",
    category: "Vegetarian",
    description: "Fragrant rice dish cooked with mixed vegetables and aromatic spices"
  },
  {
    name: "Fish Fry",
    price: 320,
    image: "/images/non3.jpeg",
    category: "Non-Vegetarian",
    description: "Crispy fried fish seasoned with traditional spices"
  }
]

async function seedMenu() {
  try {
    console.log('Clearing existing menu items...')
    await prisma.menuItem.deleteMany()

    console.log('Inserting new menu items...')
    for (const item of menuItems) {
      await prisma.menuItem.create({
        data: item
      })
    }

    const count = await prisma.menuItem.count()
    console.log(`Successfully seeded ${count} menu items`)
  } catch (error) {
    console.error('Error seeding menu items:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedMenu() 