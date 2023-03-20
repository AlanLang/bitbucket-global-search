import { getAllPorjects, getLastReps, getReposByProject, RepsResult } from './service'

let cacheResult: RepsResult['values'] = []

function appendEntryButton() {
  const nav = document.querySelector('.aui-nav')
  const a = document.createElement('a')
  a.innerText = '全局搜索'
  a.style.cursor = 'pointer'
  const li = document.createElement('li')
  li.appendChild(a)
  nav?.appendChild(li)
  return a
}

function init() {
  appendDialog()
}

function appendDialog() {
  const dialog = document.createElement('div')
  dialog.innerHTML = `
    <div class="aui-dialog2 aui-dialog2-large aui-dialog2-current aui-layer" id="aui-dialog2-1" role="dialog" aria-labelledby="aui-dialog2-1-heading" aria-hidden="true">
      <div class="aui-dialog2-header">
        <h2 class="aui-dialog2-header-main" id="aui-dialog2-1-heading">全局搜索</h2>
        <a class="aui-dialog2-header-close">
          <span class="aui-icon aui-icon-small aui-iconfont-close-dialog">Close</span>
        </a>
      </div>
      <div class="aui-dialog2-content" style="height: 500px;">
        <div class="aui-field-group">
          <div class="aui-field">
            <form class="aui" onsubmit="return false">
                <input placeholder="请输入关键字" id="search" class="text" type="search" name="search">
                <input type="button" value="全局搜索" id="search-button" class="aui-button"></input>
            </form>
          </div>
        </div>
        <div class="search-result-repositories">
          <ol id="search-result-repositories" class="dashboard-repositories-list"></ol>
        </div>
      </div>
      <div class="aui-dialog2-footer">
        <div id="search-progress" style="display: inline-flex;align-items: center;height: 100%;">
        </div>
        <div class="aui-dialog2-footer-actions">
          <button class="aui-button" id="close-btn">关闭</button>
        </div>
      </div>
    </div>
  `
  document.body.appendChild(dialog)
  AJS.$('#close-btn').click(() => {
    AJS.dialog2('#aui-dialog2-1').hide()
  })
  AJS.$('.aui-iconfont-close-dialog').click(() => {
    AJS.dialog2('#aui-dialog2-1').hide()
  })
  return dialog
}

function renderSearchResult(items: RepsResult['values']) {
  const repositories = document.querySelector('#search-result-repositories')
  if (repositories) {
    repositories
    repositories.innerHTML = `${items
      .map(
        (item) =>
          `<li><a href="/projects/${item.project.key}/repos/${item.name}/browse" aria-label="${item.project.name} / ${item.name}"><div class="project-avatar"><div style="display: inline-block; position: relative; outline: 0px;"><span class="css-50fm9s"><span class="css-1gv8fjs" role="img" aria-label="" style="background-image: url('${item.project.avatarUrl}');height: 40px;background-size: contain;"></span></span></div></div><div class="repository-details"><div class="repository-name">${item.name}</div><div class="project-name">${item.project.name}</div></div></a></li>`
      )
      .join('')}`
  }
}

function renderLoading() {
  const repositories = document.querySelector('#search-result-repositories')
  if (repositories) {
    repositories.innerHTML = `<div class="loading"><div class="loading-spinner" style="height: 100px;width: 100%;display: flex;justify-content: center;align-items: center;"><aui-spinner></aui-spinner></div></div>`
  }
}

function renderEmpty() {
  const repositories = document.querySelector('#search-result-repositories')
  if (repositories) {
    repositories.innerHTML = `<div style="height: 100px;width: 100%;display: flex;justify-content: center;align-items: center;" class="empty">暂无数据</div>`
  }
}

async function filterReps(keyWord: string, render: (items: RepsResult['values']) => void) {
  let searchResult: RepsResult['values'] = cacheResult
  if (searchResult.length === 0) {
    const result = await getAllPorjects()
    const projects = result.result
    for (let index = 0; index < projects.length; index++) {
      const project = projects[index]
      AJS.$('#search-progress').text(`正在搜索${project.projectName}的仓库`)
      const repo = await getReposByProject(project.projectKey)
      searchResult = [...searchResult, ...repo.values]
    }
    cacheResult = searchResult
  }
  const result = searchResult.filter((v) => {
    return v.name.toLowerCase().includes(keyWord.toLowerCase())
  })
  if (result.length > 0) {
    render(result)
  } else {
    renderEmpty()
  }
}

function debounce(fn: () => void, wait: number) {
  let timeout: number | null = null
  return function () {
    if (timeout !== null) clearTimeout(timeout)
    timeout = window.setTimeout(fn, wait)
  }
}

async function main() {
  cacheResult = JSON.parse(localStorage.getItem('bitbucket-search-result') || '[]')
  init()
  appendEntryButton().addEventListener('click', async () => {
    const search = document.getElementById('search') as any
    search.value = ''
    search.focus()
    const inputAction = debounce(() => {
      if (cacheResult.length === 0) return
      const { value } = search as HTMLInputElement
      if (value) {
        filterReps(value, renderSearchResult)
      } else {
        renderEmpty()
      }
    }, 500)
    search.addEventListener('input', inputAction)
    AJS.dialog2('#aui-dialog2-1').show()
    document.getElementById('search')?.addEventListener('keydown', (e) => {
      // 如果按下的是回车
      if (e.keyCode === 13) {
        AJS.$('#search-button').click()
      }
    })
    AJS.$('#search-button').click(async () => {
      cacheResult = []
      const { values } = await getLastReps()
      const searchText = search.value as string
      renderLoading()
      if (!searchText) {
        renderSearchResult(values)
      }
      await filterReps(searchText, renderSearchResult)
      AJS.$('#search-progress').text('')
      localStorage.setItem('bitbucket-search-result', JSON.stringify(cacheResult))
    })
  })
}

setTimeout(() => {
  main()
}, 500)
