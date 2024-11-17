@echo off
if "%1"=="dev" (
  npm run start:dev
) else if "%1"=="test" (
  npm run test
) else if "%1"=="build" (
  npm run build
) else if "%1"=="lint" (
  npm run lint
) else if "%1"=="prod" (
  npm run start:prod
) else (
  echo "Usage: run.bat dev|test|build|lint|prod"
)
