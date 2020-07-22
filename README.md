# JupyterLab Extensions

This repository is for all jupyterlab extensions.

## Develop and Use the Extension

### Build and Install all Extensions at once

```bash
jlpm
jlpm build-ext
jlpm install-ext
jlpm build-jlab
jupyter lab
```

To clean the lib folders:

```bash
jlpm clean-ext
```

### Build and Install one Extension

Go to the example directory you want to install, e.g. `cd ./basics/hello-world`, and run the following commands:

```bash
jlpm install
jlpm run build
jupyter labextension install .
```

Rebuild the JupyterLab application:

```bash
jlpm run build
jupyter lab build
```

You can now start JupyterLab and check if your extension is working fine:

```bash
jupyter lab
```

### Change the Sources

If you want to develop and iterate on the code, you will need to open 2 terminals.

In terminal 1, go to the extension folder and run the following:

```bash
jlpm watch
```

Then in terminal 2, start JupyterLab with the watch flag:

```bash
jupyter lab --watch
```

From there, you can change your extension source code, it will be recompiled,
and you can refresh your browser to see your changes.

We are using [embedme](https://github.com/zakhenry/embedme) to embed code snippets into the markdown READMEs. If you make changes to the source code, ensure you update the README and run `jlpm embedme` from the root of the repository to regenerate the READMEs.

## Install a Published Extension

Once your extension is published (outside of this scope), you can install it
with the following command:

```bash
jupyter labextension install <published_extension>
```
