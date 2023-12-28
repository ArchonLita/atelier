# Atelier

## Overview

The goal of this project is to create a server and client for running DND campaigns virtually. This includes designing flexible systems for users to implement their own content. For copyright reasons, only content from the [5E SRD](https://dnd.wizards.com/resources/systems-reference-document) will be implemented in this project.

## Setting up the Project

This project will only run on macOS and Linux. If you use windows, install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install). Here is a more beginner-friendly guide on installing [Ubuntu on WSL](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-11-with-gui-support). After installing WSL, you can either use a text editor like [neovim](https://neovim.io/), or use VSCode on windows with the [WSL extension](https://code.visualstudio.com/docs/remote/wsl).

1. Install the [bun](https://bun.sh/) runtime for typescript.

```sh
curl -fsSL https://bun.sh/install | bash
```

2. Install the dependencies and then run the server.

```sh
bun install
bun start
```

## Contributing

The contribution guide can be found [here](/CONTRIBUTING.md)
