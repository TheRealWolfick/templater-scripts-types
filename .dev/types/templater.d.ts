// .dev/types/templater-obsidian.d.ts
declare module 'templater-obsidian' {
    import { Plugin, App, TFile } from 'obsidian';

    export interface TemplaterApi {

        file: {
            /** 
             * The string contents of the file at the time that Templater was executed. Manipulating this string will not update the current file. 
             * 
             * @example
             * ```javascript
             * // Retrieve file content
             * <% tp.file.content %>
             * ```
             */
            content: string;

            /** 
             * Creates a new file using a specified template or with a specified content.
             * @param template Either the template used for the new file content, or the file content as a string. If it is the template to use, you retrieve it with tp.file.find_tfile(TEMPLATENAME).
             * @param filename The filename of the new file, defaults to "Untitled".
             * @param open_new Whether to open or not the newly created file. Warning: if you use this option, since commands are executed asynchronously, the file can be opened first and then other commands are appended to that new file and not the previous file.
             * @param folder The folder to put the new file in, defaults to Obsidian's default location. If you want the file to appear in a different folder, specify it with "PATH/TO/FOLDERNAME" or tp.app.vault.getAbstractFileByPath("PATH/TO/FOLDERNAME").
             * 
             * @example
             * ```javascript
             * // File creation
             * <%* await tp.file.create_new("MyFileContent", "MyFilename") %>
             * // File creation with template
             * <%* await tp.file.create_new(tp.file.find_tfile("MyTemplate"), "MyFilename") %>
             * // File creation and open created note
             * <%* await tp.file.create_new("MyFileContent", "MyFilename", true) %>
             * // File creation in current folder
             * <%* await tp.file.create_new("MyFileContent", "MyFilename", false, tp.file.folder(true)) %>
             * // File creation in specified folder with string path
             * <%* await tp.file.create_new("MyFileContent", "MyFilename", false, "Path/To/MyFolder") %>
             * // File creation in specified folder with TFolder
             * <%* await tp.file.create_new("MyFileContent", "MyFilename", false, tp.app.vault.getAbstractFileByPath("MyFolder")) %>
             * // File creation and append link to current note
             * [[<% (await tp.file.create_new("MyFileContent", "MyFilename")).basename %>]]
             * ```
             */
            create_new(template: TFile | string, filename?: string, open_new?: boolean, folder?: TFolder | string): Promise<TFile>;

            /** 
             * Retrieves the file's creation date.
             * @param format The format for the date. Defaults to "YYYY-MM-DD HH:mm". Refer to format reference.
             * 
             * @example
             * ```javascript
             * // File creation date
             * <% tp.file.creation_date() %>
             * // File creation date with format
             * <% tp.file.creation_date("dddd Do MMMM YYYY HH:mm") %>
             * ```
             */
            creation_date: (format?: string) => string;

            /** 
             * Sets the cursor to this location after the template has been inserted. You can navigate between the different cursors using the configured hotkey in Obsidian settings.
             * @param order The order of the different cursors jump, e.g. it will jump from 1 to 2 to 3, and so on. If you specify multiple tp.file.cursor with the same order, the editor will switch to multi-cursor.
             * 
             * @example
             * ```javascript
             * // File cursor
             * <% tp.file.cursor() %>
             * // File multi-cursor
             * <% tp.file.cursor(1) %>Content<% tp.file.cursor(1) %>
             * ```
             */
            cursor: (order?: number) => string;

            /** 
             * Appends some content after the active cursor in the file.
             * @param content The content to append after the active cursor.
             * 
             * @example
             * ```javascript
             * // File cursor append
             * <% tp.file.cursor_append("Some text") %>
             * ```
             */
            cursor_append: (content: string) => string;

            /** 
             * Check to see if a file exists by it's file path. The full path to the file, relative to the Vault and containing the extension, must be provided.
             * @param filepath The full file path of the file we want to check existence for.
             * 
             * @example
             * ```javacript
             * // File existence
             * <% await tp.file.exists("MyFolder/MyFile.md") %>
             * // File existence of current file
             * <% await tp.file.exists(tp.file.folder(true) + "/" + tp.file.title + ".md") %>
             * ```
             */
            exists: (filepath: string) => Promise<boolean>;

            /** 
             * Search for a file and returns its TFile instance.
             * @param filename The filename we want to search and resolve as a TFile.
             * 
             * @example
             * ```javascript
             * // File find TFile
             * <% tp.file.find_tfile("MyFile").basename %>
             * ```
             */
            find_tfile: (filename: string) => TFile | null;

            /** 
             * Retrieves the file's folder name.
             * @param absolute If set to true, returns the vault-absolute path of the folder. If false, only returns the basename of the folder (the last part). Defaults to false.
             * 
             * @example
             * ```javascript
             * // File folder (Folder)
             * <% tp.file.folder() %>
             * // File folder with vault-absolute path (Path/To/Folder)
             * <% tp.file.folder(true) %>
             * ```
             */
            folder: (absolute?: boolean) => string;

            /** 
             * Includes the file's link content. Templates in the included content will be resolved.
             * @param include_link The link to the file to include, e.g. "[[MyFile]]", or a TFile object. Also supports sections or blocks inclusions.
             * 
             * @example
             * ```javascript
             * // File include
             * <% await tp.file.include("[[Template1]]") %>
             * // File include TFile
             * <% await tp.file.include(tp.file.find_tfile("MyFile")) %>
             * // File include section
             * <% await tp.file.include("[[MyFile#Section1]]") %>
             * // File include block
             * <% await tp.file.include("[[MyFile#^block1]]") %>
             * ```
             */
            include: (include_link: string | TFile) => Promise<string>;

            /** 
             * Retrieves the file's last modification date.
             * @param format The format for the date. Defaults to "YYYY-MM-DD HH:mm". Refer to format reference.
             * 
             * @example
             * ```javascript
             * // File last modified date
             * <% tp.file.last_modified_date() %>
             * // File last modified date with format
             * <% tp.file.last_modified_date("dddd Do MMMM YYYY HH:mm") %>
             * ```
             */
            last_modified_date: (format?: string) => string;

            /** 
             * Moves the file to the desired vault location.
             * @param new_path The new vault relative path of the file, without the file extension. Note: the new path needs to include the folder and the filename, e.g. "/Notes/MyNote".
             * @param file_to_move The file to move, defaults to the current file.
             * 
             * @example
             * ```javascript
             * // File move
             * <%* await tp.file.move("/A/B/" + tp.file.title) %>
             * // File move and rename
             * <%* await tp.file.move("/A/B/NewTitle") %>
             * ```
             */
            move: (new_path: string, file_to_move?: TFile) => Promise<void>;

            /** 
             * Retrieves the file's absolute path on the system.
             * @param relative If set to true, only retrieves the vault's relative path.
             * 
             * @example
             * ```javascript
             * // File path
             * <% tp.file.path() %>
             * // File relative path (relative to vault root)
             * <% tp.file.path(true) %>
             * ```
             */
            path: (relative?: boolean) => string;

            /** 
             * Renames the file (keeps the same file extension).
             * @param new_title The new file title.
             * 
             * @example
             * ```javascript
             * // File rename
             * <%* await tp.file.rename("MyNewName") %>
             * // File append a 2 to the file name
             * <%* await tp.file.rename(tp.file.title + "2") %>
             * ```
             */
            rename: (new_title: string) => Promise<void>;

            /** 
             * Retrieves the active file's text selection. 
             * 
             * @example
             * ```javascript
             * // File selection
             * <% tp.file.selection() %>
             * ```
             */
            selection: () => string;

            /** 
             * Retrieves the file's tags (array of string). 
             * 
             * @example
             * ```javascript
             * // File tags
             * <% tp.file.tags %>
             * ```
             */
            tags: string[];

            /** 
             * Retrieves the file's title. 
             * 
             * @example
             * ```javascript
             * // File title
             * <% tp.file.title %>
             * // Strip the Zettelkasten ID of title (if space separated)
             * <% tp.file.title.split(" ")[1] %>
             * ```
             */
            title: string;
        };

