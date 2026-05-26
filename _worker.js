/**
 * Cloudflare Worker DoH Service
 * Edit DNS_UPSTREAMS below to add/remove providers.
 */

// ====== DNS Upstream Configuration ======
// Format: { '/path-prefix': 'https://doh-provider.com/dns-query' }
const DNS_UPSTREAMS = {
	'/google':     'https://dns.google/dns-query',
	'/cloudflare': 'https://cloudflare-dns.com/dns-query',
	'/quad9':      'https://dns.quad9.net/dns-query',
	'/dns.sb':     'https://dns.sb/dns-query',
	'/yandex':     'https://common.dot.dns.yandex.net/dns-query',
	'/adguard':    'https://dns.adguard-dns.com/dns-query',
};
// =======================================

const HOMEPAGE_HTML = `<!DOCTYPE html>
  <html lang="zh-CN">
  
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cloudflare DoH 服务 - 简单高效的 DNS over HTTPS 服务</title>
	  <style>
		  :root {
			  --primary-color: #f6821f;
			  --secondary-color: #3b88c3;
			  --dark-color: #404041;
			  --light-color: #f4f4f4;
			  --success-color: #5cb85c;
			  --error-color: #d9534f;
		  }
  
		  * {
			  box-sizing: border-box;
			  margin: 0;
			  padding: 0;
		  }
  
		  body {
			  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			  line-height: 1.6;
			  color: #333;
			  background-color: var(--light-color);
		  }
  
		  .container {
			  max-width: 1100px;
			  margin: 0 auto;
			  padding: 0 20px;
		  }
  
		  header {
			  background-color: var(--primary-color);
			  color: white;
			  text-align: center;
			  padding: 2rem 0;
			  margin-bottom: 2rem;
		  }
  
		  header h1 {
			  font-size: 2.5rem;
			  margin-bottom: 0.5rem;
		  }
  
		  .subtitle {
			  font-size: 1.2rem;
			  font-weight: 300;
		  }
  
		  section {
			  margin: 2rem 0;
			  padding: 1.5rem;
			  background-color: white;
			  border-radius: 5px;
			  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		  }
  
		  h2 {
			  color: var(--primary-color);
			  margin-bottom: 1rem;
			  border-bottom: 1px solid #eee;
			  padding-bottom: 0.5rem;
		  }
  
		  h3 {
			  color: var(--secondary-color);
			  margin: 1rem 0;
		  }
  
		  ul,
		  ol {
			  margin: 1rem 0 1rem 1.5rem;
		  }
  
		  li {
			  margin-bottom: 0.5rem;
		  }
  
		  pre {
			  background-color: #f8f8f8;
			  padding: 1rem;
			  border-radius: 5px;
			  overflow-x: auto;
			  margin: 1rem 0;
			  border-left: 4px solid var(--primary-color);
		  }
  
		  code {
			  font-family: 'Courier New', monospace;
		  }
  
		  .example {
			  background-color: #f9f9f9;
			  padding: 1rem;
			  border-radius: 5px;
			  margin: 1rem 0;
		  }
  
		  .card {
			  border: 1px solid #ddd;
			  border-radius: 5px;
			  padding: 1.5rem;
			  margin: 1rem 0;
		  }
  

		  
		  .cta {
			  text-align: center;
			  margin: 2rem 0;
		  }
  
		  .btn {
			  display: inline-block;
			  background-color: var(--primary-color);
			  color: white;
			  padding: 0.75rem 1.5rem;
			  border: none;
			  border-radius: 5px;
			  text-decoration: none;
			  font-weight: bold;
			  transition: background-color 0.3s;
		  }
  
		  .btn:hover {
			  background-color: #e67e22;
		  }
  
		  .lang-switch {
			  float: right;
			  color: white;
			  text-decoration: none;
			  font-weight: bold;
			  padding: 0.25rem 0.75rem;
			  border: 2px solid white;
			  border-radius: 4px;
			  transition: background-color 0.3s, color 0.3s;
		  }

		  .lang-switch:hover {
			  background-color: white;
			  color: var(--primary-color);
		  }

		  .github-link {
			  text-align: center;
			  margin-bottom: 1rem;
		  }
  
		  footer {
			  text-align: center;
			  padding: 2rem 0;
			  background-color: var(--dark-color);
			  color: white;
			  margin-top: 2rem;
		  }
  
		  .grid {
			  display: grid;
			  grid-template-columns: repeat(2, 1fr);
			  gap: 2rem;
		  }
  
		  @media (max-width: 768px) {
			  .grid {
				  grid-template-columns: 1fr;
			  }
		  }
		  #targets label { margin-right: 16px; cursor: pointer; }
		  #results table { margin-top: 12px; border-collapse: collapse; width: 100%; max-width: 400px; }
		  #results td, #results th { padding: 6px 12px; border-bottom: 1px solid #eee; text-align: left; }
	  </style>
  </head>
  
  <body>
	  <header>
		  <div class="container">
			  <a href="/en" class="lang-switch">EN</a>
			  <h1>Cloudflare DoH 服务</h1>
			  <p class="subtitle">一个轻量级的 DNS over HTTPS (DoH) 服务</p>
		  </div>
	  </header>
  
	  <div class="container">
		  <section>
			  <h2>项目介绍</h2>
			  <p>Cloudflare DoH 服务是一个基于 Cloudflare Workers 的轻量级服务，能够根据请求路径将 DNS 查询路由到不同的 DoH 服务提供商，同时保留原始查询参数。</p>
  
			  <h3>主要功能</h3>
			  <ul>
				  <li><strong>基于路径的路由</strong>：根据请求路径确定路由目标</li>
				  <li><strong>多提供商支持</strong>：支持 Google、Cloudflare 等多家 DoH 服务提供商</li>
				  <li><strong>自定义配置</strong>：通过编辑配置文件灵活配置路由规则</li>
				  <li><strong>保留查询参数</strong>：完整保留原始请求中的查询参数</li>
				  <li><strong>轻量级部署</strong>：基于 Cloudflare Worker/Pages，无需维护服务器</li>
			  </ul>
		  </section>
   
		  <section>
			  <h2>可用端点</h2>
			  <p>__UPSTREAM_LIST__</p>
		  </section>
   
		  <section>
			  <h2>使用方法</h2>
			  <p>本服务已部署到 Cloudflare，您可以直接使用以下地址进行 DNS 查询：</p>
   
			  <h3>使用 Google DoH 服务</h3>
			  <div class="example">
				  <code>https://__HOST__/google/query-dns?name=example.com</code>
			  </div>
   
			  <h3>使用 Cloudflare DoH 服务</h3>
			  <div class="example">
				  <code>https://__HOST__/cloudflare/query-dns?name=example.com</code>
			  </div>
   
			  <h3>HTTP 请求示例</h3>
			  <pre><code>curl -H "accept: application/dns-json" "https://__HOST__/google/query-dns?name=example.com&type=A"</code></pre>
		  </section>
  
		  <div class="grid">
			  <section>
				  <h2>自托管部署</h2>
				  <p>您可以使用以下两种方法部署 DoH 服务：</p>
  
				  <h3>方法一：使用 Cloudflare Workers</h3>
				  <ol>
					  <li>登录到 <a href="https://dash.cloudflare.com/" target="_blank">Cloudflare 控制台</a></li>
					  <li>进入 Workers 部分并点击"创建服务"</li>
					  <li>将项目代码粘贴到编辑器中</li>
					  <li>配置环境变量（可选）</li>
					  <li>点击"部署"按钮</li>
				  </ol>
  
				  <h3>方法二：使用 Cloudflare Pages</h3>
				  <ol>
					  <li>将项目代码推送到 Git 仓库</li>
					  <li>在 Cloudflare Pages 中创建新项目并连接到您的仓库</li>
					  <li>完成基本配置后部署即可</li>
				  </ol>
  
				  <div class="github-link">
					  <p>获取完整部署说明:</p>
					  <a href="https://github.com/jqknono/cloudflare-doh" class="btn" target="_blank">GitHub 仓库</a>
				  </div>
			  </section>
  
			  <section>
				  <h2>延迟检测</h2>
				  <p>选择要测试的端点，点击开始检测即可测速：</p>
				  <div id="targets">__UPSTREAM_CHECKBOXES__</div>
				  <p><button onclick="runLatencyTest()" style="padding:8px 20px;cursor:pointer">开始检测</button></p>
				  <div id="results" style="display:none">
					  <table><thead><tr><th>端点</th><th>延迟</th><th>状态</th></tr></thead><tbody></tbody></table>
				  </div>
			  </section>
		  </div>
  
		  <section>
			  <h2>浏览器 DoH 设置方法</h2>
			  <p>以下是在不同浏览器中配置 DNS over HTTPS (DoH) 的方法：</p>
  
			  <div class="card">
				  <h3>Firefox 浏览器设置</h3>
				  <ol>
					  <li>打开 Firefox，在地址栏中输入 <code>about:preferences#general</code></li>
					  <li>滚动到页面底部找到"网络设置"部分</li>
					  <li>点击"设置"按钮</li>
					  <li>滚动到底部，勾选"启用基于 HTTPS 的 DNS"</li>
					  <li>选择"自定义"选项，并输入以下 URL（以 Google 为例）：<br>
						  <code>https://__HOST__/google/query-dns</code>
					  </li>
					  <li>点击"确定"保存设置</li>
				  </ol>
			  </div>
  
			  <div class="card">
				  <h3>Chrome 浏览器设置</h3>
				  <ol>
					  <li>打开 Chrome，在地址栏中输入 <code>chrome://settings/security</code></li>
					  <li>找到"安全浏览和安全"部分</li>
					  <li>点击"使用安全 DNS 服务"</li>
					  <li>选择"自定义"选项，并输入以下 URL（以 Cloudflare 为例）：<br>
						  <code>https://__HOST__/cloudflare/query-dns</code>
					  </li>
				  </ol>
				  <p>注意：Chrome 只允许使用预定义的 DoH 提供商或自定义提供商，但有些版本可能限制对自定义 DoH 服务的支持。</p>
			  </div>
  
			  <div class="card">
				  <h3>Edge 浏览器设置</h3>
				  <ol>
					  <li>打开 Edge，在地址栏中输入 <code>edge://settings/privacy</code></li>
					  <li>滚动到"安全"部分</li>
					  <li>找到"使用安全 DNS 服务指定如何查找网站的网络地址"</li>
					  <li>选择"自定义"选项，并输入以下 URL（以 Google 为例）：<br>
						  <code>https://__HOST__/google/query-dns</code>
					  </li>
				  </ol>
			  </div>
  
              <h2>操作系统级别设置</h3>
			  <div class="card">
				  <h4>Windows 11 设置</h4>
				  <ol>
					  <li>打开设置 &gt; 网络和 Internet &gt; Wi-Fi 或以太网（取决于您的连接类型）</li>
					  <li>点击您的网络连接</li>
					  <li>在"DNS 服务器分配"部分，选择"编辑"</li>
					  <li>将"IPv4 DNS 服务器"设置更改为"手动"</li>
					  <li>开启"IPv4 的 DNS over HTTPS"</li>
					  <li>在"首选 DNS"字段输入 DoH 提供商的 IP 地址</li>
					  <li>在"首选 DoH 模式"下拉菜单中选择"自定义"并输入您的 DoH URL：<br>
						  <code>https://__HOST__/google/query-dns</code>
					  </li>
				  </ol>
  
                  <h4>macOS/iOS 设置</h4>
                  <ol>
                      <li>通过 <a href="https://dns.notjakob.com/tool.html" target="_blank">DNS Profile Creator</a> 等工具生成 DoH 配置描述文件</li>
                      <li>将配置文件下载到您的设备上</li>
                      <li>在 macOS 上：
                          <ul>
                              <li>双击下载的配置文件</li>
                              <li>在系统设置中找到"配置文件"</li>
                              <li>点击"安装"并输入管理员密码确认</li>
                          </ul>
                      </li>
                      <li>在 iOS 上：
                          <ul>
                              <li>打开下载的配置文件</li>
                              <li>点击"设置"应用程序中的通知</li>
                              <li>点击"安装配置文件"</li>
                              <li>输入设备密码确认安装</li>
                          </ul>
                      </li>
                      <li>安装完成后，设备将自动使用配置的 DoH 服务器</li>
                  </ol>
  
				  <h4>Android 设置</h4>
				  <p>Android 暂不支持 DoH</p>
			  </div>
		  </section>
  

		  
		  <section>
			  <h2>常见问题</h2>
			  <div class="card">
				  <h3>什么是 DNS over HTTPS (DoH)？</h3>
				  <p>DoH 是一种加密 DNS 查询的协议，它通过 HTTPS 协议发送 DNS 查询，防止中间人攻击和隐私泄露。</p>
			  </div>
			  <div class="card">
				  <h3>为什么需要 DoH 服务？</h3>
				  <p>DoH 服务可以帮助绕过网络限制、提供统一的接口调用多个 DoH 服务提供商，并在提供商之间快速切换。</p>
			  </div>
			  <div class="card">
				  <h3>使用此服务是否安全？</h3>
				  <p>本服务仅路由请求，不会修改或存储您的 DNS 查询内容。但请注意，您的 DNS 查询仍由目标 DoH 服务处理。</p>
			  </div>
			  <div class="card">
				  <h3>免费版有什么限制？</h3>
				  <p>Cloudflare Workers 免费版每日有 100,000 次请求限制，足够个人使用，但不适合大规模部署。</p>
			  </div>
		  </section>
  
		  <div class="cta">
			  <h2>开始使用</h2>
			  <p>开始部署你的 DoH 服务，或直接使用我们的服务</p>
			  <a href="https://github.com/jqknono/cloudflare-doh" class="btn">获取代码</a>
		  </div>
	  </div>
  
	  <footer>
		  <div class="container">
			  <p>Cloudflare DoH 服务 &copy; 2023</p>
			  <p>基于 MIT 许可协议开源</p>
		  </div>
	  </footer>
  <script>
const FIXED_QUERY = 'AAABAAABAAAAAAAAB2V4YW1wbGUDY29tAAABAAE=';
async function runLatencyTest() {
  const results = document.getElementById('results');
  results.style.display = 'block';
  const tbody = results.querySelector('tbody');
  tbody.innerHTML = '';
  const checks = document.querySelectorAll('#targets input:checked');
  if (!checks.length) { tbody.innerHTML = '<tr><td colspan=3>未选择端点</td></tr>'; return; }
  const tasks = [...checks].map(async cb => {
    const name = cb.value;
    const row = tbody.insertRow();
    row.innerHTML = '<td><strong>' + name + '</strong></td><td>...</td><td>...</td>';
    const start = performance.now();
    try {
      const res = await fetch('/' + name + '/query-dns?dns=' + FIXED_QUERY);
      row.cells[1].textContent = (performance.now() - start).toFixed(0) + 'ms';
      row.cells[2].textContent = res.ok ? '\u2705' : '\u274C ' + res.status;
    } catch(e) {
      row.cells[1].textContent = '-';
      row.cells[2].textContent = '\u274C';
    }
  });
  await Promise.all(tasks);
}
</script>
</body>
  
   </html>`;

