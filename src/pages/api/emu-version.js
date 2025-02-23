import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

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

        const { data: html } = await axios.get('https://cdn.emulatorjs.org/');
        const $ = cheerio.load(html);
        let response = [];

        const specialVersions = ['latest', 'nightly', 'stable'];

        for (let version of specialVersions) {
            try {
                const checkResponse = await axios.head(`https://cdn.emulatorjs.org/${version}/data/loader.js`);
                if (checkResponse.status === 200) {
                    response.push({ version, loader: checkResponse.config.url });
                }
            } catch (error) {
                console.log(`Version ${version} not found.`);
            }
        }

        $('tr.d').each((_, el) => {
            const link = $(el).find('td.n a').text().trim().replace('/', '');

            if (/^\d+\.\d+\.\d+$/.test(link)) {
                response.push({
                    version: link,
                    loader: `https://cdn.emulatorjs.org/${link}/data/loader.js`
                });
            }
        });

        response = response.sort((a, b) => {
            if (specialVersions.includes(a.version) && !specialVersions.includes(b.version)) {
                return -1;
            }
            if (!specialVersions.includes(a.version) && specialVersions.includes(b.version)) {
                return 1;
            }

            const versionA = a.version.split('.').map(Number);
            const versionB = b.version.split('.').map(Number);

            for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
                if ((versionA[i] || 0) !== (versionB[i] || 0)) {
                    return (versionB[i] || 0) - (versionA[i] || 0);
                }
            }
            return 0;
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error scraping version data:', error.message);
        res.status(500).json({ error: 'Failed to scrape version data', message: error.message });
    }
}