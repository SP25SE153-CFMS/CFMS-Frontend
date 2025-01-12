"use client"

import { useSearchParams } from "next/navigation"

const useParam = (paramName: string): string => {
  const searchParams = useSearchParams()

  return searchParams.get(paramName) ?? ""
}

export default useParam