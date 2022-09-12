// Ref. https://tailwindui.com/components/ecommerce/components/store-navigation
import React, { Fragment, useState, memo } from 'react'
import Image from 'next/image';
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = {
  categories: [
    {
      id: 'audio',
      name: 'Audio',
      featured: [
        {
          name: 'New Jacket',
          href: '#',
          imageSrc: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/caf6d90a-0bf6-444f-b244-62663ca7a1ec/out-0.png',
          imageAlt: 'crows',
        },
        {
          name: 'Popular Jacket',
          href: '#',
          imageSrc: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png',
          imageAlt: 'electric sheep, neon, synthwave',
        },
      ],
      sections: [
        {
          id: 'your-audio',
          name: 'Your Audio NFTs',
          items: [
            { name: 'All NFTs', href: '/mypage/audios' },
            { name: 'Create New NFT', href: '/mypage/audios/new' },
            { name: 'Your Offers', href: '/mypage/offers' },
          ],
        },
        {
          id: 'public-audio',
          name: 'Public Audio NFTs',
          items: [
            { name: 'Marketplace', href: '/marketplace' },
          ],
        },
      ],
    },
    {
      id: 'alter',
      name: 'Alter',
      featured: [
        {
          name: 'New Alter',
          href: '/alters/1',
          imageSrc: '/alter1.png',
          imageAlt: 'sample',
        },
        {
          name: 'Popular Alter',
          href: '/alters/1',
          imageSrc: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png',
          imageAlt: 'electric sheep, neon, synthwave',
        },
      ],
      sections: [
        {
          id: 'your-alters',
          name: 'Your Alters',
          items: [
            { name: 'All Alters', href: '/mypage/alters' },
            { name: 'Create New Alter', href: '/mypage/alters/new' },
          ],
        },
        {
          id: 'public-alters',
          name: 'Public Alters',
          items: [
            { name: 'All Alters', href: '/alters' },
          ],
        },
      ],
    },
    {
      id: 'creator',
      name: 'Creator',
      featured: [
        {
          name: 'New Creator',
          href: '/users/1',
          imageSrc: '/alter1.png',
          imageAlt: 'sample',
        },
        {
          name: 'Popular Creator',
          href: '/users/1',
          imageSrc: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png',
          imageAlt: 'electric sheep, neon, synthwave',
        },
      ],
      sections: [
        {
          id: 'creators',
          name: 'Creators',
          items: [
            { name: 'All Creators', href: '/users' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Docs', href: '/docs' },
    { name: 'Help', href: '/help' },
  ],
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const Header = memo(() => {

  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white">
    {/* Mobile menu */}
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
              <div className="flex px-4 pt-5 pb-2">
                <button
                  type="button"
                  className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Links */}
              <Tab.Group as="div" className="mt-2">
                <div className="border-b border-gray-200">
                  <Tab.List className="-mb-px flex space-x-8 px-4">
                    {navigation.categories.map((category) => (
                      <Tab
                        key={category.name}
                        className={({ selected }) =>
                          classNames(
                            selected ? 'text-indigo-600 border-indigo-600' : 'text-gray-900 border-transparent',
                            'flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium'
                          )
                        }
                      >
                        {category.name}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
                <Tab.Panels as={Fragment}>
                  {navigation.categories.map((category) => (
                    <Tab.Panel key={category.name} className="space-y-10 px-4 pt-10 pb-8">
                      <div className="grid grid-cols-2 gap-x-4">
                        {category.featured.map((item) => (
                          <div key={item.name} className="group relative text-sm">
                            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                              <img src={item.imageSrc} alt={item.imageAlt} className="object-cover object-center" />
                            </div>
                            <a href={item.href} className="mt-6 block font-medium text-gray-900">
                              <span className="absolute inset-0 z-20" aria-hidden="true" />
                              {item.name}
                            </a>
                            <p aria-hidden="true" className="mt-1">
                              View Details
                            </p>
                          </div>
                        ))}
                      </div>
                      {category.sections.map((section) => (
                        <div key={section.name}>
                          <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-gray-900">
                            {section.name}
                          </p>
                          <ul
                            role="list"
                            aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                            className="mt-6 flex flex-col space-y-6"
                          >
                            {section.items.map((item) => (
                              <li key={item.name} className="flow-root">
                                <a href={item.href} className="-m-2 block p-2 text-gray-500">
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>

              <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                {navigation.pages.map((page) => (
                  <div key={page.name} className="flow-root">
                    <a href={page.href} className="-m-2 block p-2 font-medium text-gray-900">
                      {page.name}
                    </a>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                <div className="flow-root">
                  <a href="#" className="-m-2 block p-2 font-medium text-gray-900">
                    Sign in
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-200 py-6 px-4">
                <a href="#" className="-m-2 flex items-center p-2">
                  <span className="relative w-8 h-8">
                    <Image
                      src="/polygon.png"
                      alt=""
                      layout="fill"
                      objectFit="contain"
                      className="block h-auto w-5 flex-shrink-0"
                    />
                  </span>
                  <span className="ml-3 block text-base font-medium text-gray-900">Polygon</span>
                  <span className="sr-only">, change chain</span>
                </a>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>

    <header className="relative bg-white">
    <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
      CrypTone - Some navigation message.
    </p>

    <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200">
        <div className="flex h-16 items-center">
          <button
            type="button"
            className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Logo */}
          <div className="ml-4 flex lg:ml-0 relative w-12 h-12">
            <a href="/">
              <span className="sr-only">CtypTone</span>
              <Image
                className="h-8 w-auto"
                src="/CrtpTone_logo_BPBK.jpg"
                layout="fill"
                objectFit="contain"
                alt="logo"
              />
            </a>
          </div>

          {/* Flyout menus */}
          <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
            <div className="flex h-full space-x-8">
              {navigation.categories.map((category) => (
                <Popover key={category.name} className="flex">
                  {({ open }) => (
                    <>
                      <div className="relative flex">
                        <Popover.Button
                          className={classNames(
                            open
                              ? 'border-indigo-600 text-indigo-600'
                              : 'border-transparent text-gray-700 hover:text-gray-800',
                            'relative z-20 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out'
                          )}
                        >
                          {category.name}
                        </Popover.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                          {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                          <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                          <div className="relative bg-white">
                            <div className="mx-auto max-w-7xl px-8">
                              <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                                <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                  {category.featured.map((item) => (
                                    <div key={item.name} className="group relative text-base sm:text-sm">
                                      <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                        <img
                                          src={item.imageSrc}
                                          alt={item.imageAlt}
                                          className="object-cover object-center"
                                        />
                                      </div>
                                      <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                        <span className="absolute inset-0 z-20" aria-hidden="true" />
                                        {item.name}
                                      </a>
                                      <p aria-hidden="true" className="mt-1">
                                        View Details
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                                  {category.sections.map((section) => (
                                    <div key={section.name}>
                                      <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                        {section.name}
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby={`${section.name}-heading`}
                                        className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                      >
                                        {section.items.map((item) => (
                                          <li key={item.name} className="flex">
                                            <a href={item.href} className="hover:text-gray-800">
                                              {item.name}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ))}

              {navigation.pages.map((page) => (
                <a
                  key={page.name}
                  href={page.href}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  {page.name}
                </a>
              ))}
            </div>
          </Popover.Group>

          <div className="ml-auto flex items-center">
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                Sign in
              </a>
            </div>

            <div className="hidden lg:ml-8 lg:flex">
              <a href="#" className="flex items-center text-gray-700 hover:text-gray-800">
                {/* https://www.flaticon.com/free-icons/polygon */}
                <span className="relative w-8 h-8">
                  <Image
                    src="/polygon.png"
                    alt=""
                    layout="fill"
                    objectFit="contain"
                    className="block h-auto w-5 flex-shrink-0"
                  />
                </span>
                <span className="ml-3 block text-sm font-medium">Polygon</span>
                <span className="sr-only">, change chain</span>
              </a>
            </div>

            {/* Search */}
            <div className="flex lg:ml-6">
              <a href="#" className="p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Search</span>
                <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>

            {/* Cart */}
            <div className="ml-4 flow-root lg:ml-6">
              <a href="#" className="group -m-2 flex items-center p-2">
                <ShoppingBagIcon
                  className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">0</span>
                <span className="sr-only">items in cart, view bag</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
  </div>
  )
})

Header.displayName = 'header'
