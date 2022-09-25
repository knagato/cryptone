import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAltarTemplates } from "src/api/hooks";

const Home: NextPage = () => {
  const router = useRouter();
  const { data } = useAltarTemplates();

  const selectAltar = async (templateId: number) => {
    const res = await fetch("/api/altars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "My awesome altar",
        description: "This is my awesome altar",
        templateId,
      }),
    });
    const json = await res.json();
    router.push(`/mypage/altars/${json.id}`);
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
          {data?.data.map((template) => (
            <button
              key={template.id}
              onClick={() => selectAltar(template.id)}
              className="group"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3">
                <img
                  src={template.thumbnailUrl}
                  alt="Person using a pen to cross a task off a productivity paper card."
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                <h3>{template.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
