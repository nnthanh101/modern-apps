# Infra is/as Code using Cloud Development Kit (CDK)

1. [x] Prerequisites: installing [Node.js](https://nodejs.org/en/download/) & [Hugo](https://gohugo.io/getting-started/installing/)

```
brew install node@12
brew install hugo
```

2. Git clone

```
git clone https://github.com/nnthanh101/cdk.git

cd cdk/amplify
npm run theme
```

3. Run Hugo

```
npm start
```

`http://localhost:8080`


> Note: Submodule

```
git submodule add https://github.com/nnthanh101/hugo-theme-learn themes/hugo-theme-learn
rm -rf .git/modules/themes/hugo-theme-learn .git/modules/hugo-theme-learn
```
