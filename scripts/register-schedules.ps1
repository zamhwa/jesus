$ErrorActionPreference = "Stop"

$dailyTask = "DrainKorea-AutoPublish-Daily"
$hourlyTask = "DrainKorea-AutoPublish-4H"
$weeklyTask = "DrainKorea-WeeklyOptimize"

$dailyCmd = "powershell -ExecutionPolicy Bypass -File `"c:\Users\김상화\Desktop\AI_개발\jesus\scripts\scheduled-auto-run.ps1`""
$weeklyCmd = "powershell -ExecutionPolicy Bypass -File `"c:\Users\김상화\Desktop\AI_개발\jesus\scripts\scheduled-weekly-optimize.ps1`""

schtasks /Create /F /SC HOURLY /MO 4 /TN $hourlyTask /TR $dailyCmd | Out-Null
schtasks /Create /F /SC DAILY /ST 02:30 /TN $dailyTask /TR $dailyCmd | Out-Null
schtasks /Create /F /SC WEEKLY /D MON /ST 03:00 /TN $weeklyTask /TR $weeklyCmd | Out-Null

Write-Output "Registered tasks:"
Write-Output "- $hourlyTask"
Write-Output "- $dailyTask"
Write-Output "- $weeklyTask"
