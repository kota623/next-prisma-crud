import styles from '../../styles/Home.module.scss'
import { FormEvent, useState } from 'react'
import { GetServerSideProps } from 'next'
import {prisma} from '../../lib/prisma'
import { useRouter } from 'next/router'
import Link from 'next/link'
import header from '../layout/Header.module.scss'
import {ApiClient} from '../../lib/api-client'
import {INotes, INoteForm} from '../../src/models/note_model'

export default function Home({notes} :INotes) {
  const [form, setForm] = useState<INoteForm>({
    title: '',
    post: '',
    id: '',
  })
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath)
  }

  const createNote = async (form: INoteForm) => {

    try {
      const res = await ApiClient.post(`/note/create`, JSON.stringify(form))
      const data = await res.data
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

  const updatePost = async (form: INoteForm) => {
    console.log('updated')
    try {
      const res = await ApiClient.put(`/note/${form.id}`, JSON.stringify(form))
      const data = await res.data
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
      const res = await ApiClient.delete(`/note/${id}`, {data: JSON.stringify(id)})
      const data = res.data
      console.log(data, res)
      refreshData()
    } catch (error) {
      console.log(error)
    }
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isEditing) {
      createNote(form)
      console.log(form)
    } else if (isEditing) {
      updatePost(form)
      setIsEditing(false)
    }
  }

  const handleEdit = (data: INoteForm) => {
    setForm({
      title: data.title,
      post: data.post,
      id: data.id
    })
    setIsEditing(true)
  }


  return (
    <div className={styles.container}>
      <header className={header.header} >
        <h1 className={styles.title}>
          Notes
        </h1>
      </header>
      <div className={'row'}>
        <div className={'col md-2'} >
          <ul>
            <li>
              <Link href="/notes">Notes</Link>
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
            notes.map(note => {
              return(
                <div key={note.id}>
                  <h1>{note.title}</h1>
                  <p>{note.post}</p>
                  <button className={'btn btn-success margin-right-5'} onClick={() => handleEdit(note)}><span className="icon-refresh"></span>Update</button>
                  <button className={'btn btn-error'} onClick={() => deletePost(note.id)}><span className="icon-close"></span>Delete</button>
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
  const notes = await prisma.note.findMany({
    // This removed the error we get from the date not being serialised 
    select: {
      title: true,
      id: true,
      post: true
    }
  })

  return {
    props: { notes }
  }
  
}


