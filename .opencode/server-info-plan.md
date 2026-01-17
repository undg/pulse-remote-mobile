# Server info view plan (RN)

Goal
- Show build metadata from `PrapiStatus.buildInfo` on About screen.

Fields to display
- Version (`gitVersion`)
- Commit SHA (`gitCommit`)
- Platform
- Build Date
- Go Version
- Compiler

Data source
- From volume/status store populated by `GetStatus` messages.

UX notes
- Simple card/list on About screen; optional copy/share actions.
- Handle missing data gracefully (show placeholders).
