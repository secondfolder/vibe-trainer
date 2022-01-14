import useSWR, { Fetcher } from 'swr'

export function usePromptText(promptId?: string) {
  const { data, error } = useSWR(promptId, fetcher)

  return typeof data === 'undefined' ? defaultPrompt : data
}

const fetcher: Fetcher<string | null, string> = (promptId) => {
  return fetch(`/api/prompts/${promptId}`)
    .then(res => res.json())
    .then(row => row.text)
    .catch(() => null)
}

const defaultPrompt = `
  I'm a good little slut.
  I will do as I'm told.
  I love being used.
`