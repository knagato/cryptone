import React, { memo } from 'react'

export const Footer = memo(() => {
  return (
    <footer className="bg-gray-100 text-center lg:text-left">
      <div className='text-gray-700 text-center p-4 text-sm'>
        © 2022 Copyright: CrypTone All rigits reserved.
      </div>
    </footer>
  )
})

Footer.displayName = 'footer'