export interface User {
  _id: string
  login: string
  password: string
}

export interface Message {
  message: string
}
export interface Category {
  name: string
  imageSrc?: string
  description?: string
  user?: string
  _id?: string
}
export interface Feedback {
  _id?: string
  title: string
  description: string
  createdAt?: Date
  updatedAt?: Date
  adminResponses?: AdminResponse[]
  user?: User
}

export interface AdminResponse {
  response: string
  respondedAt: Date
}

export interface News {
  date?: Date
  name: string
  description?: string
  user?: User
  articles?: Article[]
  comment?: Comment[]
  category: string
  _id?: string
}
export interface CategoryResponse {
  data: Category[]
  total: number
}
export interface Article {
  title: string
  news: string
}
export interface Comment {
  text: string
  user: User
  createdAt?: Date
}
export interface Subscriptions {
  user?: string
  category: string
}