const HOMEPAGE_HTML_EN = `<!DOCTYPE html>
  <html lang="en">

  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cloudflare DoH Service - DNS over HTTPS</title>
	  <style>
		  :root {
			  --primary-color: #f6821f;
			  --secondary-color: #3b88c3;
			  --dark-color: #404041;
			  --light-color: #f4f4f4;
			  --success-color: #5cb85c;
			  --error-color: #d9534f;
		  }

		  * {
			  box-sizing: border-box;
			  margin: 0;
			  padding: 0;
		  }

		  body {
			  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			  line-height: 1.6;
			  color: #333;
			  background-color: var(--light-color);
		  }

		  .container {
			  max-width: 1100px;
			  margin: 0 auto;
			  padding: 0 20px;
		  }

		  header {
			  background-color: var(--primary-color);
			  color: white;
			  text-align: center;
			  padding: 2rem 0;
			  margin-bottom: 2rem;
		  }

		  header h1 {
			  font-size: 2.5rem;
			  margin-bottom: 0.5rem;
		  }

		  .subtitle {
			  font-size: 1.2rem;
			  font-weight: 300;
		  }

		  section {
			  margin: 2rem 0;
			  padding: 1.5rem;
			  background-color: white;
			  border-radius: 5px;
			  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		  }

		  h2 {
			  color: var(--primary-color);
			  margin-bottom: 1rem;
			  border-bottom: 1px solid #eee;
			  padding-bottom: 0.5rem;
		  }

		  h3 {
			  color: var(--secondary-color);
			  margin: 1rem 0;
		  }

		  ul,
		  ol {
			  margin: 1rem 0 1rem 1.5rem;
		  }

		  li {
			  margin-bottom: 0.5rem;
		  }

		  pre {
			  background-color: #f8f8f8;
			  padding: 1rem;
			  border-radius: 5px;
			  overflow-x: auto;
			  margin: 1rem 0;
			  border-left: 4px solid var(--primary-color);
		  }

		  code {
			  font-family: 'Courier New', monospace;
		  }

		  .example {
			  background-color: #f9f9f9;
			  padding: 1rem;
			  border-radius: 5px;
			  margin: 1rem 0;
		  }

		  .card {
			  border: 1px solid #ddd;
			  border-radius: 5px;
			  padding: 1.5rem;
			  margin: 1rem 0;
		  }


		  
		  .cta {
			  text-align: center;
			  margin: 2rem 0;
		  }

		  .btn {
			  display: inline-block;
			  background-color: var(--primary-color);
			  color: white;
			  padding: 0.75rem 1.5rem;
			  border: none;
			  border-radius: 5px;
			  text-decoration: none;
			  font-weight: bold;
			  transition: background-color 0.3s;
		  }

		  .btn:hover {
			  background-color: #e67e22;
		  }

		  .lang-switch {
			  float: right;
			  color: white;
			  text-decoration: none;
			  font-weight: bold;
			  padding: 0.25rem 0.75rem;
			  border: 2px solid white;
			  border-radius: 4px;
			  transition: background-color 0.3s, color 0.3s;
		  }

		  .lang-switch:hover {
			  background-color: white;
			  color: var(--primary-color);
		  }

		  .github-link {
			  text-align: center;
			  margin-bottom: 1rem;
		  }

		  footer {
			  text-align: center;
			  padding: 2rem 0;
			  background-color: var(--dark-color);
			  color: white;
			  margin-top: 2rem;
		  }

		  .grid {
			  display: grid;
			  grid-template-columns: repeat(2, 1fr);
			  gap: 2rem;
		  }

		  @media (max-width: 768px) {
			  .grid {
				  grid-template-columns: 1fr;
			  }
		  }
		  #targets label { margin-right: 16px; cursor: pointer; }
		  #results table { margin-top: 12px; border-collapse: collapse; width: 100%; max-width: 400px; }
		  #results td, #results th { padding: 6px 12px; border-bottom: 1px solid #eee; text-align: left; }
	  </style>
  </head>

  <body>
	  <header>
		  <div class="container">
			  <a href="/" class="lang-switch">中文</a>
			  <h1>Cloudflare DoH Service</h1>
			  <p class="subtitle">A lightweight DNS over HTTPS (DoH) service</p>
		  </div>
	  </header>

	  <div class="container">
		  <section>
			  <h2>Introduction</h2>
			  <p>Cloudflare DoH Service is a lightweight service based on Cloudflare Workers that routes DNS queries to different DoH providers based on the request path while preserving original query parameters.</p>

			  <h3>Key Features</h3>
			  <ul>
				  <li><strong>Path-based routing</strong>: Routes requests based on the URL path</li>
				  <li><strong>Multi-provider support</strong>: Supports Google, Cloudflare, and other DoH providers</li>
				  <li><strong>Custom configuration</strong>: Flexible routing rules via configuration file</li>
				  <li><strong>Preserve query parameters</strong>: Fully preserves original request query parameters</li>
				  <li><strong>Lightweight deployment</strong>: Based on Cloudflare Worker/Pages, no server maintenance needed</li>
			  </ul>
		  </section>
   
		  <section>
			  <h2>Available Endpoints</h2>
			  <p>__UPSTREAM_LIST__</p>
		  </section>
   
		  <section>
			  <h2>Usage</h2>
			  <p>This service is deployed on Cloudflare. You can use the following addresses directly for DNS queries:</p>

			  <h3>Using Google DoH</h3>
			  <div class="example">
				  <code>https://__HOST__/google/query-dns?name=example.com</code>
			  </div>

			  <h3>Using Cloudflare DoH</h3>
			  <div class="example">
				  <code>https://__HOST__/cloudflare/query-dns?name=example.com</code>
			  </div>

			  <h3>HTTP Request Example</h3>
			  <pre><code>curl -H "accept: application/dns-json" "https://__HOST__/google/query-dns?name=example.com&type=A"</code></pre>
		  </section>

		  <div class="grid">
			  <section>
				  <h2>Self-Hosted Deployment</h2>
				  <p>You can deploy the DoH service using either of these methods:</p>

				  <h3>Method 1: Using Cloudflare Workers</h3>
				  <ol>
					  <li>Log in to the <a href="https://dash.cloudflare.com/" target="_blank">Cloudflare Dashboard</a></li>
					  <li>Go to Workers, click "Create a Service"</li>
					  <li>Paste the project code into the editor</li>
					  <li>Configure environment variables (optional)</li>
					  <li>Click "Deploy"</li>
				  </ol>

				  <h3>Method 2: Using Cloudflare Pages</h3>
				  <ol>
					  <li>Push the project code to a Git repository</li>
					  <li>Create a new project in Cloudflare Pages and connect it to your repository</li>
					  <li>Complete basic configuration and deploy</li>
				  </ol>

				  <div class="github-link">
					  <p>Get full deployment instructions:</p>
					  <a href="https://github.com/jqknono/cloudflare-doh" class="btn" target="_blank">GitHub Repository</a>
				  </div>
			  </section>

			  <section>
				  <h2>Latency Test</h2>
				  <p>Select endpoints to test, then click start:</p>
				  <div id="targets">__UPSTREAM_CHECKBOXES__</div>
				  <p><button onclick="runLatencyTest()" style="padding:8px 20px;cursor:pointer">Start Test</button></p>
				  <div id="results" style="display:none">
					  <table><thead><tr><th>Endpoint</th><th>Latency</th><th>Status</th></tr></thead><tbody></tbody></table>
				  </div>
			  </section>
		  </div>

		  <section>
			  <h2>Browser DoH Setup</h2>
			  <p>Here's how to configure DNS over HTTPS (DoH) in different browsers:</p>

			  <div class="card">
				  <h3>Firefox Setup</h3>
				  <ol>
					  <li>Open Firefox and enter <code>about:preferences#general</code> in the address bar</li>
					  <li>Scroll to the bottom and find "Network Settings"</li>
					  <li>Click "Settings"</li>
					  <li>Scroll down and check "Enable DNS over HTTPS"</li>
					  <li>Select "Custom" and enter the following URL (using Google as an example):<br>
						  <code>https://__HOST__/google/query-dns</code>
					  </li>
					  <li>Click "OK" to save</li>
				  </ol>
			  </div>

			  <div class="card">
				  <h3>Chrome Setup</h3>
				  <ol>
					  <li>Open Chrome and enter <code>chrome://settings/security</code> in the address bar</li>
					  <li>Find the "Safe browsing and security" section</li>
					  <li>Click "Use secure DNS"</li>
					  <li>Select "Custom" and enter the following URL (using Cloudflare as an example):<br>
						  <code>https://__HOST__/cloudflare/query-dns</code>
					  </li>
				  </ol>
				  <p>Note: Chrome only allows predefined DoH providers or custom providers, but some versions may limit custom DoH support.</p>
			  </div>

			  <div class="card">
				  <h3>Edge Setup</h3>
				  <ol>
					  <li>Open Edge and enter <code>edge://settings/privacy</code> in the address bar</li>
					  <li>Scroll to the "Security" section</li>
					  <li>Find "Use secure DNS to specify how to look up the network address for websites"</li>
					  <li>Select "Custom" and enter the following URL (using Google as an example):<br>
						  <code>https://__HOST__/google/query-dns</code>
					  </li>
				  </ol>
			  </div>

              <h2>Operating System Setup</h2>
			  <div class="card">
				  <h4>Windows 11 Setup</h4>
				  <ol>
					  <li>Open Settings &gt; Network & Internet &gt; Wi-Fi or Ethernet (depending on your connection type)</li>
					  <li>Click your network connection</li>
					  <li>Under "DNS server assignment", click "Edit"</li>
					  <li>Set "IPv4 DNS server" to "Manual"</li>
					  <li>Enable "DNS over HTTPS for IPv4"</li>
					  <li>Enter the DoH provider's IP address in the "Preferred DNS" field</li>
					  <li>Set "Preferred DoH mode" to "Custom" and enter your DoH URL:<br>
						  <code>https://__HOST__/google/query-dns</code>
					  </li>
				  </ol>

                  <h4>macOS/iOS Setup</h4>
                  <ol>
                      <li>Use tools like <a href="https://dns.notjakob.com/tool.html" target="_blank">DNS Profile Creator</a> to generate a DoH configuration profile</li>
                      <li>Download the profile to your device</li>
                      <li>On macOS:
                          <ul>
                              <li>Double-click the downloaded profile</li>
                              <li>Find "Profiles" in System Settings</li>
                              <li>Click "Install" and enter your admin password to confirm</li>
                          </ul>
                      </li>
                      <li>On iOS:
                          <ul>
                              <li>Open the downloaded profile</li>
                              <li>Tap the notification in the Settings app</li>
                              <li>Tap "Install Profile"</li>
                              <li>Enter your device passcode to confirm installation</li>
                          </ul>
                      </li>
                      <li>After installation, your device will automatically use the configured DoH server</li>
                  </ol>

				  <h4>Android Setup</h4>
				  <p>Android does not currently support DoH</p>
			  </div>
		  </section>


		  
		  <section>
			  <h2>FAQ</h2>
			  <div class="card">
				  <h3>What is DNS over HTTPS (DoH)?</h3>
				  <p>DoH is a protocol that encrypts DNS queries by sending them through HTTPS, preventing man-in-the-middle attacks and privacy leaks.</p>
			  </div>
			  <div class="card">
				  <h3>Why is a DoH service needed?</h3>
				  <p>A DoH service helps bypass network restrictions, provides a unified interface for multiple DoH providers, and allows quick switching between providers.</p>
			  </div>
			  <div class="card">
				  <h3>Is it safe to use this service?</h3>
				  <p>This service only routes requests and does not modify or store your DNS query content. However, note that your DNS queries are still processed by the target DoH service.</p>
			  </div>
			  <div class="card">
				  <h3>What are the limits of the free tier?</h3>
				  <p>The Cloudflare Workers free tier has a daily limit of 100,000 requests, sufficient for personal use but not suitable for large-scale deployments.</p>
			  </div>
		  </section>

		  <div class="cta">
			  <h2>Get Started</h2>
			  <p>Deploy your own DoH service or start using ours directly</p>
			  <a href="https://github.com/jqknono/cloudflare-doh" class="btn">Get the Code</a>
		  </div>
	  </div>

	  <footer>
		  <div class="container">
			  <p>Cloudflare DoH Service &copy; 2023</p>
			  <p>Open sourced under the MIT License</p>
		  </div>
	  </footer>
  <script>
const FIXED_QUERY = 'AAABAAABAAAAAAAAB2V4YW1wbGUDY29tAAABAAE=';
async function runLatencyTest() {
  const results = document.getElementById('results');
  results.style.display = 'block';
  const tbody = results.querySelector('tbody');
  tbody.innerHTML = '';
  const checks = document.querySelectorAll('#targets input:checked');
  if (!checks.length) { tbody.innerHTML = '<tr><td colspan=3>未选择端点</td></tr>'; return; }
  const tasks = [...checks].map(async cb => {
    const name = cb.value;
    const row = tbody.insertRow();
    row.innerHTML = '<td><strong>' + name + '</strong></td><td>...</td><td>...</td>';
    const start = performance.now();
    try {
      const res = await fetch('/' + name + '/query-dns?dns=' + FIXED_QUERY);
      row.cells[1].textContent = (performance.now() - start).toFixed(0) + 'ms';
      row.cells[2].textContent = res.ok ? '\u2705' : '\u274C ' + res.status;
    } catch(e) {
      row.cells[1].textContent = '-';
      row.cells[2].textContent = '\u274C';
    }
  });
  await Promise.all(tasks);
}
</script>
</body>

  </html>`;


