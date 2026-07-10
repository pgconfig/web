{ pkgs, lib, config, inputs, ... }:
{
  packages = [
    pkgs.git
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
    npm.enable = true;
  };

  scripts.install.exec = "npm install";
  scripts.dev.exec = "npm run serve";

  enterShell = ''
    echo "Run 'devenv install' to install dependencies."
    echo "Run 'devenv dev' to start the development server."
  '';

  cachix.enable = false;
}
