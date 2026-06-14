import { readForm } from '../../utils/form'

export async function login(api, form) {
  return api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(readForm(form)),
  })
}

export async function signup(api, form) {
  return api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(readForm(form)),
  })
}
