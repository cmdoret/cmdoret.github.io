# cmdoret.net

This repository holds the source code to build my personal website.
The rendered website is hosted on github pages and can be accessed from either of:
* https://cmdoret.github.io
* https://cmdoret.net

The website is built with [zola](https://www.getzola.org/) and uses the [abridge](https://github.com/Jieiku/abridge) theme, which is included as a submodule in this repo.


## Setup

> [!NOTE]
> The following dependencies are needed: `git`, `nix`, `just`

Clone this repository with submodules:

```sh
git clone --recurse-submodules https://github.com/cmdoret/cmdoret.github.io
```

All dependencies to build the website are included in a [nix](https://nixos.org/) development shell.

If [just](https://just.systems) is installed on your system, You can enter the development shell with:

```sh
just dev
```

To see a list of available commands, run `just`:

```sh
➜ just
Available recipes:
    build             # render the website
    deploy            # deploy the website to github pages
    nix-develop *args # enter a nix shell with all the tools needed
    watch             # rebuild the website on file changes
```
