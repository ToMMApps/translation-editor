# Translation-Editor

The translation-editor package was written to satisfy the need to edit translation objects.
Like those that are used by the angular-translate package.

![BuildStatus](http://jenkins.tomm-apps.de/buildStatus/icon?job=translation-editor)
![Test](http://jenkins.tomm-apps.de:3434/badge/translation-editor/test)
![LastBuild](http://jenkins.tomm-apps.de:3434/badge/translation-editor/lastbuild)
![CodeCoverageInJenkins](http://jenkins.tomm-apps.de:3434/badge/translation-editor/coverage)

## Installation

```javascript
npm install translation-editor
```

## Usage

For example:

Before the operation the translation object may look like that:

```javascript
var translation = {
    "LABEL":"Example"
};
```

Now you run the updateValue operation: 

```javascript
updateValue(LABEL, "Modified", translation)
```.

After that the translation object would look like this:

```javascript
console.log(translation);
{"LABEL":"Modified"}
```

This was just an example. This package supports several operations on translation objects:

- addKey: Add a new key to a translation-object
- delKey: Remove a key from a translation-object
- getValue: Returns the value of a specific key
- updateValue: Overwrites the value of a specific key
- keyExists: Checks if the given key exists
- changeKey: Modifies the name of a key; the value is not changed

The api is based on promises.

##License
MIT
