import Header from '@/components/Header'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div>
      <Header />
      <div className="max-w-7xl w-full mx-auto mb-11">
        <main className="mx-4">
          <div>{children}</div>
        </main>
      </div>
    </div>
  )
}
