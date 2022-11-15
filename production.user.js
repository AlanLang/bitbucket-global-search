// ==UserScript==
// @name         bitbucket-global-search
// @version      0.0.3
// @author       alan
// @include      https://code.fineres.com/dashboard
// @noframes
// @description  bitbucket全局搜索
// @namespace bitbucket-global-search
// @license MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(()=>{"use strict";var b={};function h(){return new Promise((t,o)=>{GM_xmlhttpRequest({method:"GET",url:"https://code.fineres.com/rest/api/latest/profile/recent/repos?avatarSize=64&limit=10",headers:{Accept:"application/json, text/javascript, */*; q=0.01","Accept-Language":"zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7","Cache-Control":"no-cache",Connection:"keep-alive","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest",cookie:document.cookie},data:"",onload(e){const i=JSON.parse(e.responseText);t(i)},onerror(e){console.error("\u8BF7\u6C42\u5931\u8D25:"),console.error(e),o(e)}})})}function v(){return new Promise((t,o)=>{GM_xmlhttpRequest({method:"GET",url:"https://code.fineres.com/rest/categories/latest/projects?start=0&limit=5000&project=",headers:{Accept:"application/json, text/javascript, */*; q=0.01","Accept-Language":"zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7","Cache-Control":"no-cache",Connection:"keep-alive","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest",cookie:document.cookie},data:"",onload(e){const i=JSON.parse(e.responseText);t(i)},onerror(e){console.error("\u8BF7\u6C42\u5931\u8D25:"),console.error(e),o(e)}})})}function g(t){return new Promise((o,e)=>{GM_xmlhttpRequest({method:"GET",url:`https://code.fineres.com/rest/api/latest/projects/${t}/repos?avatarSize=64&limit=5000`,headers:{Accept:"application/json, text/javascript, */*; q=0.01","Accept-Language":"zh,zh-CN;q=0.9,en-US;q=0.8,en;q=0.7","Cache-Control":"no-cache",Connection:"keep-alive","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest",cookie:document.cookie},data:"",onload(i){const n=JSON.parse(i.responseText);o(n)},onerror(i){console.error("\u8BF7\u6C42\u5931\u8D25:"),console.error(i),e(i)}})})}var c=(t,o,e)=>new Promise((i,n)=>{var l=a=>{try{s(e.next(a))}catch(p){n(p)}},r=a=>{try{s(e.throw(a))}catch(p){n(p)}},s=a=>a.done?i(a.value):Promise.resolve(a.value).then(l,r);s((e=e.apply(t,o)).next())});let u=[];function m(){const t=document.querySelector(".aui-nav"),o=document.createElement("a");o.innerText="\u5168\u5C40\u641C\u7D22",o.style.cursor="pointer";const e=document.createElement("li");return e.appendChild(o),t==null||t.appendChild(e),o}function f(){y()}function y(){const t=document.createElement("div");return t.innerHTML=`
    <div class="aui-dialog2 aui-dialog2-large aui-dialog2-current aui-layer" id="aui-dialog2-1" role="dialog" aria-labelledby="aui-dialog2-1-heading" aria-hidden="true">
      <div class="aui-dialog2-header">
        <h2 class="aui-dialog2-header-main" id="aui-dialog2-1-heading">\u5168\u5C40\u641C\u7D22</h2>
        <a class="aui-dialog2-header-close">
          <span class="aui-icon aui-icon-small aui-iconfont-close-dialog">Close</span>
        </a>
      </div>
      <div class="aui-dialog2-content" style="height: 500px;">
        <div class="aui-field-group">
          <div class="aui-field">
            <form class="aui" action="#">
                <input placeholder="\u8BF7\u8F93\u5165\u5173\u952E\u5B57" id="search" class="text" type="search" name="search">
                <input type="button" value="\u641C\u7D22" id="search-button" class="aui-button"></input>
            </form>
          </div>
        </div>
        <div class="search-result-repositories">
          <ol id="search-result-repositories" class="dashboard-repositories-list"></ol>
        </div>
      </div>
      <div class="aui-dialog2-footer">
        <div class="aui-dialog2-footer-actions">
          <button class="aui-button" id="close-btn">\u5173\u95ED</button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t),AJS.$("#close-btn").click(()=>{AJS.dialog2("#aui-dialog2-1").hide()}),AJS.$(".aui-iconfont-close-dialog").click(()=>{AJS.dialog2("#aui-dialog2-1").hide()}),t}function d(t){const o=document.querySelector("#search-result-repositories");o&&(o.innerHTML=`${t.map(e=>`<li><a href="/projects/${e.project.key}/repos/${e.name}/browse" aria-label="${e.project.name} / ${e.name}"><div class="project-avatar"><div style="display: inline-block; position: relative; outline: 0px;"><span class="css-50fm9s"><span class="css-1gv8fjs" role="img" aria-label="" style="background-image: url('${e.project.avatarUrl}');height: 40px;background-size: contain;"></span></span></div></div><div class="repository-details"><div class="repository-name">${e.name}</div><div class="project-name">${e.project.name}</div></div></a></li>`).join("")}`)}function C(){const t=document.querySelector("#search-result-repositories");t&&(t.innerHTML='<div class="loading"><div class="loading-spinner" style="height: 100px;width: 100%;display: flex;justify-content: center;align-items: center;"><aui-spinner></aui-spinner></div></div>')}function j(){const t=document.querySelector("#search-result-repositories");t&&(t.innerHTML='<div style="height: 100px;width: 100%;display: flex;justify-content: center;align-items: center;" class="empty">\u6682\u65E0\u6570\u636E</div>')}function q(t,o){return c(this,null,function*(){let e=u;if(e.length===0){const l=(yield v()).result;for(let r=0;r<l.length;r++){const s=l[r];console.log(`\u6B63\u5728\u641C\u7D22${s.projectName}\u7684\u4ED3\u5E93`);const a=yield g(s.projectKey);e=[...e,...a.values]}u=e}const i=e.filter(n=>n.name.toLowerCase().includes(t.toLowerCase()));i.length>0?o(i):j()})}function x(){return c(this,null,function*(){u=[],f(),m().addEventListener("click",()=>c(this,null,function*(){const t=document.getElementById("search");t.value="",t.focus();const{values:o}=yield h();AJS.dialog2("#aui-dialog2-1").show(),d(o),AJS.$("#search-button").click(()=>c(this,null,function*(){const e=t.value;C(),e||d(o),yield q(e,d)}))}))})}setTimeout(()=>{x()},500)})();
