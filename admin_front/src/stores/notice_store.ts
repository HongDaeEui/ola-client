import { create } from "zustand"
import { apiService } from "@/lib/api"
import { NOTICE_API } from "@/constants/api-paths"
import { Notice, NoticeRequest } from "@/models/notice"
import { IResponseList, IRequestFilter } from "@/models/model"
import {
  getMockNoticeList,
  getMockNoticeById,
  createMockNotice,
  updateMockNotice,
  deleteMockNotice
} from "@/lib/mockData"

// ===== Notice State Interface =====
interface NoticeState {
  list: Notice[] | null
  total: number
  loading: boolean
  error: string | null

  // CRUD actions
  getList: (params?: IRequestFilter) => Promise<IResponseList<Notice>>
  getDetail: (id: number) => Promise<{ data: Notice }>
  add: (data: NoticeRequest) => Promise<boolean>
  update: (id: number, data: NoticeRequest) => Promise<boolean>
  remove: (id: number) => Promise<boolean>
}

// ===== Zustand Store =====
export const useNoticeStore = create<NoticeState>((set) => ({
  // Initial state
  list: null,
  total: 0,
  loading: false,
  error: null,

  // Fetch list
  getList: async (params = {}) => {
    set({ loading: true, error: null })

    // Mock mode
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay

      const mockData = getMockNoticeList(params)
      set({ list: mockData.items, total: mockData.total, loading: false })
      return { data: mockData }
    }

    // Real API mode
    const apiCall = () => apiService.get<IResponseList<Notice>>(
      NOTICE_API.PREFIX, params
    )

    const result = await apiService.callWithErrorHandling<IResponseList<Notice>>(
      apiCall, 'Failed to fetch list.'
    )

    set({ loading: false })

    if (result.success && result.response) {
      const data = result.response.data
      set({ list: data.data?.items || [], total: data.data?.total || 0 })
      return data
    } else {
      set({ error: result.finalMessage || 'Failed to fetch list' })
      return { data: { items: [], total: 0 } }
    }
  },

  // Fetch detail
  getDetail: async (id: number) => {
    set({ loading: true, error: null })

    // Mock mode
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 200))

      const mockData = getMockNoticeById(id)
      set({ loading: false })

      if (mockData) {
        return { data: mockData }
      } else {
        const errorMsg = 'Notice not found'
        set({ error: errorMsg })
        throw new Error(errorMsg)
      }
    }

    // Real API mode
    const apiCall = () => apiService.get<{ data: Notice }>(
      NOTICE_API.ID(id)
    )

    const result = await apiService.callWithErrorHandling<{ data: Notice }>(
      apiCall, 'Failed to fetch detail.'
    )

    set({ loading: false })

    if (result.success && result.response) {
      return { data: result.response.data.data }
    } else {
      const displayMessage = result.finalMessage || 'Failed to fetch detail'
      set({ error: displayMessage })
      throw new Error(displayMessage)
    }
  },

  // Create
  add: async (data: NoticeRequest) => {
    set({ loading: true, error: null })

    // Mock mode
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 300))

      try {
        createMockNotice(data)
        set({ loading: false })
        return true
      } catch (error) {
        set({ loading: false, error: 'Failed to create' })
        return false
      }
    }

    // Real API mode
    const apiCall = () => apiService.post(
      NOTICE_API.PREFIX, data
    )

    const result = await apiService.callWithErrorHandling(
      apiCall, 'Failed to create.'
    )

    set({ loading: false })

    if (result.success) {
      return true
    } else {
      set({ error: result.finalMessage || 'Failed to create' })
      return false
    }
  },

  // Update
  update: async (id: number, data: NoticeRequest) => {
    set({ loading: true, error: null })

    // Mock mode
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 300))

      const success = updateMockNotice(id, data)
      set({ loading: false })

      if (success) {
        return true
      } else {
        set({ error: 'Failed to update' })
        return false
      }
    }

    // Real API mode
    const apiCall = () => apiService.patch(
      NOTICE_API.ID(id), data
    )

    const result = await apiService.callWithErrorHandling(
      apiCall, 'Failed to update.'
    )

    set({ loading: false })

    if (result.success) {
      return true
    } else {
      set({ error: result.finalMessage || 'Failed to update' })
      return false
    }
  },

  // Delete
  remove: async (id: number) => {
    set({ loading: true, error: null })

    // Mock mode
    const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true'
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 200))

      const success = deleteMockNotice(id)
      set({ loading: false })

      if (success) {
        return true
      } else {
        set({ error: 'Failed to delete' })
        return false
      }
    }

    // Real API mode
    const apiCall = () => apiService.delete(
      NOTICE_API.ID(id)
    )

    const result = await apiService.callWithErrorHandling(
      apiCall, 'Failed to delete.'
    )

    set({ loading: false })

    if (result.success) {
      return true
    } else {
      set({ error: result.finalMessage || 'Failed to delete' })
      return false
    }
  },
}))
