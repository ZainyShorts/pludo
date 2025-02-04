import { useEffect } from "react"

export const useResizeObserver = (ref: React.RefObject<Element>, callback: (entry: ResizeObserverEntry) => void) => {
  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      callback(entries[0])
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, callback])
}

