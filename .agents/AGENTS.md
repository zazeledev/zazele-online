# Project Customization Rules - Zazele Online

## Environment Context
- **Production Status**: This website is in live production mode. All edits made locally are intended for production release.
- **Safety First**: Always preserve the localhost protection guards in `frontend/js/api.js`.
- **Zero Localhost Leaks**: Ensure no hardcoded `localhost` references are introduced to static runtime javascript files.
- **Pre-Push Validation**: Always run the automated testing framework (`npm run test:all`) and verify all 35 tests pass before committing or pushing changes to GitHub.
