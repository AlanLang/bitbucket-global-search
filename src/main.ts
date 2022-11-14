import { getLastReps, RepsResult } from './service'

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
            <form class="aui" action="#">
                <input placeholder="请输入关键字" id="search" class="text" type="search" name="search">
                <input type="button" value="搜索" id="search-button" class="aui-button"></input>
            </form>
          </div>
        </div>
        <div class="search-result-repositories">
          <ol id="search-result-repositories" class="dashboard-repositories-list"></ol>
        </div>
      </div>
      <div class="aui-dialog2-footer">
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
          `<li><a href="/projects/${item.project.key}/repos/${item.name}/browse" aria-label="${item.project.name} / ${item.name}"><div class="project-avatar"><div style="display: inline-block; position: relative; outline: 0px;"><span class="css-50fm9s"><span class="css-1gv8fjs" role="img" aria-label="" style="background-image: url('${item.project.avatarUrl}')"></span></span></div></div><div class="repository-details"><div class="repository-name">${item.name}</div><div class="project-name">${item.project.name}</div></div></a></li>`
      )
      .join('')}`
  }
}

async function main() {
  init()
  appendEntryButton().addEventListener('click', async () => {
    const search = document.getElementById('search') as any
    search.value = ''
    search.focus()
    const { values } = await getLastReps()
    AJS.dialog2('#aui-dialog2-1').show()
    renderSearchResult(values)
    AJS.$('#search-button').click(() => {
      const searchText = search.value as string

      const filtered = searchText
        ? values.filter((v) => {
            return v.name.toLowerCase().includes(searchText.toLowerCase())
          })
        : values
      renderSearchResult(filtered)
    })
  })
}

setTimeout(() => {
  main()
}, 500)
