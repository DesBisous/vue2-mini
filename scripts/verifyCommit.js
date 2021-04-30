// Invoked on the commit-msg git hook by yorkie.

const chalk = require('chalk');
const msgPath = process.env.GIT_PARAMS;
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

/**
 * feat: 新功能、新特性
 * fix: 修改 bug
 * docs: 文档修改
 * dx:
 * style：代码风格变更（不影响功能, 例如分号修改）
 * refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
 * perf: 更改代码，以提高性能
 * test: 测试用例新增、修改
 * workflow: 工作流相关文件修改
 * build: 影响项目构建或依赖项修改
 * ci: 自动化流程配置修改
 * chore: 其他修改（不在上述类型中的修改）
 * types:
 * wip: 待完成, 研发中的提交备份
 * release: 发布新版本
 */
const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      `invalid commit message format.`
    )}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
      ) +
      `    ${chalk.green(`feat(compiler): add 'comments' option~`)}\n` +
      `    ${chalk.green(
        `fix(v-model): handle events on blur (close #28)`
      )}\n\n` +
      chalk.red(`  See .github/commit-convention.md for more details.\n`)
  );
  process.exit(1);
}
