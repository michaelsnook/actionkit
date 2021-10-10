// I wish I could write this ProgressBar component!
// This is just a kind of proof of concept of the sort
// of thing you could do if we had a reliable JS wrapper
// for the undocumented javascript API endpoints like 
// /progress and /context.
// This sample implementation uses useSWR to wrap the
// fetch() call in a hook and returns the hook to the
// ProgressBar component.

import { useProgress } from '../../lib/hooks/actionkit'

export function ProgressBar({ page }) {
  const { count, goal, isLoading, error } = useProgress(page)
  if (isLoading) return <SomeLoadingThing />
  if (count && goal) return (
    <ProgressOuter text={`${count} reached, out of ${goal}`}>
      <ProgressInner width={count/goal} />
    </ProgressOuter>
  )
  return <SomeErrorThing error={error} />
}

// and then lib/hooks/actionkit would be like:
import { useSWR } from 'swr'
import { fetchProgress } from '../api/actionkit'

export function useProgress(page) {
  const { data, error } = useSWR(page, fetchProgress)
  return {
    count: data?.count,
    goal: data?.goal,
    error,
    isLoading: !data && !error,
  }
}

// and then you just have to implement fetchProgress.