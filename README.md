# HiddenForm

*Made with 💝 by [R4shSec](https://github.com/r4shsec)*

> ⚠️ DISCLAIMER

> THE FOLLOWING TOOL IS ONLY MADE FOR EDUCATIONAL AND RESEARCH PURPOSES. THE AUTHOR ISN'T LIABLE FOR ANY MISUSE OF THIS SCRIPT THAT MAY RESULT IN DAMAGES OR CRIMINAL LIABILITY. **USE AT YOUR OWN RISK; WITH GREAT POWER COMES GREAT RESPONSIBILITY**.

---

## What is HiddenForm?

![HiddenForm GIF](/content.gif)

HiddenForm is a penetration testing tool used for red teamers. This tool's purpose is to raise awareness regarding the dangers of autofill that password managers use as well as phishing attacks.

## What are the dangers of hidden forms?

Some password managers skip attributes such as `hidden` or styling such as `style="display:none"`. This autofills the form with other information despite it being hidden. Yes, you heard me right, **hidden**!

## Usage

1. [Download Node.js for your Operating System (OS)](https://nodejs.org/en/download).
2. Clone this repository and change directories:

```bash
git clone https://github.com/r4shsec/hiddenform.git
cd hiddenform
```

3. Edit the `config.json` file if you'd like to change anything.

4. Run this command:

```bash
npm install # Install the node modules.
npm start # Run the command.
```

The default username and password for the admin panel is `admin:admin`.

## License 📜

This is licensed under [MIT](LICENSE.md).
