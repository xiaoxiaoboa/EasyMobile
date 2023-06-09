import { BASE_URL } from "@env";


interface RequestType<T> {
  url: string
  methods: 'GET' | 'POST' | 'PUT' | 'PATCH'
  body?: T
  token?: string
}

const request = async <T>(props: RequestType<T>) => {
  const {url, methods, body, token = ''} = props

  try {
    const res = await fetch(BASE_URL + url, {
      method: methods,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
    })
    return await res.json()
  } catch (err) {
    return err
  }
}

export default request

export const uploadRequest = async (params: RequestType<FormData>) => {
  const {url, methods, body, token = ''} = params

  try {
    const res = await fetch(BASE_URL + url, {
      method: methods,
      body: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return await res.json()
  } catch (err) {
    return err
  }
}
