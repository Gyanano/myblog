---
title: "Go 与 Gin 入门笔记"
date: 2023-04-06
description: "用 Gin 写第一个 Go 后端服务，以及从 HTTP 响应体里取 JSON 时踩的一个小坑。"
tags: ["Go", "Gin", "后端"]
---

学 Go 的时候用 Gin 起了第一个后端服务，顺手记下入门写法和一个取响应数据的坑。

## 一、用 Gin 写最简单的服务器

Gin 是 Go 里很受欢迎的 Web 框架，性能好、上手快。一个最小的服务：

```go
package main // 声明所属的包

import "github.com/gin-gonic/gin" // 导入 gin

func sayHello(c *gin.Context) {
	c.JSON(200, gin.H{ // 返回 json 给前端
		"msg": "Hello Golang!",
	})
}

func main() {
	r := gin.Default()        // 默认路由引擎，处理网络请求
	r.GET("/hello", sayHello) // GET /hello 交给 sayHello 处理
	r.Run(":80")              // 启动并监听 80 端口
}
```

跑起来后访问 `http://localhost/hello` 就能看到返回的 JSON。

## 二、发请求后，怎么从响应体里取数据

用惯了 Python，一开始想直接取字段，结果在 Go 里行不通。Go 的规范做法是**定义结构体绑定参数**，但有时只想先看看响应内容，那就先把响应体读成字符串。

一开始我用 `io.ReadAll` 直接打印，得到的是一串看不懂的东西——因为 `response.Body` 的类型是 `io.ReadCloser`，不能当字符串直接用。后来用 `bytes.Buffer` 读出来就正常了：

```go
response, _ := http.Get("https://www.baidu.com/")
// response.Body 类型为 io.ReadCloser

buf := new(bytes.Buffer)
buf.ReadFrom(response.Body)
newStr := buf.String()

fmt.Println(newStr)
```

> 拿到字符串后，再按需 `json.Unmarshal` 到结构体里取字段就好。

参考：<https://blog.csdn.net/zsl10/article/details/103406593>
