# Modern Application Development

> This repository requires `hugo` version [v0.64.0](https://github.com/gohugoio/hugo/releases/tag/v0.64.0).
Please follow the link and install the right version.
### 1. Prerequisites
```
brew install node@12
brew install hugo
```

### 2. Git clone

```
git clone https://github.com/nnthanh101/cdk.git

cd cdk/amplify
npm run theme
```

### 3. Run Hugo

```
npm start
```

> http://localhost:8080

### Submodule

```
git submodule add https://github.com/nnthanh101/hugo-theme-learn themes/hugo-theme-learn

rm -rf .git/modules/themes/hugo-theme-learn .git/modules/hugo-theme-learn
# git rm --cached amplify/themes/hugo-theme-learn
```

### Remove Submodule

* Delete the section referring to the submodule from the .gitmodules file
* Stage the changes via git add .gitmodules
* Delete the relevant section of the submodule from .git/config.
* Run git rm --cached path_to_submodule (no trailing slash)
* Run rm -rf .git/modules/path_to_submodule
* Commit the changes with ```git commit -m "Removed submodule "
* Delete the now untracked submodule files rm -rf path_to_submodule