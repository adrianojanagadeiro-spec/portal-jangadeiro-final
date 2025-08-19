// ARQUIVO: netlify/functions/create-session.js
const { google } = require('googleapis');

// ID da sua pasta do Google Drive
const FOLDER_ID = "1VP-sq0Gnm5JdLOAOidnjN7oJnZcVOC9M";

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const fileInfo = JSON.parse(event.body);
  try {
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.create({
      requestBody: {
        name: fileInfo.name,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: fileInfo.type,
      },
    }, {
      params: {
        uploadType: 'resumable'
      }
    });
    const uploadUrl = res.headers.location;
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, uploadUrl: uploadUrl }),
    };
  } catch (error) {
    console.error('Erro ao criar sessão no Drive:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