        date: {
            /**
             * Retrieves the date.
             * @param format The format for the date. Defaults to "YYYY-MM-DD". Refer to {@linkplain https://momentjs.com/docs/#/displaying/format/|format reference}
             * @param offset Duration to offset the date from. If a number is provided, duration will be added to the date in days. You can also specify the offset as a string using the ISO 8601 format.
             * @param reference The date referential, e.g. set this to the note's title.
             * @param reference_format The format for the reference date. Refer to {@linkplain https://momentjs.com/docs/#/displaying/format/|format reference}.
             * @returns
             * 
             * @example
             * ```javascript
             * // Date now
             * <% tp.date.now() %>
             * // Date now with format
             * <% tp.date.now("Do MMMM YYYY") %>
             * // Last week
             * <% tp.date.now("YYYY-MM-DD", -7) %>
             * // Next week
             * <% tp.date.now("YYYY-MM-DD", 7) %>
             * // Last month
             * <% tp.date.now("YYYY-MM-DD", "P-1M") %>
             * // Next year
             * <% tp.date.now("YYYY-MM-DD", "P1Y") %>
             * // File's title date + 1 day (tomorrow)
             * <% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>
             * // File's title date - 1 day (yesterday)
             * <% tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>
             * ```
             */
            now: (format?: string, offset?: number, reference?: string, reference_format?: string) => string;

            /**
             * Retrieves tomorrow's date.
             * @param format The format for the date. Defaults to "YYYY-MM-DD". Refer to {@linkplain https://momentjs.com/docs/#/displaying/format/|format reference}.
             * @returns 
             * 
             * @example
             * ```javascript
             * // Date tomorrow
             * <% tp.date.tomorrow() %>
             * // Date tomorrow with format
             * <% tp.date.tomorrow("Do MMMM YYYY") %>
             * ```
             */
            tomorrow: (format?: string) => string;

            /**
             * 
             * @param format The format for the date. Defaults to "YYYY-MM-DD". Refer to {@linkplain https://momentjs.com/docs/#/displaying/format/|format reference}.
             * @param weekday Week day number. If the locale assigns Monday as the first day of the week, 0 will be Monday, -7 will be last week's day.
             * @param reference The date referential, e.g. set this to the note's title.
             * @param reference_format The format for the reference date. Refer to {@linkplain https://momentjs.com/docs/#/displaying/format/|format reference}.
             * @returns 
             * 
             * @example
             * ```javascript
             * // This week's Monday
             * <% tp.date.weekday("YYYY-MM-DD", 0) %>
             * // Next Monday
             * <% tp.date.weekday("YYYY-MM-DD", 7) %>
             * // File's title Monday
             * <% tp.date.weekday("YYYY-MM-DD", 0, tp.file.title, "YYYY-MM-DD") %>
             * // File's title previous Monday
             * <% tp.date.weekday("YYYY-MM-DD", -7, tp.file.title, "YYYY-MM-DD") %>
             * ```
             */
            weekday: (format?: string, weekday: number, reference?: string, reference_format?: string) => string;

            /**
             * Retrieves yesterday's date.
             * @param format The format for the date. Defaults to "YYYY-MM-DD". Refer to {@linkplain https://momentjs.com/docs/#/displaying/format/|format reference}.
             * @returns 
             * 
             * @example
             * ```javascript
             * // Date yesterday
             * <% tp.date.yesterday() %>
             * // Date yesterday with format
             * <% tp.date.yesterday("Do MMMM YYYY") %>
             * ```
             */
            yesterday: (format?: string) => string;
        };

