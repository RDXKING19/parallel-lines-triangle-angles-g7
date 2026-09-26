Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\TUF\Downloads\triangle-properties-grade5\triangle-properties-grade5\src\assets\story\2.png"
$outPath = "c:\Users\TUF\Downloads\Parallel_Lines_and_Triangle_Angles_for_Grade_7\Parallel Lines and Triangle Angles for Grade 7\public\assets\images\slide6.jpg"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

$canvasWidth = 1200
$canvasHeight = 900

$bmp = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight)
$gfx = [System.Drawing.Graphics]::FromImage($bmp)

$gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gfx.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Draw cosmic dark gradient background
$rect = New-Object System.Drawing.Rectangle(0, 0, $canvasWidth, $canvasHeight)
$gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(0, $canvasHeight)),
    [System.Drawing.Color]::FromArgb(255, 34, 14, 76),
    [System.Drawing.Color]::FromArgb(255, 10, 3, 26)
)
$gfx.FillRectangle($gradBrush, $rect)
$gradBrush.Dispose()

# Draw some glowing ambient circles/stars in the background
$starBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 250, 204, 21))
$stars = @(
    @(100, 60, 4), @(250, 110, 3), @(1100, 80, 5), @(980, 50, 3),
    @(70, 750, 4), @(1120, 820, 5), @(160, 840, 3), @(1040, 740, 4),
    @(500, 40, 3), @(700, 35, 3)
)
foreach ($s in $stars) {
    $gfx.FillEllipse($starBrush, $s[0], $s[1], $s[2], $s[2])
}
$starBrush.Dispose()

# Scale source image to fit comfortably within width with margins
# srcImg is 1983 x 793 (aspect ratio 2.5:1)
$destW = 1140
$destH = [int]($destW * $srcImg.Height / $srcImg.Width) # ~456px
$destX = [int](($canvasWidth - $destW) / 2) # ~30px
$destY = 95 # Leaves space at top for title and bottom for formula pill

$destRect = New-Object System.Drawing.Rectangle($destX, $destY, $destW, $destH)
$gfx.DrawImage($srcImg, $destRect, 0, 0, $srcImg.Width, $srcImg.Height, [System.Drawing.GraphicsUnit]::Pixel)
$srcImg.Dispose()

# Draw Top Header Pill
$titleText = "EVERY TRIANGLE'S SECRET"
$titleFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$titleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 240, 138))
$pillBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 28, 12, 68))
$pillBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 168, 85, 247), 2.5)

$pillW = 460
$pillH = 46
$pillX = [int](($canvasWidth - $pillW) / 2)
$pillY = 30
$gfx.FillRectangle($pillBgBrush, $pillX, $pillY, $pillW, $pillH)
$gfx.DrawRectangle($pillBorderPen, $pillX, $pillY, $pillW, $pillH)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$gfx.DrawString("✨ $titleText ✨", $titleFont, $titleBrush, (New-Object System.Drawing.RectangleF($pillX, $pillY, $pillW, $pillH)), $sf)

$pillBgBrush.Dispose()
$pillBorderPen.Dispose()
$titleBrush.Dispose()
$titleFont.Dispose()

# Draw Bottom Formula Card
$cardW = 980
$cardH = 250
$cardX = [int](($canvasWidth - $cardW) / 2)
$cardY = 600

$cardBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 20, 8, 48))
$cardBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 250, 204, 21), 3)
$gfx.FillRectangle($cardBgBrush, $cardX, $cardY, $cardW, $cardH)
$gfx.DrawRectangle($cardBorderPen, $cardX, $cardY, $cardW, $cardH)
$cardBgBrush.Dispose()
$cardBorderPen.Dispose()

