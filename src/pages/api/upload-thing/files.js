import { NextResponse } from 'next/server';
import axios from 'axios';

async function authorize(req) {
    if (process.env.NODE_ENV === 'development') {
        return null;
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const expectedToken = process.env.NEXT_PUBLIC_API_TOKEN;

    if (token !== expectedToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

async function deleteFiles(fileKeys) {
    try {
        const response = await axios.post(
            'https://api.uploadthing.com/v6/deleteFiles',
            { fileKeys },
            {
                headers: {
                    'X-Uploadthing-Api-Key': process.env.UPLOADTHING_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete files');
    }
}

async function getFileUrl(fileKey) {
    const response = await fetch(`https://api.uploadthing.com/v6/pollUpload/${fileKey}`, {
        method: 'GET',
        headers: {
            'X-Uploadthing-Api-Key': process.env.UPLOADTHING_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch file URL');
    }

    return data.fileData ? data.fileData.fileUrl : null;
}

async function renameFile(fileKey, newName) {
    try {
        const response = await axios.post(
            'https://api.uploadthing.com/v6/renameFiles',
            {
                updates: [
                    {
                        newName: newName,
                        fileKey: fileKey,
                    },
                ],
            },
            {
                headers: {
                    'X-Uploadthing-Api-Key': process.env.UPLOADTHING_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error('Failed to rename file');
    }
}

export default async function handler(req, res) {
    const authResponse = await authorize(req);
    if (authResponse) {
        return res.status(401).json(authResponse);
    }

    if (req.method === 'POST') {
        if (req.body.fileKeys) {
            try {
                const { fileKeys } = req.body;
                const deleteResponse = await deleteFiles(fileKeys);
                return res.status(200).json({ success: true, deleteResponse });
            } catch (error) {
                console.error('Error deleting files:', error);
                return res.status(500).json({ error: 'Failed to delete files' });
            }
        }

        if (req.body.newName && req.body.fileKey) {
            try {
                const { fileKey, newName } = req.body;
                const renamedFile = await renameFile(fileKey, newName);

                return res.status(200).json({ success: true, renamedFile });
            } catch (error) {
                console.error('Error renaming file:', error);
                return res.status(500).json({ error: 'Failed to rename file' });
            }
        }

        try {
            const response = await fetch('https://api.uploadthing.com/v6/listFiles', {
                method: 'POST',
                headers: {
                    'X-Uploadthing-Api-Key': process.env.UPLOADTHING_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (!response.ok) {
                return res.status(response.status).json(data);
            }

            const filesWithLinks = await Promise.all(
                data.files.map(async (file) => {
                    const fileUrl = await getFileUrl(file.key);
                    return {
                        ...file,
                        link: fileUrl,
                    };
                })
            );

            return res.status(200).json({
                hasMore: data.hasMore,
                files: filesWithLinks,
            });
        } catch (error) {
            console.error('Error fetching files or URLs:', error);
            return res.status(500).json({ error: 'Failed to fetch files or URLs' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}