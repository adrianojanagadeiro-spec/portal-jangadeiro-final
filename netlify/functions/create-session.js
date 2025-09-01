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

    // =======================================================================
    // MUDANÇA AQUI: Criando o nome da pasta principal
    // =======================================================================
    // Se o CNPJ for preenchido, adiciona ao nome. Senão, usa só a Marca/Sala.
    const clientFolderName = uploadData.cnpj ? `${uploadData.clientName} - ${uploadData.cnpj}` : uploadData.clientName;
    
    const clientFolder = await drive.files.create({ 
      requestBody: { 
        name: clientFolderName, // Usando o novo nome da pasta
        mimeType: 'application/vnd.google-apps.folder', 
        parents: [ROOT_FOLDER_ID] 
      }, 
      fields: 'id, webViewLink',
      supportsAllDrives: true 
    });
    const clientFolderId = clientFolder.data.id;
    const clientFolderLink = clientFolder.data.webViewLink;
    // =======================================================================

    const now = new Date();
    const timestamp = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(now);
    
    // MUDANÇA AQUI: Atualizando o conteúdo do arquivo de texto para refletir os novos campos
    const textContent = `INFORMAÇÕES DE ENVIO\n-----------------------------\nMarca / Sala: ${uploadData.clientName}\nCNPJ / Razão Social: ${uploadData.cnpj}\nData do Envio: ${timestamp}\n\nInformações Adicionais:\n${uploadData.clientInfo}\n\nArquivos Enviados:\n${uploadData.files.map(f => `- ${f.name}`).join('\n')}`;
    
    // MUDANÇA AQUI: Renomeando o arquivo de texto
    await drive.files.create({ 
      requestBody: { name: `${clientFolderName} - Infos.txt`, mimeType: 'text/plain', parents: [clientFolderId] }, 
      media: { mimeType: 'text/plain', body: textContent }, 
      supportsAllDrives: true 
    });
    
    const uploadSessions = await Promise.all(uploadData.files.map(async (fileInfo) => {
      const fileFolder = await drive.files.create({ requestBody: { name: fileInfo.name, mimeType: 'application/vnd.google-apps.folder', parents: [clientFolderId] }, fields: 'id', supportsAllDrives: true });
      const fileFolderId = fileFolder.data.id;

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
    
    return { statusCode: 200, body: JSON.stringify({ success: true, uploads: uploadSessions, clientFolderLink: clientFolderLink }) };

  } catch (error) {
    console.error('ERRO NA FUNÇÃO:', error);
    const errorMessage = (error.response && error.response.data) ? JSON.stringify(error.response.data) : error.message;
    return { statusCode: 500, body: JSON.stringify({ success: false, message: errorMessage }) };
  }
};