        /**
         * Exposes the obsidian App interface
         */
        app: App;

        config: {
            /** The active file (if existing) when launching Templater. */
            active_file?: TFile | null;

            /** The RunMode, representing the way Templater was launched (Create new from template, Append to active file, ...). */
            run_mode: number;

            /** The TFile object representing the target file where the template will be inserted. */
            target_file: TFile | null;

            /** The TFile object representing the template file. */
            template_file: TFile | null;
        };

        /**
         * Frontmatter Module - Exposes all the frontmatter variables of a file as variables.
         * 
         * Usage Examples:
         * - Basic property: `tp.frontmatter.alias`
         * - Property with spaces: `tp.frontmatter["note type"]`
         * - Array manipulation: `tp.frontmatter.categories.map(prop => \`"${prop}"\`).join(", ")`
         * 
         * Example frontmatter:
         * ```yaml
         * ---
         * alias: myfile
         * note type: seedling
         * categories:
         *   - book
         *   - movie
         * ---
         * ```
         * 
         * Template usage:
         * 
         * File's metadata alias: ```<% tp.frontmatter.alias %>```
         * 
         * Note's type: ```<% tp.frontmatter["note type"] %>```
         * 
         * Categories: ```<% tp.frontmatter.categories.map(prop => `"${prop}"`).join(", ") %>```
         */
        frontmatter: {
            [key: string]: any;
        } & Record<string, any>;

