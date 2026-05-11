$base = "e:\Dev\DevWorkspace\comfyui-learning-guide\docs\实战案例"

$nodeTranslations = @(
    @{eng="Load ControlNet Model"; chn="加载ControlNet模型"},
    @{eng="Apply ControlNet"; chn="应用ControlNet"},
    @{eng="Empty Latent Image"; chn="空Latent图像"},
    @{eng="CLIP Text Encoder"; chn="CLIP文本编码器"},
    @{eng="CLIP Text Encode"; chn="CLIP文本编码器"},
    @{eng="Load Checkpoint"; chn="加载模型"},
    @{eng="Upscale Image"; chn="放大图像"},
    @{eng="Preview Image"; chn="预览图像"},
    @{eng="Load LoRA"; chn="加载LoRA"},
    @{eng="Save Image"; chn="保存图像"},
    @{eng="Load Image"; chn="加载图像"},
    @{eng="VAE Decode"; chn="VAE解码"},
    @{eng="VAE Encode"; chn="VAE编码"},
    @{eng="Load VAE"; chn="加载VAE"},
    @{eng="KSampler"; chn="K采样器"}
)

$headerRefLine = "> **相关官方文档：** [ComfyUI 官方文档](https://docs.comfy.org/) | [中文文档](https://docs.comfy.org/zh/)"

$levelDirs = @("Level1-入门级", "Level2-进阶级", "Level3-高级", "Level4-专家级", "Level5-大牛级")
$files = @()

foreach ($levelDir in $levelDirs) {
    $levelPath = Join-Path $base $levelDir
    if (Test-Path $levelPath) {
        $mdFiles = Get-ChildItem $levelPath -Filter "*.md" | Sort-Object Name
        foreach ($f in $mdFiles) {
            $files += $f.FullName
        }
    }
}

function Add-HeaderRef {
    param([string]$content)
    
    if ($content -match "docs\.comfy\.org/zh/") {
        return $content
    }
    
    $lines = $content -split "`n"
    $headerEndIdx = -1
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "^> ") {
            $headerEndIdx = $i
        } elseif ($headerEndIdx -ge 0) {
            break
        }
    }
    
    if ($headerEndIdx -ge 0) {
        $newLines = @()
        for ($i = 0; $i -le $headerEndIdx; $i++) {
            $newLines += $lines[$i]
        }
        $newLines += $headerRefLine
        for ($i = $headerEndIdx + 1; $i -lt $lines.Count; $i++) {
            $newLines += $lines[$i]
        }
        return $newLines -join "`n"
    }
    
    return $content
}

function Split-CodeBlocks {
    param([string]$content)
    
    $parts = @()
    $pattern = '(?s)(```.*?```)'
    $matches = [regex]::Split($content, $pattern)
    return $matches
}

function Annotate-FirstOccurrences {
    param([string]$content)
    
    $parts = Split-CodeBlocks $content
    
    $annotated = @{}
    $clipDone = $false
    
    for ($p = 0; $p -lt $parts.Count; $p++) {
        $part = $parts[$p]
        
        if ($part -match "^```") {
            continue
        }
        
        foreach ($trans in $nodeTranslations) {
            $engName = $trans.eng
            $chnName = $trans.chn
            
            if ($annotated.ContainsKey($engName)) {
                continue
            }
            
            if (($engName -eq "CLIP Text Encode" -or $engName -eq "CLIP Text Encoder") -and $clipDone) {
                continue
            }
            
            $idx = $part.IndexOf($engName)
            if ($idx -eq -1) {
                continue
            }
            
            $afterStart = $idx + $engName.Length
            $afterText = ""
            if ($afterStart -lt $part.Length) {
                $len = [Math]::Min(30, $part.Length - $afterStart)
                $afterText = $part.Substring($afterStart, $len)
            }
            
            if ($afterText -match "（" -and $afterText -match "）") {
                $parenIdx = $afterText.IndexOf("（")
                $closeIdx = $afterText.IndexOf("）")
                if ($closeIdx -gt $parenIdx -and $closeIdx -lt 25) {
                    $annotated[$engName] = $true
                    if ($engName -eq "CLIP Text Encode" -or $engName -eq "CLIP Text Encoder") {
                        $clipDone = $true
                    }
                    continue
                }
            }
            
            $annotation = "（$chnName）"
            $part = $part.Substring(0, $afterStart) + $annotation + $part.Substring($afterStart)
            $parts[$p] = $part
            
            $annotated[$engName] = $true
            if ($engName -eq "CLIP Text Encode" -or $engName -eq "CLIP Text Encoder") {
                $clipDone = $true
            }
        }
    }
    
    return $parts -join ""
}

foreach ($filepath in $files) {
    $content = Get-Content $filepath -Raw -Encoding UTF8
    $content = Add-HeaderRef $content
    $content = Annotate-FirstOccurrences $content
    
    [System.IO.File]::WriteAllText($filepath, $content, [System.Text.Encoding]::UTF8)
    
    $filename = [System.IO.Path]::GetFileName($filepath)
    Write-Host "Processed: $filename"
}

Write-Host "`nTotal files processed: $($files.Count)"
