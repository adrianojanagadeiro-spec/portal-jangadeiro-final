const { google } = require('googleapis');
const ROOT_FOLDER_ID = "1CddJNR01o31zCqijJvrbY5SpGzOT30bd";

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const uploadData = JSON.parse(event.body);
  
  try {
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\Entendido. Você quer simplificar a estrutura de pastas. Em vez de `Nome do Cliente > Nome do Arquivo > arquivo.ext`, você quer que fique `Nome do Cliente > arquivo.ext`.

Essa mudança é muito simples e será feita apenas no arquivo de backend `create-session.js`. O seu `index.html` não precisa de nenhuma alteração.

---

### **Arquivo `create-session.js` (com a Estrutura Simplificada)**

Aqui está o seu último código funcional, modificado para salvar todos os arquivos diretamente dentro da pasta do cliente, sem criar as subpastas. As mudanças estão claramente marcadas.

**Substitua o conteúdo do seu `create-session.js` por este:**

```javascript
const { google } = require('googleapis');
const ROOT_FOLDER_ID = "1CddJNR01o31zCqijJvrbY5SpGzOT30bd";

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const uploadData = JSON.parse(event.body);
  
  Entendido. Você quer simplificar a estrutura de pastas no Drive. Em vez de `Nome do Cliente > Nome do Arquivo > arquivo.png`, você quer `Nome do Cliente > arquivo.png`.

Essa é uma mudança muito simples e será feita **apenas no arquivo `create-session.js`**. Ela torna a estrutura mais "flat" e direta.

---

### **Arquivo `create-session.js` (com Estrutura Simplificada)**

Este código foi modificado para eliminar a criação das subpastas. Os arquivos de upload e o arquivo de texto serão salvos diretamente dentro da pasta do cliente.

**Substitua o conteúdo do seu `create-session.js` por este:**

```javascript
const { google } = require('googleapis');
constn'),
    };
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    // 1. Criar a pasta do cliente (pasta mãe)
    const clientFolderName = uploadData.cnpj ? `${uploadData.clientName} - ${uploadData.cnpj}` : uploadData.clientName;
    const clientFolder = await drive.files.create({ 
      requestBody: { 
        name: clientFolderName, 
        mimeType: 'application/vnd.google-apps.folder', 
        parents: [ROOT_FOLDER_ID] 
      }, 
      fields: 'id, webViewLink',
      supportsAllDrives: true 
    });
    const clientFolderId = clientFolder.data.id;
    const clientFolderLink = clientFolder.data.webViewLink;

    // 2. Criar arquivo de texto diretamente na pasta do cliente
    const now = new Date();
    const timestamp = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(now);
    const textContent = `INFORMAÇÕES DE ENVIO\n-----------------------------\nMarca / Sala: ${uploadData.clientName}\nCNPJ / Razão Social: ${uploadData.cnpj}\nData do Envio: ${timestamp}\n\nInformações Adicionais:\n${uploadData.clientInfo}\n\nArquivos Enviados:\n${uploadData.files.map(f => `- ${f.name}`).join('\n')}`;
    await drive.files.create({ 
      requestBody: { name: `${clientFolderName} - Infos.txt`, mimeType: 'text/plain', parents: [clientFolderId] }, 
      media: { mimeType: 'text/plain', body: textContent }, 
      supportsAllDrives: true 
    });
    
    // 3. Criar sessões de upload para cada arquivo
    const uploadSessions = await Promise.all(uploadData.files.map(async (fileInfo) => {
      // =======================================================================
      // MUDANÇA AQUI: Atry {
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/drive'] });
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    // 1. Criar a pasta principal do cliente
    const clientFolderName = uploadData.cnpj ? `${uploadData.clientName} - ${uploadData.cnpj}` : uploadData.clientName;
    const clientFolder = await drive.files.create({ 
      requestBody: { 
        name: clientFolderName, 
        mimeType: 'application/vnd.google-apps.folder', 
        parents: [ROOT_FOLDER_ID] 
      }, 
      fields: 'id, webViewLink',
      supportsAllDrives: true 
    });
    const clientFolderId = clientFolder.data.id;
    const clientFolderLink = clientFolder.data.webViewLink;

    // 2. Criar o arquivo de texto na pasta do cliente
    const now = new Date();
    const timestamp = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(now);
    const textContent = `INFORMAÇÕES DE ENVIO\n-----------------------------\nMarca / Sala: ${uploadData.clientName}\nCN ROOT_FOLDER_ID = "1CddJNR01o31zCqijJvrbY5SpGzOT30bd";

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

    // 1. Criar a pasta do cliente (pasta mãe)
    const clientFolderName = uploadData.cnpj ? `${uploadData.clientName} - ${uploadData.cnpj}` : uploadData.clientName;
    const clientFolder = await drive.files.create({ 
      requestBody: { name: clientFolderName, mimeType: 'application/vnd.google-apps.folder', parents: [ROOT_FOLDER_ID] }, 
      fields: 'id, webViewLink',
      supportsAllDrives: true 
    });
    const clientFolderId = clientFolder.data.id;
    const clientFolderLink = clientFolder.data.webViewLink;

    // 2. Criar arquivo de texto diretamente na pasta do criação da subpasta foi REMOVIDA
      // =======================================================================
      // const fileFolder = await drive.files.create({ ... }); // LINHA REMOVIDA
      // const fileFolderId = fileFolder.data.id; // LINHA REMOVIDA

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
          // MUDANÇA AQUI: O arquivo agora é salvo diretamente na pasta do cliente
          parents: [clientFolderId] 
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














