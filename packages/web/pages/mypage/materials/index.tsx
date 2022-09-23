import { NextPage } from "next";
import { useRouter } from "next/router";
import { useIsMounted } from "src/hooks/useIsMounted";
import { useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import { Image, UploadAudio } from "@prisma/client";
import Link from "next/link";

const defaultAudios = [
  {id: 1, title: "test1", description: "test1", isEnctypted: true, audioCID: "test1"},
  {id: 2, title: "test1", description: "test1", isEnctypted: true, audioCID: "test1"},
  {id: 3, title: "test1", description: "test1", isEnctypted: true, audioCID: "test1"},
];

const Materials: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const [images, setImages] = useState<Image[]>([])
  const [audios, setAudios] = useState<UploadAudio[]>([])

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
    getImages()
    getUploadAudios()
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
                      EncryptedAudioCID
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
                      {audio.encryptedAudioCID}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      <Link href={audio.audioUrl || ''}><a>URL</a></Link>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end border-t pt-4">
                <button
                  onClick={() => router.push(`/mypage/audios/new`)}
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Upload
                </button>
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
                      Title
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      Prompt
                    </th>
                    <th scope="col" className="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                      Image
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
                      {image.replicateId}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                      {image.prompt}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-4 py-4 whitespace-nowrap">
                    <img
                      src={image.imageUrl}
                      className="p-1 bg-white border rounded max-w-sm w-20 h-20"
                      alt="..."
                    />
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end border-t pt-4">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
