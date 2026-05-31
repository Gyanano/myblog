---
title: "Keil 中把数组定位到指定内存地址（AC5 → AC6）"
date: 2024-02-29
description: "移植屏幕驱动时，framebuffer 数组定位到指定地址在旧工程能编过、新工程却报 L6406E，问题出在编译器从 AC5 换成了 AC6。"
tags: ["嵌入式", "Keil", "GD32"]
---

移植屏幕驱动时踩的一个坑，记录一下，免得下次又卡住。

## 现象

源码里有这么一段，把 LCD 的 framebuffer 定位到指定的内存地址：

```c
uint16_t ltdc_lcd_framebuf[800][480] __attribute__((at(LCD_FRAME_BUF_ADDR)));
```

在原工程里编译一切正常；可一旦放进我自己新建的工程，就编不过，报：

```text
.\Objects\GD32F470.axf: Error: L6406E: No space in execution regions
with .ANY selector matching lcd.o(.bss.ltdc_lcd_framebuf0).
```

## 排查

网上搜 `L6406E` 出来的几乎全是「内存不足」。我试着调大启动文件里的堆栈空间，没用；又比对两个工程的烧录内存地址配置，也都一样。

最后发现两个工程**唯一的区别是编译器版本不同**——一个用 AC5（Arm Compiler 5），一个用 AC6。去查「AC5 和 AC6 把数组定位到指定地址」的差异，果然写法变了。

## 原因与解决

`__attribute__((at(地址)))` 是 **AC5 专有**的扩展，AC6（基于 LLVM/Clang）不支持，所以同样的代码在 AC6 下定位失败。

AC6 的做法是先给变量声明一个**带绝对地址的 section**，再放进去：

```c
// AC6 写法：section 名形如 .ARM.__at_<十六进制地址>
uint16_t ltdc_lcd_framebuf[800][480]
    __attribute__((section(".ARM.__at_0xC0000000")));
```

> 把 `0xC0000000` 换成你的 `LCD_FRAME_BUF_ADDR` 实际地址即可。另一种更通用的方式是在 **scatter 文件**里为该地址单独划一个执行区，把这个段放进去。

也可以做成兼容两种编译器的写法：

```c
#if defined(__ARMCC_VERSION) && (__ARMCC_VERSION >= 6000000)
  #define AT_ADDR(addr) __attribute__((section(".ARM.__at_" #addr)))
#else
  #define AT_ADDR(addr) __attribute__((at(addr)))
#endif
```

> 感谢这篇博客的指引：[AC6 使用 `__attribute__((at(x)))` 需要改用…](https://www.armbbs.cn/forum.php?mod=viewthread&tid=93202)
