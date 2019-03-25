# shugaStatus
**shugaStatus** is a lightweight and static service status page powered by [UptimeRobot](https://uptimerobot.com/).

## Features

- Can run on GitHub Pages
- Organize monitors into different categories
- Post date-stamped news bulletins on the top of the page
- Show a summary of online services on the top of the page
- Status refreshes every five minutes.

## Set-up

### Monitors

You are first going to need to set up your monitor and get an API key.

1. Go to [UptimeRobot's site](https://uptimerobot.com/) and make an account.
2. Make a new monitor. The name and link you set up will be what is displayed to users.
3. Go to "My Settings" and scroll to the bottom of the page.
4. Under "Monitor-Specific API Keys," click "Show/Hide," select your monitor from the drop-down, and generate a new API key. Copy the generated key.

Now, we need to put the API key into shugaStatus. To do this:

5. Open `index.js` in your favorite text editor.
6. Go to the bottom of the file and find the `data` object.
7. If you wish to add a new category, add another array and set the entry name to the name of the category.
8. Add the API key as a string to the array corresponding to the category you wish to add.

These steps can be repeated for each service or website you wish to monitor. Please note that the API keys do not compromise your account and it is okay that they are exposed.

#### Example

```json
const data = {
    "Shuga": ["m778874106-d364e78085e7c4a22ff7d38a","m778959290-aec903f88269aa3621ba3ad5","m778874126-2199efa94e371583fd42a7e7"],
    "Zenith": ["m781829689-e6732674363c27c9a862151a","m780045346-2d77165d0776d2d1c7f1c77d","m781756366-ce638a5c2d35da8501908363","m780822745-dc7ca6fbee3c28549ad8a079"]
}
```

### News Bulletins

Note: This is an optional feature. You don't *need* to do this, but it's recommended.

1. In the JavaScript console, type in `Date.now()` to get a valid `"date"` value.
2. Open `updates.json` in your favorite text editor.
3. Edit the `"body"` property with your bulletin text and set `"date"` to what you got in step 1.
4. If you want to add any additional bulletins, do so by adding an additional object and incrementing the numerical string.

#### Example

```json
{
    "0": {
        "body": "This is a message that will appear on the top of the page. Use this space to display news!",
        "date": "1553543817108"
    },
     "1": {
        "body": "shugaStatus is now open-source! Check us out <a target=\"_blank\" href=\"https://github.com/Shugabuga/shugaStatus\">on GitHub!</a>",
        "date": "1550935683902"
    },
}
````

### Set Up with GitHub Pages

1. Push your changes to a forked or your own GitHub repo.
2. In your repo settings, enable GitHub Pages for the `master` branch.
3. Set up a custom domain by [following the steps GitHub provides here](https://help.github.com/en/articles/using-a-custom-domain-with-github-pages).
