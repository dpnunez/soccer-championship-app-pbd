import { redirect } from 'next/navigation'

export default function Home() {
  if (true) {
    redirect('/sign-in')
  }
  return null
}
