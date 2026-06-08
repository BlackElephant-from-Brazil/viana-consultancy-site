import PostForm from '../../../_components/PostForm'

export default function NewPostPage() {
  return (
    <div className="container">
      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">New Post</h2>
        </div>
        <PostForm mode="create" />
      </div>
    </div>
  )
}
