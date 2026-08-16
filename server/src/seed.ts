import { connectDB } from './config/db'
import Category from './models/Category'
import Product from './models/Product'
import User from './models/User'
import bcrypt from 'bcrypt'

export async function seedInitialData() {
  console.log('Seeding initial database content...')

  const categories = [
    { name: 'Sea Fish' },
    { name: 'Freshwater Fish' },
    { name: 'Prawns & Shrimps' },
    { name: 'Crabs & Shellfish' },
    { name: 'Ready to Cook' },
    { name: 'Combo Packs' }
  ]

  await Category.deleteMany({})
  await Category.insertMany(categories)

  await Product.deleteMany({})

  const sampleProducts = [
    {
      name: 'Seer Fish (Surmai) Medium - Steak Cut',
      description: 'Cleaned, descaled & cut into firm steaks. Known for its firm texture & rich flavor. Best for Surmai Fry and coastal curries.',
      category: 'Sea Fish',
      images: ['https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '300g (Net Wt: 300g | Gross Wt: 450g)', price: 449 },
        { label: '500g (Net Wt: 500g | Gross Wt: 750g)', price: 699 }
      ],
      cuttingOptions: ['Steak Cut', 'Curry Cut', 'Boneless Cubes', 'Whole Cleaned'],
      stock: 45,
      isActive: true,
      badge: 'Bestseller',
      netWeight: '300g',
      grossWeight: '450g',
      pieces: '4-6 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.9,
      reviewsCount: 1420
    },
    {
      name: 'White Pomfret - Whole Cleaned & Gutted',
      description: 'Delicate texture, mild sweet taste. Descaled, degutted and thoroughly cleaned. Ideal for Tandoori Pomfret fry or Goan Fish Curry.',
      category: 'Sea Fish',
      images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '350g (Net Wt: 350g | Gross Wt: 500g)', price: 599 },
        { label: '700g (Net Wt: 700g | Gross Wt: 1000g)', price: 1099 }
      ],
      cuttingOptions: ['Whole Cleaned & Gutted', 'Fry Cut', 'Curry Cut'],
      stock: 30,
      isActive: true,
      badge: 'Top Rated',
      netWeight: '350g',
      grossWeight: '500g',
      pieces: '2 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.8,
      reviewsCount: 980
    },
    {
      name: 'Freshwater Large Prawns - Cleaned & Deveined',
      description: 'Juicy, tender prawns completely cleaned, deshelled, and deveined. Ready to cook immediately for Prawn Butter Masala or Garlic Fry.',
      category: 'Prawns & Shrimps',
      images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '250g (Net Wt: 250g | Gross Wt: 400g)', price: 379 },
        { label: '500g (Net Wt: 500g | Gross Wt: 800g)', price: 699 }
      ],
      cuttingOptions: ['Cleaned & Deveined', 'Tail On', 'Whole'],
      stock: 60,
      isActive: true,
      badge: 'Bestseller',
      netWeight: '250g',
      grossWeight: '400g',
      pieces: '15-20 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.9,
      reviewsCount: 2150
    },
    {
      name: 'Basa Fillet - Boneless Cubes',
      description: '100% boneless, velvety soft Basa fillets cut into perfect bite-sized cubes. Great for Fish & Chips, Fish Tikka & Continental dishes.',
      category: 'Freshwater Fish',
      images: ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '400g (Net Wt: 400g | Gross Wt: 500g)', price: 299 },
        { label: '800g (Net Wt: 800g | Gross Wt: 1000g)', price: 549 }
      ],
      cuttingOptions: ['Boneless Cubes', 'Boneless Fillet', 'Finger Cut'],
      stock: 50,
      isActive: true,
      badge: 'Relish',
      netWeight: '400g',
      grossWeight: '500g',
      pieces: '12-16 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.7,
      reviewsCount: 830
    },
    {
      name: 'Rohu (Rui) - Medium Curry Cut (With Head)',
      description: 'Freshwater Rohu descaled and cut into neat pieces including head. A staple for authentic Bengali Machher Jhol and North Indian curry.',
      category: 'Freshwater Fish',
      images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '500g (Net Wt: 500g | Gross Wt: 700g)', price: 219 },
        { label: '1000g (Net Wt: 1000g | Gross Wt: 1400g)', price: 399 }
      ],
      cuttingOptions: ['Bengali Curry Cut', 'Without Head', 'Fry Cut'],
      stock: 80,
      isActive: true,
      badge: 'Fresh Catch',
      netWeight: '500g',
      grossWeight: '700g',
      pieces: '7-10 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.8,
      reviewsCount: 1100
    },
    {
      name: 'Indian Salmon (Rawas) - Boneless Steaks',
      description: 'Premium Rawas with smooth pinkish meat, subtle rich flavor. Rich in Omega-3 fatty acids. Perfect for grilling or pan searing.',
      category: 'Sea Fish',
      images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '300g (Net Wt: 300g | Gross Wt: 450g)', price: 549 },
        { label: '600g (Net Wt: 600g | Gross Wt: 900g)', price: 999 }
      ],
      cuttingOptions: ['Boneless Steaks', 'Fillet', 'Curry Cut'],
      stock: 25,
      isActive: true,
      badge: 'Superfood',
      netWeight: '300g',
      grossWeight: '450g',
      pieces: '3-5 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.9,
      reviewsCount: 650
    },
    {
      name: 'Jumbo Tiger Prawns - Cleaned & Tail On',
      description: 'Succulent jumbo tiger prawns with tail on. Deshelled & deveined. Outstanding choice for Tandoori Prawns or Grill Skewers.',
      category: 'Prawns & Shrimps',
      images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '300g (Net Wt: 300g | Gross Wt: 500g)', price: 529 },
        { label: '600g (Net Wt: 600g | Gross Wt: 1000g)', price: 989 }
      ],
      cuttingOptions: ['Cleaned & Tail On', 'Head On Whole'],
      stock: 20,
      isActive: true,
      badge: 'Premium',
      netWeight: '300g',
      grossWeight: '500g',
      pieces: '8-12 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.9,
      reviewsCount: 490
    },
    {
      name: 'Mud Crab - Whole Cleaned & Cut',
      description: 'Fresh coastal mud crabs, deshelled, cleaned, claws cracked and cut into halves. Sweet juicy meat perfect for spicy Crab Masala Roast.',
      category: 'Crabs & Shellfish',
      images: ['https://images.unsplash.com/photo-1559742811-8228a365ccdf?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '400g (Net Wt: 400g | Gross Wt: 600g)', price: 479 },
        { label: '800g (Net Wt: 800g | Gross Wt: 1200g)', price: 899 }
      ],
      cuttingOptions: ['Cleaned & Halved', 'Whole Cleaned'],
      stock: 15,
      isActive: true,
      badge: 'Coastal Special',
      netWeight: '400g',
      grossWeight: '600g',
      pieces: '2-3 Crabs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.7,
      reviewsCount: 340
    },
    {
      name: 'Tandoori Fish Tikka - Marinated',
      description: 'Boneless Basa cubes marinated in aromatic Indian spices, yogurt & mustard oil. Pan fry or air-fry in 8 minutes!',
      category: 'Ready to Cook',
      images: ['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '350g Pack (Ready to Cook)', price: 329 }
      ],
      cuttingOptions: ['Marinated Cubes'],
      stock: 35,
      isActive: true,
      badge: 'Chef Special',
      netWeight: '350g',
      grossWeight: '350g',
      pieces: '10-12 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.8,
      reviewsCount: 1560
    },
    {
      name: 'Catla - Medium Curry Cut',
      description: 'Sweet freshwater fish descaled and cut into classic ring slices. High protein content, ideal for everyday fish curry.',
      category: 'Freshwater Fish',
      images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '500g (Net Wt: 500g | Gross Wt: 700g)', price: 239 },
        { label: '1000g (Net Wt: 1000g | Gross Wt: 1400g)', price: 449 }
      ],
      cuttingOptions: ['Curry Cut', 'Bengali Cut (with Head)'],
      stock: 70,
      isActive: true,
      badge: 'Daily Essential',
      netWeight: '500g',
      grossWeight: '700g',
      pieces: '6-9 Pcs',
      deliveryTime: 'Today in 90 mins',
      rating: 4.7,
      reviewsCount: 910
    },
    {
      name: 'Hilsa (Ilish) - Premium Padma Cut',
      description: 'The King of Fish! Sourced from Padma/Ganges delta. Rich oily texture, legendary aroma. Perfect for Shorshe Ilish & Ilish Bhapa.',
      category: 'Sea Fish',
      images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '500g (Net Wt: 500g | Gross Wt: 750g)', price: 999 },
        { label: '1000g (Net Wt: 1000g | Gross Wt: 1500g)', price: 1899 }
      ],
      cuttingOptions: ['Padma Curry Cut', 'Whole Fish'],
      stock: 12,
      isActive: true,
      badge: 'Royal Delicacy',
      netWeight: '500g',
      grossWeight: '750g',
      pieces: '5-7 Pcs',
      deliveryTime: 'Tomorrow Morning',
      rating: 4.95,
      reviewsCount: 780
    },
    {
      name: 'Crispy Fish Fingers (Ready to Cook)',
      description: 'Boneless fish strips coated in crunchy panko breadcrumbs and subtle herbs. Deep fry or air-fry for a quick golden snack.',
      category: 'Ready to Cook',
      images: ['https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '250g Pack (Ready to Cook)', price: 279 }
      ],
      cuttingOptions: ['Crumbed Strips'],
      stock: 40,
      isActive: true,
      badge: 'Kids Favorite',
      netWeight: '250g',
      grossWeight: '250g',
      pieces: '8-10 Fingers',
      deliveryTime: 'Today in 90 mins',
      rating: 4.85,
      reviewsCount: 1890
    },
    {
      name: 'Seafood Bestsellers Combo (Surmai + Prawns)',
      description: 'Ultimate seafood lover\'s feast! Includes Surmai Steaks (300g) + Cleaned Large Prawns (250g) at a special combo discount.',
      category: 'Combo Packs',
      images: ['https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'],
      weights: [
        { label: '550g Combo Pack', price: 749 }
      ],
      cuttingOptions: ['Pre-Cut Pack'],
      stock: 20,
      isActive: true,
      badge: 'Super Saver',
      netWeight: '550g',
      grossWeight: '850g',
      pieces: 'Combo Pack',
      deliveryTime: 'Today in 90 mins',
      rating: 4.9,
      reviewsCount: 1120
    }
  ]

  await Product.insertMany(sampleProducts)

  // Create admin, customer and delivery partner users
  await User.deleteMany({ email: { $in: ['admin@fishmart.test', 'customer@fishmart.test', 'delivery@fishmart.test'] } })
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const customerPassword = await bcrypt.hash('Customer123!', 10)
  const deliveryPassword = await bcrypt.hash('Delivery123!', 10)

  await User.create({ name: 'Admin User', email: 'admin@fishmart.test', password: adminPassword, role: 'ADMIN' })
  await User.create({ name: 'Customer User', email: 'customer@fishmart.test', password: customerPassword, role: 'CUSTOMER' })
  await User.create({ name: 'Delivery Partner', email: 'delivery@fishmart.test', password: deliveryPassword, role: 'DELIVERY_PARTNER' })

  console.log('Database seeding complete.')
}

if (require.main === module) {
  connectDB().then(() => seedInitialData()).then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1) })
}