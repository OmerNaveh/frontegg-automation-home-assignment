# FrontEgg Automation Home-Assignment

## Details

- Installed Cypress and frontegg react preset 
- Tested login using email and password - checking all fields and possible errors

### **Extra Testing**

- Tested signup using required fields - again testing all fields, possible errors and finally creating a user using a random email generated using cypress random string
- Tested reset password feature - creating an email using [**MailSlurp**](https://www.mailslurp.com/) api - enterring said email whilst checking all possible errors that could be received, and finally sending the confirmation email to created email box.
- Reading the confirmation email returns the desired url- edited using regex expressions.
- Redirect to reset password using the given url and checking all errors on this page show and finally successfully changing the password.

### GITHUB ACTIONS
- Implemented Github actions workflows to run test on each push or pull request to master branch

## Test Video
https://user-images.githubusercontent.com/89572395/151049140-97525d63-8bf7-4340-8bd0-3fc83a6d7fbf.mp4

