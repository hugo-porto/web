# web

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/20aeb1a662c3458493b6543773c88de9)](https://app.codacy.com/gh/hugo-porto/web/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

This repository contains a sample website built with [Hugo](https://gohugo.io/), a fast and flexible static site generator written in Go. The site uses the [Hugo-Porto](https://github.com/hugo-porto/theme) theme, which provides a modern, responsive design and a variety of features for personal and portfolio websites.

> **Developer Note:** This project serves as the main development and testing website for the Hugo-Porto theme. It is intended for theme contributors and developers to preview, debug, and validate theme changes in a real-world environment. All theme updates should be tested here before release. **Note:** Only use `make dev-theme` if you are actively developing or changing the theme project. For regular website development, use `make dev` and ignore the theme development section.

The project is structured for easy local development, testing, and deployment. It includes configuration for live reloading, custom theme development, and automated linting for Markdown files. The latest version is deployed at [https://hugo-porto.netlify.app/](https://hugo-porto.netlify.app/).

## Installation

Follow these steps to set up the project for local development:

1. **Install Hugo (extended version recommended):**
   - [Official installation guide](https://gohugo.io/getting-started/installing/)
   - On macOS: `brew install hugo`

2. **Clone the repository:**

   ```sh
   git clone https://github.com/hugo-porto/web.git
   cd web
   ```

3. **Install Node.js and npm (if not already installed):**
   - [Download Node.js](https://nodejs.org/)
   - On macOS: `brew install node`

4. **Install npm dependencies (if required):**

   ```sh
   npm install
   ```

5. **Start the development server:**

   ```sh
   make dev
   ```

   For theme development, use:

   ```sh
   make dev-theme
   ```

6. **Build the site for production:**

   ```sh
   make build
   ```

## Makefile Commands

The following commands are available for development and maintenance:

- **make lint**  
  Runs `markdownlint` on all Markdown files in the project to check for style and formatting issues.

- **make dev**  
  Starts the Hugo development server with live reload, including drafts and future-dated content. Useful for previewing the site locally.

- **make dev-theme**  
  Starts the Hugo development server with the local theme (`../../theme`) as a module replacement. Use this only when developing or testing changes to the theme itself.

- **make clean**  
  Removes the `public`, `resources`, and `.resources` directories to clean up generated files and caches.

- **make build**  
  Cleans the project and then builds the site for production, enabling garbage collection, minification, and cleaning the destination directory.

- **make upgrade**  
  Updates Hugo modules to their latest versions and tidies up the module dependencies.

## Prerequisites

- [Hugo](https://gohugo.io/getting-started/installing/) (extended version recommended)
- [Node.js](https://nodejs.org/) and npm (for theme development and asset building, if required)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the terms of the MIT license. For more details, see the [LICENSE](LICENSE) file in the project root.
