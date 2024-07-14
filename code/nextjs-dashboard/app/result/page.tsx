'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Test() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const name = searchParams.get('name')
    console.log('name: ', name)
    const age = searchParams.get('age')
    console.log('age: ', age)
  }, [])

  return (
    <div>
      <div>result</div>
    </div>
  )
}
