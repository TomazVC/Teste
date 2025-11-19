# Script de Gerenciamento da Aplicacao
# Controla iniciar, parar, reiniciar, build e logs da aplicacao

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$processId = $null
$appJob = $null
$logFile = "app-logs.txt"

function Show-Menu {
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   GERENCIADOR DE APLICACAO" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "1. Iniciar aplicacao (dev)" -ForegroundColor Green
    Write-Host "2. Parar aplicacao" -ForegroundColor Red
    Write-Host "3. Reiniciar aplicacao" -ForegroundColor Yellow
    Write-Host "4. Fazer build" -ForegroundColor Blue
    Write-Host "5. Ver logs" -ForegroundColor Magenta
    Write-Host "6. Limpar logs" -ForegroundColor Gray
    Write-Host "7. Preview build" -ForegroundColor Cyan
    Write-Host "8. Lint (verificar codigo)" -ForegroundColor Yellow
    Write-Host "9. Status da aplicacao" -ForegroundColor White
    Write-Host "0. Sair" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Start-Application {
    # Verifica processos Node existentes
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "Aplicacao pode ja estar em execucao. Verifique com a opcao 9 (Status)." -ForegroundColor Yellow
        Write-Host "Se nao estiver, use a opcao 2 (Parar) primeiro." -ForegroundColor Yellow
        return
    }
    
    Write-Host "Iniciando aplicacao..." -ForegroundColor Green
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$timestamp] Iniciando aplicacao..."
    
    # Verifica se npm está disponível
    try {
        $null = Get-Command npm -ErrorAction Stop
    } catch {
        Write-Host "Erro: npm nao encontrado. Certifique-se de que o Node.js esta instalado e no PATH." -ForegroundColor Red
        Add-Content -Path $logFile -Value "[$timestamp] Erro: npm nao encontrado"
        return
    }
    
    # Inicia o processo em background no mesmo terminal
    try {
        # Cria um job para executar npm run dev em background
        $script:appJob = Start-Job -ScriptBlock {
            Set-Location $using:PWD
            npm run dev 2>&1
        }
        
        Start-Sleep -Seconds 3
        
        # Tenta encontrar o processo Node criado
        $nodeProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Select-Object -Last 1
        if ($nodeProcess) {
            $script:processId = $nodeProcess.Id
            Write-Host "Aplicacao iniciada com sucesso! (PID: $processId)" -ForegroundColor Green
            Write-Host "Use a opcao 5 (Ver logs) para ver a saida do Vite." -ForegroundColor Cyan
            Add-Content -Path $logFile -Value "[$timestamp] Aplicacao iniciada (PID: $processId)"
            
            # Mostra as primeiras linhas da saída
            Write-Host "`n=== Primeiras linhas da saida ===" -ForegroundColor Cyan
            $output = Receive-Job -Job $script:appJob -ErrorAction SilentlyContinue
            if ($output) {
                $output | Select-Object -First 10 | ForEach-Object { Write-Host $_ }
            }
            Write-Host "==============================`n" -ForegroundColor Cyan
        } else {
            Write-Host "Aplicacao iniciada (processo em verificacao)" -ForegroundColor Green
            Add-Content -Path $logFile -Value "[$timestamp] Aplicacao iniciada"
        }
    } catch {
        Write-Host "Erro ao iniciar aplicacao: $_" -ForegroundColor Red
        Add-Content -Path $logFile -Value "[$timestamp] Erro ao iniciar: $_"
    }
}

function Stop-Application {
    # Para o job se existir
    if ($script:appJob) {
        Write-Host "Parando job da aplicacao..." -ForegroundColor Red
        Stop-Job -Job $script:appJob -ErrorAction SilentlyContinue
        Remove-Job -Job $script:appJob -ErrorAction SilentlyContinue
        $script:appJob = $null
    }
    
    # Procura processos do Node
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    
    if (-not $nodeProcesses) {
        Write-Host "Nenhuma aplicacao em execucao." -ForegroundColor Yellow
        $script:processId = $null
        return
    }
    
    Write-Host "Parando processos Node..." -ForegroundColor Red
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$timestamp] Parando aplicacao..."
    
    # Para todos os processos Node
    $nodeProcesses | ForEach-Object {
        try {
            Stop-Process -Id $_.Id -ErrorAction SilentlyContinue
        } catch {
            # Ignora erros
        }
    }
    
    Start-Sleep -Seconds 2
    
    # Forca parada se ainda estiver rodando
    $remaining = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($remaining) {
        $remaining | ForEach-Object {
            try {
                Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            } catch {
                # Ignora erros
            }
        }
    }
    
    Write-Host "Aplicacao parada com sucesso!" -ForegroundColor Green
    Add-Content -Path $logFile -Value "[$timestamp] Aplicacao parada"
    $script:processId = $null
}

function Restart-Application {
    Write-Host "Reiniciando aplicacao..." -ForegroundColor Yellow
    Stop-Application
    Start-Sleep -Seconds 2
    Start-Application
}

