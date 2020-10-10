import https from 'https';
import { NEWSAPI } from '../../../config';
import { NewsApiArticle, NewsApiItemAdapter, NewsApiResponse } from './newsapi.response';
import { INews, INewsDoc } from './schema';
import NewsService from './service';

export default class NewsApiRetriever {
    newsService: NewsService = new NewsService();
    countryList: string[] = ['au', 'us', 'ru', 've', 'ua'];
    category: string[] = ['entertainment', 'general', 'health', 'science', 'sports', 'technology'];

    getRandomBetween(min: number, max: number): number {
        const num = Math.random() * (max - min) + min;
        return Math.floor(num);
    }

    chooseCountry(): string {
        let countryIndex = this.getRandomBetween(0, this.countryList.length - 1);
        return this.countryList[countryIndex];
    }

    chooseCategory(): string {
        let categoryIndex = this.getRandomBetween(0, this.category.length - 1);
        return this.category[categoryIndex];
    }

    getApiUrl() {
        let country = this.chooseCountry();
        let category = this.chooseCategory();
        let url = `${NEWSAPI.URL}?country=${country}&category=${category}&apiKey=${NEWSAPI.KEY}`;
        return url;
    }

    makeRequest(url: string): Promise<string> {
        let promise: Promise<string> = new Promise((resolve, reject) => {
            let data = '';
            https.get(url, (response) => {

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    resolve(data);
                });

            }).on('error', (err) => {
                reject(err);
            });
        });
        return promise;
    }

    castItems(articles: NewsApiArticle[]): INews[] {
        const castedItems: NewsApiItemAdapter[] = [];
        for (let article of articles) {
            const castedItem = new NewsApiItemAdapter(article);
            castedItems.push(castedItem);
        }
        return castedItems as INews[];
    }

    saveDataToDb(articles: INews[]): Promise<INewsDoc[]> {
        return this.newsService.saveMany(articles);
    }

    async requestNews() {
        let apiUrl: string = this.getApiUrl();
        let data: string = await this.makeRequest(apiUrl);
        let parsedData: NewsApiResponse = JSON.parse(data);
        let castedData: INews[] = this.castItems(parsedData.articles);
        await this.saveDataToDb(castedData);
    }
}