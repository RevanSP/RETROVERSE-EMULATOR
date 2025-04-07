import axios from 'axios';

async function authorize(req) {
  if (process.env.NODE_ENV === 'development') return null;
  
  const token = req.headers.authorization;
  const expectedToken = process.env.NEXT_PUBLIC_API_TOKEN;
  
  return token !== expectedToken
    ? { status: 401, body: { error: 'Unauthorized' } }
    : null;
}

const cleanText = text => text.replace(/\\"/g, '"');

const processChangelogData = entries =>
  entries
    .filter(entry => entry.version !== "Changes")
    .map(entry => ({
      version: entry.version.replace(' View Tree', '').trim(),
      changes: Array.isArray(entry.changes) ? entry.changes.map(cleanText) : []
    }));

export default async function handler(req, res) {
  try {
    const authResponse = await authorize(req);
    if (authResponse) return res.status(authResponse.status).json(authResponse.body);

    const cheerio = require('cheerio');
    const { data: htmlContent } = await axios.get('https://emulatorjs.org/docs/changelog#changes');
    console.log('HTML Content:', htmlContent.substring(0, 500));

    const $ = cheerio.load(htmlContent);
    const changes = [];
    
    $('h1').each((i, element) => {
      const version = $(element).text().trim();
      const changeList = [];
      
      $(element).next('p').each((i, pElement) => {
        const description = $(pElement).text().trim();
        if (description) changeList.push(description);
      });

      $(element).nextAll('ul').each((i, ulElement) => {
        $(ulElement).find('li').each((i, liElement) => {
          const listItem = $(liElement).text().trim();
          if (listItem) changeList.push(listItem);
        });
      });

      if (version && changeList.length) changes.push({ version, changes: changeList });
    });

    console.log('Raw Changelog Entries:', changes);

    const processedChanges = processChangelogData(changes);
    processedChanges.sort((a, b) =>
      b.version.replace(/[^0-9.]/g, '').localeCompare(a.version.replace(/[^0-9.]/g, ''), undefined, { numeric: true })
    );

    console.log('Sorted Changelog Entries:', processedChanges);

    res.status(200).json(processedChanges.map(change => ({
      version: change.version,
      changes: change.changes
    })));
    
  } catch (error) {
    console.error('Error processing changelog:', error);
    res.status(500).json({ error: 'Failed to process changelog', message: error.message });
  }
}