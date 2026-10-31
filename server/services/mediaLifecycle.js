import imagekit from "../configs/imageKit.js";

export const deleteImageKitFile = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    if (error?.status !== 404) {
      console.error("ImageKit media cleanup failed:", error.message);
      throw error;
    }
  }
};

export const deletePostMedia = async (post) => {
  await Promise.all([
    ...(post.image_file_ids || []).map((fileId) => deleteImageKitFile(fileId)),
    deleteImageKitFile(post.video_file_id),
  ]);
};

export const deleteStoryMedia = async (story) => {
  await deleteImageKitFile(story.media_file_id);
};
