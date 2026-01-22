import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qhyuoiyamcxxjsznbiyt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoeXVvaXlhbWN4eGpzem5iaXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMDgzMTMsImV4cCI6MjA4NDY4NDMxM30.Z1CfW5H_x0Pgyftqro_KVDqzvU7nvOlwU1n2snCWh58'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database
export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  address?: string
  city?: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  shipping_cost: number
  customer_name: string
  customer_phone: string
  customer_email?: string
  shipping_address?: string
  shipping_city?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: number
  product_name: string
  product_color: string
  size: string
  quantity: number
  unit_price: number
  subtotal: number
}

// Auth functions
export const signUp = async (email: string, password: string, fullName: string, phone: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      }
    }
  })
  
  if (error) throw error
  
  // Create user profile
  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: email,
      full_name: fullName,
      phone: phone,
    })
  }
  
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as User
}

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data as User
}

// Order functions
export const createOrder = async (
  userId: string | null,
  items: Array<{
    product_id: number
    product_name: string
    product_color: string
    size: string
    quantity: number
    unit_price: number
  }>,
  customerInfo: {
    name: string
    phone: string
    email?: string
    address?: string
    city?: string
    notes?: string
  },
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
) => {
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      total: totals.total,
      subtotal: totals.subtotal,
      shipping_cost: totals.shipping,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_email: customerInfo.email,
      shipping_address: customerInfo.address,
      shipping_city: customerInfo.city,
      notes: customerInfo.notes,
    })
    .select()
    .single()
  
  if (orderError) throw orderError
  
  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    product_color: item.product_color,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.unit_price * item.quantity,
  }))
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) throw itemsError
  
  return order as Order
}

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .single()
  
  if (error) throw error
  return data
}
