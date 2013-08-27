evaluate-password
=================
Evaluate password strength.

Installation
-----------------
Include script after the jQuery library
```html
<script src="jquery.evaluatePassword.js" type="text/javascript"></script>
```

Usage
-----------------
Need Input Form ID and DIV for PasswordBar 
```html
<input type="password" id="login-pass" name="password">
<div class="password-strength" data-target="login-pass"></div>
```

Create PasswordBar
```javascript
$("#login-pass").evaluatePassword({
    autoCreateForm: true
});
```

Configuration
-----------------

#### minimum_length
```
defaults.minimum_length: 8
```

#### runOnInit
```
defaults.runOnInit: true
```

#### autoCreateForm
```
defaults.autoCreateForm: false
```

#### dictionaryCheck
Load "dicrionay.json"
```
defaults.dictionaryCheck: true
```

#### dictionaryJsonPath
path/to/dicrionay.json
```
defaults.dictionaryJsonPath: "../dicrionay.json"
```

#### requireStringKind
```
defaults.requireStringKind: 1
```
If requireStringKind is 2

* minimum_length < aaaaaa : string-kind = 1 -> NG
* minimum_length < aaaA12 : string-kind = 3 -> OK

#### levels
```
defaults.levels: { "0": "Too short", "1": ... , "4": "Strong" }
```

#### patterns
regular expression
```
defaults.patterns: [
    "[a-z]", // StringKind 1
    "[A-Z]", // StringKind 2
    "[0-9]",
    "-_"
]
```