function Build-Application {
    Write-Host "Fazendo build da aplicacao..." -ForegroundColor Blue
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$timestamp] Iniciando build..."
    
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build concluido com sucesso!" -ForegroundColor Green
        Add-Content -Path $logFile -Value "[$timestamp] Build concluido com sucesso"
    } else {
        Write-Host "Erro ao fazer build!" -ForegroundColor Red
        Add-Content -Path $logFile -Value "[$timestamp] Erro ao fazer build"
    }
}

function Show-Logs {
    Write-Host "`n=== LOGS DA APLICACAO ===" -ForegroundColor Cyan
    
    # Mostra saída do job do Vite se existir
    if ($script:appJob) {
        Write-Host "`n--- Saida do Vite (ultimas 50 linhas) ---" -ForegroundColor Yellow
        $output = Receive-Job -Job $script:appJob -ErrorAction SilentlyContinue
        if ($output) {
            $output | Select-Object -Last 50 | ForEach-Object { Write-Host $_ }
        } else {
            Write-Host "Nenhuma saida ainda disponivel." -ForegroundColor Gray
        }
        Write-Host ""
    }
    
    # Mostra logs do arquivo
    if (Test-Path $logFile) {
        Write-Host "--- Logs do arquivo (ultimas 20 linhas) ---" -ForegroundColor Yellow
        Get-Content $logFile -Tail 20
        Write-Host ""
    } else {
        Write-Host "Nenhum log de arquivo encontrado." -ForegroundColor Gray
    }
    
    Write-Host "========================`n" -ForegroundColor Cyan
}

function Clear-Logs {
    if (Test-Path $logFile) {
        Remove-Item $logFile
        Write-Host "Logs limpos com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Nenhum log para limpar." -ForegroundColor Yellow
    }
}

function Preview-Build {
    Write-Host "Iniciando preview do build..." -ForegroundColor Cyan
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$timestamp] Iniciando preview..."
    
    npm run preview
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Erro ao iniciar preview. Certifique-se de que o build foi feito primeiro." -ForegroundColor Red
    }
}

function Run-Lint {
    Write-Host "Executando lint..." -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $logFile -Value "[$timestamp] Executando lint..."
    
    npm run lint
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Lint concluido sem erros!" -ForegroundColor Green
        Add-Content -Path $logFile -Value "[$timestamp] Lint concluido sem erros"
    } else {
        Write-Host "Lint encontrou problemas!" -ForegroundColor Red
        Add-Content -Path $logFile -Value "[$timestamp] Lint encontrou problemas"
    }
}

function Show-Status {
    Write-Host "`n=== STATUS DA APLICACAO ===" -ForegroundColor Cyan
    
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    
    if ($nodeProcesses) {
        Write-Host "Status: EM EXECUCAO" -ForegroundColor Green
        Write-Host "Processos Node encontrados: $($nodeProcesses.Count)" -ForegroundColor White
        $nodeProcesses | ForEach-Object {
            Write-Host "  - PID: $($_.Id) | Memoria: $([math]::Round($_.WorkingSet64 / 1MB, 2)) MB | Tempo: $((Get-Date) - $_.StartTime)" -ForegroundColor White
        }
        if ($nodeProcesses.Count -eq 1) {
            $script:processId = $nodeProcesses[0].Id
        }
    } else {
        Write-Host "Status: PARADA" -ForegroundColor Red
        $script:processId = $null
    }
    
    Write-Host "`n========================`n" -ForegroundColor Cyan
}

# Verifica se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules nao encontrado. Execute 'npm install' primeiro." -ForegroundColor Yellow
    $install = Read-Host "Deseja instalar as dependencias agora? (s/n)"
    if ($install -eq "s" -or $install -eq "S") {
        Write-Host "Instalando dependencias..." -ForegroundColor Green
        npm install
    }
}

# Loop principal
:mainLoop while ($true) {
    Show-Menu
    $choice = Read-Host "Escolha uma opcao"
    
    switch ($choice) {
        "1" { Start-Application }
        "2" { Stop-Application }
        "3" { Restart-Application }
        "4" { Build-Application }
        "5" { Show-Logs }
        "6" { Clear-Logs }
        "7" { Preview-Build }
        "8" { Run-Lint }
        "9" { Show-Status }
        "0" { 
            Write-Host "`nSaindo do gerenciador..." -ForegroundColor Cyan
            if ($script:appJob -or (Get-Process -Name "node" -ErrorAction SilentlyContinue)) {
                Write-Host "Parando aplicacao antes de sair..." -ForegroundColor Yellow
                Stop-Application
            }
            Write-Host "Ate logo!" -ForegroundColor Green
            break mainLoop
        }
        default { 
            Write-Host "Opcao invalida! Tente novamente." -ForegroundColor Red
        }
    }
    
    if ($choice -ne "0") {
        Write-Host "`nPressione qualquer tecla para continuar..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

