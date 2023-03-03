import styles from '../../styles/Home.module.scss'
import { FormEvent, useState } from 'react'
import { GetServerSideProps } from 'next'
import {prisma} from '../../lib/prisma'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface IPosts {
  posts: {
    title: string,
    post: string,
    id: string
  }[]
}
interface IPostForm {
  title: string
  post: string
  id: string
}

export default function Home({posts} :IPosts) {
  const [form, setForm] = useState<IPostForm>({
    title: '',
    post: '',
    id: '',
  })
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();
  
  const refreshData = () => {
    router.replace(router.asPath)
  }

  const createPost = async (form: IPostForm) => {

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setForm({
        title: '',
        post: '',
        id: '',
      })
      refreshData()
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const updatePost = async (form: IPostForm) => {
    console.log('updated')
    try {
      const res = await fetch(`/api/post/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = await res.json()
      setForm({
        title: '',
        post: '',
        id: ''
      })
      refreshData()
      console.log(data)
    } catch (error) {
      console.log(error)
      
    }
  }

  const deletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/post/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(id),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const data = res.json()
      console.log(data, res)
      refreshData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isEditing) {
      createPost(form)
      console.log(form)
    } else if (isEditing) {
      updatePost(form)
      setIsEditing(false)
    }
  }

  const handleEdit = (data: IPostForm) => {
    setForm({
      title: data.title,
      post: data.post,
      id: data.id
    })
    setIsEditing(true)
  }


  return (
    <div className={styles.container}>
      <h1 className={styles.title}> 
        Posts
      </h1>
      <div className={'row'}>
        <div className={'col md-2'} >
          <ul>
            <li>
              <Link href="/posts">Posts</Link>
            </li>
          </ul>
        </div>
        <div className={'col md-10'} >
          <form className={styles.form} onSubmit={(e) => handleFormSubmit(e)}>
            <input
              className={'form-control'}
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
            <input
              className={'form-control'}
              type="text"
              placeholder="Post"
              value={form.post}
              onChange={(e) => setForm({...form, post: e.target.value})}
            />
            <button className={'btn'} type="submit">{isEditing ? 'Edit' : 'Create'}</button>
          </form>

          {
            posts.map(post => {
              return(
                <div key={post.id}>
                  <h1>{post.title}</h1>
                  <p>{post.post}</p>
                  <button className={'btn btn-success margin-right-5'} onClick={() => handleEdit(post)}><span className="icon-refresh"></span>Update</button>
                  <button className={'btn btn-error'} onClick={() => deletePost(post.id)}><span className="icon-close"></span>Delete</button>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.note.findMany({
    // This removed the error we get from the date not being serialised 
    select: {
      title: true,
      id: true,
      post: true
    }
  })

  return {
    props: { posts }
  }
  
}


