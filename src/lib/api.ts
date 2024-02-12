import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      console.log('401')
    }
    return Promise.reject(error.response.data)
  },
)

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export { api, fetcher }
