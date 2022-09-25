import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { addSeconds, parseISO } from "date-fns";
import { randomUUID } from "crypto";

const BUCKET = process.env.AWS_S3_BUCKET ?? "cryptone";
const REGION = process.env.AWS_S3_REGION ?? "ap-northeast-1";

const BASE_URL = `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

const client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
  },
});

export const putOriginalAudio = async ({
  file,
  creatorAddress,
  filenameWithExtention,
  contentType,
}: {
  file: Buffer;
  creatorAddress: string;
  filenameWithExtention: string;
  contentType?: string | null;
}) => {
  const key = `users/${creatorAddress}/original-audios/${randomUUID()}-${filenameWithExtention}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType ?? undefined,
    Body: file,
  });
  await client.send(command);

  return { url: `${BASE_URL}/${key}`, key: key };
};

export const putPreviewAudio = async ({
  file,
  creatorAddress,
  filenameWithExtention,
  contentType,
}: {
  file: Buffer;
  creatorAddress: string;
  filenameWithExtention: string;
  contentType?: string | null;
}) => {
  const key = `users/${creatorAddress}/preview-audios/${randomUUID()}-${filenameWithExtention}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType ?? undefined,
    Body: file,
    ACL: "public-read",
  });
  await client.send(command);

  return { url: `${BASE_URL}/${key}`, key: key };
};

export const getOriginalAudioSignedUrl = async ({ key }: { key: string }) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  const url = await getSignedUrl(client, command, { expiresIn: 900 });
  return url;
};

export const renewOriginalAudioSignedUrl = async ({ url }: { url: string }) => {
  try {
    const { pathname, searchParams } = new URL(url);
    const creationDate = parseISO(searchParams.get("X-Amz-Date") as string);
    const expiresInSec = Number(searchParams.get("X-Amz-Expires"));
    const expiryDate = addSeconds(creationDate, expiresInSec);
    const isExpired = expiryDate < new Date();

    if (isExpired) {
      return await getOriginalAudioSignedUrl({ key: pathname });
    }
    return url;
  } catch (error) {
    console.error(error);
    return url;
  }
};
