import React from 'react'
import "./Post.css"
import Avatar from "@material-ui/core/Avatar/Avatar"
import { db } from './firebase'
import firebase from "firebase"

function Post({ user, postId, imageURL, username, caption }) {

    const [comment, setComment] = React.useState([])

    const [com, setCom] = React.useState('')

    React.useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comment')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComment(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe()
        }

    }, [postId])

    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection('comment').add({
            text: com,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setCom('')
    }

    return (
        <div className="post">
            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    alt="Deep"
                    src="data:image/png;base64,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"
                />
                <h3>{username}</h3>
            </div>
            <img src={imageURL} alt="" />
            <h4 className="post_text"><strong>{caption}</strong></h4>

            <div className="post_comment">
                {comment.map((comment) => (
                    <p>
                        <strong>
                            {comment.username}
                        </strong>
                        <p>
                            {comment.text}
                        </p>
                    </p>
                ))}
            </div>

            {user && (
                <form className="post_comments">
                    <input
                        type="text"
                        className="post_input"
                        placeholder="Add a comment"
                        value={com}
                        onChange={(e) => setCom(e.target.value)}
                    />
                    <button
                        className="post_button"
                        disabled={!com}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                </button>
                </form>
            )

            }
        </div>
    )
}

export default Post
