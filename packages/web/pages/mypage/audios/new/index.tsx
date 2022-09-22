import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Lit from "src/lib/Lit";

type Schema = {
  name?: string;
  description?: string;
  audio: FileList;
  jacket: FileList;
};

const PostNewAudio: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Schema>({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const audioFile = data.audio.item(0);
    const jacketFile = data.jacket.item(0);

    // TODO: store jacketFile to IPFS
    jacketFile;

    if (!audioFile || !jacketFile) return;

    const { encryptedFile, symmetricKey } = await Lit.encryptFile(audioFile);

    // TODO: store encryptedFile to IPFS

    const res = await fetch("/api/audios", {
      method: "POST",
      body: JSON.stringify({
        title: data.name,
        description: data.description,
        audioUrl: "TODO",
        audioSize: audioFile.size,
        encryptedAudioCID: "TODO",
        symmetricKey: new TextDecoder().decode(symmetricKey),
        previewAudioCID: "TODO",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { id } = await res.json();
    router.push(`/mypage/audios/${id}`);
  });

  return (
    <div className="container mx-auto py-10">
      <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Post New Audio
          </h3>
        </div>

        <div className="grid grid-cols-3 items-center gap-4 border-t border-gray-200 py-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
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
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4 border-t border-gray-200 py-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Audio description
          </label>
          <div className="mt-1 col-span-2">
            <textarea
              {...register("description")}
              id="description"
              className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4 border-t border-gray-200 py-4">
          <label className="block text-sm font-medium text-gray-700">
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
          </div>
        </div>

        <div className="grid grid-cols-3 items-center gap-4 border-t border-gray-200 py-4">
          <label
            htmlFor="jacket"
            className="block text-sm font-medium text-gray-700"
          >
            Jacket
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
                    htmlFor="jacket"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      {...register("jacket")}
                      id="jacket"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t pt-4">
          <button
            disabled={isSubmitting}
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
