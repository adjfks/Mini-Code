import dayjs from 'dayjs'
import SidebarNoteItemContent from './sidebarNoteItemContent'

export default function SidebarNoteItem({ noteId, note }) {
  const { title, content = '', updateTime } = note
  return (
    <SidebarNoteItemContent
      id={noteId}
      title={title}
      expandChildren={
        <p className="sidebar-note-excerpt">
          {content.substring(0, 20) || <i>(No content)</i>}
        </p>
      }
    >
      <header className="sidebar-note-header">
        <strong>{title}</strong>
        <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
      </header>
    </SidebarNoteItemContent>
  )
}
