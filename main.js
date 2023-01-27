// ! npx electronmon . (nodemon likewise)

const { app, BrowserWindow, Menu, ipcMain, shell, Notification } = require('electron')
const ResizeImg = require('resize-img');
const pngToIco = require('png-to-ico');
const toastify = require('toastify-js');
// require path
const path = require('path');
//require fs-extra
const fs = require('fs-extra');
//let us build an image resizer

const isDev = process.env.NODE_ENV !== 'development';

var win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        title: "Resizer-Beta",
        width: isDev ? 1200 : 600,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, './renderer/js/preload.js'),
        },
        show: false
    })

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, './renderer/index.html'))
    win.center;

    var splash = new BrowserWindow({
        width: isDev ? 1200 : 600,
        height: 700,
        transparent: true,
        frame: false,
        alwaysOnTop: true
    });


    splash.loadFile(path.join(__dirname, './renderer/splash.html'))
    splash.center();


    setTimeout(function () {
        splash.close();
        win.show();
    }, 5000);

    // Open the DevTools.

    // win.webContents.openDevTools()


}

function openAboutWindow() {
    const win = new BrowserWindow({
        title: "About Resizer",
        width: 650,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile(path.join(__dirname, './renderer/about.html'))
}
app.whenReady().then(() => {
    createWindow()
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    app.on('activate', () => {

        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})


const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    },
    {
        label: 'Window',
        submenu: [
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click() {
                    openAboutWindow()
                }
            }
        ]
    }, {
        label: 'Developer',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'CmdOrCtrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            },
            {
                label: 'Toggle Full Screen',
                accelerator: 'F11',
                click(item, focusedWindow) {
                    focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                }

            }
            , {
                role: 'forcereload'
            }
        ]
    }

]

ipcMain.on('image:resize', (e, options) => {
    console.log("hello")
    options.dest = path.join(__dirname, 'imageresizer');
    console.log("🚀 ~ file: main.js:134 ~ ipcMain.on ~ dest", options)

    resizeImage(options);
});


ipcMain.on('image:convert', (e, options) => {
    console.log("hello")
    options.dest = path.join(__dirname, 'imageConversion');
    console.log("🚀 ~ file: main.js:134 ~ ipcMain.on ~ dest", options)

    imageConverter(options);
});

async function resizeImage({ imgPath, height, width, dest }) {
    try {
        console.log(imgPath, height, width, dest)
        const resizedImage = await ResizeImg(
            fs.readFileSync(imgPath),
            {
                width: parseInt(width),
                height: parseInt(height)
            }
        );

        const fileName = path.basename(imgPath);


        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest)
        }

        const destPath = path.join(dest, fileName);

        fs.writeFileSync(destPath, resizedImage)

        win.webContents.send('image:done');

        shell.openPath(dest);


    } catch (error) {
        new Notification(
            'Image Resizer',
            {
                body: error
            }
        )
    }

}


async function imageConverter({ imgPath, fileName, width, dest }) {

    try {
        const resizedImage = await ResizeImg(
            fs.readFileSync(imgPath),
            {
                width: parseInt(width),
                height: parseInt(width)
            }
        );

        const fileName_ = path.basename(imgPath);


        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest)
        }

        const destPath = path.join(dest, fileName_);

        fs.writeFileSync(destPath, resizedImage)

        pngToIco(destPath).then(buf => {
            console.log("🚀 ~ file: main.js:134 ~ ipcMain.on ~ dest", buf)
            fs.writeFileSync(`${dest+'\\'+fileName}.ico`, buf);
            fs.unlinkSync(
                destPath,
                (err) => {
                    if (err) {
                        new Notification(
                            'Image Converter',
                            {
                                body: err
                            }
                        )
                 
                        return
                    }
                }
            )
            win.webContents.send('conversion:done');
            shell.openPath(dest);

        }).catch((error)=>{
            new Notification(
                'Image Converter',
                {
                    body: error
                }
            )
        })
    }
    catch (error) {
        new Notification(
            'Image Resizer',
            {
                body: error
            }
        )
    }

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit()
    }
})


