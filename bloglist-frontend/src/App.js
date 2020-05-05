import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

 
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {    
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (event) => {
    event.preventDefault()
    
    const blogObject = {title, author,url }
    
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${title} by ${author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000) 
        setTitle('')
        setAuthor('')
        setUrl('')
      })
    
  }

  

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>title:<input name="title" value={title} onChange={({ target }) => setTitle(target.value)} /> </div>
      <div>author:<input name="author" value={author} onChange={({ target }) => setAuthor(target.value)}/> </div>
      <div>url:<input name="url" value={url} onChange={({ target }) => setUrl(target.value)} /> </div>
      <button type="submit">create</button>
    </form>  

  )

    if (user === null) {
      return (
        <div>
          <h2>Log in to application</h2>
          <Notification message={message} />
          <form onSubmit={handleLogin}>
            <div>
              username
                <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
                <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form> 
        </div>
      )
    }
  
    return (
      
      <div>
        <h2>blogs</h2>
        <Notification message={message} />
    <p>{user.name} logged in
      <button onClick={handleLogout}>logout</button>
    </p> 
    <h2>create new</h2>
    {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  
}

export default App