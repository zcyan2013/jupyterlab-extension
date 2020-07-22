# Server Convert

> Create a minimal extension with backend (i.e. server) and frontend parts.

- [The template folder structure](#the-template-folder-structure)
- [Frontend Part](#frontend-part)
- [Backend (server) Part](<#backend-(server)-part>)
- [Packaging the Extension](#packaging-the-extension)
- [Installing the Package](#installing-the-package)

## The template folder structure

```bash
context-menu/
│  # Generic Files
│   .gitignore
│   LICENSE                     # License of your code
│   README.md                   # Instructions to install and build
│
├───.github
│   └───workflows
│           build.yml
│  
│  # Backend (server) Files
│   MANIFEST.in                 # Help Python to list your source files
│   pyproject.toml              # Define dependencies for building the server package
│   setup.py                    # Information about the server package
│
├───jlab_ext_example
│       handlers.py             # API handler (where things happen)
│       _version.py             # Server extension version
│       __init__.py             # Hook the extension in the server
│
├───jupyter-config
│       jlab_ext_example.json   # Server extension enabler
│  
│  # Frontend Files
│   .eslintignore               # Code linter configuration
│   .eslintrc.js
│   .prettierignore             # Code formatter configuration
│   .prettierrc
│   package.json                # Information about the frontend package
│   tsconfig.json               # Typescript compilation configuration
│  
├───src
│       index.ts                # Actual code of the extension
│       jlabextexample.ts       # More code used by the extension
│       svg.d.ts                # Show svg icon of the extension
│
└───style
        index.css               # CSS styling
        convert.svg             # Svg icon for convert operation
        onnx.svg                # Svg icon for onnx file
        pb.svg                  # Svg icon for pb file
```

There are two major parts in the extension:

- A Python package for the server extension
- A NPM package for the frontend extension

In this Extension, you will see that the template code have been extended
to demonstrate the use of GET and POST HTTP requests.

## Installing the Package

With the packaging described above, installing the extension is done in two commands once the package is published on pypi.org:

```bash
# Install the server extension and
# copy the frontend extension where JupyterLab can find it
pip install jlab_ext_example
# Build JupyterLab to integrate the frontend extension
jupyter lab build
```

> Note: User will need NodeJS to install the extension.

As developer, you might want to install the package in local editable mode.
This will shunt the installation machinery described above. Therefore the commands
to get you set are:

```bash
# Install server extension in editable mode
pip install -e .
# Register server extension
jupyter serverextension enable --py jlab_ext_example
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Install your development version of the extension with JupyterLab
jupyter labextension install .

# Rebuild Typescript source after making changes
jlpm build
# Rebuild JupyterLab after making any changes
jupyter lab build
```
<!-- prettier-ignore-end -->
