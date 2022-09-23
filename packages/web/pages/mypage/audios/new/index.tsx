import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({}).shape({
  name: yup.string().required("This field is required."),
  description: yup.string(),
  audio: yup.mixed().test({
    message: "This field is required.",
    test: (file) => file.length > 0,
  })
});

type Schema = yup.InferType<typeof schema>;

const PostNewAudio: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm<Schema>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(schema),
  });
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const audioFile = data.audio.item(0);

    if (!audioFile) return;

    const formData = new FormData();
    formData.append("title", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append(
      "originalAudio",
      new Blob([audioFile], { type: "application/octet-stream" })
    );

    const res = await fetch("/api/audios", {
      method: "POST",
      body: formData,
    });

    const { id } = await res.json();
    router.push(`/mypage/materials`);
  });

  return (
    <div className="container mx-auto py-10">
      <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Post New Audio
          </h3>
        </div>

        <div className="grid grid-cols-3 items-start gap-4 border-t border-gray-200 py-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mt-2"
          >
            Audio name
          </label>
          <div className="mt-1 col-span-2">
            <input
              {...register("name")}
              type="text"
              id="name"
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 items-start gap-4 border-t border-gray-200 py-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mt-2"
          >
            Audio description
          </label>
          <div className="mt-1 col-span-2">
            <textarea
              {...register("description")}
              id="description"
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600" id="email-error">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 items-start gap-4 border-t border-gray-200 py-4">
          <label className="block text-sm font-medium text-gray-700 mt-2">
            Original Audio
          </label>
          <div className="mt-1 col-span-2">
            <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="original-audio"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      {...register("audio")}
                      id="original-audio"
                      type="file"
                      accept="audio/*"
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {watch("audio")?.item(0) && (
              <p className="mt-2 text-sm">{watch("audio").item(0).name}</p>
            )}
            {errors.audio && (
              <p className="mt-2 text-sm text-red-600">
                {errors.audio.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t pt-4">
          <button
            disabled={isSubmitting || !isDirty}
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostNewAudio;
