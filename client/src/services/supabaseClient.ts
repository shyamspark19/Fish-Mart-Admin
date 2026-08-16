import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zubxrgefekxlossvqdxj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_G7aTVQe4JqhnzUnAWwI-2g_2CtjgYFM'

/**
 * Checks if a valid Supabase Anon/Publishable Key (sb_publishable_... or eyJ...) is provided.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    (supabaseAnonKey.startsWith('sb_publishable_') || supabaseAnonKey.startsWith('ey'))
  )
}

// Fallback dummy key to prevent initialization crash
const safeAnonKey = isSupabaseConfigured()
  ? supabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'

export const supabase = createClient(supabaseUrl, safeAnonKey)

// supabaseAdmin is an alias — RLS is configured on products/orders tables
export const supabaseAdmin = supabase

/**
 * Supabase Authentication Helper: Sign In User
 */
export async function supabaseSignIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase publishable key is missing. Please set VITE_SUPABASE_ANON_KEY in client/.env')
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

/**
 * Default Real Seafood Catalog with explicit stock quantities (including low stock items)
 */
export const DEFAULT_CATALOG_SEEDS = [
  {
    name: 'Seer Fish (Vanjaram) - Fresh Steak Cut',
    description: 'Cleaned, descaled & cut into firm juicy steaks. Caught fresh from Kasimedu Harbour.',
    category: 'Sea Fish',
    images: ['https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'],
    weights: [{ label: '500g (Net Wt: 500g | Gross: 700g)', price: 699 }],
    cutting_options: ['Steak Cut', 'Curry Cut', 'Fry Cut', 'Boneless Cubes'],
    stock: 35, // In Stock
    badge: 'Bestseller',
    net_weight: '500g',
    gross_weight: '700g',
    pieces: '5-7 Pcs',
    delivery_time: 'Today in 90 mins',
    rating: 4.9,
    reviews_count: 340,
    is_active: true
  },
  {
    name: 'Jumbo Tiger Prawns - Cleaned & Deveined',
    description: 'Fresh Bay of Bengal sea prawns, tail-on, deshelled & deveined for quick frying.',
    category: 'Prawns & Shrimps',
    images: ['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80'],
    weights: [{ label: '350g (Net Wt: 350g | Gross: 500g)', price: 499 }],
    cutting_options: ['Tail-On Deveined', 'Butterflied', 'Whole Cleaned'],
    stock: 8, // LOW STOCK (<10)
    badge: 'Low Stock Alert',
    net_weight: '350g',
    gross_weight: '500g',
    pieces: '18-22 Pcs',
    delivery_time: 'Today in 90 mins',
    rating: 4.85,
    reviews_count: 210,
    is_active: true
  },
  {
    name: 'White Pomfret (Vellai Vavval) - Whole Cleaned',
    description: 'Delicate white flesh with mild sweet flavor. Gutted and descaled for whole tandoori fry.',
    category: 'Sea Fish',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'],
    weights: [{ label: '400g (Net Wt: 400g | Gross: 550g)', price: 549 }],
    cutting_options: ['Whole Cleaned & Gutted', 'Fry Cut', 'Curry Cut'],
    stock: 24, // In Stock
    badge: 'Fresh Catch',
    net_weight: '400g',
    gross_weight: '550g',
    pieces: '2 Pcs',
    delivery_time: 'Today in 90 mins',
    rating: 4.9,
    reviews_count: 180,
    is_active: true
  },
  {
    name: 'Live Blue Sea Mud Crabs - Cleaned',
    description: 'Fresh coastal sea crabs with tender sweet meat. Shell pre-cracked for easy cooking.',
    category: 'Crabs & Shellfish',
    images: ['https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=600&q=80'],
    weights: [{ label: '500g (Net Wt: 500g | Gross: 750g)', price: 599 }],
    cutting_options: ['Cleaned Half-Cut', 'Whole Cleaned'],
    stock: 4, // CRITICAL LOW STOCK (<10)
    badge: 'Limited Catch',
    net_weight: '500g',
    gross_weight: '750g',
    pieces: '2-3 Pcs',
    delivery_time: 'Today in 90 mins',
    rating: 4.75,
    reviews_count: 95,
    is_active: true
  },
  {
    name: 'Black Pomfret (Karuppu Vavval) - Curry Cut',
    description: 'Rich dark sea fish with distinct coastal flavor. Perfect for fiery Chettinad fish curry.',
    category: 'Sea Fish',
    images: ['https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'],
    weights: [{ label: '450g (Net Wt: 450g | Gross: 600g)', price: 429 }],
    cutting_options: ['Curry Cut', 'Steak Cut', 'Fry Cut'],
    stock: 6, // LOW STOCK (<10)
    badge: 'Limited Units',
    net_weight: '450g',
    gross_weight: '600g',
    pieces: '6-8 Pcs',
    delivery_time: 'Today in 90 mins',
    rating: 4.8,
    reviews_count: 140,
    is_active: true
  },
  {
    name: 'Nethili (Anchovy) - Headless Cleaned',
    description: 'Fresh little anchovies, head removed and gutted. Ideal for spicy deep fry and thogayal.',
    category: 'Sea Fish',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'],
    weights: [{ label: '250g (Net Wt: 250g | Gross: 350g)', price: 199 }],
    cutting_options: ['Headless Cleaned', 'Whole Cleaned'],
    stock: 52, // In Stock
    badge: 'Bestseller',
    net_weight: '250g',
    gross_weight: '350g',
    pieces: '30-40 Pcs',
    delivery_time: 'Today in 90 mins',
    rating: 4.95,
    reviews_count: 420,
    is_active: true
  }
]