# Card Header Badge inside card
$badgeW = 340
$badgeH = 38
$badgeX = [int](($canvasWidth - $badgeW) / 2)
$badgeY = $cardY - 19
$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
$badgeTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 4, 36))
$badgeFont = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Bold)
$gfx.FillRectangle($badgeBrush, $badgeX, $badgeY, $badgeW, $badgeH)
$gfx.DrawString("ANGLE SUM PROPERTY", $badgeFont, $badgeTextBrush, (New-Object System.Drawing.RectangleF($badgeX, $badgeY, $badgeW, $badgeH)), $sf)
$badgeBrush.Dispose()
$badgeTextBrush.Dispose()
$badgeFont.Dispose()

# Formula Equation
$eqFont = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
$eqBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$eqGoldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
$gfx.DrawString("Angle A + Angle B + Angle C = 180°", $eqFont, $eqGoldBrush, (New-Object System.Drawing.RectangleF([float]$cardX, [float]($cardY + 30), [float]$cardW, 55.0)), $sf)
$eqFont.Dispose()
$eqBrush.Dispose()
$eqGoldBrush.Dispose()

# Explanatory Text
$subFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 226, 232, 240))
$gfx.DrawString("The three inside angles of ANY triangle always add up to exactly 180°!", $subFont, $subBrush, (New-Object System.Drawing.RectangleF([float]$cardX, [float]($cardY + 95), [float]$cardW, 35.0)), $sf)
$subFont.Dispose()
$subBrush.Dispose()

# 3 Angle Badges Row
$badgeFont2 = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
$bWidth = 190
$bHeight = 44
$bY = $cardY + 150

# Angle A = 65°
$b1X = $cardX + 110
$b1Bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 95, 70))
$b1Pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 52, 211, 153), 2)
$b1Text = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 167, 243, 208))
$gfx.FillRectangle($b1Bg, $b1X, $bY, $bWidth, $bHeight)
$gfx.DrawRectangle($b1Pen, $b1X, $bY, $bWidth, $bHeight)
$gfx.DrawString("∠A = 65°", $badgeFont2, $b1Text, (New-Object System.Drawing.RectangleF([float]$b1X, [float]$bY, [float]$bWidth, [float]$bHeight)), $sf)

# Plus 1
$plusFont = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$plusBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
$gfx.DrawString("+", $plusFont, $plusBrush, (New-Object System.Drawing.RectangleF([float]($b1X + $bWidth), [float]$bY, 60.0, [float]$bHeight)), $sf)

# Angle B = 75°
$b2X = $b1X + $bWidth + 60
$b2Bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 58, 138))
$b2Pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 96, 165, 250), 2)
$b2Text = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 191, 219, 254))
$gfx.FillRectangle($b2Bg, $b2X, $bY, $bWidth, $bHeight)
$gfx.DrawRectangle($b2Pen, $b2X, $bY, $bWidth, $bHeight)
$gfx.DrawString("∠B = 75°", $badgeFont2, $b2Text, (New-Object System.Drawing.RectangleF([float]$b2X, [float]$bY, [float]$bWidth, [float]$bHeight)), $sf)

# Plus 2
$gfx.DrawString("+", $plusFont, $plusBrush, (New-Object System.Drawing.RectangleF([float]($b2X + $bWidth), [float]$bY, 60.0, [float]$bHeight)), $sf)

# Angle C = 40°
$b3X = $b2X + $bWidth + 60
$b3Bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 120, 53, 15))
$b3Pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 251, 191, 36), 2)
$b3Text = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 254, 230, 138))
$gfx.FillRectangle($b3Bg, $b3X, $bY, $bWidth, $bHeight)
$gfx.DrawRectangle($b3Pen, $b3X, $bY, $bWidth, $bHeight)
$gfx.DrawString("∠C = 40°", $badgeFont2, $b3Text, (New-Object System.Drawing.RectangleF([float]$b3X, [float]$bY, [float]$bWidth, [float]$bHeight)), $sf)

$sf.Dispose()
$gfx.Dispose()

# Save as high-quality JPEG
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)

$bmp.Save($outPath, $codec, $encoderParams)
$bmp.Dispose()

Write-Output "Successfully generated: $outPath"
