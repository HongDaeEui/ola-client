// 예제 엔티티 타입 정의
export interface Example {
  id: number
  title: string
  content: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

// 예제 생성/수정 요청 타입
export interface ExampleRequest {
  title: string
  content: string
  status: 'draft' | 'published' | 'archived'
}
