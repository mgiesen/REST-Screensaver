const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

const appName = "REST Screensaver";

function executeGetRequest(url, callback)
{
    fetch(url)
        .then(response => response.json())
        .then(data =>
        {
            callback(data);
        })
        .catch(error =>
        {
            console.error('Fehler beim Abrufen der Daten:', error);
        });
}

function powerOn()
{

}

function powerOff()
{

}

function createWindow()
{
    mainWindow = new BrowserWindow({
        width: 840,
        height: 490,
        show: false,
        resizable: false,
        minimizable: false,
        alwaysOnTop: true,
        title: appName
    });

    mainWindow.on('closed', () =>
    {
        mainWindow = null;
    });

    mainWindow.loadFile('index.html');
}

function createTrayIcon()
{
    tray = new Tray(path.join(__dirname, 'trayIcon.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Turn Display off',
            click: () =>
            {
                powerOff();
            },
        },
        {
            label: 'Settings',
            click: () =>
            {
                if (mainWindow === null)
                {
                    createWindow();
                }
                mainWindow.once('ready-to-show', () =>
                {
                    mainWindow.show();
                });
            }
        },
        {
            label: 'Quit',
            click: () =>
            {
                app.quit();
            },
        },
    ]);

    tray.on('double-click', () =>
    {
        powerOff();
    });


    tray.setToolTip(appName);
    tray.setContextMenu(contextMenu);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock)
{
    app.quit();
} else
{
    app.on('second-instance', () =>
    {
        if (mainWindow)
        {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() =>
    {
        createTrayIcon();

        app.on('activate', () =>
        {
            createWindow();
        });

        app.on('window-all-closed', () =>
        {
            if (process.platform !== 'darwin')
            {
                app.quit();
            }
        });
    });
}
