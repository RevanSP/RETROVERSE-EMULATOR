import axios from 'axios';
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

        const url = 'https://emulatorjs.org/docs4devs/cores';
        const response = await axios.get(url);
        const data = response.data;

        const cheerio = require('cheerio');
        const $ = cheerio.load(data);
        const cores = [];

        $('ul li').each((index, element) => {
            const coreElements = $(element).find('code').map((i, el) => $(el).text().trim()).get();

            if (coreElements.length >= 1) {
                const core = coreElements[0];
                const systems = coreElements.slice(1).join(', ');

                if (core && systems) {
                    const systemList = systems.split(',').map(system => system.trim());

                    systemList.forEach(system => {
                        cores.push({ core, system });
                    });
                }
            }
        });

        cores.sort((a, b) => a.system.localeCompare(b.system) || a.core.localeCompare(b.core));

        res.status(200).json(cores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
}