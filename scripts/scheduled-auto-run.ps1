$ErrorActionPreference = "Stop"

Set-Location "c:\Users\김상화\Desktop\AI_개발\jesus"

try {
  npm run publish:seo1000
} catch {
  Write-Output "publish:seo1000 failed: $($_.Exception.Message)"
}

try {
  npm run publish:winners
} catch {
  Write-Output "publish:winners failed: $($_.Exception.Message)"
}
