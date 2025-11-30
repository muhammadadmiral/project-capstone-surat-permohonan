import crypto from "crypto";

export type CloudinarySignPayload = {
  timestamp?: number;
  folder?: string;
  public_id?: string;
  [key: string]: string | number | undefined;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export function signCloudinaryPayload(payload: CloudinarySignPayload) {
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET");
  const timestamp = payload.timestamp || Math.floor(Date.now() / 1000);
  const entries = Object.entries({ ...payload, timestamp })
    .filter(([, v]) => v !== undefined && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(entries + apiSecret).digest("hex");
  return { signature, timestamp };
}
