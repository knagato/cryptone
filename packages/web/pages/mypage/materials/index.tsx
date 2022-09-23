import { NextPage } from "next";
import { useRouter } from "next/router";
import { useIsMounted } from "src/hooks/useIsMounted";
import { useAccount } from "wagmi";
import React, { useState, useEffect } from "react";
import { Image } from "pages/api/materials/images";

const audios = [
  {id: 1, title: "test1", description: "test1", isEnctypted: true, audioCID: "test1"},
  {id: 2, title: "test1", description: "test1", isEnctypted: true, audioCID: "test1"},
  {id: 3, title: "test1", description: "test1", isEnctypted: true, audioCID: "test1"},
];

const defaultImages = [
  { id: 1, replicateId: 'rdjp5iduprg7fljmjxtsi4k6xi', url: 'https://replicate.com/api/models/stability-ai/stable-diffusion/files/caf6d90a-0bf6-444f-b244-62663ca7a1ec/out-0.png', prompt: 'crows', jacketCID: 'aaa' }
]

type Props = {
  images: Image[]
};

const Materials: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const { images } = props

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
                      AudioCID
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
                      {audio.audioCID}
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

Materials.getInitialProps = async (ctx) => {
  try {
    const host = ctx.req.headers.host || 'localhost:3000'
    const protocol = /^localhost/.test(host) ? 'http' : 'https' 
    const res = await fetch(`${protocol}://${host}/api/materials/images`)
        .then(data => data.json())
    return {
          images: res.images,
    }
  } catch (e) {
      console.log(e)
      return {
          images: defaultImages,
      }
  }
}

export default Materials;
