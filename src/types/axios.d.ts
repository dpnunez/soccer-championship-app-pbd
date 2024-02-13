import {
  AxiosResponse as BaseAxiosResponse,
  AxiosError as BaseAxiosError,
} from 'axios'

// Estendendo a interface AxiosResponse para incluir a propriedade toastInfo
declare module 'axios' {
  interface AxiosResponse<T> extends BaseAxiosResponse<T> {
    toastInfo?: {
      title: string
      description: string
    }
  }
  interface AxiosError extends BaseAxiosError {
    toastInfo: {
      title: string
      description: string
    }
  }
}
