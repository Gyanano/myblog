---
title: "Git 踩坑与常用指令笔记"
date: 2023-10-03
description: "学习期间整理的 Git 常用指令，以及 clone / push / pull 几次卡住后摸出来的解决办法。"
tags: ["Git", "版本控制", "踩坑"]
---

刚学 Git 那阵子踩了不少坑，这里把常用指令和几次卡住的解决过程整理成一篇，方便日后回查。

## 一、常用指令速查

```bash
# 初始化仓库
git init

# 把变更加入暂存区（. 表示所有变更）
git add .

# 提交到本地仓库
git commit -m "本次提交的描述"

# 查看提交日志 / 分支 / 分支关联关系
git log
git branch
git branch -vv

# 分支操作
git branch dev01          # 新建分支 dev01
git checkout dev01        # 切换到 dev01
git merge 分支名           # 把“分支名”合并进当前分支
git branch -d 分支名       # 删除分支

# 关联并推送远程仓库
git remote add origin <远程仓库地址>
git push --set-upstream origin master   # 绑定后下次直接 git push

# 拉取 / 克隆
git clone <仓库地址>
git pull <remote> <branch>    # = fetch + merge
git fetch <remote> <branch>   # 只下载不合并
```

> 关于分支的小理解：分支就像游戏里的分身——主身在家摆烂，练级打怪交给分身，分身回来后用 `merge` 把经验同步回主身。（当然实际开发里别把活都丢给一个人。）

## 二、clone 一直失败，但浏览器能打开页面

网页能访问、`git clone` 却卡住，基本是**走了代理但 Git 没配代理**。把系统代理端口配给 Git 即可（端口换成自己代理软件里的）：

```bash
# 查看系统代理端口后，设置给 git（10810 换成你自己的）
git config --global http.proxy 127.0.0.1:10810

# 确认是否设置成功
git config --list

# clone 完成后可以撤销代理设置
git config --global --unset http.proxy
```

## 三、push 时本地与远程「不相关」无法合并

本地是 `git init` 建的、远程是直接在 Gitee/GitHub 上建的，两边没有共同的提交历史，push 会被拒。加 `--allow-unrelated-histories` 先把历史并起来：

```bash
git pull origin master --allow-unrelated-histories
```

如果之前已经关联过别的 origin，先删掉再重新关联：

```bash
git remote rm origin
git remote add origin <你的仓库地址>
git push origin master
```

## 四、pull 时与本地修改冲突，拉不下来

多人协作时，别人改了、你本地也改了，`pull` 极易冲突失败。如果**确定要用远程覆盖本地**：

```bash
git fetch --all                 # 先下载最新版本，但不合并
git reset --hard origin/master  # 用下载的版本强制覆盖本地
```

> 注意：`reset --hard` 会丢弃本地未提交的修改，执行前确认本地没有要保留的改动。

## 五、pull 报 "is owned by ... but the current user is ..."

这次是把另一台电脑的项目文件夹直接复制过来用，pull 时报所有者（SID）不一致：

```text
'xxx' is owned by:
        'S-1-5-32-544'
but the current user is:
        'S-1-5-21-...'
```

我图省事直接**重新 clone 了一份**就好了。（也可以用 `git config --global --add safe.directory <路径>` 把该目录标记为安全，但当时重拉更快。）
