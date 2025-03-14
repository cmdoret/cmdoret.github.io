set positional-arguments
set shell := ["bash", "-cue"]
root_dir := justfile_dir()

# Default recipe to list all recipes.
[private]
default:
  @just --list --no-aliases

# render the website
build:
  @echo "Building website..."
  cd {{root_dir}} && \
    zola build && \
    npm run abridge && \
    zola build

# rebuild the website on file changes
watch: build
  @echo "Watching website..."
  cd {{root_dir}} && \
    zola serve

# deploy the website to github pages
deploy: build
  git subtree push --prefix public origin gh-pages

alias dev := nix-develop
# enter a nix shell with all the tools needed 
nix-develop *args:
  @echo "Starting nix dev shell..."
  cd {{root_dir}} && \
    { [ -n "${cmd:-}" ] || cmd=("zsh"); } && \
    nix develop \
      ./tools/nix#default \
      --accept-flake-config \
      --command "${cmd[@]}"
