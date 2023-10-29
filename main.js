const { app, BrowserWindow, Tray, Menu, screen } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow()
{
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
    });

    mainWindow.loadFile('index.html');
}

function createTrayIcon()
{
    tray = new Tray(path.join(__dirname, 'trayIcon.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open UI',
            click: () =>
            {
                mainWindow.show();
            },
        },
        {
            label: 'Quit',
            click: () =>
            {
                app.quit();
            },
        },
    ]);

    tray.setToolTip('REST Screensaver Control');
    tray.setContextMenu(contextMenu);
}

// Einzelinstanzsperre
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
        createWindow();
        createTrayIcon();

        app.on('activate', () =>
        {
            if (mainWindow === null)
            {
                createWindow();
            }
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