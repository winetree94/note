// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  setIgnoreMouseEvents: (ignore: boolean, options: { forward: boolean }) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options);
  },
  on: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.on(channel, listener);
  },
  removeEventListener: (
    channel: string,
    listener: (...args: any[]) => void
  ) => {
    ipcRenderer.removeListener(channel, listener);
  },
  // Expose any APIs you want to be available in the renderer process
  // (e.g. to enable the use of Node.js modules in the renderer)
  // api: require('./api'),
  // ipcRenderer: require('electron').ipcRenderer,
  // remote: require('electron').remote,
  // shell: require('electron').shell,
  // etc.
});
