
## Submission Guideline

1. Fork the repo to your own github account

2. Clone the repo from your own account, please note: do no clone the origin one directly, but clone the repo you forked
```
git clone https://github.com/xxxxxxxx/rei-dao.git
cd rei-dao/
```

3. Create a new branch (file) and switch to a new branch named by your address name
  For example:
```
git branch xxx-address
git checkout xxx-address
```

4. Add a new json file to the [./src](./src/) directory, named by your address. 
  For example:
  *0x4779Af7e65c055979C8100f2183635E5d28c78f5.json*

5. Please ensure to use UTF-8 encoding in the json file. Please check the template file to fill in the complete address information: [$template.json](./src/$template.json)

6. Commit and push the information to your repo
  For example:
```
git add -A
git commit -m “Add xxx address
git push origin xxx-address
```

7. Under your repo page, click the “New pull request” button. Then, attach the detailed  project information.

8. We will review your PR as soon as possible. If there is no problem with your PR, we will merge it into our master branch.
And then your validator profile will display in the REI DAO Validator list


