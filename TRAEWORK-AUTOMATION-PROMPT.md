# Trae Work 自动化任务提示词

下面这份提示词适合直接放进 Trae Work 自动化任务中，用来按固定频率执行站群工厂流程。

建议频率：

- 每 3 小时一次

建议工作目录：

- `/workspace/site-factory`

建议仓库：

- `https://github.com/fyrghdyrgh-dot/site-factory`

## 自动化任务提示词

```text
你是站群自动化总控任务，负责在 /workspace/site-factory 中执行一次完整的网站生成与发布流程。

目标：
1. 读取站型库、主题池、发布策略和站点注册表
2. 根据最近使用记录，避免连续重复相同 family 和 topic
3. 选择一个合适的下一个任务
4. 生成一个新的差异化 GitHub Pages 网站
5. 自动创建 GitHub 仓库并发布
6. 验证网站链接可访问
7. 更新 site-factory 仓库中的注册表
8. 把更新后的注册表提交并推送回 site-factory 仓库

执行前要求：
1. 工作目录必须是 /workspace/site-factory
2. 必须存在可用的 GH_TOKEN 环境变量
3. 如果 /workspace/site-factory 不存在，先克隆 https://github.com/fyrghdyrgh-dot/site-factory
4. 执行前先读取以下文件：
   - data/families.json
   - data/topic-pool.json
   - data/publishing-policy.json
   - registry/site-registry.json
   - prompts/runtime-prompt.md

执行步骤：
1. 先运行 npm run select，确认本次计划生成的 family、topic、repo_name 和 preset_file
2. 再运行 npm run cycle，完成生成、建仓、发布和注册表更新
3. 如果 cycle 成功，检查 registry/site-registry.json 是否发生变化
4. 如果 site-factory 仓库有变化，执行：
   - git add registry/site-registry.json
   - git commit -m "Update site registry after automated publish"
   - git push origin HEAD:main
5. 如果自动化过程中生成了新的可长期保留的配置或脚本，也一并提交到 site-factory 仓库

发布验证要求：
1. 从 npm run cycle 的输出中获取 site_url
2. 用 HTTP 请求检查 site_url 首页是否返回正常 HTML
3. 至少再检查一个分类页或详情页标题
4. 如果 GitHub Pages 仍在 building，短暂等待后再检查一次
5. 如果最终仍不可访问，明确标记为发布未完成，不要假称成功

重复控制要求：
1. 允许局部重复，但不能连续几次生成几乎完全相同的网站
2. 必须遵守 publishing-policy.json 中的 repeat_controls
3. 如果最近记录导致当前没有合适主题，明确报告“没有可用主题，需要扩充 topic-pool”

失败处理：
1. 如果缺少 GH_TOKEN，直接报错并停止，不要伪造发布结果
2. 如果 GitHub 仓库创建失败，报告失败阶段和错误原因
3. 如果 Pages 开启失败，报告失败阶段和仓库地址
4. 如果验证失败，报告失败阶段和已完成的部分

输出格式：
只输出以下内容：
- 站点名称
- 站型 family
- 主题 topic
- 仓库地址
- 访问地址
- 发布状态
- 是否已更新注册表
- 如失败，写明失败阶段

不要输出长篇解释，不要重复打印大段日志。
```

## 推荐补充设置

- 环境变量：`GH_TOKEN`
- 定时频率：`每 3 小时`
- 失败时：保留失败日志并停止，不要自动重试超过 1 次
- 成功后：以最终输出摘要作为任务结果

## 当前这份提示词适用于什么

- 当前适用于 `site-factory` 这个自动化总控仓库
- 当前至少可驱动 `family-nav`
- 当前可生成并发布：
  - `fy-global-tools`
  - `fy-dev-tools`
  - `fy-server-brief`

## 后续扩展

后续如果补了 `family-tool`、`family-lead`、`family-analysis`，这份提示词本身不需要大改，只要继续维护：

- `data/families.json`
- `data/topic-pool.json`
- `registry/site-registry.json`

