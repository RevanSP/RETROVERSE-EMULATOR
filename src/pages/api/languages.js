import axios from 'axios';
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

async function authorize(req) {
    if (process.env.NODE_ENV === 'development') {
        return null;
    }

    const token = req.headers.authorization;
    const expectedToken = process.env.NEXT_PUBLIC_API_TOKEN;

    if (token !== expectedToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

export default async function handler(req, res) {
    try {
        const authorizationResponse = await authorize(req);
        if (authorizationResponse) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const url = 'https://emulatorjs.org/docs/languages';
        const response = await axios.get(url);
        const data = response.data;
        const $ = cheerio.load(data);
        const languages = [];
        const seenCodes = new Set();

        $('code[data-v-2f6bd69d]').each((index, element) => {
            const languageCode = $(element).text().trim();

            if (seenCodes.has(languageCode)) {
                return false;
            }

            const languageName = $(element)
                .parent()
                .contents()
                .filter((_, el) => {
                    return el.type === 'text' && $(el).prev().is(element);
                })
                .text()
                .trim()
                .replace('-', '')
                .trim();

            if (languageCode && languageName) {
                if (languageCode.includes('-') && languageName.length > 1) {
                    seenCodes.add(languageCode);
                    languages.push({
                        code: languageCode,
                        name: languageName
                    });
                }
            }
        });

        languages.sort((a, b) => a.name.localeCompare(b.name) || a.code.localeCompare(b.code));

        res.status(200).json(languages);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
}
