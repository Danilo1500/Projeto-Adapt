import { BadgeCheck, Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { requestWithAuth } from "../../utils/authRequest";

const PostCard = ({ post, showDelete = false, onDeleted }) => {

  const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600 cursor-pointer">$1</span>')
  const [likes, setLikes] = useState(post.likes_count)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentsCount, setCommentsCount] = useState(post.comments_count ?? 0)
  const commentSubmittingRef = useRef(false)
  const currentUser = useSelector((state)=> state.user.value)
  const isOwner = currentUser?._id === post.user._id

  const {getToken} = useAuth()

  const handleLike = async (params) => {
    try {
      const { data } = await requestWithAuth(
        getToken,
        (headers) => api.post(`/api/post/like`, {postId: post._id}, { headers })
      )

      if(data.success){
        toast.success(data.message)
        setLikes(prev =>{
          if(prev.includes(currentUser._id)){
            return prev.filter(id=> id !== currentUser._id)
          }else{
            return [...prev, currentUser._id]
          }
        })
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {
    if (!isOwner) return
    const confirmed = window.confirm("Tem certeza que deseja apagar este post?")
    if (!confirmed) return
    try {
      const { data } = await requestWithAuth(
        getToken,
        (headers) => api.post(`/api/post/delete`, { postId: post._id }, { headers })
      )
      if (data.success) {
        toast.success(data.message)
        if (typeof onDeleted === "function") {
          onDeleted(post._id)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const navigate = useNavigate()

  const fetchComments = async () => {
    try {
      setCommentsLoading(true)
      const { data } = await requestWithAuth(
        getToken,
        (headers) => api.get(`/api/comment/post/${post._id}`, { headers })
      )
      if (data.success) {
        setComments(data.comments)
        setCommentsCount(data.comments.length)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleToggleComments = async () => {
    const next = !showComments
    setShowComments(next)
    if (next && comments.length === 0) {
      await fetchComments()
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    const content = commentText.trim()
    if (!content || commentSubmittingRef.current) return

    commentSubmittingRef.current = true
    setCommentSubmitting(true)
    try {
      const { data } = await requestWithAuth(
        getToken,
        (headers) => api.post(
          `/api/comment/add`,
          { postId: post._id, content },
          { headers }
        )
      )
      if (data.success) {
        const commentAlreadyExists = comments.some(comment => comment._id === data.comment._id)
        setComments(prev => {
          if (prev.some(comment => comment._id === data.comment._id)) return prev
          return [data.comment, ...prev]
        })
        setCommentText("")
        if (!commentAlreadyExists) {
          setCommentsCount(prev => prev + 1)
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      commentSubmittingRef.current = false
      setCommentSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* User info */}
      <div className="flex items-start justify-between gap-3">
        <div onClick={() => navigate('/profile/' + post.user._id)} className="inline-flex items-center gap-3 cursor-pointer">
          <img
            src={post.user.profile_picture}
            alt=""
            className="w-10 h-10 rounded-full shadow"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span>{post.user.full_name}</span>
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-gray-500 text-sm">
              @{post.user.username} • {moment(post.createdAt).fromNow()}
            </div>
          </div>
        </div>
        {showDelete && isOwner && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            title="Apagar post"
          >
            <Trash2 className="w-4 h-4" />
            Apagar
          </button>
        )}
      </div>

      {/* content */}
      {post.content && 
        <div className="text-gray-800 text-sm whitespace-normal" dangerouslySetInnerHTML={{ __html: postWithHashtags }}/>}

        {/* images */}
        <div className="grid grid-cols-2 gap-2">
            {post.image_urls.map((img, index)=>(
                <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} alt="" />
            ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
          <div className="flex items-center gap-1">
            <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
            <span>{likes.length}</span>
          </div>
          <button type="button" className="flex items-center gap-1 cursor-pointer" onClick={handleToggleComments}>
            <MessageCircle className="w-4 h-4"/>
            <span>{commentsCount}</span>
          </button>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4"/>
            <span>{7}</span>
          </div>

        </div>

        {showComments && (
          <div className="pt-2 border-t border-gray-200 space-y-3">
            <form onSubmit={handleAddComment} className="flex items-start gap-2">
              <img
                src={currentUser?.profile_picture}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  rows={2}
                  placeholder="Escreva um comentário..."
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="submit"
                    disabled={commentSubmitting || !commentText.trim()}
                    className="text-xs px-3 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {commentSubmitting ? "Enviando..." : "Comentar"}
                  </button>
                </div>
              </div>
            </form>

            {commentsLoading ? (
              <p className="text-xs text-gray-500">Carregando comentários...</p>
            ) : comments.length === 0 ? (
              <p className="text-xs text-gray-500">Seja o primeiro a comentar.</p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-2">
                    <img
                      src={comment.user?.profile_picture}
                      alt=""
                      className="w-7 h-7 rounded-full"
                    />
                    <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium text-gray-800">{comment.user?.full_name}</span>
                        <span className="ml-1">@{comment.user?.username}</span>
                        <span className="ml-2 text-gray-400">{moment(comment.createdAt).fromNow()}</span>
                      </div>
                      <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
    </div>
  );
};

export default PostCard;

