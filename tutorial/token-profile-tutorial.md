
## What is Token Profile?

REI Bridges Token Profile is the detailed information of the REI Bridges Token. 

## Submission Guideline

1. Fork the repo to your own github account

2. Clone the repo from your own account, please note: do no clone the origin one directly, but clone the repo you forked
```
git clone https://github.com/xxxxxxxx/rei-dao.git
cd rei-dao/
```

3. Create a new branch (file) and switch to a new branch named by your token name
  For example:
```
git branch xxx-token
git checkout xxx-token
```

4. Add your token information to the src/bridgesInfo/tokenList.json. 

5. Commit and push the information to your repo
  For example:
```
git add -A
git commit -m “Add xxx token
git push origin xxx-token
```

6. Under your repo page, click the “New pull request” button. Then, attach the detailed  project information.

7. We will review your PR as soon as possible. If there is no problem with your PR, we will merge it into our master branch.
