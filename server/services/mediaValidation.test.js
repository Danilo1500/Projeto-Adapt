import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateVideoFile, VIDEO_LIMITS } from './mediaValidation.js';

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'adapt-media-test-'));
const writeTemp = (name, bytes) => {
  const filePath = path.join(tempDir, name);
  fs.writeFileSync(filePath, bytes);
  return filePath;
};

try {
  const mp4 = writeTemp('video.mp4', Buffer.concat([Buffer.alloc(4), Buffer.from('ftypmp42'), Buffer.alloc(20)]));
  validateVideoFile({ path: mp4, mimetype: 'video/mp4', size: 28 }, VIDEO_LIMITS.postBytes);

  const webm = writeTemp('video.webm', Buffer.concat([Buffer.from([0x1a, 0x45, 0xdf, 0xa3]), Buffer.alloc(20)]));
  validateVideoFile({ path: webm, mimetype: 'video/webm', size: 24 }, VIDEO_LIMITS.postBytes);

  assert.throws(
    () => validateVideoFile({ path: mp4, mimetype: 'video/quicktime', size: 28 }, VIDEO_LIMITS.postBytes),
    /Formato inválido/
  );
  assert.throws(
    () => validateVideoFile({ path: mp4, mimetype: 'video/mp4', size: VIDEO_LIMITS.postBytes + 1 }, VIDEO_LIMITS.postBytes),
    /excede o limite/
  );

  console.log('mediaValidation.test: ok');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
