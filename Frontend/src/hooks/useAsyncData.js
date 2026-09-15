import { useCallback, useEffect, useState } from 'react'

/**
 * Runs an async fetch function on mount (and whenever `deps` change),
 * exposing the same {data, loading, error, refetch} shape everywhere in the
 * app that loads data from the API layer — so every page handles a slow or
 * failed backend call the same way instead of each reinventing it.
 *
 *   const { data: alerts, loading, error, refetch } = useAsyncData(fetchAlerts, [])
 *
 * `fetchFn` is called with an AbortSignal so in-flight requests are
 * cancelled if the component unmounts or deps change again before it
 * resolves (e.g. switching locations quickly).
 */
export function useAsyncData(fetchFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    setState((prev) => ({ ...prev, loading: true, error: null }))
 
    fetchFn(controller.signal)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (cancelled || error?.name === 'AbortError') return
        setState({ data: null, loading: false, error })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken])

  const refetch = useCallback(() => setReloadToken((t) => t + 1), [])

  return { ...state, refetch }
}
