import React, { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { supabase, fetchSupabaseProducts, fetchSupabaseOrders } from '../services/supabaseClient'
import { useLocation } from 'react-router-dom'
import {
  updateProductStock,
  updateOrderStatus,
  deleteAdminProduct,
  createAdminProduct,
  editAdminProduct
} from '../services/adminService'

interface Product {
  _id: string
  name: string
  description: string
  category: string
  images: string[]
  weights: { label: string; price: number }[]
  cuttingOptions: string[]
  stock: number
  badge?: string
  netWeight?: string
  grossWeight?: string
  pieces?: string
  deliveryTime?: string
  rating?: number
}

interface Order {
  _id: string
  orderNumber: string
  user?: { name: string; email: string }
  address?: { name: string; phone: string; street: string; area: string; city: string }
  items: any[]
  total: number
  paymentMethod: string
  orderStatus: string
  createdAt: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PRODUCTS' | 'ORDERS' | 'MAPS'>('ANALYTICS')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Hub location state for Maps tab (replaces deleted LocationContext)
  const [hubLocation, setHubLocation] = useState({
    lat: 13.0827,
    lng: 80.2707,
    area: 'Central Hub Chennai',
    city: 'Chennai'
  })

  // Product Form State for Read/Write Ops
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sea Fish',
    imageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
    price: 399,
    weightLabel: '300g (Net Wt: 300g | Gross Wt: 450g)',
    stock: 50,
    badge: 'Fresh Catch',
    netWeight: '300g',
    grossWeight: '450g',
    pieces: '4-6 Pcs',
    cuts: 'Steak Cut, Curry Cut, Boneless Cubes'
  })

  // New order notification state
  const [newOrderBanner, setNewOrderBanner] = useState<string | null>(null)
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetchData()

    // ── Supabase Real-Time Subscription ──
    // Fires instantly whenever a customer places an order
    const channel = supabase
      .channel('admin-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newRow = payload.new as any
          const mappedOrder: Order = {
            _id: newRow.id,
            orderNumber: newRow.order_number || ('FM' + String(newRow.id).slice(0, 8).toUpperCase()),
            address: {
              name: newRow.recipient_name,
              phone: newRow.phone,
              street: newRow.address,
              area: '',
              city: ''
            },
            items: newRow.items || [],
            total: newRow.total,
            paymentMethod: newRow.payment_method,
            orderStatus: newRow.status || 'PLACED',
            createdAt: newRow.created_at
          }
          // Prepend new order to top of list
          setOrders(prev => [mappedOrder, ...(Array.isArray(prev) ? prev : [])])
          // Show banner notification
          const customerName = newRow.recipient_name || 'Customer'
          setNewOrderBanner(`🆕 New order from ${customerName} — ₹${newRow.total}`)
          if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
          bannerTimerRef.current = setTimeout(() => setNewOrderBanner(null), 6000)
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as any
          setOrders(prev =>
            (Array.isArray(prev) ? prev : []).map(o =>
              o._id === updated.id ? { ...o, orderStatus: updated.status } : o
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      let prods: any[] = []
      let ords: any[] = []

      // 1. Fetch live products and orders from Supabase database
      const [supaProds, supaOrds] = await Promise.all([
        fetchSupabaseProducts(),
        fetchSupabaseOrders()
      ])

      if (supaProds && supaProds.length > 0) {
        prods = supaProds.map((p: any) => ({
          _id: p.id || p._id,
          name: p.name,
          description: p.description,
          category: p.category,
          images: p.images || [],
          weights: p.weights || [],
          cuttingOptions: p.cuttingOptions || p.cutting_options || [],
          stock: p.stock ?? 50,
          badge: p.badge,
          netWeight: p.netWeight || p.net_weight,
          grossWeight: p.grossWeight || p.gross_weight,
          pieces: p.pieces,
          deliveryTime: p.deliveryTime || p.delivery_time,
          rating: p.rating,
          reviewsCount: p.reviewsCount || p.reviews_count
        }))
      }

      if (supaOrds && supaOrds.length > 0) {
        ords = supaOrds.map((o: any) => ({
          _id: o.id,
          orderNumber: o.order_number || ('FM' + String(o.id).slice(0, 8)),
          address: {
            name: o.recipient_name,
            phone: o.phone,
            street: o.address,
            area: '',
            city: ''
          },
          items: o.items || [],
          total: o.total,
          paymentMethod: o.payment_method,
          orderStatus: o.status || 'PLACED',
          createdAt: o.created_at
        }))
      }

      // 2. Fallback to Express backend API if Supabase is empty
      if (prods.length === 0 || ords.length === 0) {
        try {
          const [prodRes, ordRes] = await Promise.all([
            api.get('/products').catch(() => ({ data: [] })),
            api.get('/orders').catch(() => ({ data: [] }))
          ])
          if (prods.length === 0) prods = prodRes.data || []
          if (ords.length === 0) ords = ordRes.data || []
        } catch (e) { }
      }

      setProducts(prods || [])
      setOrders(ords || [])
      setError('')
    } catch (err: any) {
      console.error(err)
      setError('Failed to fetch admin dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  // 100% REAL-TIME CALCULATIONS FROM LIVE DATABASE STATE
  const safeProducts = Array.isArray(products) ? products : []
  const safeOrders = Array.isArray(orders) ? orders : []

  const totalRevenue = safeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const totalOrdersCount = safeOrders.length
  const totalStockCount = safeProducts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0

  // Real-time Profit & Loss allocations
  const sourcingCost = Math.round(totalRevenue * 0.55)
  const logisticsCost = Math.round(totalRevenue * 0.10)
  const spoilageLoss = Math.round(totalRevenue * 0.02)
  const netProfit = totalRevenue - (sourcingCost + logisticsCost + spoilageLoss)
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0'

  // Real-time category distribution calculated from live products inventory
  const totalProductItems = safeProducts.length || 1
  const categoryCounts = safeProducts.reduce((acc: any, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  const categoryColors: { [key: string]: string } = {
    'Sea Fish': '#F97316',
    'Freshwater Fish': '#F59E0B',
    'Prawns & Shrimps': '#06B6D4',
    'Crabs & Shellfish': '#8B5CF6',
    'Ready to Cook': '#10B981',
    'Combo Packs': '#EC4899'
  }

  let accumulatedPercent = 0
  const categoryData = Object.keys(categoryCounts).map(cat => {
    const count = categoryCounts[cat]
    const percent = Math.round((count / totalProductItems) * 100)
    const strokeDasharray = `${percent} ${100 - percent}`
    const strokeDashoffset = `-${accumulatedPercent}`
    accumulatedPercent += percent
    return {
      name: cat,
      count,
      percent,
      color: categoryColors[cat] || '#3B82F6',
      dash: strokeDasharray,
      offset: strokeDashoffset
    }
  })

  // Real-time order status counts from live orders database
  const deliveredCount = safeOrders.filter(o => o.orderStatus === 'DELIVERED').length
  const outForDeliveryCount = safeOrders.filter(o => o.orderStatus === 'OUT_FOR_DELIVERY').length
  const preparingCount = safeOrders.filter(o => ['PLACED', 'CONFIRMED', 'PREPARING', 'PACKED'].includes(o.orderStatus || '')).length
  const cancelledCount = safeOrders.filter(o => o.orderStatus === 'CANCELLED').length

  const statusData = [
    { name: 'Delivered', color: '#10B981', count: deliveredCount },
    { name: 'Out for Delivery', color: '#06B6D4', count: outForDeliveryCount },
    { name: 'Preparing & Packed', color: '#F59E0B', count: preparingCount },
    { name: 'Cancelled', color: '#EF4444', count: cancelledCount }
  ]

  const handleOpenAddModal = () => {
    setEditingId(null)
    setFormData({
      name: '',
      description: '',
      category: 'Sea Fish',
      imageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
      price: 399,
      weightLabel: '300g (Net Wt: 300g | Gross Wt: 450g)',
      stock: 50,
      badge: 'Fresh Catch',
      netWeight: '300g',
      grossWeight: '450g',
      pieces: '4-6 Pcs',
      cuts: 'Steak Cut, Curry Cut, Boneless Cubes'
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (p: Product) => {
    setEditingId(p._id)
    setFormData({
      name: p.name,
      description: p.description || '',
      category: p.category || 'Sea Fish',
      imageUrl: p.images?.[0] || 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
      price: p.weights?.[0]?.price || 399,
      weightLabel: p.weights?.[0]?.label || '300g',
      stock: p.stock || 0,
      badge: p.badge || '',
      netWeight: p.netWeight || '300g',
      grossWeight: p.grossWeight || '450g',
      pieces: p.pieces || '4-6 Pcs',
      cuts: (p.cuttingOptions || []).join(', ')
    })
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setError('')
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      images: [formData.imageUrl],
      weights: [{ label: formData.weightLabel, price: Number(formData.price) }],
      cuttingOptions: formData.cuts.split(',').map(c => c.trim()).filter(Boolean),
      stock: Number(formData.stock),
      badge: formData.badge,
      netWeight: formData.netWeight,
      grossWeight: formData.grossWeight,
      pieces: formData.pieces,
      deliveryTime: 'Today in 90 mins',
      isActive: true
    }

    try {
      if (editingId) {
        await editAdminProduct(editingId, payload)
        setSuccessMsg(`✓ Product "${formData.name}" updated successfully!`)
      } else {
        const newProduct = await createAdminProduct(payload)
        setSuccessMsg(`✓ Product "${formData.name}" created successfully!`)
        if (newProduct) {
          const mappedNewProd: Product = {
            _id: newProduct.id || newProduct._id || `prod_${Date.now()}`,
            name: newProduct.name || formData.name,
            description: newProduct.description || formData.description,
            category: newProduct.category || formData.category,
            images: newProduct.images || [formData.imageUrl],
            weights: newProduct.weights || [{ label: formData.weightLabel, price: Number(formData.price) }],
            cuttingOptions: newProduct.cutting_options || payload.cuttingOptions,
            stock: newProduct.stock ?? Number(formData.stock),
            badge: newProduct.badge || formData.badge,
            netWeight: newProduct.net_weight || formData.netWeight,
            grossWeight: newProduct.gross_weight || formData.grossWeight,
            pieces: newProduct.pieces || formData.pieces,
            deliveryTime: newProduct.delivery_time || 'Today in 90 mins'
          }
          setProducts(prev => [mappedNewProd, ...(Array.isArray(prev) ? prev : [])])
        }
      }
      setIsModalOpen(false)
      fetchData()
    } catch (err: any) {
      console.error(err)
      setError(err?.message || err?.response?.data?.message || 'Failed to save product.')
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      setSuccessMsg('')
      setError('')
      await deleteAdminProduct(id)
      setSuccessMsg(`✓ Product "${name}" deleted.`)
      fetchData()
    } catch (err: any) {
      setError(err?.message || 'Failed to delete product.')
    }
  }

  const handleStockAdjust = async (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock + delta)
    try {
      setSuccessMsg('')
      setError('')
      await updateProductStock(p._id, newStock)
      setProducts(prev => (Array.isArray(prev) ? prev : []).map(item => item._id === p._id ? { ...item, stock: newStock } : item))
      setSuccessMsg(`✓ Stock for "${p.name}" updated to ${newStock} Pcs`)
    } catch (err: any) {
      console.error(err)
      setError('Failed to update product stock.')
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setSuccessMsg('')
      setError('')
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => (Array.isArray(prev) ? prev : []).map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      setSuccessMsg(`✓ Order status updated to "${newStatus}"`)
    } catch (err: any) {
      setError('Failed to update order status.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-16">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-black uppercase tracking-wider border border-orange-500/30 mb-1">
            <span>⚡ Real-Time Operational Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Fish Mart Store & Order Control</h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-stone-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-500/20 transition-transform active:scale-95 flex items-center gap-2"
        >
          <span>➕ Add New Product</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-amber-950/60 border border-amber-500/50 text-amber-200 rounded-2xl text-xs font-bold animate-fade-in shadow-lg">
          {successMsg}
        </div>
      )}

      {/* Real-Time New Order Notification Banner */}
      {newOrderBanner && (
        <div className="flex items-center justify-between p-4 bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 rounded-2xl text-xs font-black shadow-xl shadow-emerald-900/30 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xl animate-bounce">🔔</span>
            <div>
              <div className="text-emerald-300 font-black">{newOrderBanner}</div>
              <div className="text-emerald-600 text-[10px] font-semibold mt-0.5">Click "Customer Orders" tab to view</div>
            </div>
          </div>
          <button
            onClick={() => { setActiveTab('ORDERS'); setNewOrderBanner(null) }}
            className="px-4 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors"
          >
            View Order →
          </button>
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Real-Time Gross Sales */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-stone-400">Real-Time Gross Sales</span>
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-lg">💰</span>
          </div>
          <div className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-emerald-400">
            {totalOrdersCount} Placed Orders Recorded
          </div>
        </div>

        {/* Card 2: Real-Time Net Profit */}
        <div className="bg-stone-900 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-2 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-300">Net Calculated Profit</span>
            <span className="p-2 bg-amber-500/10 text-amber-400 rounded-xl text-lg">📈</span>
          </div>
          <div className="text-3xl font-black text-amber-400">₹{netProfit.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-amber-300">
            {profitMargin}% Operating Margin
          </div>
        </div>

        {/* Card 3: Real-Time Inventory Stock */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-stone-400">Inventory Units</span>
            <span className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl text-lg">📦</span>
          </div>
          <div className="text-3xl font-black text-white">{totalStockCount} Pcs</div>
          <div className="text-[11px] font-bold text-cyan-400">
            Across {products.length} Active Catalog Items
          </div>
        </div>

        {/* Card 4: Real-Time Average Order Value */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-stone-400">Average Order Value</span>
            <span className="p-2 bg-purple-500/10 text-purple-400 rounded-xl text-lg">⚡</span>
          </div>
          <div className="text-3xl font-black text-purple-300">₹{averageOrderValue}</div>
          <div className="text-[11px] font-bold text-stone-400">
            Calculated per order
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'ANALYTICS'
            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-stone-950 shadow-lg shadow-orange-500/20 font-black'
            : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
        >
          📊 Overall Status (Profit & Loss Analytics)
        </button>
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'PRODUCTS'
            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-stone-950 shadow-lg shadow-orange-500/20 font-black'
            : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
        >
          📦 Product Catalog ({safeProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'ORDERS'
            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-stone-950 shadow-lg shadow-orange-500/20 font-black'
            : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
        >
          📋 Customer Orders ({safeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('MAPS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'MAPS'
            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-stone-950 shadow-lg shadow-orange-500/20 font-black'
            : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
        >
          🗺️ Google Maps Hub Detector
        </button>
      </div>

      {/* TAB 1: 100% REAL-TIME PIE CHARTS & PROFIT & LOSS DETAILS */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-Time Pie Chart 1: Category Inventory Share */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-amber-400">Live Category Inventory Share</h3>
                  <p className="text-xs text-stone-400">Real-time catalog distribution across categories</p>
                </div>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  {safeProducts.length} Catalog Items
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
                {/* Real-time SVG Donut Chart */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-950"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {categoryData.map((cat, idx) => (
                      <path
                        key={idx}
                        stroke={cat.color}
                        strokeDasharray={cat.dash}
                        strokeDashoffset={cat.offset}
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    ))}
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-xl font-black text-white">{products.length}</div>
                    <div className="text-[10px] text-stone-400 uppercase font-bold">Products</div>
                  </div>
                </div>

                {/* Legend List */}
                <div className="space-y-2.5 text-xs font-semibold w-full sm:w-auto">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-2 bg-stone-950 rounded-xl border border-stone-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-stone-200 font-bold">{cat.name}</span>
                      </div>
                      <span className="font-mono font-black text-white">{cat.count} ({cat.percent}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-Time Pie Chart 2: Order Status Distribution */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-amber-400">Live Order Status Breakdown</h3>
                  <p className="text-xs text-stone-400">Real-time status tracking from customer database</p>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  {totalOrdersCount} Total Orders
                </span>
              </div>

              {totalOrdersCount === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs font-bold">
                  No orders recorded in database yet. Place a checkout order to see live breakdown.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {statusData.map((st, idx) => {
                    const percent = Math.round((st.count / totalOrdersCount) * 100)
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-stone-300">{st.name} ({percent}%)</span>
                          <span className="text-white font-mono">{st.count} Orders</span>
                        </div>
                        <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden border border-stone-800">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: st.color
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Profit & Loss (P&L) Statement Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-amber-400">Real-Time Profit & Loss (P&L) Statement</h3>
                <p className="text-xs text-stone-400">Calculated directly from live MongoDB customer orders</p>
              </div>
              <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30">
                {profitMargin}% Operating Margin
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead className="bg-stone-950 text-stone-400 uppercase font-extrabold tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-3.5">Financial Line Item</th>
                    <th className="p-3.5">Allocation Rate</th>
                    <th className="p-3.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-200">
                  <tr>
                    <td className="p-3.5 font-bold text-white">Real-Time Gross Sales Revenue</td>
                    <td className="p-3.5 text-emerald-400 font-bold">100.0%</td>
                    <td className="p-3.5 text-right font-black text-emerald-400">+₹{totalRevenue.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-stone-300">(-) Coastline Direct Seafood Sourcing Cost</td>
                    <td className="p-3.5 text-stone-400">55.0%</td>
                    <td className="p-3.5 text-right font-bold text-rose-400">-₹{sourcingCost.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-stone-300">(-) Cold-Chain Packaging & Delivery Logistics</td>
                    <td className="p-3.5 text-stone-400">10.0%</td>
                    <td className="p-3.5 text-right font-bold text-rose-400">-₹{logisticsCost.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-stone-300">(-) Spoilage, Returns & Order Cancellations</td>
                    <td className="p-3.5 text-stone-400">2.0%</td>
                    <td className="p-3.5 text-right font-bold text-rose-400">-₹{spoilageLoss.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-stone-950 font-black text-sm text-amber-400">
                    <td className="p-4">Calculated Net Operating Profit</td>
                    <td className="p-4">{profitMargin}% Net Margin</td>
                    <td className="p-4 text-right text-amber-400">₹{netProfit.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'PRODUCTS' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <h3 className="text-base font-black text-amber-400">Live Product & Stock Catalog (Read / Write)</h3>
            <span className="text-xs text-stone-400 font-semibold">Total Stock Items: {safeProducts.reduce((acc, p) => acc + (p.stock || 0), 0)} Pcs</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-amber-400">Loading catalog items...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase font-extrabold tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="p-4">Picture</th>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Control</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80 text-stone-200">
                  {safeProducts.map(p => (
                    <tr key={p._id} className="hover:bg-stone-800/50 transition-colors">
                      <td className="p-4">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-xl border border-stone-700 shadow-md"
                        />
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="font-extrabold text-white text-sm">{p.name}</div>
                        {p.badge && (
                          <span className="inline-block text-[10px] font-black uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            {p.badge}
                          </span>
                        )}
                        <div className="text-[11px] text-stone-400">{p.netWeight || '300g'} | {p.pieces || 'Standard'}</div>
                      </td>
                      <td className="p-4 font-bold text-orange-400">{p.category}</td>
                      <td className="p-4 font-black text-white text-sm">
                        ₹{p.weights?.[0]?.price || 299}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockAdjust(p, -5)}
                            className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-700 rounded-lg text-stone-300 font-bold"
                          >
                            -5
                          </button>
                          <span className={`font-black px-2.5 py-1 rounded-lg border ${p.stock > 10 ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' : 'bg-rose-950/40 text-rose-400 border-rose-500/30'}`}>
                            {p.stock} Pcs
                          </span>
                          <button
                            onClick={() => handleStockAdjust(p, +5)}
                            className="px-2.5 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-700 rounded-lg text-stone-300 font-bold"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl font-bold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl font-bold transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'ORDERS' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 bg-stone-950/60">
            <div>
              <h3 className="text-base font-black text-amber-400">Live Customer Orders</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">{safeOrders.length} orders · Auto-updated from Supabase</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Live stats strip */}
              {(['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const).map(s => {
                const count = safeOrders.filter(o => o.orderStatus === s).length
                const colorMap: Record<string, string> = {
                  PLACED: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
                  CONFIRMED: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                  PREPARING: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
                  OUT_FOR_DELIVERY: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
                  DELIVERED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                }
                return count > 0 ? (
                  <span key={s} className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${colorMap[s]}`}>
                    {s.replace('_', ' ')} {count}
                  </span>
                ) : null
              })}
              <button
                onClick={fetchData}
                className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-600 text-stone-950 rounded-xl font-black text-[10px] uppercase tracking-wider hover:from-orange-600 hover:to-amber-700 transition-all"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-amber-400">Loading orders...</div>
          ) : safeOrders.length === 0 ? (
            <div className="text-center py-16 text-stone-500 text-xs font-bold">
              <div className="text-3xl mb-3">🛒</div>
              <div>No customer orders placed yet.</div>
              <div className="text-stone-600 mt-1">Orders will appear here in real-time as customers checkout.</div>
            </div>
          ) : (
            <div className="divide-y divide-stone-800">
              {safeOrders.map(o => {
                const statusColors: Record<string, string> = {
                  PLACED: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
                  CONFIRMED: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                  PREPARING: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
                  PACKED: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
                  OUT_FOR_DELIVERY: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
                  DELIVERED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  CANCELLED: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                }
                const orderTime = o.createdAt
                  ? new Date(o.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : '—'
                const totalItems = Array.isArray(o.items) ? o.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0) : 0
                return (
                  <div key={o._id} className="p-5 hover:bg-stone-800/30 transition-colors">
                    {/* Order header row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-black text-orange-400 font-mono">#{o.orderNumber || o._id?.slice(0, 8).toUpperCase()}</span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${statusColors[o.orderStatus] || 'text-stone-400 bg-stone-800 border-stone-700'}`}>
                            {(o.orderStatus || 'PLACED').replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-white font-bold">👤 {o.address?.name || 'Customer'}</span>
                          <span className="text-stone-400">📞 {o.address?.phone || '—'}</span>
                          <span className="text-stone-500">🕐 {orderTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-base font-black text-white">₹{Number(o.total).toLocaleString()}</div>
                          <div className="text-[10px] text-stone-400 font-medium">{o.paymentMethod} · {totalItems} item{totalItems !== 1 ? 's' : ''}</div>
                        </div>
                        <select
                          value={o.orderStatus || 'PLACED'}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="bg-stone-900 border border-orange-500/30 text-xs font-extrabold text-amber-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          {['PLACED', 'CONFIRMED', 'PREPARING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Address row */}
                    <div className="text-[11px] text-stone-400 mb-3 flex items-start gap-1.5">
                      <span>📍</span>
                      <span className="text-stone-300">{o.address?.street || o.address?.area || 'Address not provided'}{o.address?.city ? `, ${o.address.city}` : ''}</span>
                    </div>

                    {/* Items breakdown */}
                    {Array.isArray(o.items) && o.items.length > 0 && (
                      <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 space-y-2">
                        <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider mb-1">
                          🐟 Ordered Items ({o.items.length})
                        </div>
                        {o.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-stone-200">
                              <span className="text-amber-400 font-black">×{item.quantity || 1}</span>
                              <span className="font-bold text-white">{item.name || 'Seafood Item'}</span>
                              <span className="text-stone-500">
                                {item.weightLabel || item.weight ? `· ${item.weightLabel || item.weight}` : ''}
                                {item.cutting ? ` · ${item.cutting}` : ''}
                              </span>
                            </div>
                            <span className="font-black text-emerald-400">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-stone-800 flex justify-between text-xs font-black">
                          <span className="text-stone-400">Order Total</span>
                          <span className="text-white">₹{Number(o.total).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GOOGLE MAPS HUB DETECTOR */}
      {activeTab === 'MAPS' && (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-amber-400">Google Maps Delivery Hub Detector</h3>
            <p className="text-xs text-stone-400">Configure central fulfillment hub coordinates and coverage radius.</p>
          </div>

          <div className="h-72 rounded-2xl overflow-hidden border border-stone-800 relative bg-stone-950">
            <iframe
              title="Google Maps Admin Fulfillment Hub"
              src={`https://maps.google.com/maps?q=${hubLocation.lat},${hubLocation.lng}&z=13&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>

          <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl flex items-center justify-between text-xs text-stone-300">
            <div>
              Active Hub: <strong className="text-white">{hubLocation.area}, {hubLocation.city}</strong> ({hubLocation.lat.toFixed(4)}, {hubLocation.lng.toFixed(4)})
            </div>
            <button
              onClick={() => setHubLocation({ lat: 13.0827, lng: 80.2707, area: 'Central Hub Chennai', city: 'Chennai' })}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-stone-950 rounded-xl font-bold uppercase text-[10px] tracking-wider"
            >
              Reset to Central Hub
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL (SUNSET THEME) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-stone-900 border border-orange-500/40 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-lg font-black text-amber-400">{editingId ? 'Edit Product Details' : 'Add New Seafood Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-300">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Atlantic Salmon Steaks"
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  >
                    {['Sea Fish', 'Freshwater Fish', 'Prawns & Shrimps', 'Crabs & Shellfish', 'Ready to Cook', 'Combo Packs'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300">Initial Stock (Pcs)</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Bestseller, Fresh Catch"
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-300">Image Picture URL</label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2 flex items-center gap-3 bg-stone-950 p-2 rounded-xl border border-stone-800">
                      <img src={formData.imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-stone-700" />
                      <span className="text-[10px] text-stone-400">Picture Live Preview</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-300">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-stone-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-stone-300">Cutting Options (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.cuts}
                    onChange={e => setFormData({ ...formData, cuts: e.target.value })}
                    placeholder="Steak Cut, Curry Cut, Boneless Cubes"
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95"
              >
                Save Product to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
