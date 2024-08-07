'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function Test() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const name = searchParams.get('name')
  console.log('name: ', name)
  const age = searchParams.get('age')
  console.log('age: ', age)

  useEffect(() => {
    const url = window.location.href
    console.log('url: ', url)
  }, [])

  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
    </div>
  )
}

export default function Result() {
  return (
    <div>
      <div>result</div>
      <Suspense>
        <Test />
      </Suspense>
    </div>
  )
}
