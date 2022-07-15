
## Submission Guideline

1. Fork the repo to your own github account

2. Clone the repo from your own account, please note: do no clone the origin one directly, but clone the repo you forked
```
git clone https://github.com/xxxxxxxx/rei-dao.git
cd rei-dao/
```

3. Create a new branch (file) and switch to a new branch
  For example:
```
git branch add-mint-address-0xxxxx
git checkout add-mint-address-0xxxxx
```

4. Add your mint address information to the src/bridges/mintAddress/index.json.

5. Commit and push the information to your repo
  For example:
```
git add -A
git commit -m “Add mint address xxx
git push origin add-mint-address-0xxxxx
```

6. Under your repo page, click the “New pull request” button.

7. We will review your PR as soon as possible. If there is no problem with your PR, we will merge it into our master branch.