/**
 * Supabase Database Helper: Fetch All Seafood Products
 * Automatically seeds default items if database table is initially empty
 */
export async function fetchSupabaseProducts() {
  if (!isSupabaseConfigured()) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase product fetch warning:', error.message)
    return []
  }

  // If table is empty, auto-seed default products to database
  if (!data || data.length === 0) {
    try {
      const { data: inserted, error: insertErr } = await supabase
        .from('products')
        .insert(DEFAULT_CATALOG_SEEDS)
        .select()

      if (!insertErr && inserted) {
        return inserted
      }
    } catch (e) {
      console.warn('Auto-seed products error:', e)
    }
  }

  return data || []
}

/**
 * Supabase Database Helper: Fetch All Orders for Admin
 */
export async function fetchSupabaseOrders() {
  if (!isSupabaseConfigured()) return []

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Supabase orders fetch warning:', error.message)
    return []
  }
  return data || []
}

/**
 * Supabase Database Helper: Update Order Status
 */
export async function updateSupabaseOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()

  if (error) {
    console.warn('Supabase order status update error:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Create Product
 */
export async function createSupabaseProduct(payload: any) {
  const insertPayload = {
    name: payload.name,
    description: payload.description,
    category: payload.category,
    images: payload.images || [],
    weights: payload.weights || [],
    cutting_options: payload.cuttingOptions || [],
    stock: Number(payload.stock) || 0,
    badge: payload.badge || (Number(payload.stock) < 10 ? 'Low Stock' : null),
    net_weight: payload.netWeight || null,
    gross_weight: payload.grossWeight || null,
    pieces: payload.pieces || null,
    delivery_time: payload.deliveryTime || 'Today in 90 mins',
    is_active: true
  }

  const { data, error } = await supabase
    .from('products')
    .insert([insertPayload])
    .select()

  if (error) {
    console.error('Supabase product creation error:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Edit Product Details
 */
export async function updateSupabaseProduct(productId: string, payload: any) {
  const stockNum = Number(payload.stock) || 0
  const { data, error } = await supabase
    .from('products')
    .update({
      name: payload.name,
      description: payload.description,
      category: payload.category,
      images: payload.images || [],
      weights: payload.weights || [],
      cutting_options: payload.cuttingOptions || [],
      stock: stockNum,
      badge: payload.badge || (stockNum < 10 ? 'Low Stock' : null),
      net_weight: payload.netWeight || null,
      gross_weight: payload.grossWeight || null,
      pieces: payload.pieces || null
    })
    .eq('id', productId)
    .select()

  if (error) {
    console.warn('Supabase product update error:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Update Real Stock in Database
 */
export async function updateSupabaseProductStock(productId: string, newStock: number) {
  const stockValue = Math.max(0, Number(newStock) || 0)
  const { data, error } = await supabase
    .from('products')
    .update({ 
      stock: stockValue,
      badge: stockValue === 0 ? 'Out of Stock' : (stockValue < 10 ? 'Low Stock' : null)
    })
    .eq('id', productId)
    .select()

  if (error) {
    console.warn('Supabase stock update error:', error.message)
    throw error
  }
  return data?.[0]
}

/**
 * Supabase Database Helper: Delete Product (Soft delete)
 */
export async function deleteSupabaseProduct(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', productId)
    .select()

  if (error) {
    console.warn('Supabase product delete error:', error.message)
    throw error
  }
  return data?.[0]
}
