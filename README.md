# autoaccountant
>realtime accountant and budget manager system

## How it works
1. The user defines categories to divide and tally up different types of spending

2. The user defines goals to keep boundaries on how much spending *should* be occurring in each category

3. Now all the user has to do is sign in to the bank and credit card institutions they want to track, and boom, everything else is in the hands of autoaccountant!

4. The application pulls data from bank and credit card accounts to store and retroactively classify/mark previous and historical transactions

5. Then, the application listens for new transactions on bank/credit card accounts and prompts the user for category of spending

6. It even has an additional manual entry system for entering cash expenses

## Dependencies
 * Plaid API account credentials
 * MongoDB
 * A crap ton of node modules (`npm install` all the things)
