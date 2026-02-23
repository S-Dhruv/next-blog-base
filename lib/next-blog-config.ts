import {dbProvider} from "./db";
import { put, del, list } from "@vercel/blob"

// Minimal Vercel Blob storage adapter
const blobStorageAdapter = {
    async upload(key: string, data: Buffer, contentType: string) {
        const { url } = await put(key, data, { access: 'public', contentType })
        return { url }
    },
    async delete(key: string) {
        await del(key)
    },
    async list(prefix?: string) {
        const { blobs } = await list({ prefix })
        return blobs.map(b => ({ key: b.pathname, url: b.url }))
    }
}
export default function () {
    return {
        db: dbProvider,
        storage: blobStorageAdapter,
        ui: {
            branding: {
                name: "Demo Blog",
                description: "The best directory website"
            }
        }
    }
}
