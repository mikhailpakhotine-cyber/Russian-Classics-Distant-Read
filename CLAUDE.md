# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a distant reading project for analyzing Russian classics and utopian literature. The repository currently contains the text corpus but no analysis code yet.

## Corpus

The repository contains three primary texts for analysis:

- **pg600.txt**: Dostoyevsky's "Notes from the Underground" (Project Gutenberg #600)
- **Chernyshevsky_What_Is_To_Be_Done_UTF8.txt**: Chernyshevsky's "What Is To Be Done?" (UTF-8 encoded)
- **WellsModernUtopia.txt**: H.G. Wells' "A Modern Utopia"

All corpus files are plain text files in the root directory. The Chernyshevsky text is in UTF-8 encoding; verify encoding for other files if processing issues arise.

## Architecture

This repository is in its initial stage with only the corpus files present. No analysis infrastructure, dependencies, or build system has been established yet.

When developing analysis code:
- The corpus files should be treated as read-only primary sources
- Consider creating a separate directory structure for analysis scripts, outputs, and visualizations
- Text preprocessing may be needed for the Project Gutenberg file (pg600.txt) which includes boilerplate headers and footers
