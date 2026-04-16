import { Example, ExampleRequest } from "@/models/example"
import { User, UserRequest } from "@/models/user"
import { Product, ProductRequest } from "@/models/product"
import { Notice, NoticeRequest } from "@/models/notice"
import { Category, CategoryRequest } from "@/models/category"

// Mock data storage key
const MOCK_EXAMPLES_KEY = 'mock_examples_data'

// Initial sample data
const initialExamples: Example[] = [
  {
    id: 1,
    title: 'Welcome to Admin Boilerplate',
    content: '<h2>Getting Started</h2><p>This is a sample example with rich text content. You can edit, delete, or create new examples.</p><ul><li>Full CRUD operations</li><li>Rich text editor support</li><li>File upload functionality</li><li>Search and filtering</li></ul>',
    status: 'published',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 2,
    title: 'Draft Example',
    content: '<p>This is a draft example. Change the status to published when ready.</p>',
    status: 'draft',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 3,
    title: 'Archived Example',
    content: '<p>This example has been archived. You can restore it by changing the status.</p>',
    status: 'archived',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 4,
    title: 'Sample Article with Editor',
    content: '<h1>Article Title</h1><p>This demonstrates the Lexical editor capabilities:</p><ul><li>Rich text formatting</li><li>Lists and headings</li><li>Code blocks</li><li>Links and images</li></ul><p>Try creating a new example and using the editor!</p>',
    status: 'published',
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-12').toISOString(),
  },
  {
    id: 5,
    title: 'Testing Search Functionality',
    content: '<p>Use the search box above to find this example by title or content.</p>',
    status: 'published',
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString(),
  },
]

// Get all examples from localStorage
export function getMockExamples(): Example[] {
  const stored = localStorage.getItem(MOCK_EXAMPLES_KEY)
  if (!stored) {
    // Initialize with sample data
    localStorage.setItem(MOCK_EXAMPLES_KEY, JSON.stringify(initialExamples))
    return initialExamples
  }
  return JSON.parse(stored)
}

// Save examples to localStorage
function saveMockExamples(examples: Example[]) {
  localStorage.setItem(MOCK_EXAMPLES_KEY, JSON.stringify(examples))
}

