const ipc = require('electron').ipcRenderer
const selectDirBtn = document.getElementById('select-file')
	selectDirBtn.addEventListener('click', function (event){
		ipc.send('openDialog')
});	

var dropzone = document.getElementById('dropzone');
	dropzone.ondrop = function(e) {
var length = e.dataTransfer.items.length;
	for (var i = 0; i < length; i++) {
var entry = e.dataTransfer.items[i].webkitGetAsEntry();
	if (entry.isFile) {
		// console.log("Debug; It's a File!")
		ipc.send('showWarning')
	} else if (entry.isDirectory) {
		// console.log("Debug; It's a Directory!")
		for (let f of e.dataTransfer.files) {
				ipc.send('filePath', f.path);
			}
		}
	}
};
	
const footerExternal = document.getElementById('footerExternal')
		footerExternal.addEventListener('click', function (event){
			ipc.send('openExternal')
});

const headerExternal = document.getElementById('headerExternal')
		headerExternal.addEventListener('click', function (event){
			ipc.send('openExternal')
});		