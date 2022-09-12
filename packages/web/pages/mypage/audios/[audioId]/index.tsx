// Ref. https://tailwindui.com/components/ecommerce/components/product-lists
import type { NextPage } from "next";

const products = [
  {
    id: 1,
    name: 'crows',
    href: '/mypage/audios/1',
    imageSrc: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/caf6d90a-0bf6-444f-b244-62663ca7a1ec/out-0.png',
    imageAlt: "crows",
    price: '0.01 MATIC',
  },
  {
    id: 2,
    name: 'electric sheep',
    href: '/mypage/audios/2',
    imageSrc: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/d3db96b0-4314-491c-bcdb-1528bea0ba30/out-0.png',
    imageAlt: "electric sheep, neon, synthwave",
    price: '0.01 MATIC',
  },
  // More products...
]

const Home: NextPage = () => {

  const product = products[0]

  return (
    <div className="py-2 flex justify-center">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{product.name}</h2>

          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6">
            <div key={product.id} className="group relative">
              <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="/mypage/audios/1/onsale">
                      <span aria-hidden="true" className="absolute inset-0" />
                      Put On Sale
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
