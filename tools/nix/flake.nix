{
  description = "dev shell for cmdoret's personal website";


  inputs = {
    # Nixpkgs
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    nixpkgsZola.url = "github:nixos/nixpkgs/194c2aa446b2b059886bb68be15ef6736d5a8c31";
    # Also see the 'stable-packages' overlay at 'overlays/default.nix'.

    flake-utils.url = "github:numtide/flake-utils";

  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }@inputs:
    let
      # The function which builds the flake output attrMap.
      defineOutput =
        system:
        let
          # inherit from nixpkgs
          pkgs = nixpkgs.legacyPackages.${system};

          # Things needed only at compile-time.
          packagesBasic = with pkgs; [
            bash
            coreutils
            curl
            findutils
            git
            just
            nodejs_23
            yamlfmt
            inputs.nixpkgsZola.legacyPackages.${system}.zola
            zsh
          ];

        in
        {
          devShells = {
            default = pkgs.mkShell {
              name = "cmdoret.net";
              packages = packagesBasic;
            };
          };
        };
    in
    # Creates an attribute map `{ <key>.<system>.default = ...}`
    # by calling function `defineOutput`.
    # Key sofar is only `devShells` but can be any output `key` for a flake.
    flake-utils.lib.eachDefaultSystem defineOutput;
}
