// Product entity type
export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: 'available' | 'out_of_stock' | 'discontinued'
  image?: string
  createdAt: string
  updatedAt: string
}

// Product create/update request type
export interface ProductRequest {
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: 'available' | 'out_of_stock' | 'discontinued'
  image?: string
}