// Get paginated and filtered list
export function getMockExampleList(params: {
  page?: number
  limit?: number
  search?: string
  searchKey?: string
  sort?: string
  order?: 'asc' | 'desc'
}) {
  let examples = getMockExamples()

  // Search filter
  if (params.search && params.searchKey) {
    const searchLower = params.search.toLowerCase()
    examples = examples.filter(item => {
      const value = item[params.searchKey as keyof Example]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  }

  // Sort
  if (params.sort) {
    examples.sort((a, b) => {
      const aVal = a[params.sort as keyof Example]
      const bVal = b[params.sort as keyof Example]

      if (aVal < bVal) return params.order === 'asc' ? -1 : 1
      if (aVal > bVal) return params.order === 'asc' ? 1 : -1
      return 0
    })
  }

  const total = examples.length
  const page = params.page || 1
  const limit = params.limit || 30
  const start = (page - 1) * limit
  const end = start + limit
  const items = examples.slice(start, end)

  return {
    items,
    total,
    page,
    limit,
  }
}

// Get example by ID
export function getMockExampleById(id: number): Example | undefined {
  const examples = getMockExamples()
  return examples.find(item => item.id === id)
}

// Create new example
export function createMockExample(data: ExampleRequest): Example {
  const examples = getMockExamples()
  const newId = Math.max(0, ...examples.map(e => e.id)) + 1

  const newExample: Example = {
    id: newId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  examples.push(newExample)
  saveMockExamples(examples)

  return newExample
}

// Update example
export function updateMockExample(id: number, data: ExampleRequest): boolean {
  const examples = getMockExamples()
  const index = examples.findIndex(item => item.id === id)

  if (index === -1) return false

  examples[index] = {
    ...examples[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  saveMockExamples(examples)
  return true
}

// Delete example
export function deleteMockExample(id: number): boolean {
  const examples = getMockExamples()
  const filtered = examples.filter(item => item.id !== id)

  if (filtered.length === examples.length) return false

  saveMockExamples(filtered)
  return true
}

// Reset to initial data (useful for testing)
export function resetMockExamples() {
  localStorage.setItem(MOCK_EXAMPLES_KEY, JSON.stringify(initialExamples))
}

// ===== USER MOCK DATA =====
const MOCK_USERS_KEY = 'mock_users_data'

const initialUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    phone: '010-1234-5678',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 2,
    name: 'John Manager',
    email: 'john@example.com',
    role: 'manager',
    status: 'active',
    phone: '010-2345-6789',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 3,
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    phone: '010-3456-7890',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 4,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
  },
]

export function getMockUsers(): User[] {
  const stored = localStorage.getItem(MOCK_USERS_KEY)
  if (!stored) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(initialUsers))
    return initialUsers
  }
  return JSON.parse(stored)
}

function saveMockUsers(users: User[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

export function getMockUserList(params: any) {
  let users = getMockUsers()

  if (params.search && params.searchKey) {
    const searchLower = params.search.toLowerCase()
    users = users.filter(item => {
      const value = item[params.searchKey as keyof User]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  }

  if (params.sort) {
    users.sort((a, b) => {
      const aVal = a[params.sort as keyof User]
      const bVal = b[params.sort as keyof User]
      if (aVal < bVal) return params.order === 'asc' ? -1 : 1
      if (aVal > bVal) return params.order === 'asc' ? 1 : -1
      return 0
    })
  }

  const total = users.length
  const page = params.page || 1
  const limit = params.limit || 30
  const items = users.slice((page - 1) * limit, page * limit)

  return { items, total, page, limit }
}

export function getMockUserById(id: number): User | undefined {
  return getMockUsers().find(item => item.id === id)
}

export function createMockUser(data: UserRequest): User {
  const users = getMockUsers()
  const newId = Math.max(0, ...users.map(u => u.id)) + 1
  const newUser: User = {
    id: newId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  users.push(newUser)
  saveMockUsers(users)
  return newUser
}

export function updateMockUser(id: number, data: UserRequest): boolean {
  const users = getMockUsers()
  const index = users.findIndex(item => item.id === id)
  if (index === -1) return false
  users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() }
  saveMockUsers(users)
  return true
}

export function deleteMockUser(id: number): boolean {
  const users = getMockUsers()
  const filtered = users.filter(item => item.id !== id)
  if (filtered.length === users.length) return false
  saveMockUsers(filtered)
  return true
}

// ===== PRODUCT MOCK DATA =====
const MOCK_PRODUCTS_KEY = 'mock_products_data'

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with 2.4GHz connection',
    price: 29.99,
    stock: 150,
    category: 'Electronics',
    status: 'available',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 89.99,
    stock: 75,
    category: 'Electronics',
    status: 'available',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 3,
    name: 'USB-C Cable',
    description: '2m USB-C to USB-C cable',
    price: 12.99,
    stock: 0,
    category: 'Accessories',
    status: 'out_of_stock',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString(),
  },
  {
    id: 4,
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand',
    price: 45.00,
    stock: 30,
    category: 'Accessories',
    status: 'available',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
]

export function getMockProducts(): Product[] {
  const stored = localStorage.getItem(MOCK_PRODUCTS_KEY)
  if (!stored) {
    localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(initialProducts))
    return initialProducts
  }
  return JSON.parse(stored)
}

function saveMockProducts(products: Product[]) {
  localStorage.setItem(MOCK_PRODUCTS_KEY, JSON.stringify(products))
}

export function getMockProductList(params: any) {
  let products = getMockProducts()

  if (params.search && params.searchKey) {
    const searchLower = params.search.toLowerCase()
    products = products.filter(item => {
      const value = item[params.searchKey as keyof Product]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  }

  if (params.sort) {
    products.sort((a, b) => {
      const aVal = a[params.sort as keyof Product]
      const bVal = b[params.sort as keyof Product]
      if (aVal < bVal) return params.order === 'asc' ? -1 : 1
      if (aVal > bVal) return params.order === 'asc' ? 1 : -1
      return 0
    })
  }

  const total = products.length
  const page = params.page || 1
  const limit = params.limit || 30
  const items = products.slice((page - 1) * limit, page * limit)

  return { items, total, page, limit }
}

export function getMockProductById(id: number): Product | undefined {
  return getMockProducts().find(item => item.id === id)
}

export function createMockProduct(data: ProductRequest): Product {
  const products = getMockProducts()
  const newId = Math.max(0, ...products.map(p => p.id)) + 1
  const newProduct: Product = {
    id: newId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(newProduct)
  saveMockProducts(products)
  return newProduct
}

export function updateMockProduct(id: number, data: ProductRequest): boolean {
  const products = getMockProducts()
  const index = products.findIndex(item => item.id === id)
  if (index === -1) return false
  products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() }
  saveMockProducts(products)
  return true
}

export function deleteMockProduct(id: number): boolean {
  const products = getMockProducts()
  const filtered = products.filter(item => item.id !== id)
  if (filtered.length === products.length) return false
  saveMockProducts(filtered)
  return true
}

// ===== NOTICE MOCK DATA =====
const MOCK_NOTICES_KEY = 'mock_notices_data'

const initialNotices: Notice[] = [
  {
    id: 1,
    title: 'System Maintenance Notice',
    content: '<p>System maintenance is scheduled for Feb 20, 2024 from 2:00 AM to 4:00 AM.</p>',
    author: 'Admin',
    isPublished: true,
    isPinned: true,
    viewCount: 245,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 2,
    title: 'New Feature Release',
    content: '<p>We are excited to announce new features including dark mode and advanced search.</p>',
    author: 'Product Team',
    isPublished: true,
    isPinned: false,
    viewCount: 189,
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString(),
  },
  {
    id: 3,
    title: 'Draft Notice',
    content: '<p>This notice is still being drafted.</p>',
    author: 'Admin',
    isPublished: false,
    isPinned: false,
    viewCount: 0,
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-12').toISOString(),
  },
]

export function getMockNotices(): Notice[] {
  const stored = localStorage.getItem(MOCK_NOTICES_KEY)
  if (!stored) {
    localStorage.setItem(MOCK_NOTICES_KEY, JSON.stringify(initialNotices))
    return initialNotices
  }
  return JSON.parse(stored)
}

function saveMockNotices(notices: Notice[]) {
  localStorage.setItem(MOCK_NOTICES_KEY, JSON.stringify(notices))
}

export function getMockNoticeList(params: any) {
  let notices = getMockNotices()

  if (params.search && params.searchKey) {
    const searchLower = params.search.toLowerCase()
    notices = notices.filter(item => {
      const value = item[params.searchKey as keyof Notice]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  }

  if (params.sort) {
    notices.sort((a, b) => {
      const aVal = a[params.sort as keyof Notice]
      const bVal = b[params.sort as keyof Notice]
      if (aVal < bVal) return params.order === 'asc' ? -1 : 1
      if (aVal > bVal) return params.order === 'asc' ? 1 : -1
      return 0
    })
  }

  const total = notices.length
  const page = params.page || 1
  const limit = params.limit || 30
  const items = notices.slice((page - 1) * limit, page * limit)

  return { items, total, page, limit }
}

export function getMockNoticeById(id: number): Notice | undefined {
  return getMockNotices().find(item => item.id === id)
}

export function createMockNotice(data: NoticeRequest): Notice {
  const notices = getMockNotices()
  const newId = Math.max(0, ...notices.map(n => n.id)) + 1
  const newNotice: Notice = {
    id: newId,
    ...data,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  notices.push(newNotice)
  saveMockNotices(notices)
  return newNotice
}

export function updateMockNotice(id: number, data: NoticeRequest): boolean {
  const notices = getMockNotices()
  const index = notices.findIndex(item => item.id === id)
  if (index === -1) return false
  notices[index] = { ...notices[index], ...data, updatedAt: new Date().toISOString() }
  saveMockNotices(notices)
  return true
}

export function deleteMockNotice(id: number): boolean {
  const notices = getMockNotices()
  const filtered = notices.filter(item => item.id !== id)
  if (filtered.length === notices.length) return false
  saveMockNotices(filtered)
  return true
}

// ===== CATEGORY MOCK DATA =====
const MOCK_CATEGORIES_KEY = 'mock_categories_data'

const initialCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    order: 1,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 2,
    name: 'Computers',
    slug: 'computers',
    description: 'Desktop and laptop computers',
    parentId: 1,
    order: 1,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 3,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Various computer accessories',
    parentId: 1,
    order: 2,
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 4,
    name: 'Books',
    slug: 'books',
    description: 'Books and publications',
    order: 2,
    isActive: true,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
]

export function getMockCategories(): Category[] {
  const stored = localStorage.getItem(MOCK_CATEGORIES_KEY)
  if (!stored) {
    localStorage.setItem(MOCK_CATEGORIES_KEY, JSON.stringify(initialCategories))
    return initialCategories
  }
  return JSON.parse(stored)
}

function saveMockCategories(categories: Category[]) {
  localStorage.setItem(MOCK_CATEGORIES_KEY, JSON.stringify(categories))
}

export function getMockCategoryList(params: any) {
  let categories = getMockCategories()

  if (params.search && params.searchKey) {
    const searchLower = params.search.toLowerCase()
    categories = categories.filter(item => {
      const value = item[params.searchKey as keyof Category]
      return value && String(value).toLowerCase().includes(searchLower)
    })
  }

  if (params.sort) {
    categories.sort((a, b) => {
      const aVal = a[params.sort as keyof Category]
      const bVal = b[params.sort as keyof Category]
      if (aVal < bVal) return params.order === 'asc' ? -1 : 1
      if (aVal > bVal) return params.order === 'asc' ? 1 : -1
      return 0
    })
  }

  const total = categories.length
  const page = params.page || 1
  const limit = params.limit || 30
  const items = categories.slice((page - 1) * limit, page * limit)

  return { items, total, page, limit }
}

export function getMockCategoryById(id: number): Category | undefined {
  return getMockCategories().find(item => item.id === id)
}

export function createMockCategory(data: CategoryRequest): Category {
  const categories = getMockCategories()
  const newId = Math.max(0, ...categories.map(c => c.id)) + 1
  const newCategory: Category = {
    id: newId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  categories.push(newCategory)
  saveMockCategories(categories)
  return newCategory
}

export function updateMockCategory(id: number, data: CategoryRequest): boolean {
  const categories = getMockCategories()
  const index = categories.findIndex(item => item.id === id)
  if (index === -1) return false
  categories[index] = { ...categories[index], ...data, updatedAt: new Date().toISOString() }
  saveMockCategories(categories)
  return true
}

export function deleteMockCategory(id: number): boolean {
  const categories = getMockCategories()
  const filtered = categories.filter(item => item.id !== id)
  if (filtered.length === categories.length) return false
  saveMockCategories(filtered)
  return true
}
