const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow = null;
let addWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on('closed', () => {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 400,
    height: 400,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => {
    addWindow = null;
  });
}

ipcMain.on('todo:add', (event, data) => {
  mainWindow.webContents.send('todo:add', data);
  addWindow.close();
});

function clearTodos() {
  mainWindow.webContents.send('todo:clear');
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Todo',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() {
          createAddWindow();
        }
      },

      {
        label: 'Clear Todos',
        click() {
          clearTodos();
        }
      },

      {
        label: 'Quit',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Command+Q';
          } else {
            return 'Ctrl+Q';
          }
        })(),
        click() {
          app.quit();
        }
      }
    ]
  }
];

if (process.env.NODE_ENV !== 'production') {
  menuTemplate[0].submenu.push({
    label: 'Devtools',
    accelerator: 'F12',
    click(item, focusedWindow) {
      focusedWindow.openDevTools();
    }
  });
  // menuTemplate[0].submenu.push({ role: 'reload' });
  menuTemplate[0].submenu.push({
    label: 'Reload',
    accelerator: 'Ctrl+R',
    click(item, focusedWindow) {
      focusedWindow.reload();
    }
  });
}

