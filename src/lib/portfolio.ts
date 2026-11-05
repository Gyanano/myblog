import { getCollection } from "astro:content";

const byOrder = <T extends { data: { order: number; title: string } }>(a: T, b: T) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

export const getWorks = async () => (await getCollection("works")).sort(byOrder);
export const getProjects = async () => (await getCollection("projects")).sort(byOrder);
