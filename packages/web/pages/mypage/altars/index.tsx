import type { NextPage } from "next";
import Link from "next/link";

const user = {
  id: "user1",
  altars: [
    {
      id: "altar1",
      thumbnail:
        "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-01.jpg",
      title: "My awesome altar1",
    },
    {
      id: "altar2",
      thumbnail:
        "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-02.jpg",
      title: "My awesome altar2",
    },
    {
      id: "altar3",
      thumbnail:
        "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-03.jpg",
      title: "My awesome altar3",
    },
  ],
};

const Home: NextPage = () => {
  return (
    <div className="container mx-auto py-16">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          My Altars
        </h2>
        <Link href="/mypage/altars/new">
          <a className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block">
            Create
          </a>
        </Link>
      </div>

      <section aria-labelledby="products-heading" className="mt-8">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {user.altars.map((altar) => (
            <Link key={altar.id} href={`/mypage/altars/${altar.id}`}>
              <a className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3">
                  <img
                    src={altar.thumbnail}
                    alt="Person using a pen to cross a task off a productivity paper card."
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                  <h3>{altar.title}</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
