import React, { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import { supabase, fetchSupabaseProducts, fetchSupabaseOrders } from '../services/supabaseClient'
import { useLanguage } from '../context/LanguageContext'
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

export interface DeliveryPartner {
  id: string
  name: string
  phone: string
  email: string
  address: string
  photo: string
  vehicleType: string
  vehicleNumber: string
  zone: string
  rating: number
  deliveriesCompleted: number
  status: 'ACTIVE' | 'ON_DELIVERY' | 'OFFLINE'
  joinedDate: string
}

export interface DeliveryAssignment {
  orderId: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  partnerId: string
  partnerName: string
  pickupStatus: 'PENDING_PICKUP' | 'PICKED_UP' | 'AT_HUB'
  deliveryStatus: 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  itemsSummary: string
  orderTotal: number
  etaMinutes: number
  updatedAt: string
}

export interface CustomerFeedback {
  id: string
  orderNumber: string
  customerName: string
  partnerName: string
  rating: number
  comment: string
  deliverySpeed: 'FAST' | 'ON_TIME' | 'DELAYED'
  hygieneCondition: 'EXCELLENT' | 'GOOD' | 'AVERAGE'
  date: string
}

const INITIAL_PARTNERS: DeliveryPartner[] = [
  {
    id: 'dp_1',
    name: 'Karthik Raja',
    phone: '+91 98401 23456',
    email: 'karthik.raja@fishmart.delivery',
    address: 'No. 42, 1st Cross, OMR Road, Thoraipakkam, Chennai - 600097',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    vehicleType: 'Refrigerated EV Scooter',
    vehicleNumber: 'TN 07 BZ 4182',
    zone: 'OMR & Velachery Corridor',
    rating: 4.9,
    deliveriesCompleted: 342,
    status: 'ACTIVE',
    joinedDate: 'Jan 2025'
  },
  {
    id: 'dp_2',
    name: 'Senthil Kumar',
    phone: '+91 98842 87654',
    email: 'senthil.k@fishmart.delivery',
    address: 'No. 18, North Usman Road, T. Nagar, Chennai - 600017',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    vehicleType: 'Insulated Cold-Box Bike',
    vehicleNumber: 'TN 09 CK 9021',
    zone: 'T. Nagar & Anna Nagar Hub',
    rating: 4.8,
    deliveriesCompleted: 512,
    status: 'ON_DELIVERY',
    joinedDate: 'Nov 2024'
  },
  {
    id: 'dp_3',
    name: 'Muruganathan P.',
    phone: '+91 97903 54321',
    email: 'murugan.p@fishmart.delivery',
    address: 'No. 88, Harbour Main Road, Royapuram, Chennai - 600013',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    vehicleType: 'Cold-Chain Delivery Van',
    vehicleNumber: 'TN 04 EE 6734',
    zone: 'Kasimedu Coastal & North Chennai',
    rating: 4.95,
    deliveriesCompleted: 680,
    status: 'ACTIVE',
    joinedDate: 'Aug 2024'
  },
  {
    id: 'dp_4',
    name: 'Vigneshwaran S.',
    phone: '+91 94432 11987',
    email: 'vignesh.s@fishmart.delivery',
    address: 'No. 24, DB Road, RS Puram, Coimbatore - 641002',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    vehicleType: 'Refrigerated Scooter',
    vehicleNumber: 'TN 37 AF 5512',
    zone: 'Coimbatore RS Puram & Peelamedu',
    rating: 4.75,
    deliveriesCompleted: 219,
    status: 'ACTIVE',
    joinedDate: 'Feb 2025'
  }
]

const INITIAL_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'fb_1',
    orderNumber: 'FM7829A1',
    customerName: 'Anitha Ramachandran',
    partnerName: 'Karthik Raja',
    rating: 5,
    comment: 'Super fast delivery! Seer fish was perfectly chilled and packed in ice. Arrived in just 45 minutes.',
    deliverySpeed: 'FAST',
    hygieneCondition: 'EXCELLENT',
    date: 'Today, 10:45 AM'
  },
  {
    id: 'fb_2',
    orderNumber: 'FM9910C2',
    customerName: 'Vijay Shankar',
    partnerName: 'Senthil Kumar',
    rating: 5,
    comment: 'Prawns were cleaned so neatly and the partner handled the cold-box carefully. Highly recommended!',
    deliverySpeed: 'ON_TIME',
    hygieneCondition: 'EXCELLENT',
    date: 'Today, 09:30 AM'
  },
  {
    id: 'fb_3',
    orderNumber: 'FM5541B8',
    customerName: 'Meenakshi Sundaram',
    partnerName: 'Muruganathan P.',
    rating: 4,
    comment: 'Very polite delivery partner. Fish temperature was intact and completely odor-free packaging.',
    deliverySpeed: 'ON_TIME',
    hygieneCondition: 'GOOD',
    date: 'Yesterday, 06:15 PM'
  }
]

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PRODUCTS' | 'ORDERS' | 'MAPS' | 'DELIVERY'>('ANALYTICS')
  const [deliverySubTab, setDeliverySubTab] = useState<'ORDERS' | 'PICKUP' | 'FEEDBACK' | 'PROFILES'>('PROFILES')

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Hub location state for Maps tab
  const [hubLocation, setHubLocation] = useState({
    lat: 13.0827,
    lng: 80.2707,
    area: 'Central Hub Chennai',
    city: 'Chennai'
  })

  // Delivery Partners State
  const [partners, setPartners] = useState<DeliveryPartner[]>(INITIAL_PARTNERS)
  const [feedbacks] = useState<CustomerFeedback[]>(INITIAL_FEEDBACK)
  const [editingPartner, setEditingPartner] = useState<DeliveryPartner | null>(null)
  const [partnerFormData, setPartnerFormData] = useState<Partial<DeliveryPartner>>({})

  // Delivery Assignments State
  const [assignments, setAssignments] = useState<DeliveryAssignment[]>([
    {
      orderId: 'ord_1',
      orderNumber: 'FM-CH-8821',
      customerName: 'Priya Narayanan',
      customerPhone: '+91 98840 55112',
      customerAddress: 'Flat 4B, Emerald Apts, 2nd Main Rd, Besant Nagar, Chennai',
      partnerId: 'dp_1',
      partnerName: 'Karthik Raja',
      pickupStatus: 'PICKED_UP',
      deliveryStatus: 'OUT_FOR_DELIVERY',
      itemsSummary: 'Seer Fish Steak (500g), Tiger Prawns (500g)',
      orderTotal: 1249,
      etaMinutes: 24,
      updatedAt: '10 mins ago'
    },
    {
      orderId: 'ord_2',
      orderNumber: 'FM-CH-9104',
      customerName: 'Raghavan S.',
      customerPhone: '+91 97911 22334',
      customerAddress: 'No. 12, 5th Avenue, Anna Nagar East, Chennai',
      partnerId: 'dp_2',
      partnerName: 'Senthil Kumar',
      pickupStatus: 'PENDING_PICKUP',
      deliveryStatus: 'ASSIGNED',
      itemsSummary: 'White Pomfret Curry Cut (1kg)',
      orderTotal: 899,
      etaMinutes: 50,
      updatedAt: '18 mins ago'
    },
    {
      orderId: 'ord_3',
      orderNumber: 'FM-CH-6540',
      customerName: 'Deepa Krishnan',
      customerPhone: '+91 94440 99887',
      customerAddress: 'Villa 18, Palm Meadows, ECR Road, Palavakkam, Chennai',
      partnerId: 'dp_3',
      partnerName: 'Muruganathan P.',
      pickupStatus: 'PICKED_UP',
      deliveryStatus: 'DELIVERED',
      itemsSummary: 'Mud Crabs (2 pcs), Salmon Cubes (300g)',
      orderTotal: 1650,
      etaMinutes: 0,
      updatedAt: '35 mins ago'
    }
  ])

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

    // Supabase Real-Time Subscription
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
          setOrders(prev => [mappedOrder, ...(Array.isArray(prev) ? prev : [])])
          const customerName = newRow.recipient_name || 'Customer'
          setNewOrderBanner(`New order received from ${customerName} — ₹${newRow.total}`)
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

  const safeProducts = Array.isArray(products) ? products : []
  const safeOrders = Array.isArray(orders) ? orders : []

  const totalRevenue = safeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const totalOrdersCount = safeOrders.length
  const totalStockCount = safeProducts.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0

  const sourcingCost = Math.round(totalRevenue * 0.55)
  const logisticsCost = Math.round(totalRevenue * 0.10)
  const spoilageLoss = Math.round(totalRevenue * 0.02)
  const netProfit = totalRevenue - (sourcingCost + logisticsCost + spoilageLoss)
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0'

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
        setSuccessMsg(`Product "${formData.name}" updated successfully!`)
      } else {
        const newProduct = await createAdminProduct(payload)
        setSuccessMsg(`Product "${formData.name}" created successfully!`)
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
      setSuccessMsg(`Product "${name}" deleted.`)
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
      setSuccessMsg(`Stock for "${p.name}" updated to ${newStock} Pcs`)
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
      setSuccessMsg(`Order status updated to "${newStatus}"`)
    } catch (err: any) {
      setError('Failed to update order status.')
    }
  }

  // Delivery Partner Handlers
  const handleOpenEditPartner = (partner: DeliveryPartner) => {
    setEditingPartner(partner)
    setPartnerFormData({ ...partner })
  }

  const handleSavePartnerProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPartner) return

    const updated = {
      ...editingPartner,
      ...partnerFormData
    } as DeliveryPartner

    setPartners(prev => prev.map(p => p.id === updated.id ? updated : p))

    // Update partner name in assignments if changed
    if (updated.name !== editingPartner.name) {
      setAssignments(prev => prev.map(a => a.partnerId === updated.id ? { ...a, partnerName: updated.name } : a))
    }

    setEditingPartner(null)
    setSuccessMsg(`Delivery partner profile for "${updated.name}" updated successfully.`)
  }

  const handleTogglePickupStatus = (assignmentOrderId: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.orderId === assignmentOrderId) {
        const nextStatus = a.pickupStatus === 'PENDING_PICKUP' ? 'PICKED_UP' : (a.pickupStatus === 'PICKED_UP' ? 'AT_HUB' : 'PENDING_PICKUP')
        return { ...a, pickupStatus: nextStatus, updatedAt: 'Just now' }
      }
      return a
    }))
    setSuccessMsg('Pickup status updated.')
  }

  const handleAssignmentDeliveryStatusChange = (assignmentOrderId: string, nextStatus: any) => {
    setAssignments(prev => prev.map(a => {
      if (a.orderId === assignmentOrderId) {
        return { ...a, deliveryStatus: nextStatus, updatedAt: 'Just now' }
      }
      return a
    }))
    setSuccessMsg('Delivery assignment status updated.')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans pb-16">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wider border border-cyan-500/20 mb-1.5">
            <span>{t('admin.liveOps')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('brand.title')} — {t('admin.control')}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
          >
            + {t('btn.addNewProduct')}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 rounded-2xl text-xs font-semibold animate-fade-in shadow-lg flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white font-bold text-xs ml-4">✕</button>
        </div>
      )}

      {/* Real-Time New Order Notification Banner */}
      {newOrderBanner && (
        <div className="flex items-center justify-between p-4 bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 rounded-2xl text-xs font-bold shadow-xl shadow-cyan-900/30 animate-fade-in">
          <div>{newOrderBanner}</div>
          <button
            onClick={() => { setActiveTab('ORDERS'); setNewOrderBanner(null) }}
            className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            View Orders &rarr;
          </button>
        </div>
      )}

      {/* 4 Analytics Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('stat.grossSales')}</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md text-[10px] font-bold border border-emerald-500/20">LIVE</span>
          </div>
          <div className="text-3xl font-extrabold text-white">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] font-medium text-emerald-400">
            {totalOrdersCount} Verified Placed Orders
          </div>
        </div>

        {/* Card 2: Net Profit */}
        <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-5 shadow-xl space-y-2 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{t('stat.netProfit')}</span>
            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md text-[10px] font-bold border border-cyan-500/20">{profitMargin}%</span>
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">₹{netProfit.toLocaleString()}</div>
          <div className="text-[11px] font-medium text-cyan-300">
            Estimated Net Operating Margin
          </div>
        </div>

        {/* Card 3: Inventory Units */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('stat.inventoryUnits')}</span>
            <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-md text-[10px] font-bold border border-sky-500/20">STOCK</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalStockCount} Pcs</div>
          <div className="text-[11px] font-medium text-sky-400">
            Across {products.length} Active Catalog Items
          </div>
        </div>

        {/* Card 4: Average Order Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('stat.avgOrderValue')}</span>
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md text-[10px] font-bold border border-purple-500/20">AOV</span>
          </div>
          <div className="text-3xl font-extrabold text-purple-300">₹{averageOrderValue}</div>
          <div className="text-[11px] font-medium text-slate-400">
            Calculated per order checkout
          </div>
        </div>
      </div>

      {/* Admin 5 Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ANALYTICS'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {t('tab.analytics')}
        </button>

        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'PRODUCTS'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {t('tab.products')} ({safeProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ORDERS'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {t('tab.orders')} ({safeOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('DELIVERY')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'DELIVERY'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {t('tab.delivery')} ({partners.length})
        </button>

        <button
          onClick={() => setActiveTab('MAPS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'MAPS'
              ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          {t('tab.maps')}
        </button>
      </div>

      {/* ── TAB 1: ANALYTICS ── */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Inventory Share */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-cyan-400">Live Category Inventory Distribution</h3>
                  <p className="text-xs text-slate-400">Catalog share across seafood categories</p>
                </div>
                <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                  {safeProducts.length} Items
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-950"
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
                    <div className="text-xl font-extrabold text-white">{products.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">SKUs</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-medium w-full sm:w-auto">
                  {categoryData.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-slate-200">{cat.name}</span>
                      </div>
                      <span className="font-mono font-bold text-white">{cat.count} ({cat.percent}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-cyan-400">Order Fulfillment Breakdown</h3>
                  <p className="text-xs text-slate-400">Real-time status tracking from customer database</p>
                </div>
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  {totalOrdersCount} Total Orders
                </span>
              </div>

              {totalOrdersCount === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs font-medium">
                  No orders recorded yet. Checkout orders will show live status breakdowns here.
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {statusData.map((st, idx) => {
                    const percent = Math.round((st.count / totalOrdersCount) * 100)
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{st.name} ({percent}%)</span>
                          <span className="text-white font-mono">{st.count} Orders</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
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

          {/* Profit & Loss Statement Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-cyan-400">Profit & Loss (P&L) Operating Breakdown</h3>
                <p className="text-xs text-slate-400">Calculated directly from confirmed order revenues</p>
              </div>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/30">
                {profitMargin}% Operating Margin
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Financial Line Item</th>
                    <th className="p-3.5">Allocation Rate</th>
                    <th className="p-3.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="p-3.5 font-bold text-white">Gross Sales Revenue</td>
                    <td className="p-3.5 text-emerald-400 font-semibold">100.0%</td>
                    <td className="p-3.5 text-right font-bold text-emerald-400">+₹{totalRevenue.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-slate-300">(-) Direct Coastal Seafood Sourcing Cost</td>
                    <td className="p-3.5 text-slate-400">55.0%</td>
                    <td className="p-3.5 text-right font-semibold text-rose-400">-₹{sourcingCost.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-slate-300">(-) Cold-Chain Packaging & Delivery Logistics</td>
                    <td className="p-3.5 text-slate-400">10.0%</td>
                    <td className="p-3.5 text-right font-semibold text-rose-400">-₹{logisticsCost.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-slate-300">(-) Spoilage, Returns & Order Cancellations</td>
                    <td className="p-3.5 text-slate-400">2.0%</td>
                    <td className="p-3.5 text-right font-semibold text-rose-400">-₹{spoilageLoss.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-950 font-bold text-sm text-cyan-400">
                    <td className="p-4">Calculated Net Operating Profit</td>
                    <td className="p-4">{profitMargin}% Net Margin</td>
                    <td className="p-4 text-right text-cyan-400">₹{netProfit.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PRODUCTS ── */}
      {activeTab === 'PRODUCTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <h3 className="text-base font-bold text-cyan-400">Live Product & Stock Catalog</h3>
            <span className="text-xs text-slate-400 font-medium">Total Inventory: {safeProducts.reduce((acc, p) => acc + (p.stock || 0), 0)} Units</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-semibold text-cyan-400">Loading catalog items...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Picture</th>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Control</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {safeProducts.map(p => (
                    <tr key={p._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80'}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-700 shadow-md"
                        />
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        {p.badge && (
                          <span className="inline-block text-[10px] font-bold uppercase text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {p.badge}
                          </span>
                        )}
                        <div className="text-[11px] text-slate-400">{p.netWeight || '300g'} | {p.pieces || 'Standard'}</div>
                      </td>
                      <td className="p-4 font-semibold text-sky-400">{p.category}</td>
                      <td className="p-4 font-bold text-white text-sm">
                        ₹{p.weights?.[0]?.price || 299}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockAdjust(p, -5)}
                            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-semibold cursor-pointer"
                          >
                            -5
                          </button>
                          <span className={`font-bold px-2.5 py-1 rounded-lg border text-xs ${p.stock > 10 ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' : 'bg-rose-950/40 text-rose-400 border-rose-500/30'}`}>
                            {p.stock} Pcs
                          </span>
                          <button
                            onClick={() => handleStockAdjust(p, +5)}
                            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-semibold cursor-pointer"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-xl font-semibold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl font-semibold transition-colors cursor-pointer"
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

      {/* ── TAB 3: ORDERS ── */}
      {activeTab === 'ORDERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/60">
            <div>
              <h3 className="text-base font-bold text-cyan-400">Live Customer Orders</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{safeOrders.length} orders recorded in Supabase</p>
            </div>
            <div className="flex items-center gap-3">
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
                  <span key={s} className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${colorMap[s]}`}>
                    {s.replace('_', ' ')}: {count}
                  </span>
                ) : null
              })}
              <button
                onClick={fetchData}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:from-cyan-400 hover:to-sky-500 transition-all cursor-pointer"
              >
                {t('btn.refresh')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-semibold text-cyan-400">Loading orders...</div>
          ) : safeOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs font-medium">
              <div>No customer orders placed yet.</div>
              <div className="text-slate-600 mt-1">Orders will appear here in real-time as customers place requests.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
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
                  <div key={o._id} className="p-5 hover:bg-slate-800/30 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-cyan-400 font-mono">#{o.orderNumber || o._id?.slice(0, 8).toUpperCase()}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[o.orderStatus] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                            {(o.orderStatus || 'PLACED').replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="text-white font-semibold">{o.address?.name || 'Customer'}</span>
                          <span className="text-slate-400">{o.address?.phone || '—'}</span>
                          <span className="text-slate-500">{orderTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-base font-extrabold text-white">₹{Number(o.total).toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{o.paymentMethod} · {totalItems} item{totalItems !== 1 ? 's' : ''}</div>
                        </div>
                        <select
                          value={o.orderStatus || 'PLACED'}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="bg-slate-900 border border-cyan-500/30 text-xs font-bold text-cyan-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          {['PLACED', 'CONFIRMED', 'PREPARING', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(s => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-3 flex items-start gap-1.5">
                      <span className="text-slate-300">{o.address?.street || o.address?.area || 'Address not provided'}{o.address?.city ? `, ${o.address.city}` : ''}</span>
                    </div>

                    {Array.isArray(o.items) && o.items.length > 0 && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                        <div className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider mb-1">
                          Ordered Items ({o.items.length})
                        </div>
                        {o.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-200">
                              <span className="text-cyan-400 font-bold">×{item.quantity || 1}</span>
                              <span className="font-semibold text-white">{item.name || 'Seafood Item'}</span>
                              <span className="text-slate-500">
                                {item.weightLabel || item.weight ? `· ${item.weightLabel || item.weight}` : ''}
                                {item.cutting ? ` · ${item.cutting}` : ''}
                              </span>
                            </div>
                            <span className="font-bold text-emerald-400">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: DELIVERY PARTNER FLEET MANAGEMENT (NEW SECTION) ── */}
      {activeTab === 'DELIVERY' && (
        <div className="space-y-6">
          {/* Header Strip & Sub-navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-lg font-bold text-cyan-400">{t('delivery.title')}</h3>
                <p className="text-xs text-slate-400">{t('delivery.subtitle')}</p>
              </div>

              {/* Delivery Quick KPI Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-400 text-[11px] block">{t('delivery.activePartners')}</span>
                  <span className="font-bold text-white">{partners.filter(p => p.status !== 'OFFLINE').length} / {partners.length}</span>
                </div>
                <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-400 text-[11px] block">{t('delivery.fleetRating')}</span>
                  <span className="font-bold text-emerald-400">4.88 / 5.0</span>
                </div>
                <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                  <span className="text-slate-400 text-[11px] block">{t('delivery.onTimeRate')}</span>
                  <span className="font-bold text-cyan-400">96.4%</span>
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setDeliverySubTab('PROFILES')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  deliverySubTab === 'PROFILES'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t('delivery.subTab.profiles')} ({partners.length})
              </button>

              <button
                onClick={() => setDeliverySubTab('ORDERS')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  deliverySubTab === 'ORDERS'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t('delivery.subTab.orders')} ({assignments.length})
              </button>

              <button
                onClick={() => setDeliverySubTab('PICKUP')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  deliverySubTab === 'PICKUP'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t('delivery.subTab.pickup')} ({assignments.filter(a => a.pickupStatus !== 'AT_HUB').length})
              </button>

              <button
                onClick={() => setDeliverySubTab('FEEDBACK')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  deliverySubTab === 'FEEDBACK'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t('delivery.subTab.feedback')} ({feedbacks.length})
              </button>
            </div>
          </div>

          {/* 1. PARTNER PROFILES (WITH CLICK TO EDIT) */}
          {deliverySubTab === 'PROFILES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {partners.map(p => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:border-cyan-500/60 transition-colors"
                      />
                      <div>
                        <div className="font-bold text-white text-base flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.status === 'ACTIVE'
                              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                              : p.status === 'ON_DELIVERY'
                              ? 'bg-cyan-950/50 text-cyan-400 border-cyan-500/30'
                              : 'bg-slate-950 text-slate-400 border-slate-700'
                          }`}>
                            {p.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{p.zone}</div>
                        <div className="text-[11px] text-cyan-300 font-semibold mt-1">
                          Rating: {p.rating} / 5.0 · {p.deliveriesCompleted} Deliveries Done
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEditPartner(p)}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('delivery.editProfile')}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone</span>
                      <span className="text-slate-200 font-semibold">{p.phone}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Email</span>
                      <span className="text-slate-200 font-semibold truncate block">{p.email}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 sm:col-span-2">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Address / Base Hub</span>
                      <span className="text-slate-300 font-normal leading-relaxed">{p.address}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 sm:col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Vehicle Details</span>
                        <span className="text-slate-200 font-semibold">{p.vehicleType}</span>
                      </div>
                      <span className="font-mono text-cyan-400 font-bold">{p.vehicleNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. ORDER STATUS (ASSIGNED DELIVERIES) */}
          {deliverySubTab === 'ORDERS' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <h3 className="text-base font-bold text-cyan-400">Active Delivery Assignments & Stage</h3>
                <span className="text-xs text-slate-400">{assignments.length} Deliveries Tracked</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Order ID & Total</th>
                      <th className="p-4">Customer & Address</th>
                      <th className="p-4">Assigned Partner</th>
                      <th className="p-4">Pickup Stage</th>
                      <th className="p-4">Delivery Stage</th>
                      <th className="p-4">ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {assignments.map(a => (
                      <tr key={a.orderId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 space-y-1">
                          <div className="font-mono font-bold text-cyan-400">{a.orderNumber}</div>
                          <div className="font-bold text-white text-sm">₹{a.orderTotal}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{a.itemsSummary}</div>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <div className="font-bold text-white">{a.customerName}</div>
                          <div className="text-slate-400 text-[11px]">{a.customerPhone}</div>
                          <div className="text-slate-400 text-[11px] max-w-[220px] truncate">{a.customerAddress}</div>
                        </td>
                        <td className="p-4 font-bold text-slate-200">
                          <div className="flex items-center gap-2">
                            <span>{a.partnerName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            a.pickupStatus === 'PICKED_UP'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                              : a.pickupStatus === 'AT_HUB'
                              ? 'bg-sky-950/40 text-sky-400 border-sky-500/30'
                              : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                          }`}>
                            {a.pickupStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={a.deliveryStatus}
                            onChange={(e) => handleAssignmentDeliveryStatusChange(a.orderId, e.target.value)}
                            className="bg-slate-950 border border-cyan-500/30 text-xs font-bold text-cyan-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-300">
                          {a.deliveryStatus === 'DELIVERED' ? 'Completed' : `${a.etaMinutes} mins`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PICKUP STATUS */}
          {deliverySubTab === 'PICKUP' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div>
                  <h3 className="text-base font-bold text-cyan-400">Harbour Hub & Store Pickup Status</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Verification of packaging handover from dock/hub to courier</p>
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {assignments.map(a => (
                  <div key={a.orderId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-cyan-400 text-sm">{a.orderNumber}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          a.pickupStatus === 'PICKED_UP'
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : a.pickupStatus === 'AT_HUB'
                            ? 'bg-sky-950/40 text-sky-400 border-sky-500/30'
                            : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                        }`}>
                          {a.pickupStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-white font-semibold">
                        Assigned Courier: <span className="text-cyan-300">{a.partnerName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {a.itemsSummary} · ₹{a.orderTotal}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-[11px] text-slate-500">
                        Updated {a.updatedAt}
                      </div>
                      <button
                        onClick={() => handleTogglePickupStatus(a.orderId)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:from-cyan-400 hover:to-sky-500 shadow-md shadow-cyan-500/20 cursor-pointer"
                      >
                        Toggle Pickup Stage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CUSTOMER FEEDBACK */}
          {deliverySubTab === 'FEEDBACK' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {feedbacks.map(f => (
                  <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm">{f.customerName}</div>
                      <span className="font-bold text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {f.rating} / 5.0 Rating
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-normal italic leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      "{f.comment}"
                    </p>

                    <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Partner:</span>
                        <span className="text-cyan-300 font-semibold">{f.partnerName}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Delivery Speed:</span>
                        <span className="text-emerald-400 font-semibold">{f.deliverySpeed}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Hygiene & Condition:</span>
                        <span className="text-sky-400 font-semibold">{f.hygieneCondition}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 pt-1 text-[10px]">
                        <span>Order #{f.orderNumber}</span>
                        <span>{f.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: MAPS ── */}
      {activeTab === 'MAPS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-cyan-400">Google Maps Central Fulfillment Hub</h3>
            <p className="text-xs text-slate-400">Fulfillment dock coordinates and dispatch radial zone</p>
          </div>

          <div className="h-72 rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
            <iframe
              title="Google Maps Admin Fulfillment Hub"
              src={`https://maps.google.com/maps?q=${hubLocation.lat},${hubLocation.lng}&z=13&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div>
              Active Base Hub: <strong className="text-white">{hubLocation.area}, {hubLocation.city}</strong> ({hubLocation.lat.toFixed(4)}, {hubLocation.lng.toFixed(4)})
            </div>
            <button
              onClick={() => setHubLocation({ lat: 13.0827, lng: 80.2707, area: 'Central Hub Chennai', city: 'Chennai' })}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider cursor-pointer"
            >
              Reset to Central Hub
            </button>
          </div>
        </div>
      )}

      {/* ── EDIT DELIVERY PARTNER PROFILE MODAL ── */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-cyan-400">{t('modal.editPartner')}</h3>
                <p className="text-xs text-slate-400">Update profile details, contact info, and base location</p>
              </div>
              <button
                onClick={() => setEditingPartner(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePartnerProfile} className="space-y-4 text-xs font-medium">
              {/* Picture Live Preview */}
              <div className="flex items-center gap-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <img
                  src={partnerFormData.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt="Partner Preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md"
                />
                <div className="space-y-1 flex-1">
                  <label className="text-slate-300 text-[11px] font-bold block">{t('modal.photo')}</label>
                  <input
                    type="text"
                    required
                    value={partnerFormData.photo || ''}
                    onChange={e => setPartnerFormData({ ...partnerFormData, photo: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">{t('modal.name')}</label>
                  <input
                    type="text"
                    required
                    value={partnerFormData.name || ''}
                    onChange={e => setPartnerFormData({ ...partnerFormData, name: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">{t('modal.phone')}</label>
                  <input
                    type="text"
                    required
                    value={partnerFormData.phone || ''}
                    onChange={e => setPartnerFormData({ ...partnerFormData, phone: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold">{t('modal.email')}</label>
                  <input
                    type="email"
                    required
                    value={partnerFormData.email || ''}
                    onChange={e => setPartnerFormData({ ...partnerFormData, email: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-bold">{t('modal.address')}</label>
                  <textarea
                    rows={2}
                    required
                    value={partnerFormData.address || ''}
                    onChange={e => setPartnerFormData({ ...partnerFormData, address: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">{t('modal.zone')}</label>
                  <input
                    type="text"
                    required
                    value={partnerFormData.zone || ''}
                    onChange={e => setPartnerFormData({ ...partnerFormData, zone: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Vehicle Reg Number</label>
                  <input
                    type="text"
                    required
                    value={partnerFormData.vehicleNumber || ''}
                    onChange={e => setPartnerFormData({ ...partnerFormData, vehicleNumber: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  {t('modal.save')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {t('modal.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-cyan-400">{editingId ? 'Edit Product Details' : 'Add New Seafood Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Atlantic Salmon Steaks"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {['Sea Fish', 'Freshwater Fish', 'Prawns & Shrimps', 'Crabs & Shellfish', 'Ready to Cook', 'Combo Packs'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Initial Stock (Pcs)</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Bestseller, Fresh Catch"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300">Image Picture URL</label>
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  ></textarea>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300">Cutting Options (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.cuts}
                    onChange={e => setFormData({ ...formData, cuts: e.target.value })}
                    placeholder="Steak Cut, Curry Cut, Boneless Cubes"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
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
