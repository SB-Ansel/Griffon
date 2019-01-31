// Navigation menu module
const {
   app
} = require('electron');
const shell = require('electron').shell

const nav = [{
      label: 'File',
      submenu: [{
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q', //Mac?
            click() {
               app.quit();
            }
         },
         {
            type: 'separator'
         }
      ]
   },

   {
      label: 'View',
      submenu: [{
            role: 'reload'
         },
         {
            type: 'separator'
         },
         {
            role: 'togglefullscreen'
         }
      ]
   },
   {
      label: 'help',
      submenu: [{
         label: 'Learn More',
         click() {
            shell.openExternal('https://github.com/SB-Ansel/Griffon')
         }
      }]
   }
];

module.exports = nav;

//SB-Ansel 2019/01/31