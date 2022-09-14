import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const altars = [
  {
    id: "altar1",
    thumbnail: "/altar-pastel.png",
    title: "Modern",
  },
  {
    id: "altar2",
    thumbnail: "/altar-pastel.png",
    title: "Fancy",
  },
];

const Home: NextPage = () => {
  const router = useRouter();

  const selectAltar = async (id: string) => {
    // const altar = await createAlatar(id);
    router.push(`/mypage/altars/${id}`);
  };

  return (
    <div className="container mx-auto py-16">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Create new altar
        </h2>
      </div>

      <section aria-labelledby="products-heading" className="mt-8">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {altars.map((altar) => (
            <button
              key={altar.id}
              onClick={() => selectAltar(altar.id)}
              className="group"
            >
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
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
