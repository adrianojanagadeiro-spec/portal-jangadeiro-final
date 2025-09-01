const { google } = require('googleapis');
const ROOT_FOLDER_ID = "1CddJNR01o31zCqijJvrbY5SpGzOT30bd";

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const uploadData = JSON.parse(event.body);
  
  try {
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
    const drive = google.drive({ version: 'v3', auth });

    // 1. Criar a pasta do cliente (privada por padrão)
    const clientFolder = await drive.files.create({ 
      requestBody: { name: uploadData.clientName, mimeType: 'application/vnd.google-apps.folder', parents: [ROOT_FOLDER_ID] }, 
      fields: 'id',
      supportsAllDrives: true 
    });
    const clientFolderId = clientFolder.data.id;

    // 2. Criar arquivo de texto
    const now = new Date();
    const timestamp = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(now);
    const textContent = `INFORMAÇÕES DE ENVIO\n-----------------------------\nCliente: ${uploadData.clientName}\nCNPJ / Razão Social: ${uploadData.cnpj}\nData do Envio: ${timestamp}\n\nInformações Adicionais:\n${uploadData.clientInfo}\n\nArquivos Enviados:\n${uploadData.files.map(f => `- ${f.name}`).join('\n')}`;
    await drive.files.create({ requestBody: { name: `${uploadData.clientName} - Infos.txt`, mimeType: 'text/plain', parents: [clientFolderId] }, media: { mimeType: 'text/plain', body: textContent }, supportsAllDrives: true });
    
    // 3. Criar subpastas e sessões de upload
    const uploadSessions = await Promise.all(uploadData.files.map(async (fileInfo) => {
      const fileFolder = await drive.files.create({ requestBody: { name: fileInfo.name, mimeType: 'application/vnd.google-apps.folder', parents: [clientFolderId] }, fields: 'id', supportsAllDrives: true });
      const fileFolderId = fileFolder.data.id;

      const res = await drive.files.create({
        requestBody: { name: fileInfo.name, parents: [fileFolderId] },
        fields: 'id',
        supportsAllDrives: true,
      }, { params: { uploadType: 'resumable' } });

      return {
        fileName: fileInfo.name,
        uploadUrl: res.headers.location,
        size: fileInfo.size,
      };
    }));
    
    // Retornamos apenas o sucesso, sem o link.
    return { statusCode: 200, body: JSON.stringify({ success: true, uploads: uploadSessions }) };

  } catch (error) {
    console.error('ERRO NA FUNÇÃO:', error);
    const errorMessage = (error.response && error.response.data) ? JSON.stringify(error.response.data) : error.message;
    return { statusCode: 500, body: JSON.stringify({ success: false, message: errorMessage }) };
  }
};













