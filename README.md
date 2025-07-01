# templater-scripts-types
Type definitions for creating user scripts

This is intended to assist with creating user scripts with the templater plugin by proving typescript like functionality in your javascript files.

# How to use
1. Download the .dev folder and tsconfig.json file.
2. Place these files in whichever folder you have defined as your templater scripts folder.
3. If you use obsidian git, consider adding "**/.dev/**" and "**/tsconfig.json" to your .gitignore file.
4. Create all your user scripts with the following format:

```javascript
import moment from '.dev/types/moment'; 

/**
 * 
 * @param {import('templater-obsidian').TemplaterApi} tp
 */
function addCssClasses (tp) {
    
}

modult.exports = userFunction;
```

This gives the correct suggestions to all templater functions with full jsdocs as per the plugin functions.

# References

Information for jsdocs was replicated from [https://silentvoid13.github.io/Templater|Templater Docs]

External sources:
moment.d.ts types file copied from [https://github.com/moment/moment]
obsidian types cloned from [https://github.com/obsidianmd/obsidian-api]
