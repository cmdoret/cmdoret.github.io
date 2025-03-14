+++
title = "Automation: just make it easy"
date = 2025-03-14
draft = true
weight = 1

[taxonomies]
categories = ["programming"]
tags = ["automation", "tools"]
[extra]
toc = true
keywords = "Programming, Development, Automation"
+++

> [!WARNING]
> This is very WIP and currently a brain dump.

# why use just

* make is a build system -> use it to automate compilation
* just is a command runner -> use it to automate arbitrary commands

Don't use shell glue.

## make cons

* if a file/folder has the same name as a rule, it will refuse to run it ("file" is up to date)
* needs special escaping $$ for environment variables
* special assignment behaviour := =
* cannot parametrize recipes

## just pros

* lighter syntax
* print recipe comments as help message
* modular design and subcommands (`just docker build`)
* supports variadic and named parameters in recipes
* additional settings: auto source env files,

# Resources
https://theorangeone.net/posts/just-stop-using-makefile/
