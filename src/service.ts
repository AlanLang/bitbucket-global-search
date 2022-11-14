//https://code.fineres.com/rest/categories/latest/projects?start=0&limit=50&project=&_=1668427015058
export interface RepsResult {
  size: number
  limit: number
  isLastPage: boolean
  values: {
    id: number
    name: string
    project: {
      key: string
      id: number
      name: string
      avatarUrl: string
      links: { self: { href: string }[] }
    }
  }[]
}

export interface Project {
  projectId: number
  projectKey: string
  projectName: string
  projectDescription: string
  categories: {
    id: number
    title: string
  }[]
}

export function getLastReps(): Promise<RepsResult> {
  return new Promise<RepsResult>((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://code.fineres.com/rest/api/latest/profile/recent/repos?avatarSize=64&limit=10',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        cookie: document.cookie,
      },
      data: ``,
      onload(response) {
        const result = JSON.parse(response.responseText)
        resolve(result)
      },
      onerror(response) {
        console.error('请求失败:')
        console.error(response)
        reject(response)
      },
    })
  })
}

export function getAllPorjects(): Promise<{ message: string; result: Project[] }> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://code.fineres.com/rest/categories/latest/projects?start=0&limit=5000&project=',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        cookie: document.cookie,
      },
      data: ``,
      onload(response) {
        const result = JSON.parse(response.responseText)
        resolve(result)
      },
      onerror(response) {
        console.error('请求失败:')
        console.error(response)
        reject(response)
      },
    })
  })
}

export function getReposByProject(project: string): Promise<RepsResult> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://code.fineres.com/rest/api/latest/projects/${project}/repos?avatarSize=64&limit=5000`,
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        cookie: document.cookie,
      },
      data: ``,
      onload(response) {
        const result = JSON.parse(response.responseText)
        resolve(result)
      },
      onerror(response) {
        console.error('请求失败:')
        console.error(response)
        reject(response)
      },
    })
  })
}