        /**
         * Hooks Module - Exposes hooks that allow you to execute code when a Templater event occurs.
         * 
         * Use hooks to run code after template execution completes, such as:
         * - Updating frontmatter after template finishes
         * - Running commands from other plugins
         * - Performing cleanup or post-processing tasks
         */
        hooks: {
            /**
             * Hooks into when all actively running templates have finished executing.
             * 
             * Most of the time this will be a single template, unless you are using 
             * `tp.file.include` or `tp.file.create_new`. Multiple invocations of this 
             * method will have their callback functions run in parallel.
             * 
             * @param callback_function Callback function that will be executed when all 
             *                         actively running templates have finished executing.
             * 
             * @example
             * ```javascript
             * // Update frontmatter after template finishes executing
             * tp.hooks.on_all_templates_executed(async () => {
             *   const file = tp.file.find_tfile(tp.file.path(true));
             *   await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
             *     frontmatter["key"] = "value";
             *   });
             * });
             * ```
             * 
             * @example
             * ```javascript
             * // Run a command from another plugin after Templater updates the file
             * tp.hooks.on_all_templates_executed(() => {
             *   tp.app.commands.executeCommandById("obsidian-linter:lint-file");
             * });
             * ```
             */
            on_all_templates_executed(callback_function: () => any | Promise<any>): void;
        };

        /**
         * Obsidian Module - Exposes all the functions and classes from the Obsidian API.
         * 
         * This module provides direct access to Obsidian's internal API, which is useful
         * when writing scripts that need to interact with Obsidian's core functionality.
         * 
         * Refer to the Obsidian API declaration file for complete documentation:
         * https://github.com/obsidianmd/obsidian-api
         * 
         * @example
         * ```javascript
         * // Get all folders
         * tp.app.vault.getAllLoadedFiles()
         *   .filter(x => x instanceof tp.obsidian.TFolder)
         *   .map(x => x.name)
         * ```
         * 
         * @example
         * ```javascript
         * // Normalize path
         * tp.obsidian.normalizePath("Path/to/file.md")
         * ```
         * 
         * @example
         * ```javascript
         * // HTML to markdown conversion
         * tp.obsidian.htmlToMarkdown("<h1>Heading</h1><p>Paragraph</p>")
         * ```
         * 
         * @example
         * ```javascript
         * // HTTP request
         * const response = await tp.obsidian.requestUrl("https://api.example.com/data");
         * const data = response.json;
         * ```
         */
        obsidian: typeof import('obsidian');

        /**
         * This modules contains every internal function related to the web (making web requests).
         */
        web: {
            /**
             * Retrieves and parses the daily quote from {@link https://github.com/Zachatoo/quotes-database} as a callout.
             * @returns 
             * 
             * @example
             * ```javascript
             * // Daily quote
             * <% await tp.web.daily_quote() %>
             * ``` 
             */
            daily_quote: () => Promise<string>;

            /**
             * Gets a random image from {@link https://unsplash.com/}
             * @param size Image size in the format <width>x<height>.
             * @param query Limits selection to photos matching a search term. Multiple search terms can be passed separated by a comma.
             * @param include_size Optional argument to include the specified size in the image link markdown. Defaults to false.
             * @returns 
             * 
             * @example
             * ```javascript
             * // Random picture
             * <% await tp.web.random_picture() %>
             * // Random picture with size
             * <% await tp.web.random_picture("200x200") %>
             * // Random picture with size and query
             * <% await tp.web.random_picture("200x200", "landscape,water") %>
             * ```
             */
            random_picture: (size?: string, query?: string, include_size?: boolean) => Promise<string>;

            /**
             * Makes a HTTP request to the specified URL. Optionally, you can specify a path to extract specific data from the response.
             * @param url The URL to which the HTTP request will be made.
             * @param path A path within the response JSON to extract specific data.
             * @returns 
             * 
             * @example
             * ```javascript
             * // Simple request
             * <% await tp.web.request("https://jsonplaceholder.typicode.com/todos/1") %>
             * // Request with path
             * <% await tp.web.request("https://jsonplaceholder.typicode.com/todos", "0.title") %>
             * ```
             */
            request: (url: string, path?: string) => Promise<any>;
        };

