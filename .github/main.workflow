workflow "Deploy docs" {
  resolves = [
    "Deploy docs to gh-pages",
  ]
  on = "push"
}

action "On master" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "branch master"
}

action "Build mkdocs" {
  uses = "docker://squidfunk/mkdocs-material@4.4.0"
  args = "build"
  needs = ["On master"]
}

action "Build JSDoc" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run jsdoc-generate"
  needs = ["Build mkdocs"]
}

action "Deploy docs to gh-pages" {
  uses = "maxheld83/ghpages@v0.2.1"
  secrets = ["GH_PAT"]
  env = {
    BUILD_DIR = "site/"
  }
  needs = ["Build JSDoc"]
}