$ErrorActionPreference = "Stop"

Set-Location "c:\Users\김상화\Desktop\AI_개발\jesus"

try {
  npm run publish:weekly
} catch {
  Write-Output "publish:weekly failed: $($_.Exception.Message)"
}
