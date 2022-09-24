import { NextPage } from "next";
import { useRouter } from "next/router";
import { useIsMounted } from "src/hooks/useIsMounted";
import { useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import { Image, UploadAudio } from "@prisma/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({}).shape({
  prompt: yup.string().required("This field is required.").min(4).max(500)
});

type Schema = yup.InferType<typeof schema>;

const Materials: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const [images, setImages] = useState<Image[]>([])
  const [audios, setAudios] = useState<UploadAudio[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    reset
  } = useForm<Schema>({
    defaultValues: {
      prompt: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append("prompt", data.prompt);

    const res = await fetch("/api/materials/images", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    reset();
    getImages()
  });

  const getImages = async () => {
    const res = await fetch("/api/materials/images", {
      method: "GET",
    });
    const json = await res.json()
    setImages(json.images)
  }

  const getUploadAudios = async () => {
    const res = await fetch("/api/audios", {
      method: "GET",
    });
    const json = await res.json()
    setAudios(json.audios)
  }

  useEffect(() => {
    getUploadAudios()
    getImages()
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <h1 className="font-medium leading-tight text-3xl mt-0 mb-2 text-gray-600">Uploaded Audios</h1>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      #
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      Title
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      Description
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      EncryptedAudioCID / PreviewAudioCID
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                {audios.map((audio) => (
                  <tr className="border-b" key={audio.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {audio.id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      {audio.title}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      {audio.description}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      <p>{audio.encryptedAudioCID}</p>
                      <p>{audio.previewAudioCID}</p>
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      { audio.audioUrl && <p><Link href={audio.audioUrl || ''}><a>original</a></Link></p> }
                      { audio.previewUrl && <p><Link href={audio.previewUrl || ''}><a>preview</a></Link></p> }
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
              <div className={address ? 'visible' : 'visible'}>
                <div className="flex justify-end border-t pt-4">
                  <button
                    onClick={() => router.push(`/mypage/audios/new`)}
                    type="submit"
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <hr className="mt-20 mb-10 h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
              <h1 className="font-medium leading-tight text-3xl mt-0 mb-2 text-gray-600">Generated Jackets</h1>
              <table className="min-w-full">
                <thead className="border-b">
                <tr>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      #
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      Image
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      JacketCID
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      Prompt
                    </th>
                  </tr>
                </thead>
                <tbody>
                {images.map((image) => (
                  <tr className="border-b" key={image.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {image.id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      <Link href={image.imageUrl || ''}>
                        <a target="_blank" rel="noopener noreferrer">
                          <img
                            src={image.imageUrl}
                            className="p-1 bg-white border rounded max-w-sm w-20 h-20"
                            alt={image.prompt}
                          />
                        </a>
                      </Link>

                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      {image.jacketCID}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      {image.prompt}
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
              <div className={address ? 'visible' : 'visible'}>
                <form onSubmit={onSubmit} className="space-y-6 max-w-4-xl mt-20">
                  <div className="grid grid-cols-4 items-start gap-4 border-t border-gray-200 py-4">
                    <div className="relative z-0 mb-6 w-full group col-span-3">
                      <input
                        {...register("prompt")}
                        type="text"
                        name="prompt"
                        id="prompt"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required />
                      <label
                        htmlFor="prompt"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                          Prompt for generating image by AI
                      </label>
                      {errors.prompt && (
                        <p className="mt-2 text-sm text-red-600" id="prompt-error">
                          {errors.prompt.message}
                        </p>
                      )}
                    </div>
                    <div className="relative mb-6 w-full group flex justify-end">
                      <button
                        disabled={isSubmitting || !isDirty}
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
