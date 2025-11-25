export interface Memorial {
  id: string
  nome: string
  biografia: string
  slug: string
  fotoMainUrl: string
  corPrincipal: string
  galeriaFotos: string[]
  galeriaVideos?: string[]
  dataNascimento?: string | null
  dataMorte?: string | null
  causaMorte?: string | null
}

export interface LoginRequest {
  email: string
  senha: string
}

const TOKEN_KEY = 'eternomemorial_token'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function fetchJson<T>(path: string, init?: RequestInit & { auth?: boolean }): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers || {}),
  }
  if (init?.auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  })
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    const message = isJson && body?.error ? body.error : `Erro HTTP ${res.status}`
    throw new Error(message)
  }
  return body as T
}

export const api = {
  // Login
  login: async (email: string, senha: string) => {
     const data = await fetchJson<{ success: boolean; token: string; user: { email: string; name: string } }>(
       '/auth/login',
       {
         method: 'POST',
         body: JSON.stringify({ email, senha } satisfies LoginRequest),
       }
     )
     if (typeof window !== 'undefined') {
       localStorage.setItem(TOKEN_KEY, data.token)
     }
     return data
   /*  if (email === "admin@eternomemorial.com" && senha === "1234") {
      return {
        success: true,
        token: "mock-token-" + Date.now(),
        user: { email, name: "Administrador" },
      }
    } */
  },

  // Get all memoriais
  getMemoriais: async () => {
    return await fetchJson<Memorial[]>('/memoriais')
  },

  // Get memorial by slug
  getMemorialBySlug: async (slug: string) => {
    return await fetchJson<Memorial>(`/memoriais/${encodeURIComponent(slug)}`)
  },

  // Create memorial
  createMemorial: async (data: Omit<Memorial, "id">) => {
    // Backend espera base64 em fotoMainUrl e galeriaFotos
    return await fetchJson<Memorial>('/memoriais', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    })
  },

  // Update memorial
  updateMemorial: async (slug: string, data: Partial<Memorial>) => {
    return await fetchJson<Memorial>(`/memoriais/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(data),
    })
  },

  // Delete memorial
  deleteMemorial: async (slug: string) => {
    return await fetchJson<{ success: boolean }>(`/memoriais/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      auth: true,
    })
  },

  // Process image to convert to base64
  processImage: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        reject(new Error("Erro ao processar imagem"))
      }
      reader.readAsDataURL(file)
    })
  },

  // Process video to convert to base64
  processVideo: async (file: File): Promise<string> => {
    // Validar tamanho máximo (50MB)
    const MAX_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      throw new Error(`Vídeo muito grande. Tamanho máximo: ${MAX_SIZE / (1024 * 1024)}MB`)
    }

    // Validar tipo de vídeo
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de vídeo não permitido. Tipos permitidos: ${allowedTypes.join(', ')}`)
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        reject(new Error("Erro ao processar vídeo"))
      }
      reader.readAsDataURL(file)
    })
  },
}
