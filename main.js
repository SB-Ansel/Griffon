const electron = require('electron');
const {app, Menu, BrowserWindow} = require('electron');
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const shell = require('node-powershell');
const fs = require('fs');
const shelly = require('electron').shell


function MainWindow() { // Creates the browser window.
	win = new BrowserWindow({
		width: 800,
		height: 800,
		parent: MainWindow,
		modal: true,
		nodeIntegration: true,
		nodeIntegrationInWorker: true,
		resizable: false
	})
	win.loadFile('index.html') // and load the index.html.
}

//PowerShell Arguments
var setLocation = "Set-Location -Path " 
var cmdCommand = "; cmd /r dir /s "
var syntax = "'" //This completes the full path on windows.

//Invoke PowerShell
function PowerShell(shellArgument){
	let ps = new shell({
				executionPolicy: 'Bypass',
				noProfile: true
			});
	ps.addCommand(setLocation + syntax + shellArgument + syntax + cmdCommand) //Final PowerShell command.
			ps.invoke()
				.then(output => {
					var savePath = dialog.showSaveDialog({
						defaultPath: '~/DirList.txt'
					}) //Brings up Save Dialog options for the end user.
					console.log(savePath) //Dumps path to console, might disable this once it's all working.
					fs.writeFile(savePath, output, function (err) {})
					console.log(output);
					const messageBox = {
						type: 'info',
						title: 'Griffon',
						message: 'Information',
						detail: 'File has been saved!',
						buttons: ['Okay'],
					}
					dialog.showMessageBox(messageBox)
					ps.dispose(); //Releases all resources once operation has been completed.
				})
				.catch(err => {
					console.log(err);
					ps.dispose();
				});
}
function errorMessage(){
	const caughtException = {
	type: 'warning',
	title: 'Griffon',
	message: 'Information',
	detail: 'Please select a directory.',
	buttons: ['Okay'],
}
	dialog.showMessageBox(caughtException)
}
//Drop Folder//
ipc.on('filePath', (event, path) => {
		console.log(path);
		var dropFolder = path
		dropFolder.toString();
		PowerShell(dropFolder)//passing arguments to PowerShell function
	});

//Select Folder//
ipc.on('openDialog', function (event) {
	dialog.showOpenDialog({
			properties: ['openDirectory']
		},
		function (files) {
			// if (files) event.sender.send('selected-file', files)
			console.log("Folder Selected: ", files)

			var selectedFolder = files;
			if (selectedFolder == null){
					errorMessage()
			}else{
				selectedFolder.toString();
			PowerShell(selectedFolder);//passing arguments to PowerShell function
			}
			});
		})
ipc.on('openExternal', function (event) {
	shelly.openExternal('https://github.com/SB-Ansel')
})
//Error Message
ipc.on('showWarning', function (event){
const warningBox = {
	type: 'warning',
	title: 'Griffon',
	message: 'Information',
	detail: 'Only directories are allowed.',
	buttons: ['Okay'],
}
	dialog.showMessageBox(warningBox)
})

//mainWindow navigation bar.
var menuModule = require('./js/navMenu');
const menu = Menu.buildFromTemplate(menuModule)
Menu.setApplicationMenu(menu)


//Initiate application
app.on('ready', MainWindow)