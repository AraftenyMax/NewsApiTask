import { INews } from "./schema";

export interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: [NewsApiArticle]
}

export interface NewsApiArticle {
    source: {
        id: string,
        name: string
    },
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string
}

export class NewsApiItemAdapter implements INews {
    source: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: Date;
    content: string;
    createdBy?: string | undefined;

    constructor(article: NewsApiArticle) {
        this.source = article.source.name;
        this.author = article.author;
        this.title = article.title;
        this.description = article.description;
        this.url = article.url;
        this.urlToImage = article.urlToImage;
        this.publishedAt = new Date(article.publishedAt);
        this.content = article.content;
    }
}
