+++
title = "Task Automation: Just Make it Easy"
date = 2025-03-14
draft = false
weight = 1

[taxonomies]
categories = ["programming"]
tags = ["automation", "tools"]
[extra]
toc = true
keywords = "Programming, Development, Automation"
+++

When working in a git repository, we often use recipes to automate frequent tasks, such as building, linting, formatting, testing or benchmarking.

This provides a written trace of these "recipes" and a way to discover, remember and run the commands easily in the right order.

While this can be achieved with custom shell scripts, this would be error prone and require much boilerplate code.

Instead, there are "command runner" tools that are made for this purpose.

## Make is a Build System

The majority of projects use [`make`](https://www.gnu.org/software/make/) as a "command runner", because it is well known and available on most systems.

However, `make` was intended as a build system, not a generic command runner: its purpose is to organize the compilation of source files, and this is reflected by its features:

* recipes are designed around file dependencieiave file Recipes in a "Makefile" are expected to have file inputs and outputs.
* running arbitrary commands require explicitely marking rules with `.PHONY`.
* `make` does not have a built-in way to pass arguments to recipes.

Additionally, some default behaviours get in the way of using `make` as a task runner, for example if a `.PHONY` recipe has the same name as a file or directory (e.g. `test/`), it will refuse to run it.

## Just Use a Task Runner

[`just`](just.systems) is only one of many tools that were designed specifically as task runners. Other examples include [task](https://taskfile.dev/) or [doit](https://github.com/pydoit/doit).

In brief, it has saner default than `make` for use as a task runner and provides useful options which remove the need for glue code:

* print recipe comments as help message
* group recipes into sub commands
* automatically load .env files, or make it a requirement
* pass variadic or named arguments to recipes

The main con of `just`, is that it is likely not available on the system, however it is available on most package registries and can be used as a standalone binary.

## Example

Here is a small example `justfile` showcasing some useful just features:

```make
#!/usr/bin/env just
# ./justfile

set shell := ["bash", "-cue"] # <- enforce specific shell in recipes
set positional-arguments # <- allow passing positional args
set dotenv-required # <- source .env, exit if missing

alias bench := benchmark

# default behaviour: show help
_default: # <- underscore prefix hides it from help
    @just --list --no-aliases # <- @ hides command from output

# Install dependencies
install:
  uv sync

# Run tests
test *args: install # <- install, then test
  uv run pytest {{args}} # <- all args passed to pytest

# Measure performances
benchmark model="large" dataset="iris": install # <- args with default values
  uv run ./benchmark.py --model {{model}} --dataset {{dataset}}

```

```bash
➜ just
Available recipes:
    benchmark model="large" dataset="iris" # Measure performances
    install                                # Install dependencies
    test *args                             # Run tests

➜ just test --collect-only
uv sync
Resolved 6 packages in 1ms
Audited 4 packages in 0.02ms
uv run pytest --collect-only # <- all args passed to pytest
============================== test session starts ===============================
platform linux -- Python 3.13.1, pytest-8.3.5, pluggy-1.5.0
rootdir: /tmp/foobar
configfile: pyproject.toml
collected 2 items                                                                

<Dir foobar>
  <Dir tests>
    <Module test_foobar.py>
      <Function test_foo>
      <Function test_bar>

=========================== 2 tests collected in 0.01s ===========================
➜ just bench small
uv sync
Resolved 6 packages in 1ms
Audited 4 packages in 0.02ms
uv run ./benchmark.py --model small --dataset iris
benchmarking small model on iris dataset
```

## Conclusion


Only use `make` if you actually need a build system, otherwise use a proper task runner tool. I personally think the convenience is well worth having one extra dependency, and this is a non-issue if the project comes with its environment (e.g. ~conda~ [micromamba](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html), [docker](https://www.docker.com/), [nix](https://nixos.org), [pixi](https://github.com/prefix-dev/pixi)). In any case, reimplementing it with shell script glue is risky and time consuming.

# Resources
https://theorangeone.net/posts/just-stop-using-makefile/
