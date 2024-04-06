import React from 'react'
import Link from 'next/link'
import { getAllNotes } from '@/lib/redis'
import SidebarNoteList from './SidebarNoteList'

export default async function Sidebar() {
  const notes = await getAllNotes()
  return (
    <>
      <section className="col sidebar">
        <Link href={'/'} className="link--unstyled">
          <section className="sidebar-header">
            <img
              className="logo"
              src="/logo.svg"
              width="22px"
              height="20px"
              alt=""
              role="presentation"
            />
            <strong>React Notes</strong>
          </section>
        </Link>
        <section className="sidebar-menu" role="menubar">
          <SidebarNoteList notes={notes} />
        </section>
        <nav></nav>
      </section>
    </>
  )
}
