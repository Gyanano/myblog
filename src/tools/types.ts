export type ToolMeta = {
  /** = 文件夹名 = url 短名（/tools/<id>） */
  id: string;
  title: string;
  description: string;
  /** 设计 / 视频 / 文本 … */
  category: string;
  /** 工具放在站外时填完整地址，索引页在新标签页打开 */
  external?: string;
};
