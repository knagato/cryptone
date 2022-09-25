import { Altar, AltarTemplate } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useAccount } from "wagmi";

const fetcher = (path: string, address: string) =>
  fetch(`${path}?address=${address}`, {
    method: "GET",
  }).then((res) => res.json());

const Home: NextPage = () => {
  const { address } = useAccount();
  const { data } = useSWR<{ data: (Altar & { template: AltarTemplate })[] }>(
    () => (address ? ["/api/altars", address] : null),
    fetcher
  );

  return (
    <div className="container mx-auto py-16">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          My Altars
        </h2>
        <Link href="/mypage/altars/new">
          <a className="font-medium text-indigo-600 hover:text-indigo-500">
            Create
          </a>
        </Link>
      </div>

      <section aria-labelledby="products-heading" className="mt-8">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {data?.data.map((altar) => (
            <Link key={altar.id} href={`/mypage/altars/${altar.id}`}>
              <a className="group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3 relative">
                  <Image
                    alt={altar.title}
                    src={altar.template.thumbnailUrl}
                    layout="fill"
                    objectFit="cover"
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
