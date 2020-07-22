import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { LabIcon } from '@jupyterlab/ui-components';
import { showDialog, Dialog } from '@jupyterlab/apputils';
import pbIconStr from '../style/pb.svg';
import onnxIconStr from '../style/onnx.svg';
import convertIconStr from '../style/convert.svg';
import { ICommandPalette } from '@jupyterlab/apputils';
import { requestAPI } from './jlabextexample';
import { PageConfig } from '@jupyterlab/coreutils';

/**
 * Initialization data for the server-extension-example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'server-extension-example',
  autoStart: true,
  requires: [IFileBrowserFactory, ICommandPalette],
  activate: (app: JupyterFrontEnd, factory: IFileBrowserFactory) => {
    console.log('JupyterLab extension server-extension-example is activated!');

    const pbIcon = new LabIcon({
      name: 'context-menu:pbicon',
      svgstr: pbIconStr
    });
    const onnxIcon = new LabIcon({
      name: 'context-menu:onnxicon',
      svgstr: onnxIconStr
    });
    const convertIcon = new LabIcon({
      name: 'context-menu:converticon',
      svgstr: convertIconStr
    });

    app.docRegistry.addFileType({
      name: 'onnx',
      icon: onnxIcon,
      displayName: 'Onnx File',
      extensions: ['.onnx'],
      fileFormat: 'text',
      contentType: 'file',
      mimeTypes: ['text/plain']
    });

    app.contextMenu.addItem({
      command: 'jlab-examples/context-menu:toyaml',
      selector: '.jp-DirListing-item[data-file-type="onnx"]',
      rank: 0
    });
    app.contextMenu.addItem({
      command: 'jlab-examples/context-menu:todot',
      selector: '.jp-DirListing-item[data-file-type="onnx"]',
      rank: 0
    });

    app.docRegistry.addFileType({
      name: 'pb',
      icon: pbIcon,
      displayName: 'Protocol Buffer File',
      extensions: ['.pb'],
      fileFormat: 'text',
      contentType: 'file',
      mimeTypes: ['text/plain']
    });

    app.contextMenu.addItem({
      command: 'jlab-examples/context-menu:toyaml',
      selector: '.jp-DirListing-item[data-file-type="pb"]',
      rank: 0
    });
    app.contextMenu.addItem({
      command: 'jlab-examples/context-menu:todot',
      selector: '.jp-DirListing-item[data-file-type="pb"]',
      rank: 0
    });

    app.docRegistry.addFileType({
      name: 'yaml',
      icon: pbIcon,
      displayName: 'Yaml File',
      extensions: ['.yaml'],
      fileFormat: 'text',
      contentType: 'file',
      mimeTypes: ['text/plain']
    });

    app.contextMenu.addItem({
      command: 'jlab-examples/context-menu:topb',
      selector: '.jp-DirListing-item[data-file-type="yaml"]',
      rank: 0
    });
    app.contextMenu.addItem({
      command: 'jlab-examples/context-menu:todot',
      selector: '.jp-DirListing-item[data-file-type="yaml"]',
      rank: 0
    });

    app.commands.addCommand('jlab-examples/context-menu:toyaml', {
      label: 'Convert to YAML',
      caption: "Convert to YAML context menu button for file browser's items.",
      icon: convertIcon,
      execute: async () => {
        const serverRoot = PageConfig.getOption('serverRoot');
        const file = factory.tracker.currentWidget.selectedItems().next();
        let source = serverRoot + '/' + file.path;
        let pos = file.name.lastIndexOf('.');
        let sformat = file.name.substring(pos + 1, file.name.length);
        let target = source.replace(/\.[^/.]+$/, '.yaml');
        // GET request
        const dataToSend = {
          source: source,
          sformat: sformat,
          target: target,
          tformat: 'yaml'
        };
        try {
          const reply = await requestAPI<any>('convert', {
            body: JSON.stringify(dataToSend),
            method: 'POST'
          });
          // console.log(reply);
          showDialog({
            title: file.name,
            body: reply.result,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
        } catch (reason) {
          showDialog({
            title: file.name,
            body: `Error on POST /convert ${dataToSend}.\n${reason}`,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
          // console.error(
          //   `Error on POST /convert ${dataToSend}.\n${reason}`
          // );
        }
      }
    });

    app.commands.addCommand('jlab-examples/context-menu:todot', {
      label: 'Convert to image',
      caption: "Convert to image button for file browser's items.",
      icon: convertIcon,
      execute: async () => {
        const serverRoot = PageConfig.getOption('serverRoot');
        const file = factory.tracker.currentWidget.selectedItems().next();
        let source = serverRoot + '/' + file.path;
        let pos = file.name.lastIndexOf('.');
        let sformat = file.name.substring(pos + 1, file.name.length);
        let target = source.replace(/\.[^/.]+$/, '.gv');
        // GET request
        const dataToSend = {
          source: source,
          sformat: sformat,
          target: target,
          tformat: 'dot'
        };
        try {
          const reply = await requestAPI<any>('convert', {
            body: JSON.stringify(dataToSend),
            method: 'POST'
          });
          console.log(reply);
          showDialog({
            title: file.name,
            body: reply.result,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
        } catch (reason) {
          showDialog({
            title: file.name,
            body: `Error on POST /convert ${dataToSend.source}.\n${reason}`,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
          console.error(
            `Error on POST /convert ${dataToSend.source}.\n${reason}`
          );
        }
      }
    });

    app.commands.addCommand('jlab-examples/context-menu:topb', {
      label: 'Convert to pb file',
      caption: "Convert to pb file button for file browser's items.",
      icon: convertIcon,
      execute: async () => {
        const serverRoot = PageConfig.getOption('serverRoot');
        const file = factory.tracker.currentWidget.selectedItems().next();
        let source = serverRoot + '/' + file.path;
        let pos = file.name.lastIndexOf('.');
        let sformat = file.name.substring(pos + 1, file.name.length);
        let target = source.replace(/\.[^/.]+$/, '.pb');
        // GET request
        const dataToSend = {
          source: source,
          sformat: sformat,
          target: target,
          tformat: 'pb'
        };
        try {
          const reply = await requestAPI<any>('convert', {
            body: JSON.stringify(dataToSend),
            method: 'POST'
          });
          console.log(reply);
          showDialog({
            title: file.name,
            body: reply.result,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
        } catch (reason) {
          showDialog({
            title: file.name,
            body: `Error on POST /convert ${dataToSend.source}.\n${reason}`,
            buttons: [Dialog.okButton()]
          }).catch(e => console.log(e));
          console.error(
            `Error on POST /convert ${dataToSend.source}.\n${reason}`
          );
        }
      }
    });
  }
};

export default extension;
