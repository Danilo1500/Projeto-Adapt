import fs from "fs";

export const VIDEO_LIMITS = Object.freeze({ storyBytes: 50 * 1024 * 1024, postBytes: 100 * 1024 * 1024 });
export const ALLOWED_VIDEO_MIME_TYPES = new Set(["video/mp4", "video/webm"]);

export function validateVideoFile(file, maxBytes) {
  if (!file) throw new Error("Vídeo não enviado.");
  if (!ALLOWED_VIDEO_MIME_TYPES.has(file.mimetype)) {
    throw new Error("Formato inválido. Envie um vídeo MP4 ou WebM.");
  }
  if (file.size > maxBytes) {
    throw new Error(`O vídeo excede o limite de ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }

  const buffer = Buffer.alloc(32);
  const descriptor = fs.openSync(file.path, "r");
  try {
    fs.readSync(descriptor, buffer, 0, buffer.length, 0);
  } finally {
    fs.closeSync(descriptor);
  }

  if (file.mimetype === "video/mp4") {
    const text = buffer.subarray(4, 12).toString("latin1");
    if (!text.includes("ftyp") && !text.includes("mp4")) {
      throw new Error("O arquivo não é um vídeo MP4 válido.");
    }
  }

  if (file.mimetype === "video/webm" && !buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) {
    throw new Error("O arquivo não é um vídeo WebM válido.");
  }
}

export function removeUploadedFiles(files = []) {
  for (const file of files) {
    if (file?.path) fs.unlink(file.path, () => {});
  }
}
