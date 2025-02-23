import axios from 'axios';
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

async function authorize(req) {
    if (process.env.NODE_ENV === 'development') return null;
    return req.headers.authorization !== process.env.NEXT_PUBLIC_API_TOKEN 
        ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
        : null;
}

async function scrapeDetailPage(url) {
    try {
        const { data } = await axios.get(`https://www.romspedia.com${url}`);
        const $ = cheerio.load(data);
        const size = $('.view-emulator-detail-value').text().trim().match(/(\d+(?:\.\d+)?\s*(?:KB|MB|GB))/i)?.[0] || '';
        return { size, downloadUrl: $('#btnDownload').attr('href') };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}

export default async function handler(req, res) {
    try {
        const authResponse = await authorize(req);
        if (authResponse) return res.status(401).json({ error: 'Unauthorized' });

        const $ = cheerio.load((await axios.get('https://www.romspedia.com/bios')).data);
        const biosPromises = $('.single-rom').map(async (_, el) => {
            const title = $(el).find('.roms-title').text().trim();
            if (!title) return null;
            const details = await scrapeDetailPage($(el).find('a').attr('href'));
            return details ? { title, ...details } : null;
        }).get();

        const results = (await Promise.all(biosPromises)).filter(Boolean).sort((a, b) => a.title.localeCompare(b.title));
        res.status(200).json(results);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
}