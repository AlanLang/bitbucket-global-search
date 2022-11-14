interface RepsResult {
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

function getAllReps(): Promise<RepsResult> {
  return new Promise<RepsResult>((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://code.fineres.com/rest/api/latest/profile/recent/repos?avatarSize=64&limit=2000',
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

async function main() {
  const searchInput = document.getElementById('quick-search')
  if (searchInput) {
    searchInput.addEventListener('click', () => {
      console.log('open search')
    })
  }
  const { values } = await getAllReps()
  const resultContent = document.getElementById('quick-search-results')!
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchText = (e.target as any).value as string
      const searchResult = values.filter((item) =>
        item.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      )
      console.log(
        searchResult
          .map(
            (item) => `
      <li class="search-results-item repository"><a href="/projects/CHART/repos/duchamp/browse" class="repository-link" data-entity="repository" data-repository-id="20854" data-repository-slug="duchamp" data-project-id="547" data-project-key="CHART" id="quick-search-repository-20854" title="Duchamp"><span class="aui-avatar aui-avatar-medium aui-avatar-project"><span class="aui-avatar-inner"><img alt="图表" src="/projects/CHART/avatar.png?s=64&amp;v=1492563502000" aria-describedby="aui-tooltip"></span></span><div class="item-wrapper"><strong class="item-name"><span><mark class="term-highlight">Duch</mark>amp</span></strong><p class="item-description">图表</p></div></a></li>
      `
          )
          .join('')
      )
      resultContent.innerHTML = searchResult
        .map(
          (item) => `
      <li class="search-results-item repository"><a href="/projects/CHART/repos/duchamp/browse" class="repository-link" data-entity="repository" data-repository-id="20854" data-repository-slug="duchamp" data-project-id="547" data-project-key="CHART" id="quick-search-repository-20854" title="Duchamp"><span class="aui-avatar aui-avatar-medium aui-avatar-project"><span class="aui-avatar-inner"><img alt="图表" src="/projects/CHART/avatar.png?s=64&amp;v=1492563502000" aria-describedby="aui-tooltip"></span></span><div class="item-wrapper"><strong class="item-name"><span><mark class="term-highlight">Duch</mark>amp</span></strong><p class="item-description">图表</p></div></a></li>
      `
        )
        .join('')
      console.log('%csearchResult: ', 'color: MidnightBlue; background: Aquamarine;', searchResult)
    })
  }
}

setTimeout(() => {
  main()
}, 500)
