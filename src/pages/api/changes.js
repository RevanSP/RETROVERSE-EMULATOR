import axios from 'axios';

async function authorize(req) {
  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  const token = req.headers.authorization;
  const expectedToken = process.env.NEXT_PUBLIC_API_TOKEN;

  if (token !== expectedToken) {
    return {
      status: 401,
      body: { error: 'Unauthorized' }
    };
  }

  return null;
}

function cleanText(text) {
  return text.replace(/\\"/g, '"');
}

function processChangelogData(entries) {
  return entries
    .filter(entry => entry.version !== "Changes")
    .map(entry => ({
      version: entry.version,
      changes: Array.isArray(entry.changes) ? entry.changes.map(cleanText) : []
    }));
}

export default async function handler(req, res) {
  try {
    const authResponse = await authorize(req);
    if (authResponse) {
      return res.status(authResponse.status).json(authResponse.body);
    }

    const cheerio = require('cheerio');
    const { data: htmlContent } = await axios.get('https://emulatorjs.org/docs/changelog#changes');
    const $ = cheerio.load(htmlContent);

    const changes = [];
    $('h1').each((i, element) => {
      const version = $(element).text().trim();
      const changeList = [];
      $(element).next('p').each((i, pElement) => {
        const description = $(pElement).text().trim();
        if (description) {
          changeList.push(description);
        }
      });
      $(element).nextAll('ul').each((i, ulElement) => {
        $(ulElement).find('li').each((j, liElement) => {
          const listItem = $(liElement).text().trim();
          if (listItem) {
            changeList.push(listItem);
          }
        });
      });
      if (version && changeList.length > 0) {
        changes.push({
          version,
          changes: changeList
        });
      }
    });
    const processedChanges = processChangelogData(changes);
    processedChanges.sort((a, b) => {
      const versionA = a.version.replace(/[^0-9.]/g, '');
      const versionB = b.version.replace(/[^0-9.]/g, '');
      return versionB.localeCompare(versionA, undefined, { numeric: true });
    });

    const jsonResponse = processedChanges.map(change => ({
      version: change.version,
      changes: change.changes
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(jsonResponse); 

  } catch (error) {
    console.error('Error processing changelog:', error);
    res.status(500).json({
      error: 'Failed to process changelog',
      message: error.message
    });
  }
}
