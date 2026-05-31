---
title: "开发环境与工具速记"
date: 2024-10-01
description: "零散但常用的小记录：IntelliJ IDEA 两则 Servlet/Filter 坑、JetBrains 快捷键、终端代理命令、Windows KMS 激活。"
tags: ["工具", "环境", "效率"]
---

一些零散但时不时要用的环境/工具小记，攒到一起。

## 一、IDEA 新建模块右键找不到 Servlet 选项

网上方法大多够详细，但有一次照做仍无效。对比新旧模块后发现，可以在 IDEA 自动生成的 `模块名.iml` 里补一行依赖来解决：

```xml
<orderEntry type="library" scope="PROVIDED"
            name="Tomcat 8.5.85" level="application_server_libraries" />
```

> 如果新建模块里找不到 `.iml`，先跑一次 Tomcat，它会自动生成该配置文件。

## 二、IDEA 里 Filter 放行了却仍然 404

学过滤器时，建了个模块叫 `filter`，配好 Tomcat 后觉得名字不好，又用 IDEA 把模块名和目录名都改成了 `filter_module`。结果写第一个过滤器、设置放行后，控制台输出显示已生效，浏览器却 404。

卡了几分钟才想起刚改过名。打开 `File > Project Structure > Artifacts`，发现部署的 war 包还显示旧名 `filter:war exploded` 没跟着改。把它改成与新名一致，问题解决。

> 教训：重命名模块后，记得检查 Artifacts 里的部署项是否同步。

## 三、JetBrains 系 IDE 常用快捷键

```text
新建临时文件（scratch file）  Ctrl + Alt + Shift + Insert
格式化代码                    Ctrl + Alt + L
快速复制当前行                Ctrl + D
整行上移 / 下移               Ctrl + Shift + ↑ / ↓
```

## 四、给终端设置代理

命令行走代理（端口换成自己的代理端口）：

```bash
# Windows (cmd)
set http_proxy=http://127.0.0.1:10810
set https_proxy=http://127.0.0.1:10810

# Linux / macOS
export http_proxy=http://127.0.0.1:10810
export https_proxy=http://127.0.0.1:10810
```

## 五、Windows 11 专业版 KMS 命令激活

用管理员权限打开命令行，依次执行：

```text
slmgr -ipk W269N-WFGWX-YVC9B-4J6C9-T83GX
slmgr -skms kms.0t.net.cn
slmgr -ato
```

> 方法出处，感谢 [@幽冥狂_七](https://home.cnblogs.com/u/youmingkuang) 的分享：[Windows11 专业版 KMS 命令激活](https://www.cnblogs.com/youmingkuang/p/17574228.html)。KMS 为 180 天周期激活，仅供学习测试，正式使用请购买正版授权。
