'use client'
import { useRouter } from 'next/navigation'

export default function Test() {
  const router = useRouter()

  const handleGoToTest = () => {
    router.push('/result?name=Jane&age=18')
  }
  return (
    <div>
      <div>test</div>
      <div
        className="px-[10px] py-[5px] rounded-lg bg-green-200 cursor-pointer inline-block"
        onClick={handleGoToTest}
      >
        点击前往result页
      </div>
    </div>
  )
}