        /**
         * This module contains system related functions.
         * 
         * Function documentation is using a specific syntax. More information {@linkplain https://silentvoid13.github.io/Templater/syntax.html#function-documentation-syntax|here}.
         */
        system: {

            /**
             * Retrieves the clipboard's content.
             */
            clipboard: () => Promise<string>;

            /**
             * Spawns a prompt modal and returns the user's input.
             * @param prompt_text Text placed above the input field.
             * @param default_value A default value for the input field.
             * @param throw_on_cancel Throws an error if the prompt is canceled, instead of returning a null value.
             * @param multiline If set to true, the input field will be a multiline textarea. Defaults to false.
             * @returns 
             * 
             * @example
             * ```javascript
             * // Prompt
             * <% await tp.system.prompt("Please enter a value") %>
             * // Prompt with default value
             * <% await tp.system.prompt("What is your mood today?", "happy") %>
             * // Multiline prompt
             * <% await tp.system.prompt("What is your mood today?", null, false, true) %>
             * ```
             * 
             * @example
             * ```javascript
             * // Reuse output from prompt
             * <%* let value = await tp.system.prompt("Please enter a value"); %>
             * # <% value %>
             * selected value: <% value %>
             * ```
             */
            prompt: (prompt_text?: string, default_value?: string, throw_on_cancel?: boolean) => Promise<string>;

            /**
             * Spawns a suggester prompt and returns the user's chosen item.
             * 
             * @param text_items Array of strings representing the text that will be displayed for each item in the suggester prompt. This can also be a function that maps an item to its text representation.
             * @param items Array containing the values of each item in the correct order.
             * @param throw_on_cancel Throws an error if the prompt is canceled, instead of returning a null value.
             * @param placeholder Placeholder string of the prompt.
             * @param limit Limit the number of items rendered at once (useful to improve performance when displaying large lists).
             * @returns 
             * 
             * /
             * 
             * Examples:
             * ```javascript
             * // Suggester
             * <% await tp.system.suggester(["Happy", "Sad", "Confused"], ["Happy", "Sad", "Confused"]) %>
             * // Suggester with mapping function (same as above example)
             * <% await tp.system.suggester((item) => item, ["Happy", "Sad", "Confused"]) %>
             * // Suggester for files
             * [[<% (await tp.system.suggester((item) => item.basename, tp.app.vault.getMarkdownFiles())).basename %>]]
             * // Suggester for tags
             * <% await tp.system.suggester(item => item, Object.keys(tp.app.metadataCache.getTags()).map(x => x.replace("#", ""))) %>
             * // Reuse value from suggester
             * <%*
             * let selectedValue = await tp.system.suggester(["Happy", "Sad", "Confused"], ["Happy", "Sad", "Confused"]);
             * %>
             * # <% selectedValue %>
             * selected value: <% selectedValue %>
             * ```
             */
            suggester: <T>(
                text_items: string[] | ((item: T) => string),
                items: T[],
                throw_on_cancel?: boolean,
                placeholder?: string,
                limit?: number
            ) => Promise<T>;
        };

        /**
         * Call on a user defined function from the scripts folder. See {@linkplain https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html|user defined functions}
         */
        user: {
            [key: string]: any;
        };
    }

    export default class TemplaterPlugin extends Plugin {
        moment: string
    }
}
