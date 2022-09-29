# REI Token Profile Guideline

This repository (repo) provides the details about self-submitting **Token** information to REI DAO via GitHub.

## What is REI Token Profile?

REI Token Profile is the detailed information of the REI DAO My Account assets information. 

## Submission Guideline

1. Fork the repo to your own github account

2. Clone the repo from your own account, please note: do no clone the origin one directly, but clone the repo you forked
```
git clone https://github.com/xxxxxxxx/rei-token-profile.git
cd rei-token-profile/
```

3. Create a new branch (file) and switch to a new branch named by your token name
  For example:
```
git branch xxx-token
git checkout xxx-token
```

4. Add a new json file to the src/erc20 or src/erc721 or src/1155 directory, named by your token contract address. 
  For example:
  *0x4779Af7e65c055979C8100f2183635E5d28c78f5.json*

5. Please ensure to use UTF-8 encoding in the json file. Please check the template file to fill in the complete token information: [erc20-$template.json](./src/erc20/$template.json)

6. Commit and push the information to your repo
  For example:
```
git add -A
git commit -m “Add xxx token
git push origin xxx-token
```

7. Under your repo page, click the “New pull request” button. Then, attach the detailed  project information.

8. We will review your PR as soon as possible. If there is no problem with your PR, we will merge it into our master branch.
And then your token profile will display in the REI DAO My Account wallet list


