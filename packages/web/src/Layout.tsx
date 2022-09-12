import { ReactElement } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export const Layout = ({ children }: LayoutProps) => (
  <div className='flex flex-col min-h-screen'>
      <div className='relative z-20'>
        <Header />
      </div>
      <div className='flex-grow relative z-10'>
        {children}
      </div>
      <div className='relative z-20'>
        <Footer />
      </div>
  </div>
)