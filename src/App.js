import React from 'react'
import "./App.css"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { db, auth } from './firebase';
import Post from "./Post"
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./ImageUpload"
import InstagramEmbed from "react-instagram-embed"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles()

  const [modalStyle] = React.useState(getModalStyle)

  const [posts, setPosts] = React.useState([])

  const [open, setOpen] = React.useState(false)

  const [username, setUserName] = React.useState("")

  const [email, setEmail] = React.useState("")

  const [password, setPass] = React.useState("")

  const [user, setUser] = React.useState(null)

  const [openSignIn, setOpenSignIn] = React.useState(false)

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser)
        setUser(authUser)

        if (authUser.displayName) {

        }
        else {
          return authUser.updateProfile({
            displayName: username
          })
        }
      }
      else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  React.useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const signup = (e) => {
    e.preventDefault()
    auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    }).catch((e) => alert(e.message))
    setOpen(false)
  }

  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch(e => alert(e.message))
    setOpenSignIn(false)
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        {<div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.freepnglogos.com/uploads/instagram-logo-png-transparent-0.png"
                alt=""
                className="app_header_logo" />
            </center>
            <Input
              placeholder='mail'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
            <Button type='submit' onClick={signup}>Sign Up</Button>
          </form>
        </div>}
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        {<div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.freepnglogos.com/uploads/instagram-logo-png-transparent-0.png"
                alt=""
                className="app_header_logo" />
            </center>
            <Input
              placeholder='mail'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>}
      </Modal>
      <div className="app_header">
        <img
          src="https://www.freepnglogos.com/uploads/instagram-logo-png-transparent-0.png"
          alt=""
          className="app_header_logo" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app_loigncon">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>

            </div>
          )}
      </div>
      <div className="app_posts">
        <div className="app_postsleft">
          {
            posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                imageURL={post.imageURL}
                caption={post.caption}
              />
            ))
          }
        </div>
        <div className="app_postsright">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>
      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3>Sorry U have to LogIn First to Upload Image</h3>
        )}

    </div>
  )
}

export default App