function serveHomepage(request) {
	const host = new URL(request.url).host;
	const names = Object.keys(DNS_UPSTREAMS).map(k => '<strong>' + k.slice(1) + '</strong>').join(', ');
	const list = names || '<strong>未启用</strong>';
	const checkboxes = Object.keys(DNS_UPSTREAMS).map(k => {
		const name = k.slice(1);
		return '<label><input type="checkbox" value="' + name + '" checked> <strong>' + name + '</strong></label>';
	}).join(' ') || '无';
	const html = HOMEPAGE_HTML.replaceAll('__HOST__', host)
		.replace('__UPSTREAM_LIST__', list)
		.replace('__UPSTREAM_CHECKBOXES__', checkboxes);
	return new Response(html, {
		status: 200,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	});
}

function serveHomepageEn(request) {
	const host = new URL(request.url).host;
	const names = Object.keys(DNS_UPSTREAMS).map(k => '<strong>' + k.slice(1) + '</strong>').join(', ');
	const list = names || '<strong>none</strong>';
	const checkboxes = Object.keys(DNS_UPSTREAMS).map(k => {
		const name = k.slice(1);
		return '<label><input type="checkbox" value="' + name + '" checked> <strong>' + name + '</strong></label>';
	}).join(' ') || 'none';
	const html = HOMEPAGE_HTML_EN.replaceAll('__HOST__', host)
		.replace('__UPSTREAM_LIST__', list)
		.replace('__UPSTREAM_CHECKBOXES__', checkboxes);
	return new Response(html, {
		status: 200,
		headers: { 'Content-Type': 'text/html; charset=utf-8' },
	});
}

async function handleRequest(request) {
	const url = new URL(request.url);
	const path = url.pathname;
	const queryString = url.search;

	if (path === '/en') {
		return serveHomepageEn(request);
	}

	if (path === '/index.html' || path === '/') {
		return serveHomepage(request);
	}

	const pathPrefix = Object.keys(DNS_UPSTREAMS).find((prefix) => path.startsWith(prefix));

	if (pathPrefix) {
		const newUrl = DNS_UPSTREAMS[pathPrefix] + queryString;
		const newRequest = new Request(newUrl, {
			method: request.method,
			headers: request.headers,
			body: request.body,
			redirect: 'follow',
		});
		return fetch(newRequest);
	}

	return serveHomepage(request);
}

export default {
	async fetch(request) {
		return handleRequest(request);
	},
};
