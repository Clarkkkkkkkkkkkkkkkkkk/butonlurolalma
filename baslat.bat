@echo off
cls
title Roles
:StartServer
node discow.js
echo (%time%) Server closed/crashed... restarting!
goto StartServer