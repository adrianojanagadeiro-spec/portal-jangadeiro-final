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
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const clientFolder = await drive.files.create({ requestBody: { name: uploadData.clientName, mimeType: 'application/vnd.google-apps.folder', parents: [ROOT_FOLDER_ID] }, fields: 'id', supportsAllDrives: true });
    const clientFolderId = clientFolder.data.id;
    const now = new Date();
    const timestamp = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(now);
    const textContent = `INFORMAÇÕES DE ENVIO\n-----------------------------\nCliente: ${uploadData.clientName}\nCNPJ / Razão Social: ${uploadData.cnpj}\nData do Envio: ${timestamp}\n\nInformações Adicionais:\n${uploadData.clientInfo}\n\nArquivos Enviados:\n${uploadData.files.map(f => `- ${f.name}`).join('\n')}`;
    await drive.files.create({ requestBody: { name: `${uploadData.clientName} - Infos.txt`, mimeType: 'text/plain', parents: [clientFolderId] }, media: { mimeType: 'text/plain', body: textContent }, supportsAllDrives: true });
    
    const uploadSessions = await Promise.all(uploadData.files.map(async (fileInfo) => {
      const fileFolder = await drive.files.create({ requestBody: { name: fileInfo.name, mimeType: 'application/vnd.google-apps.folder', parents: [clientFolderId] }, fields: 'id', supportsAllDrives: true });
      const fileFolderId = fileFolder.data.id;

      // =======================================================================
      // CORREÇÃO FINAL AQUI: Adicionando supportsAllDrives=true na URL
      // =======================================================================
      const res = await authClient.request({
        method: 'POST',
        url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': fileInfo.type || 'application/octet-stream',
          'Origin': event.headers.origin
        },
        data: {
          name: fileInfo.name,
          parents: [fileFolderId]
        }
      });

      const uploadUrl = res.headers.location;
      if (!uploadUrl) throw new Error(`Google não retornou URL para ${fileInfo.name}`);

      return {
        fileName: fileInfo.name,
        uploadUrl: uploadUrl,
        size: fileInfo.size,
      };
    }));

    return { statusCode: 200, body: JSON.stringify({ success: true, uploads: uploadSessions }) };

  } catch (error) {
    console.error('ERRO NA FUNÇÃO:', error);
    const errorMessage = (error.response && error.response.data) ? JSON.stringify(error.response.data) : error.message;
    return { statusCode: 500, body: JSON.stringify({ success: false, message: errorMessage }) };
  }
};




