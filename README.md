# NODE Wordpress Parser
---

## Goal 
Make parser for WP which will parse WP website using json api.
It must parse Pages, Posts, Categories and Media files.
If something is unaccesible - skip it.
Everything what parsed will be saved in data folder, folder - with name of website.
Parsed pages and posts will be saved as .json.
Also user have opportunity to save as MD.

## How to use?
1. Git clone this project.
2. Enter the projects folder.
3. Run `npm install` to install all dependencies.
4. Run `npm run start` to start parser.
5. Enter WP website link
6. IF json api works - select which content should be downloaded Posts/ Pages/ Media files/
7. Also user can save downloaded data as Markdown.
