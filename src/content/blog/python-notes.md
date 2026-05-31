---
title: "Python 踩坑笔记：数据转换、终端配色与环境问题"
date: 2024-05-11
description: "几则 Python 实践中遇到的小问题：bytes/json/dict 互转、用 \\033 给终端输出上色、conda 激活失败、以及找不到 pip。"
tags: ["Python", "踩坑", "环境"]
---

零散记录几个用 Python 时反复会查的点，整理到一起。

## 一、bytes / JSON / dict 互转速查

调 EMQX 的 API 时，拿到的 `response` 是 `bytes`，要转成字符串或字典才好用。常用转换如下：

```python
import json

s = json.dumps(json_obj)              # json -> string
s = str(bytes_obj, "utf-8")           # bytes -> string
d = json.loads(s)                     # string/json -> dict
j = json.dumps(d)                     # dict -> json

# 文件读写
with open("test.json") as f:
    d = json.load(f)                  # 读 json 文件 -> dict
with open("test.json", "w") as f:
    json.dump(d, f)                   # dict -> 写入 json 文件
```

## 二、用 `\033` 给终端输出上色

`\033`（或 `\33`）是 ANSI 转义起始符，可以改变终端输出的颜色和样式（依据 ECMA-48 标准）。注意有些编辑器内置控制台不显示效果，用系统命令行能看到。

常用控制码：

```text
\33[0m   关闭所有属性（重置）
\33[1m   高亮
\33[4m   下划线
\33[5m   闪烁
\33[7m   反显

前景色：\33[30m ~ \33[37m   （30 黑 31 红 32 绿 33 黄 34 蓝 35 紫 36 青 37 白）
背景色：\33[40m ~ \33[47m
加亮前景：\33[90m ~ \33[97m
```

用法——关键是**用完记得用 `\33[0m` 关闭，否则样式会一直叠加到后面的文字**：

```python
# 正确：每段样式用 \33[0m 收尾
print("\33[41;1m他好\33[0m，\033[4m我也好\33[0m")

# 忘记收尾：后面的内容会继续带上前面的样式
print("\33[41;1m他好，\033[4m我也好\33[0m")
```

> 参考：<https://www.cnblogs.com/demonxian3/p/8963807.html>

## 三、conda 激活虚拟环境报错

新装 Anaconda、手动配好环境变量后，`conda` 有反应，但激活虚拟环境时报：

```text
usage: conda-script.py [-h] [--no-plugins] [-V] COMMAND ...
```

原因是**没有初始化 conda**。执行一次初始化，再开一个新的命令行窗口就好了：

```bash
conda init
```

## 四、Python 没有 pip（No module named pip）

用 ESP-IDF 开发套件、在 VS Code 里激活环境时失败，发现是这个 Python 没带 pip。重装即可：

```bash
python -m ensurepip
python -m pip install --upgrade pip   # 顺手升级，可选
```
