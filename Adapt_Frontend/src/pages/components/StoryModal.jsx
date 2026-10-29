import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, Sparkle, TextIcon, Upload, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { requestWithAuth } from "../../utils/authRequest";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {getToken} = useAuth()

  const MAX_VIDEO_DURATION = 60; // seconds
  const MAX_VIDEO_SIZE_MB = 50; //MB

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.type.startsWith("video")){
        if (!['video/mp4', 'video/webm'].includes(file.type)) {
          toast.error('Selecione um vídeo MP4 ou WebM.')
          return
        }
        if(file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024){
          toast.error(`Video file size cannot exceed ${MAX_VIDEO_SIZE_MB}MB.`)
          setMedia(null)
          setPreviewUrl(null)
          return; 
        }
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = ()=>{
          window.URL.revokeObjectURL(video.src)
          if(video.duration > MAX_VIDEO_DURATION){
            toast.error("Video duration cannot exceed 1 minute.")
            setMedia(null)
            setPreviewUrl(null)
          }else{
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
            setText('')
            setMode("media")
          }
        }
        video.src = URL.createObjectURL(file)
      }else if(file.type.startsWith("image")){
        setMedia(file)
        setPreviewUrl(URL.createObjectURL(file))
        setText('')
        setMode("media")
      }
    }
  };

  const handleCreateStory = async () => {
      const media_type = mode === 'media' ? media?.type.startsWith('image') ? 'image' : "video" : "text";

      if(media === "text" && !text){
          throw new Error("Please enter some text")
      }

      let formData = new FormData();
      formData.append('content', text);
      formData.append('media_type', media_type);
      formData.append('media', media);
      formData.append('background_color', background);

      try {
        const { data } = await requestWithAuth(
          getToken,
          (headers) => api.post('/api/story/create', formData, {
            headers,
            onUploadProgress: ({ loaded, total }) => total && setUploadProgress(Math.round((loaded / total) * 100))
          })
        )

        if(data.success){
          setShowModal(false)
          toast.success("Story Created successfully")
          fetchStories()
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      }
  }

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/50 backdrop-blur-text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg text-white font-semibold">Create a Story</h2>
          <span className="w-10"></span>
        </div>

        <div
          className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
              placeholder="What's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}
          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full"
              />
            ) : (
              <video src={previewUrl} className="object-contain max-h-full w-full" controls playsInline />
            ))}
          {mode === "media" && previewUrl && (
            <button type="button" onClick={() => { setMode('text'); setMedia(null); setPreviewUrl(null) }} className="absolute top-2 right-2 z-10 rounded-full bg-black/70 p-1 text-white" aria-label="Cancelar mídia">
              <X className="size-5" />
            </button>
          )}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4 h-2 rounded bg-zinc-700 overflow-hidden" aria-label="Progresso do upload">
            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        <div className="flex mt-4 gap-2">
          {bgColors.map((color) => (
            <button key={color} className="w-6 h-6 rounded-full ring cursor-pointer" style={{ backgroundColor: color }} onClick={() => setBackground(color)}/>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => {setMode('text'); setMedia(null); setPreviewUrl(null)}} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'text' ? "bg-white text-black" : "bg-zinc-800 text-white"}`}>
            <TextIcon size={18}/> Text
          </button>
          <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode === 'media' ? "bg-white text-black" : "bg-zinc-800 text-white"}`}>
            <input onChange={handleMediaUpload} type="file" accept="image/*,video/mp4,video/webm" className="hidden"/>
            <Upload size={18}/> Photo/Video
          </label>
        </div>

        <button onClick={()=> toast.promise(handleCreateStory(), {
          loading : 'Saving...',})} className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover: to-purple-700 active:scale-95 transition cursor-pointer'>
          <Sparkle size={18}/> Create Story
        </button>

      </div>
    </div>
  );
};

export default StoryModal;
